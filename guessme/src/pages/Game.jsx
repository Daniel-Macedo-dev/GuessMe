import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBubble from "../components/MessageBubble";
import PersonagemCard from "../components/PersonagemCard";
import VictoryModal from "../components/VictoryModal";

export default function Game() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("guessme_messages_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [question, setQuestion] = useState("");
  const [gameStarted, setGameStarted] = useState(() => {
    return localStorage.getItem("guessme_started_v2") === "true";
  });
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [gameOver, setGameOver] = useState(() => {
    return localStorage.getItem("guessme_over_v2") === "true";
  });

  const chatRef = useRef(null);
  const endRef = useRef(null);

  const WIN_KEYWORDS = [
    "acert",
    "parabéns",
    "você descobriu",
    "você acertou",
    "isso mesmo",
    "exatamente",
    "correto",
    "venceu",
    "congrat"
  ];

  useEffect(() => {
    localStorage.setItem("guessme_messages_v2", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("guessme_started_v2", gameStarted ? "true" : "false");
  }, [gameStarted]);

  useEffect(() => {
    localStorage.setItem("guessme_over_v2", gameOver ? "true" : "false");
  }, [gameOver]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function pushMessage(sender, text) {
    setMessages(prev => [...prev, { sender, text }]);
  }

  function checkWin(text) {
    const lower = text.toLowerCase();
    return WIN_KEYWORDS.some(k => lower.includes(k));
  }

  async function startGame() {
    setLoading(true);
    try {
      const response = await api.get("/start");
      const text = response.data?.text ?? 
        "Ok! Já escolhi um personagem. Pode fazer sua primeira pergunta!";

      setMessages([{ sender: "AI", text }]);
      setGameStarted(true);
      setGameOver(false);
    } catch (err) {
      console.error("Erro ao iniciar o jogo:", err);
      pushMessage("System", "Erro ao iniciar o jogo. Verifique o backend.");
    } finally {
      setLoading(false);
    }
  }

  async function sendQuestion() {
    if (!question.trim() || loading || !gameStarted || gameOver) return;

    pushMessage("Você", question);
    setQuestion("");
    setTyping(true);
    setLoading(true);

    const minTyping = new Promise(resolve => setTimeout(resolve, 500));

    try {
      const responsePromise = api.post("/ask", { question }, {
        headers: { "Content-Type": "application/json" }
      });

      const [response] = await Promise.all([responsePromise, minTyping]);

      const aiText = response.data?.text ?? "A IA não retornou texto.";
      setTyping(false);
      pushMessage("AI", aiText);

      if (checkWin(aiText)) {
        setGameOver(true);
      }
    } catch (err) {
      console.error("Erro ao enviar pergunta:", err);
      setTyping(false);
      pushMessage("System", "Erro ao contatar a IA.");
    } finally {
      setLoading(false);
    }
  }

  function resetGameClientOnly() {
    setMessages([]);
    setQuestion("");
    setGameStarted(false);
    setGameOver(false);
    setTyping(false);
    localStorage.removeItem("guessme_messages_v2");
    localStorage.removeItem("guessme_started_v2");
    localStorage.removeItem("guessme_over_v2");
  }

  async function restartGame() {
    resetGameClientOnly();
    await startGame();
  }

  return (
    <>
      <Navbar onRestart={restartGame} disabled={loading} />

      <div className="container mt-4" style={{ maxWidth: 900 }}>
        {!gameStarted ? (
          <div className="d-flex justify-content-center">
            <PersonagemCard />
            <div className="ms-4 align-self-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={startGame}
                disabled={loading}
              >
                {loading ? "Iniciando..." : "Iniciar Jogo"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={chatRef}
              className="card dark-card p-3 mb-3 chat-card"
              style={{ height: 520, overflowY: "auto" }}
            >
              {messages.length === 0 && (
                <div className="text-muted text-center mt-4">
                  Sem mensagens ainda.
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} sender={msg.sender} text={msg.text} />
              ))}

              {typing && (
                <LoadingSpinner small={true} text="IA está digitando..." />
              )}

              <div ref={endRef} />
            </div>

            <div className="d-flex gap-2 mb-5">
              <input
                className="form-control"
                placeholder={
                  gameOver
                    ? "Jogo finalizado — clique em Reiniciar"
                    : "Faça sua pergunta..."
                }
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendQuestion();
                }}
                disabled={loading || gameOver}
              />

              <button
                className="btn btn-success"
                onClick={sendQuestion}
                disabled={loading || gameOver}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>

              <button
                className="btn btn-outline-light"
                onClick={restartGame}
                disabled={loading}
              >
                Reiniciar
              </button>
            </div>
          </>
        )}
      </div>

      <VictoryModal
        show={gameOver}
        onClose={() => setGameOver(false)}
        onPlayAgain={restartGame}
      />
    </>
  );
}
