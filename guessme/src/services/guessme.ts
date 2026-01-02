import { api } from "./api";
import type { AIResponse } from "../types/guessme";

export async function startGame(): Promise<AIResponse> {
  const { data } = await api.get<AIResponse>("/start");
  return data;
}

export async function askQuestion(question: string): Promise<AIResponse> {
  const { data } = await api.post<AIResponse>("/ask", { question });
  return data;
}
