import { useEffect, useMemo, useRef, useState } from "react";
import type { Message, WinnerData } from "../types/guessme";
import { askGuessMe, resetGuessMe } from "../services/guessme";

const STORAGE_KEY = "guessme:v1";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type Stored = {
  messages: Message[];
  questionsCount: number;
  winner: WinnerData | null;
};

export function useGame() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // load
  useEffect(() => {
    const stored = safeParse<Stored>(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setMessages(stored.messages || []);
      setQuestionsCount(stored.questionsCount || 0);
      setWinner(stored.winner || null);
    } else {
      setMessages([
        {
          id: uid(),
          sender: "AI",
          text: "Beleza! Faça perguntas de sim/não e tente adivinhar o personagem 😄",
          ts: Date.now(),
        },
      ]);
    }
  }, []);

  // persist
  useEffect(() => {
    const payload: Stored = { messages, questionsCount, winner };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [messages, questionsCount, winner]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canAsk = useMemo(() => !loading && !winner, [loading, winner]);

  async function sendQuestion(question: string) {
    const q = question.trim();
    if (!q || !canAsk) return;

    setError(null);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { id: uid(), sender: "Você", text: q, ts: Date.now() },
    ]);
    setQuestionsCount((n) => n + 1);

    try {
      const res = await askGuessMe(q);

      setMessages((prev) => [
        ...prev,
        { id: uid(), sender: "AI", text: res.answer, ts: Date.now() },
      ]);

      if (res.success && res.character) {
        setWinner({
          name: res.character.name,
          work: res.character.work,
          image: res.character.image,
        });
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao chamar a API.");
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          sender: "AI",
          text: "Deu erro ao buscar resposta. Tenta novamente em alguns segundos.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function restart() {
    setError(null);
    setLoading(true);
    try {
      await resetGuessMe().catch(() => {});
    } finally {
      setWinner(null);
      setQuestionsCount(0);
      setMessages([
        {
          id: uid(),
          sender: "AI",
          text: "Novo jogo! Pergunte de sim/não e tente adivinhar 😄",
          ts: Date.now(),
        },
      ]);
      setLoading(false);
    }
  }

  return {
    messages,
    questionsCount,
    winner,
    loading,
    error,
    canAsk,
    bottomRef,
    sendQuestion,
    restart,
  };
}
