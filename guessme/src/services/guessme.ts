import { apiFetch } from "./api";
import type { AIResponse } from "../types/guessme";

export async function askGuessMe(question: string): Promise<AIResponse> {
  return apiFetch<AIResponse>("/guessme/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function resetGuessMe(): Promise<void> {
  await apiFetch<void>("/guessme/reset", { method: "POST" });
}
