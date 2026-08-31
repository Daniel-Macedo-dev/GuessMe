import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameHeader from "../components/GameHeader";
import GameStatsBar from "../components/GameStatsBar";
import MessageBubble from "../components/MessageBubble";
import TranscriptDivider from "../components/TranscriptDivider";
import AnswerChips from "../components/AnswerChips";
import QuestionInput from "../components/QuestionInput";
import VictoryModal from "../components/VictoryModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EvidenceNotebook from "../components/EvidenceNotebook";
import GameArchiveSummary from "../components/GameArchiveSummary";
import DossierIcon from "../components/DossierIcon";
import { useGame } from "../hooks/useGame";
import { useCaseHistory } from "../hooks/useCaseHistory";
import { deriveEvidence, deriveSolvedSummary } from "../helpers/deriveEvidence";
import { deriveCaseStatus } from "../helpers/caseVisualStatus";

export default function Game() {
  const {
    messages,
    questionsCount,
    winner,
    loading,
    error,
    bootError,
    limitMessage,
    canAsk,
    sessionExpired,
    chatScrollRef,

    categories,
    category,
    changeCategory,

    sendQuestion,
    hint,
    hintLoading,
    restart,
  } = useGame();

  const { history, saveStatus, saveOnVictory } = useCaseHistory();

  const savedWinnerRef = useRef(winner);
  useEffect(() => {
    if (!winner) {
      savedWinnerRef.current = null;
      return;
    }
    if (savedWinnerRef.current === winner) return;
    savedWinnerRef.current = winner;
    saveOnVictory(winner, messages, category, questionsCount);
  }, [winner, messages, category, questionsCount, saveOnVictory]);

  const evidence = deriveEvidence(messages);
  const solved = deriveSolvedSummary(winner);

  const caseStatus = deriveCaseStatus({ messages, loading, hintLoading, winner, error });
  const hintsCount = messages.filter((m) => m.kind === "hint").length;

  const inputPlaceholder = !canAsk
    ? sessionExpired
      ? "Sessão expirada — clique em Novo caso"
      : winner
      ? "Caso encerrado. Inicie um novo caso."
      : loading
      ? "Aguardando análise…"
      : "Inicie um caso primeiro"
    : "Interrogue a IA (ex: É humano?)";

  return (
    <div className="shell shell--game">
      <Navbar onRestart={restart} disabled={loading || hintLoading} />

      <main id="main-content" className="main" tabIndex={-1}>
        <GameHeader
          onRestart={restart}
          onHint={hint}
          hintLoading={hintLoading}
          hintDisabled={sessionExpired || loading}
          solved={Boolean(winner)}
          caseStatus={caseStatus}
          categories={categories}
          category={category}
          onChangeCategory={changeCategory}
        />

        <div className="gamePageGrid">
          <section className="panel chatPanelWide">
            <GameStatsBar questionsCount={questionsCount} hintsCount={hintsCount} />

            <div className="transcriptLabel" aria-hidden="true">
              <span className="transcriptLabelText">TRANSCRIÇÃO DE INTERROGAÇÃO</span>
              <span className="transcriptLabelLine" />
            </div>

            <div className="chatScroll" ref={chatScrollRef} aria-live="polite" data-testid="chat-scroll">
              {messages.map((m, i) => {
                const prevKind = i > 0 ? messages[i - 1].kind : null;
                const isLastMsg = i === messages.length - 1;

                return (
                  <div key={m.id}>
                    {i === 0 && (
                      <TranscriptDivider label="ABERTURA DO CASO" variant="open" />
                    )}
                    {m.kind === "hint" && prevKind !== "hint" && (
                      <TranscriptDivider label="PISTA DO SISTEMA" variant="clue" />
                    )}
                    {winner && isLastMsg && m.kind === "ai" && (
                      <TranscriptDivider label="VEREDITO FINAL" variant="verdict" />
                    )}
                    <MessageBubble
                      sender={m.sender}
                      text={m.text}
                      kind={m.kind}
                      verdict={m.verdict}
                    />
                  </div>
                );
              })}
              {loading ? <LoadingSpinner /> : null}
            </div>

            {error ? (
              <div className="errorBox" role="alert" data-testid="error-box">
                <div className="errorBoxContent">
                  <DossierIcon name="warning" size={14} aria-hidden={true} className="errorBoxIcon" />
                  <div className="errorBoxText">
                    <span className="errorBoxLabel">FALHA NO DOSSIÊ</span>
                    <span>{error}</span>
                  </div>
                </div>
                {sessionExpired && (
                  <button className="btn btn-primary errorRestartBtn" onClick={restart}>
                    Novo caso
                  </button>
                )}
                {bootError && !sessionExpired && (
                  <button className="btn btn-primary errorRestartBtn" onClick={restart}>
                    Tentar novamente
                  </button>
                )}
              </div>
            ) : null}

            {limitMessage ? (
              <div className="warningBox" role="alert" data-testid="warning-box">
                <DossierIcon name="warning" size={13} aria-hidden={true} className="warningBoxIcon" />
                <span>{limitMessage}</span>
              </div>
            ) : null}

            <div className="queryDesk">
              {!winner ? (
                <div className="querySection">
                  <span className="queryLabel" aria-hidden="true">CONSULTAS RÁPIDAS</span>
                  <AnswerChips disabled={!canAsk} onPick={sendQuestion} />
                </div>
              ) : null}

              <div className="queryInputSection">
                <span className="queryLabel queryInputLabel" aria-hidden="true">NOVA PERGUNTA</span>
                <QuestionInput
                  disabled={!canAsk}
                  loading={loading}
                  placeholder={inputPlaceholder}
                  onSend={sendQuestion}
                />
              </div>
            </div>
          </section>

          <EvidenceNotebook
            evidence={evidence}
            solved={solved}
            questionsCount={questionsCount}
          />
        </div>

        <VictoryModal winner={winner} onRestart={restart} />

        <GameArchiveSummary history={history} saveStatus={saveStatus} />
      </main>

      <Footer />
    </div>
  );
}
