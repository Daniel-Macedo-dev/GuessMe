import type { Message, WinnerData } from "../types/guessme";

export type CaseVisualStatus =
  | "idle"
  | "opening"
  | "active"
  | "analyzing"
  | "clue"
  | "solved"
  | "error";

type Params = {
  messages: Message[];
  loading: boolean;
  hintLoading: boolean;
  winner: WinnerData | null;
  error: string | null;
};

export function deriveCaseStatus({
  messages,
  loading,
  hintLoading,
  winner,
  error,
}: Params): CaseVisualStatus {
  if (winner) return "solved";
  if (error) return "error";
  if (hintLoading) return "clue";
  if (loading && messages.length === 0) return "opening";
  if (loading) return "analyzing";
  if (messages.length > 0) return "active";
  return "idle";
}

export const CASE_STATUS_LABELS: Record<CaseVisualStatus, string> = {
  idle:      "CASO NÃO ABERTO",
  opening:   "ABRINDO DOSSIÊ",
  active:    "INVESTIGAÇÃO ATIVA",
  analyzing: "ANALISANDO RESPOSTA",
  clue:      "PISTA EM ANÁLISE",
  solved:    "CASO ENCERRADO",
  error:     "FALHA NO DOSSIÊ",
};
