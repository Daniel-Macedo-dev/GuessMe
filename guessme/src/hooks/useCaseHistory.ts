import { useCallback, useState } from "react";
import type { CaseEvidence, CaseHistoryEntry, Message, VerdictStats, WinnerData } from "../types/guessme";
import {
  clearCaseHistory,
  deleteCaseHistoryEntry,
  getCaseHistory,
  saveCaseHistoryEntry,
} from "../services/caseHistoryStorage";
import { deriveEvidence } from "../helpers/deriveEvidence";
import { normalizeImportedCase } from "../helpers/caseImport";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildVerdictStats(messages: Message[]): VerdictStats {
  const stats: VerdictStats = { yes: 0, no: 0, maybe: 0, unknown: 0 };
  for (const m of messages) {
    if (m.kind !== "ai") continue;
    if (m.verdict === "YES") stats.yes++;
    else if (m.verdict === "NO") stats.no++;
    else if (m.verdict === "MAYBE") stats.maybe++;
    else stats.unknown++;
  }
  return stats;
}

function findWinningQuestion(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].kind === "ai" && messages[i].verdict === "YES") {
      for (let j = i - 1; j >= 0; j--) {
        if (messages[j].kind === "user") return messages[j].text;
      }
    }
  }
  return null;
}

function toCaseEvidence(messages: Message[]): CaseEvidence {
  const ev = deriveEvidence(messages);
  return {
    confirmed: ev.confirmed.map((e) => ({ ...e, kind: "confirmed" as const })),
    refuted: ev.refuted.map((e) => ({ ...e, kind: "refuted" as const })),
    inconclusive: ev.inconclusive.map((e) => ({ ...e, kind: "inconclusive" as const })),
    hints: ev.hints,
  };
}

function countHints(messages: Message[]): number {
  return messages.filter((m) => m.kind === "hint").length;
}

export function useCaseHistory() {
  const [history, setHistory] = useState<CaseHistoryEntry[]>(() => getCaseHistory());

  function refresh() {
    setHistory(getCaseHistory());
  }

  const saveOnVictory = useCallback(
    (
      winner: WinnerData,
      messages: Message[],
      category: string,
      questionsCount: number,
    ) => {
      const winningQuestion = findWinningQuestion(messages);
      const evidence = toCaseEvidence(messages);
      const verdictStats = buildVerdictStats(messages);
      const hintCount = countHints(messages);

      const entry: CaseHistoryEntry = {
        id: uid(),
        createdAt: Date.now(),
        characterName: winner.name,
        work: winner.work,
        category,
        questionCount: questionsCount,
        hintCount,
        messages: [...messages],
        evidence,
        solvedSummary: { name: winner.name, work: winner.work, image: winner.image },
        winningQuestion,
        verdictStats,
      };

      saveCaseHistoryEntry(entry);
      refresh();
    },
    [],
  );

  const deleteEntry = useCallback((id: string) => {
    deleteCaseHistoryEntry(id);
    refresh();
  }, []);

  const clearAll = useCallback(() => {
    clearCaseHistory();
    refresh();
  }, []);

  const importEntry = useCallback(
    (entry: CaseHistoryEntry): { renamed: boolean } => {
      const current = getCaseHistory();
      const existingIds = new Set(current.map((e) => e.id));
      const { entry: normalized, renamed } = normalizeImportedCase(entry, existingIds);
      saveCaseHistoryEntry(normalized);
      refresh();
      return { renamed };
    },
    [],
  );

  return { history, saveOnVictory, deleteEntry, clearAll, importEntry };
}
