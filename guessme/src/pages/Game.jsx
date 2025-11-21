import { useState } from "react";
import { api } from "../services/api";

import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBubble from "../components/MessageBubble";
import PersonagemCard from "../components/PersonagemCard";

export default function Game() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function startGame() {
    setLoading(true);
    const response = await api.get("/start");
    setLoading(false);

    setMessages([{ sender: "AI", text: response.data.text }]);
    setGameStarted(true);
  }

  async function sendQuestion() {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { sender: "Você", text: question }]);

    setLoading(true);
    const response = await api.post("/ask", question, {
      headers: { "Content-Type": "text/plain" }
    });
    setLoading(false);

    setMessages((prev) => [
      ...prev,
      { sender: "AI", text: response.data.text }
    ]);

    setQuestion("");
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4" style={{ maxWidth: "700px" }}>
        {!gameStarted ? (
          <>
            <PersonagemCard />

            <div className="text-center mt-3">
              <button className="btn btn-success btn-lg" onClick={startGame}>
                Iniciar Jogo
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="card p-3 mb-3"
              style={{ height: "400px", overflowY: "auto" }}
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} sender={msg.sender} text={msg.text} />
              ))}

              {loading && <LoadingSpinner />}
            </div>

            <div className="input-group">
              <input
                className="form-control"
                placeholder="Faça sua pergunta..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button className="btn btn-primary" onClick={sendQuestion}>
                Enviar
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
