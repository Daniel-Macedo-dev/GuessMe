import type { AIResponse } from "../types/guessme";
import { apiFetch } from "./api";

const VALID_VERDICTS = new Set(["YES", "NO", "MAYBE", "UNKNOWN"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseAIResponse(value: unknown): AIResponse {
  if (!isRecord(value) || typeof value.answer !== "string" || value.answer.trim() === "") {
    throw new Error("Resposta inválida do servidor.");
  }
  if (typeof value.success !== "boolean") throw new Error("Resposta inválida do servidor.");
  if (typeof value.sessionId !== "string" || value.sessionId.trim() === "") {
    throw new Error("Resposta inválida do servidor.");
  }
  const character = value.character;
  if (character !== null && (
    !isRecord(character) || typeof character.name !== "string" ||
    typeof character.work !== "string" || typeof character.image !== "string"
  )) {
    throw new Error("Resposta inválida do servidor.");
  }
  if (value.verdict !== undefined && !VALID_VERDICTS.has(String(value.verdict))) {
    throw new Error("Resposta inválida do servidor.");
  }
  return value as AIResponse;
}

export async function getCategories(): Promise<string[]> {
  const value = await apiFetch<unknown>("/api/game/categories", { method: "GET" });
  if (!Array.isArray(value) || value.some((category) => typeof category !== "string")) {
    throw new Error("Resposta inválida do servidor.");
  }
  return [...new Set(value.map((category) => category.trim()).filter(Boolean))];
}

export async function startGame(category?: string, signal?: AbortSignal): Promise<AIResponse> {
  const c = (category || "").trim();
  const body: Record<string, string> = {};
  if (c && c.toLowerCase() !== "geral") body.category = c;

  const response = await apiFetch<unknown>("/api/game/start", {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });
  return parseAIResponse(response);
}

export async function askGuessMe(
  question: string,
  sessionId: string | null,
  signal?: AbortSignal,
): Promise<AIResponse> {
  const response = await apiFetch<unknown>("/api/game/ask", {
    method: "POST",
    body: JSON.stringify({ question, sessionId }),
    signal,
  });
  return parseAIResponse(response);
}

export async function requestHint(sessionId: string | null, signal?: AbortSignal): Promise<AIResponse> {
  const response = await apiFetch<unknown>("/api/game/hint", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
    signal,
  });
  return parseAIResponse(response);
}
