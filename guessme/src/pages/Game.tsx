import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBubble from "../components/MessageBubble";
import VictoryModal from "../components/VictoryModal";
import Footer from "../components/Footer";
import QuestionInput from "../components/QuestionInput";
import SidebarTips from "../components/SidebarTips";
import GameHeader from "../components/GameHeader";

import { useGame } from "../hooks/useGame";

export default function Game() {
  const {
    messages,
    question,
    gameStarted,
    gameOver,
    loading,
    typing,
    winner,
    questionsAsked,
    elapsedSeconds,
    lastAiMessage,
    aiAnswerChips,
    chatEndRef,

    setQuestion,
    startGame,
    sendQuestion,
    restartGame,
    setGameOver,
  } = useGame();

  return (
    <>
      <Navbar onRestart={restartGame} disabled={loading} />

      <div className="container mt-4">
        {!gameStarted ? (
          <div className="start-wrap">
            <div className="panel start-panel">
              <div className="panel-body">
                <h3 className="mb-1">Bem-vindo ao GuessMe!</h3>
                <p className="text-muted small mb-0">
                  A IA escolherá um personagem — faça perguntas de sim/não/talvez até acertar.
                </p>

                <div className="mt-3">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={startGame}
                    disabled={loading}
                  >
                    {loading ? "Iniciando..." : "Iniciar Jogo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-layout">
            <SidebarTips
              lastHint={lastAiMessage}
              questionsAsked={questionsAsked}
              elapsedSeconds={elapsedSeconds}
              chips={aiAnswerChips}
            />

            <section className="panel chat-panel">
              <div className="panel-header">
                <GameHeader
                  status={gameOver ? "Finalizado" : "Jogando"}
                  questionsAsked={questionsAsked}
                  elapsedSeconds={elapsedSeconds}
                />
              </div>

              <div className="panel-body p-0">
                <div className="chat-messages flex-grow-1 p-3">
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} sender={msg.sender} text={msg.text} />
                  ))}

                  {typing && <LoadingSpinner small text="IA está digitando..." />}

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
      </div>

      <VictoryModal
        show={gameOver}
        onClose={() => setGameOver(false)}
        onPlayAgain={restartGame}
        winner={winner}
      />

      <Footer />
    </>
  );
}
