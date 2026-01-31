import type { AIResponse } from "../types/guessme";
import { apiFetch } from "./api";

export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>("/api/game/categories", { method: "GET" });
}

export async function startGame(category?: string): Promise<AIResponse> {
  const c = (category || "").trim();
  const q =
    c && c.toLowerCase() !== "geral"
      ? `?category=${encodeURIComponent(c)}`
      : "";

  return apiFetch<AIResponse>(`/api/game/start${q}`, { method: "GET" });
}

export async function askGuessMe(question: string): Promise<AIResponse> {
  return apiFetch<AIResponse>("/api/game/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function requestHint(): Promise<AIResponse> {
  return apiFetch<AIResponse>("/api/game/hint", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
