import { useEffect, useMemo, useRef, useState } from "react";
import type { Message, WinnerData } from "../types/guessme";
import { askGuessMe, startGame } from "../services/guessme";

const STORAGE_KEY = "guessme:state:v4";

type Stored = {
  messages: Message[];
  questionsCount: number;
  winner: WinnerData | null;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeLoad(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Stored;
    if (!Array.isArray(data.messages)) return null;
    return data;
  } catch {
    return null;
  }
}

function safeSave(state: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useGame() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [winner, setWinner] = useState<WinnerData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Para evitar double start no StrictMode e evitar chamadas repetidas
  const startedRef = useRef(false);

  // Para cancelar requests quando desmonta / reinicia
  const inFlightRef = useRef<AbortController | null>(null);

  // Para scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ========== LOAD FROM STORAGE ==========
  useEffect(() => {
    const stored = safeLoad();
    if (stored) {
      setMessages(stored.messages);
      setQuestionsCount(stored.questionsCount || 0);
      setWinner(stored.winner || null);
      startedRef.current = true; // já tem estado, não precisa start automático
    }
  }, []);

  // ========== PERSIST ==========
  useEffect(() => {
    safeSave({ messages, questionsCount, winner });
  }, [messages, questionsCount, winner]);

  // ========== SCROLL ==========
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canAsk = useMemo(() => !loading && !winner, [loading, winner]);

  function cancelInFlight() {
    if (inFlightRef.current) {
      inFlightRef.current.abort();
      inFlightRef.current = null;
    }
  }

  // ========== START GAME ==========
  async function boot() {
    if (startedRef.current) return;
    startedRef.current = true;

    setError(null);
    setLoading(true);
    cancelInFlight();

    const controller = new AbortController();
    inFlightRef.current = controller;

    try {
      // startGame usa apiFetch; para suportar abort, você pode adaptar apiFetch
      // mas mesmo sem isso, manteremos o controle de "stale" aqui.
      const res = await startGame();

      // se reiniciou no meio, ignora
      if (inFlightRef.current !== controller) return;

      setWinner(null);
      setQuestionsCount(0);
      setMessages([
        { id: uid(), sender: "AI", text: res.answer, ts: Date.now() },
      ]);
    } catch (e: any) {
      if (inFlightRef.current !== controller) return;
      setError(e?.message || "Erro ao iniciar o jogo.");
      setMessages([
        {
          id: uid(),
          sender: "AI",
          text: "Não consegui iniciar o jogo. Verifique se a API está rodando.",
          ts: Date.now(),
        },
      ]);
    } finally {
      if (inFlightRef.current === controller) {
        inFlightRef.current = null;
      }
      setLoading(false);
    }
  }

  // auto-boot se não tem mensagens
  useEffect(() => {
    if (messages.length === 0) boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  // ========== SEND QUESTION ==========
  async function sendQuestion(question: string) {
    const q = question.trim();
    if (!q || !canAsk) return;

    setError(null);
    setLoading(true);
    cancelInFlight();

    // adiciona mensagem do usuário
    setMessages((prev) => [
      ...prev,
      { id: uid(), sender: "Você", text: q, ts: Date.now() },
    ]);
    setQuestionsCount((n) => n + 1);

    const controller = new AbortController();
    inFlightRef.current = controller;

    try {
      const res = await askGuessMe(q);

      if (inFlightRef.current !== controller) return;

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
      if (inFlightRef.current !== controller) return;

      setError(e?.message || "Erro ao chamar a API.");
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          sender: "AI",
          text: "Deu erro ao buscar resposta. Tenta novamente.",
          ts: Date.now(),
        },
      ]);
    } finally {
      if (inFlightRef.current === controller) {
        inFlightRef.current = null;
      }
      setLoading(false);
    }
  }

  // ========== RESTART ==========
  async function restart() {
    // reiniciar = limpar tudo + chamar /start novamente
    cancelInFlight();
    setWinner(null);
    setQuestionsCount(0);
    setMessages([]);
    startedRef.current = false;
    await boot();
  }

  // ========== CLEANUP ==========
  useEffect(() => {
    return () => cancelInFlight();
  }, []);

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
