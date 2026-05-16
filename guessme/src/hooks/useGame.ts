import { useEffect, useMemo, useRef, useState } from "react";
import type { Message, WinnerData } from "../types/guessme";
import { askGuessMe, getCategories, requestHint, startGame } from "../services/guessme";

const STORAGE_KEY = "guessme:state:v5";

type Stored = {
  messages: Message[];
  questionsCount: number;
  winner: WinnerData | null;
  category: string;
  sessionId: string | null;
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
    if (typeof data.category !== "string") data.category = "Geral";
    if (!data.sessionId) data.sessionId = null;
    return data;
  } catch {
    return null;
  }
}

function safeSave(state: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    //
  }
}

export function useGame() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [winner, setWinner] = useState<WinnerData | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>(["Geral"]);
  const [category, setCategory] = useState<string>("Geral");

  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedRef = useRef(false);
  const inFlightRef = useRef<AbortController | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ===== load storage =====
  useEffect(() => {
    const stored = safeLoad();
    if (stored) {
      setMessages(stored.messages);
      setQuestionsCount(stored.questionsCount || 0);
      setWinner(stored.winner || null);
      setCategory(stored.category || "Geral");
      setSessionId(stored.sessionId || null);
      startedRef.current = stored.messages.length > 0;
    }
  }, []);

  // ===== persist =====
  useEffect(() => {
    safeSave({ messages, questionsCount, winner, category, sessionId });
  }, [messages, questionsCount, winner, category, sessionId]);

  // ===== scroll =====
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

  // ===== load categories (uma vez) =====
  useEffect(() => {
    let alive = true;
    getCategories()
      .then((list) => {
        if (!alive) return;
        if (Array.isArray(list) && list.length > 0) setCategories(list);
      })
      .catch(() => {
        // se falhar, fica só "Geral"
      });
    return () => {
      alive = false;
    };
  }, []);

  // ===== start game =====
  async function boot(cat?: string) {
    if (startedRef.current) return;
    startedRef.current = true;

    setError(null);
    setLoading(true);
    cancelInFlight();

    const controller = new AbortController();
    inFlightRef.current = controller;

    try {
      const chosen = (cat ?? category) || "Geral";
      const res = await startGame(chosen);

      if (inFlightRef.current !== controller) return;

      setWinner(null);
      setQuestionsCount(0);
      setSessionId(res.sessionId ?? null);
      setMessages([{ id: uid(), sender: "AI", text: res.answer, ts: Date.now() }]);
    } catch (e: any) {
      if (inFlightRef.current !== controller) return;
      setError(e?.message || "Erro ao iniciar o jogo.");
      setMessages([
        {
          id: uid(),
          sender: "AI",
          text: "Não consegui iniciar o jogo agora. Verifique se a API está rodando.",
          ts: Date.now(),
        },
      ]);
    } finally {
      if (inFlightRef.current === controller) inFlightRef.current = null;
      setLoading(false);
    }
  }

  // inicia automaticamente se não tem mensagens
  useEffect(() => {
    if (messages.length === 0) boot(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  // ===== send question =====
  async function sendQuestion(question: string) {
    const q = question.trim();
    if (!q || !canAsk) return;

    setError(null);
    setLoading(true);
    cancelInFlight();

    setMessages((prev) => [...prev, { id: uid(), sender: "Você", text: q, ts: Date.now() }]);
    setQuestionsCount((n) => n + 1);

    const controller = new AbortController();
    inFlightRef.current = controller;

    try {
      const res = await askGuessMe(q, sessionId);

      if (inFlightRef.current !== controller) return;

      setMessages((prev) => [...prev, { id: uid(), sender: "AI", text: res.answer, ts: Date.now() }]);

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
        { id: uid(), sender: "AI", text: "Deu erro ao buscar resposta. Tenta novamente.", ts: Date.now() },
      ]);
    } finally {
      if (inFlightRef.current === controller) inFlightRef.current = null;
      setLoading(false);
    }
  }

  // ===== hint =====
  async function hint() {
    if (loading || winner || hintLoading) return;

    setHintLoading(true);
    setError(null);

    try {
      const res = await requestHint(sessionId);
      const txt = (res?.answer || "").trim();
      const text = txt ? `Dica: ${txt}` : "Dica: (vazia)";

      setMessages((prev) => [...prev, { id: uid(), sender: "AI", text, ts: Date.now() }]);
    } catch (e: any) {
      setError(e?.message || "Erro ao pedir dica.");
      setMessages((prev) => [
        ...prev,
        { id: uid(), sender: "AI", text: "Não consegui gerar uma dica agora.", ts: Date.now() },
      ]);
    } finally {
      setHintLoading(false);
    }
  }

  // ===== change category =====
  async function changeCategory(newCategory: string) {
    const next = newCategory?.trim() || "Geral";
    setCategory(next);

    cancelInFlight();
    setWinner(null);
    setQuestionsCount(0);
    setSessionId(null);
    setMessages([]);
    startedRef.current = false;

    await boot(next);
  }

  // ===== restart =====
  async function restart() {
    cancelInFlight();
    setWinner(null);
    setQuestionsCount(0);
    setSessionId(null);
    setMessages([]);
    startedRef.current = false;
    await boot(category);
  }

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

    categories,
    category,
    changeCategory,

    sendQuestion,
    hint,
    hintLoading,
    restart,
  };
}
