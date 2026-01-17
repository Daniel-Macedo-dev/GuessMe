import { useEffect, useMemo, useRef, useState } from "react";
import { askQuestion, startGame as startGameApi } from "../services/guessme";
import type { WinnerData } from "../types/guessme";

type ChatMessage = { sender: string; text: string };

const LS = {
  messages: "guessme_messages_v3",
  started: "guessme_started_v3",
  over: "guessme_over_v3",
  qcount: "guessme_qcount_v3",
  startedAt: "guessme_startedAtMs_v3",
};

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeYesNoMaybe(text: string): "yes" | "no" | "maybe" | null {
  const t = (text || "").trim().toLowerCase();
  if (t === "sim") return "yes";
  if (t === "não" || t === "nao") return "no";
  if (t === "talvez") return "maybe";
  return null;
}

export function useGame() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => safeParse(localStorage.getItem(LS.messages), [])
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

  const [startedAtMs, setStartedAtMs] = useState<number>(() => {
    const n = Number(localStorage.getItem(LS.startedAt) ?? "0");
    return Number.isFinite(n) ? n : 0;
  });

  const [nowMs, setNowMs] = useState<number>(Date.now());

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => localStorage.setItem(LS.messages, JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem(LS.started, gameStarted ? "true" : "false"), [gameStarted]);
  useEffect(() => localStorage.setItem(LS.over, gameOver ? "true" : "false"), [gameOver]);
  useEffect(() => localStorage.setItem(LS.qcount, String(questionsAsked)), [questionsAsked]);
  useEffect(() => localStorage.setItem(LS.startedAt, String(startedAtMs)), [startedAtMs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!gameStarted || !startedAtMs || gameOver) return;

    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [gameStarted, startedAtMs, gameOver]);

  useEffect(() => {
    if (!gameStarted) return;
    if (!startedAtMs || startedAtMs > Date.now() + 60_000) {
      const fresh = Date.now();
      setStartedAtMs(fresh);
    }
  }, [gameStarted, startedAtMs]);

  const elapsedSeconds = useMemo(() => {
    if (!gameStarted || !startedAtMs) return 0;
    const diff = Math.max(0, Math.floor((nowMs - startedAtMs) / 1000));
    return diff;
  }, [gameStarted, startedAtMs, nowMs]);

  const lastAiMessage = useMemo(
    () => [...messages].reverse().find((m) => m.sender === "AI")?.text,
    [messages]
  );

  const aiAnswerChips = useMemo(() => {
    const chips: string[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.sender !== "AI") continue;
      const kind = normalizeYesNoMaybe(m.text);
      if (!kind) continue;
      chips.push(kind);
      if (chips.length >= 10) break;
    }
    return chips.reverse();
  }, [messages]);

  const pushMessage = (sender: string, text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const data = await startGameApi();
      const text =
        data?.answer || "Ok! Já escolhi um personagem. Pode fazer sua primeira pergunta!";

      setMessages([{ sender: "AI", text }]);
      setGameStarted(true);
      setGameOver(false);
      setWinner(null);
      setQuestionsAsked(0);

      const fresh = Date.now();
      setStartedAtMs(fresh);
      setNowMs(fresh);
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

    const questionToSend = question.trim();
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

  const resetClient = () => {
    setMessages([]);
    setQuestion("");
    setGameStarted(false);
    setGameOver(false);
    setTyping(false);
    setWinner(null);
    setQuestionsAsked(0);
    setStartedAtMs(0);

    Object.values(LS).forEach((k) => localStorage.removeItem(k));
  };

  const restartGame = async () => {
    resetClient();
    await startGame();
  };

  return {
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
  };
}
