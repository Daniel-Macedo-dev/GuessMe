import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameHeader from "../components/GameHeader";
import GameStatsBar from "../components/GameStatsBar";
import MessageBubble from "../components/MessageBubble";
import AnswerChips from "../components/AnswerChips";
import QuestionInput from "../components/QuestionInput";
import VictoryModal from "../components/VictoryModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGame } from "../hooks/useGame";

export default function Game() {
  const {
    messages,
    questionsCount,
    winner,
    loading,
    error,
    canAsk,
    sessionExpired,
    bottomRef,

    categories,
    category,
    changeCategory,

    sendQuestion,
    hint,
    hintLoading,
    restart,
  } = useGame();

  const inputPlaceholder = !canAsk
    ? sessionExpired
      ? "Sessão expirada — clique em Reiniciar"
      : winner
      ? "Você venceu! Reinicie para jogar novamente."
      : loading
      ? "Aguardando resposta…"
      : "Inicie um jogo primeiro"
    : "Faça uma pergunta (ex: É humano?)";

  return (
    <div className="shell">
      <Navbar onRestart={restart} disabled={loading || hintLoading} />

      <main className="main">
        <GameHeader
          onRestart={restart}
          onHint={hint}
          hintLoading={hintLoading || sessionExpired}
          categories={categories}
          category={category}
          onChangeCategory={changeCategory}
        />

        <section className="panel chatPanelWide">
          <GameStatsBar questionsCount={questionsCount} />

          <div className="chatScroll" aria-live="polite">
            {messages.map((m) => (
              <MessageBubble key={m.id} sender={m.sender} text={m.text} kind={m.kind} />
            ))}
            <div ref={bottomRef} />
            {loading ? <LoadingSpinner /> : null}
          </div>

          {error ? (
            <div className="errorBox">
              <span>{error}</span>
              {sessionExpired && (
                <button className="btn btn-primary errorRestartBtn" onClick={restart}>
                  Novo Jogo
                </button>
              )}
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

        <VictoryModal winner={winner} onRestart={restart} />
      </main>

      <Footer />
    </div>
  );
}
