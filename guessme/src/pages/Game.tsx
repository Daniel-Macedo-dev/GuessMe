import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBubble from "../components/MessageBubble";
import PersonagemCard from "../components/PersonagemCard";
import VictoryModal from "../components/VictoryModal";
import Footer from "../components/Footer";

import { askQuestion, startGame as startGameApi } from "../services/guessme";
import type { WinnerData } from "../types/guessme";

type ChatMessage = { sender: string; text: string };

export default function Game() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("guessme_messages_v2");
      return saved ? (JSON.parse(saved) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });

  const [question, setQuestion] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(
    localStorage.getItem("guessme_started_v2") === "true"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(
    localStorage.getItem("guessme_over_v2") === "true"
  );
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const pushMessage = (sender: string, text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const data = await startGameApi();
      const text =
        data?.answer || "Ok! Já escolhi um personagem. Faça sua primeira pergunta!";

      setMessages([{ sender: "AI", text }]);
      setGameStarted(true);
      setGameOver(false);
      setWinner(null);
    } catch (err) {
      console.error(err);
      pushMessage("System", "Erro ao iniciar o jogo. Verifique o backend.");
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim() || loading || !gameStarted || gameOver) return;

    pushMessage("Você", question);
    const questionToSend = question;
    setQuestion("");
    setTyping(true);
    setLoading(true);

    const minTyping = new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const responsePromise = askQuestion(questionToSend);
      const [data] = await Promise.all([responsePromise, minTyping]);

      const aiText = data?.answer || "A IA não retornou resposta.";
      const success = data?.success === true;
      const character = data?.character;

      setTyping(false);
      pushMessage("AI", aiText);

      if (success && character) {
        setWinner({
          nome: character.name ?? "",
          obra: character.work ?? "",
          imagem: character.image ?? "",
        });
        setGameOver(true);
      }
      
    } catch (err) {
      console.error(err);
      setTyping(false);
      pushMessage("System", "Erro ao comunicar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  const resetGameClientOnly = () => {
    setMessages([]);
    setQuestion("");
    setGameStarted(false);
    setGameOver(false);
    setTyping(false);
    setWinner(null);

    localStorage.removeItem("guessme_messages_v2");
    localStorage.removeItem("guessme_started_v2");
    localStorage.removeItem("guessme_over_v2");
  };

  const restartGame = async () => {
    setIsRestarting(true);
    resetGameClientOnly();
    await startGame();
    setIsRestarting(false);
  };

  return (
    <>
      <Navbar onRestart={restartGame} disabled={loading} />

      <div className="container mt-4">
        {!gameStarted && !isRestarting ? (
          <div className="d-flex justify-content-center flex-wrap align-items-center">
            <PersonagemCard />
            <button
              className="btn btn-primary btn-lg ms-3 mt-3"
              onClick={startGame}
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar Jogo"}
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column chat-wrapper">
            <div className="chat-messages flex-grow-1 p-3">
              {messages.map((msg, i) => (
                <MessageBubble key={i} sender={msg.sender} text={msg.text} />
              ))}

              {typing && <LoadingSpinner small text="IA está digitando..." />}

              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area p-3 d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder={gameOver ? "Jogo finalizado" : "Faça sua pergunta..."}
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
            </div>
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
