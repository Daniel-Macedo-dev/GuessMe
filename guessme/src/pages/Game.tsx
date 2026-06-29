import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameHeader from "../components/GameHeader";
import GameStatsBar from "../components/GameStatsBar";
import MessageBubble from "../components/MessageBubble";
import AnswerChips from "../components/AnswerChips";
import QuestionInput from "../components/QuestionInput";
import VictoryModal from "../components/VictoryModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EvidenceNotebook from "../components/EvidenceNotebook";
import CaseHistoryPanel from "../components/CaseHistoryPanel";
import { useGame } from "../hooks/useGame";
import { useCaseHistory } from "../hooks/useCaseHistory";
import { deriveEvidence, deriveSolvedSummary } from "../helpers/deriveEvidence";

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

  const { history, saveOnVictory, deleteEntry, clearAll, importEntry } = useCaseHistory();

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
    <div className="shell">
      <Navbar onRestart={restart} disabled={loading || hintLoading} />

      <main className="main">
        <GameHeader
          onRestart={restart}
          onHint={hint}
          hintLoading={hintLoading}
          hintDisabled={sessionExpired || loading}
          solved={Boolean(winner)}
          categories={categories}
          category={category}
          onChangeCategory={changeCategory}
        />

        <div className="gamePageGrid">
          <section className="panel chatPanelWide">
            <GameStatsBar questionsCount={questionsCount} />

            <div className="chatScroll" ref={chatScrollRef} aria-live="polite" data-testid="chat-scroll">
              {messages.map((m) => (
                <MessageBubble key={m.id} sender={m.sender} text={m.text} kind={m.kind} verdict={m.verdict} />
              ))}
              {loading ? <LoadingSpinner /> : null}
            </div>

            {error ? (
              <div className="errorBox" role="alert" data-testid="error-box">
                <span>{error}</span>
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
                <span>{limitMessage}</span>
              </div>
            ) : null}

            {!winner ? (
              <AnswerChips disabled={!canAsk} onPick={sendQuestion} />
            ) : null}

            <QuestionInput
              disabled={!canAsk}
              loading={loading}
              placeholder={inputPlaceholder}
              onSend={sendQuestion}
            />
          </section>

          <EvidenceNotebook
            evidence={evidence}
            solved={solved}
            questionsCount={questionsCount}
          />
        </div>

        <VictoryModal winner={winner} onRestart={restart} />

        <CaseHistoryPanel
          history={history}
          onDelete={deleteEntry}
          onClearAll={clearAll}
          onImport={importEntry}
        />
      </main>

      <Footer />
    </div>
  );
}
