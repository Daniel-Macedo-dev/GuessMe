import type { AIResponse } from "../types/guessme";
import { apiFetch } from "./api";

export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>("/api/game/categories", { method: "GET" });
}

export async function startGame(category?: string): Promise<AIResponse> {
  const c = (category || "").trim();
  const body: Record<string, string> = {};
  if (c && c.toLowerCase() !== "geral") body.category = c;

  return apiFetch<AIResponse>("/api/game/start", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function askGuessMe(question: string, sessionId: string | null): Promise<AIResponse> {
  return apiFetch<AIResponse>("/api/game/ask", {
    method: "POST",
    body: JSON.stringify({ question, sessionId }),
  });
}

export async function requestHint(sessionId: string | null): Promise<AIResponse> {
  return apiFetch<AIResponse>("/api/game/hint", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}
