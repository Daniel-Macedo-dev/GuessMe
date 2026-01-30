import { apiFetch } from "./api";
import type { AIResponse } from "../types/guessme";

export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>("/api/game/categories", { method: "GET" });
}

export async function startGame(category?: string): Promise<AIResponse> {
  const q =
    category && category.trim() && category !== "Geral"
      ? `?category=${encodeURIComponent(category.trim())}`
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
  return apiFetch<AIResponse>("/api/game/hint", { method: "POST" });
}
