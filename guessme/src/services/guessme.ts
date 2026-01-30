import { apiFetch } from "./api";
import type { AIResponse } from "../types/guessme";

export async function startGame(): Promise<AIResponse> {
  return apiFetch<AIResponse>("/api/game/start", { method: "GET" });
}

export async function askGuessMe(question: string): Promise<AIResponse> {
  return apiFetch<AIResponse>("/api/game/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
