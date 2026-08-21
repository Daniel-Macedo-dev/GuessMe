import { useEffect, useMemo, useRef, useState } from "react";
import type { AnswerVerdict, Message, MessageKind, WinnerData } from "../types/guessme";
import { askGuessMe, getCategories, requestHint, startGame } from "../services/guessme";

const STORAGE_KEY = "guessme:state:v5";

type AnswerKind = "stale-session" | "system-error" | "user-limit" | "game";

function cleanGeminiError(answer: string): string {
  const prefix = answer.match(/^(Erro da API Gemini \(\d+\)):\s*/);
  if (!prefix) return answer;
  const body = answer.slice(prefix[0].length).trim();
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } };
    const msg = parsed?.error?.message;
    if (msg) return `${prefix[1]}: ${msg}`;
  } catch {
    if (body.length > 100) return `${prefix[1]}: ${body.slice(0, 100)}…`;
  }
  return answer;
}

function classifyAnswer(answer: string): AnswerKind {
  if (answer.startsWith("Sessão não encontrada")) return "stale-session";
  if (
    answer.startsWith("Config inválida") ||
    answer.startsWith("Erro da API Gemini") ||
    answer.startsWith("Erro inesperado") ||
    answer.startsWith("Resposta vazia") ||
    answer.startsWith("Resposta inválida") ||
    answer.startsWith("Pergunta inválida")
  )
    return "system-error";
  // Backend limit/cooldown messages — show as inline warning, not as game bubbles.
  if (
    answer.startsWith("Aguarde") ||
    answer.startsWith("Limite") ||
    answer.startsWith("Pergunta muito longa")
  )
    return "user-limit";
  return "game";
}

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

function msg(sender: Message["sender"], text: string, kind: MessageKind, verdict?: AnswerVerdict): Message {
  return { id: uid(), sender, text, ts: Date.now(), kind, verdict };
}

function safeLoad(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Stored;
    if (!Array.isArray(data.messages)) return null;
    if (typeof data.category !== "string") data.category = "Geral";
    // Reject stored game progress without a sessionId — pre-integration data would route
    // to the backend's shared default session, which is wrong.
    if (data.messages.length > 0 && !data.sessionId) return null;
    data.sessionId = data.sessionId ?? null;
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
  const [sessionExpired, setSessionExpired] = useState(false);

  const [categories, setCategories] = useState<string[]>(["Geral"]);
  const [category, setCategory] = useState<string>("Geral");

  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bootError, setBootError] = useState(false);
  // Inline warning for backend limit/cooldown rejections (user-facing, non-critical).
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const startedRef = useRef(false);
  const inFlightRef = useRef<AbortController | null>(null);
  const hintInFlightRef = useRef(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

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
  // Skip the very first run: it fires in the same effect flush as the load
  // effect, before restored state is rendered, and would clobber stored
  // progress with the initial empty state (visible under StrictMode remounts).
  const persistReadyRef = useRef(false);
  useEffect(() => {
    if (!persistReadyRef.current) {
      persistReadyRef.current = true;
      return;
    }
    safeSave({ messages, questionsCount, winner, category, sessionId });
  }, [messages, questionsCount, winner, category, sessionId]);

  // ===== scroll =====
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const canAsk = useMemo(
    () =>
      !loading &&
      !winner &&
      !sessionExpired &&
      (sessionId !== null || messages.length === 0),
    [loading, winner, sessionExpired, sessionId, messages.length]
  );

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

    setSessionExpired(false);
    setBootError(false);
    setError(null);
    setLimitMessage(null);
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
      setMessages([msg("AI", res.answer, "ai")]);
    } catch (e: any) {
      if (inFlightRef.current !== controller) return;
      setBootError(true);
      setError("Não foi possível abrir o caso. Verifique se a API está acessível e tente novamente.");
      setMessages([msg("AI", "Não foi possível abrir o caso agora. Verifique se a API está rodando.", "error")]);
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
    setLimitMessage(null);
    setLoading(true);
    cancelInFlight();

    setMessages((prev) => [...prev, msg("Você", q, "user")]);
    setQuestionsCount((n) => n + 1);

    const controller = new AbortController();
    inFlightRef.current = controller;

    try {
      const res = await askGuessMe(q, sessionId);

      if (inFlightRef.current !== controller) return;

      const kind = classifyAnswer(res.answer);

      if (kind === "stale-session") {
        setSessionId(null);
        setSessionExpired(true);
        setQuestionsCount((n) => n - 1);
        setError("Sessão expirada. Clique em 'Novo caso' para iniciar uma nova investigação.");
      } else if (kind === "system-error") {
        setQuestionsCount((n) => Math.max(0, n - 1));
        setError(cleanGeminiError(res.answer));
      } else if (kind === "user-limit") {
        // Backend rejected the request (cooldown, max questions, overlong) — not counted.
        setQuestionsCount((n) => n - 1);
        setLimitMessage(res.answer);
      } else {
        setMessages((prev) => [...prev, msg("AI", res.answer, "ai", res.verdict)]);
        if (res.success && res.character) {
          setWinner({
            name: res.character.name,
            work: res.character.work,
            image: res.character.image,
          });
        }
      }
    } catch (e: any) {
      if (inFlightRef.current !== controller) return;
      setQuestionsCount((n) => Math.max(0, n - 1));
      setError(e?.message || "Erro ao chamar a API. Verifique se o servidor está rodando.");
    } finally {
      if (inFlightRef.current === controller) inFlightRef.current = null;
      setLoading(false);
    }
  }

  // ===== hint =====
  async function hint() {
    if (loading || winner || hintInFlightRef.current || sessionExpired) return;

    hintInFlightRef.current = true;
    setHintLoading(true);
    setError(null);
    setLimitMessage(null);

    try {
      const res = await requestHint(sessionId);

      const kind = classifyAnswer(res.answer);

      if (kind === "stale-session") {
        setSessionId(null);
        setSessionExpired(true);
        setError("Sessão expirada. Clique em 'Novo caso' para iniciar uma nova investigação.");
      } else if (kind === "system-error") {
        setError(cleanGeminiError(res.answer));
      } else if (kind === "user-limit") {
        setLimitMessage(res.answer);
      } else {
        const txt = (res?.answer || "").trim();
        const text = txt || "(vazia)";
        setMessages((prev) => [...prev, msg("AI", text, "hint")]);
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao pedir dica. Verifique se o servidor está rodando.");
    } finally {
      hintInFlightRef.current = false;
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
    setSessionExpired(false);
    setError(null);
    setLimitMessage(null);
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
    setSessionExpired(false);
    setError(null);
    setLimitMessage(null);
    setMessages([]);
    startedRef.current = false;
    await boot(category);
  }

  useEffect(() => {
    return () => {
      cancelInFlight();
      // Allow a future mount to boot again: the cancelled request will never
      // populate the transcript, so the started flag must not survive unmount.
      startedRef.current = false;
    };
  }, []);

  return {
    messages,
    questionsCount,
    winner,
    loading,
    error,
    bootError,
    limitMessage,
    canAsk,
    sessionExpired,
    chatScrollRef,

    categories,
    category,
    changeCategory,

    sendQuestion,
    hint,
    hintLoading,
    restart,
  };
}
