import { useEffect, useMemo, useRef, useState } from "react";
import { askQuestion, startGame as startGameApi } from "../services/guessme";
import type { WinnerData } from "../types/guessme";

type ChatMessage = { sender: string; text: string };

const LS = {
  messages: "guessme_messages_v3",
  started: "guessme_started_v3",
  over: "guessme_over_v3",
  qcount: "guessme_qcount_v3",
  startedAt: "guessme_startedAt_v3",
};

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useGame() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => safeParse(localStorage.getItem(LS.messages), [] as ChatMessage[])
  );

  const [question, setQuestion] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(
    localStorage.getItem(LS.started) === "true"
  );
  const [gameOver, setGameOver] = useState<boolean>(
    localStorage.getItem(LS.over) === "true"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const [winner, setWinner] = useState<WinnerData | null>(null);

  const [questionsAsked, setQuestionsAsked] = useState<number>(() => {
    const n = Number(localStorage.getItem(LS.qcount) ?? "0");
    return Number.isFinite(n) ? n : 0;
  });

  const [startedAt, setStartedAt] = useState<number>(() => {
    const n = Number(localStorage.getItem(LS.startedAt) ?? "0");
    return Number.isFinite(n) ? n : 0;
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(LS.messages, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LS.started, gameStarted ? "true" : "false");
  }, [gameStarted]);

  useEffect(() => {
    localStorage.setItem(LS.over, gameOver ? "true" : "false");
  }, [gameOver]);

  useEffect(() => {
    localStorage.setItem(LS.qcount, String(questionsAsked));
  }, [questionsAsked]);

  useEffect(() => {
    localStorage.setItem(LS.startedAt, String(startedAt));
  }, [startedAt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const lastAiMessage = useMemo(
    () => [...messages].reverse().find((m) => m.sender === "AI")?.text,
    [messages]
  );

  const aiAnswerChips = useMemo(() => {
    return [...messages]
      .filter((m) => m.sender === "AI")
      .map((m) => (m.text || "").trim())
      .filter((t) => t === "Sim" || t === "Não" || t === "Talvez")
      .slice(-10);
  }, [messages]);

  const elapsedSeconds = useMemo(() => {
    if (!startedAt || !gameStarted) return 0;
    return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  }, [startedAt, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const id = setInterval(() => setStartedAt((t) => t), 1000);
    return () => clearInterval(id);
  }, [gameStarted, gameOver]);

  const pushMessage = (sender: string, text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const resetClientOnly = () => {
    setMessages([]);
    setQuestion("");
    setGameStarted(false);
    setGameOver(false);
    setTyping(false);
    setLoading(false);
    setWinner(null);
    setQuestionsAsked(0);
    setStartedAt(0);

    localStorage.removeItem(LS.messages);
    localStorage.removeItem(LS.started);
    localStorage.removeItem(LS.over);
    localStorage.removeItem(LS.qcount);
    localStorage.removeItem(LS.startedAt);
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
      setQuestionsAsked(0);
      setStartedAt(Date.now());
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
    setQuestionsAsked((q) => q + 1);

    const questionToSend = question;
    setQuestion("");
    setTyping(true);
    setLoading(true);

    const minTyping = new Promise((resolve) => setTimeout(resolve, 450));

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
          name: character.name ?? "",
          work: character.work ?? "",
          image: character.image ?? "",
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

  const restartGame = async () => {
    resetClientOnly();
    await startGame();
  };

  return {
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
    resetClientOnly,
    setGameOver,
  };
}
