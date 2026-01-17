import Navbar from "../components/Navbar";
import SidebarTips from "../components/SidebarTips";
import GameHeader from "../components/GameHeader";
import MessageBubble from "../components/MessageBubble";
import LoadingSpinner from "../components/LoadingSpinner";
import QuestionInput from "../components/QuestionInput";
import VictoryModal from "../components/VictoryModal";
import Footer from "../components/Footer";

import { useGame } from "../hooks/useGame";

export default function Game() {
  const {
    messages,
    question,
    setQuestion,
    gameStarted,
    gameOver,
    setGameOver,
    loading,
    typing,
    winner,
    questionsAsked,
    elapsedSeconds,
    lastAiMessage,
    aiAnswerChips,
    chatEndRef,
    startGame,
    sendQuestion,
    restartGame,
  } = useGame();

  return (
    <div className="shell">
      <Navbar onRestart={restartGame} disabled={loading} />

      <main className="main">
        {!gameStarted ? (
          <div className="panel" style={{ maxWidth: 660, margin: "0 auto" }}>
            <div className="panelHeader">
              <div style={{ fontWeight: 1000 }}>Bem-vindo ao GuessMe</div>
              <span className="pill">Modo: Sim/Não/Talvez</span>
            </div>
            <div className="panelBody">
              <div className="muted" style={{ lineHeight: 1.6 }}>
                A IA escolhe um personagem. Você faz perguntas que só podem ser respondidas com
                <b> Sim</b>, <b>Não</b> ou <b>Talvez</b> até acertar.
              </div>

              <div style={{ marginTop: 14 }}>
                <button className="btn btn-primary" onClick={startGame} disabled={loading}>
                  {loading ? "Iniciando..." : "Iniciar jogo"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="gameLayout">
            <SidebarTips
              lastHint={lastAiMessage}
              questionsAsked={questionsAsked}
              elapsedSeconds={elapsedSeconds}
              chips={aiAnswerChips}
            />

            <section className="panel">
              <div className="panelHeader">
                <GameHeader
                  status={gameOver ? "Finalizado" : "Jogando"}
                  questionsAsked={questionsAsked}
                  elapsedSeconds={elapsedSeconds}
                />
              </div>

              <div className="chatBody">
                <div className="chatScroll">
                  {messages.map((m, i) => (
                    <MessageBubble key={i} sender={m.sender} text={m.text} />
                  ))}

                  {typing && <LoadingSpinner text="IA está digitando..." />}
                  <div ref={chatEndRef} />
                </div>

                <QuestionInput
                  value={question}
                  onChange={setQuestion}
                  onSend={sendQuestion}
                  sending={loading}
                  disabled={loading || gameOver}
                  placeholder={gameOver ? "Jogo finalizado" : "Faça sua pergunta..."}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      <VictoryModal
        show={gameOver}
        onClose={() => setGameOver(false)}
        onPlayAgain={restartGame}
        winner={winner}
      />

      <Footer />
    </div>
  );
}
