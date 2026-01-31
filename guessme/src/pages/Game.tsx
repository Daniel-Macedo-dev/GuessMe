import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameHeader from "../components/GameHeader";
import GameStatsBar from "../components/GameStatsBar";
import MessageBubble from "../components/MessageBubble";
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
    bottomRef,

    categories,
    category,
    changeCategory,

    sendQuestion,
    hint,
    hintLoading,
    restart,
  } = useGame();

  return (
    <div className="shell">
      <Navbar onRestart={restart} disabled={loading || hintLoading} />

      <main className="main">
        <GameHeader
          onRestart={restart}
          onHint={hint}
          hintLoading={hintLoading}
          categories={categories}
          category={category}
          onChangeCategory={changeCategory}
        />

        <section className="panel chatPanelWide">
          <GameStatsBar questionsCount={questionsCount} />

          <div className="chatScroll" aria-live="polite">
            {messages.map((m) => (
              <MessageBubble key={m.id} sender={m.sender} text={m.text} />
            ))}
            <div ref={bottomRef} />
            {loading ? <LoadingSpinner /> : null}
          </div>

          {error ? <div className="errorBox">{error}</div> : null}

          <QuestionInput disabled={!canAsk} loading={loading} onSend={sendQuestion} />
        </section>

        <VictoryModal winner={winner} onRestart={restart} />
      </main>

      <Footer />
    </div>
  );
}
