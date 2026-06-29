import type { CaseHistoryEntry } from "./guessme";

export type CategoryStats = {
  category: string;
  count: number;
  totalQuestions: number;
  avgQuestions: number;
};

export type VerdictStatsSummary = {
  yes: number;
  no: number;
  maybe: number;
  unknown: number;
  total: number;
  yesRatio: number;
  noRatio: number;
  maybeRatio: number;
};

export type EvidenceStatsSummary = {
  confirmed: number;
  refuted: number;
  inconclusive: number;
  hints: number;
  total: number;
};

export type CaseRankingEntry = {
  entry: CaseHistoryEntry;
  rank: "best" | "longest";
};

export type PersonalStatsDashboardData = {
  totalCases: number;
  totalQuestions: number;
  totalHints: number;
  averageQuestions: number;
  averageHints: number;
  verdictTotals: VerdictStatsSummary;
  categoryBreakdown: CategoryStats[];
  evidenceTotals: EvidenceStatsSummary;
  bestCase: CaseHistoryEntry | null;
  longestCase: CaseHistoryEntry | null;
  recentCases: CaseHistoryEntry[];
  uniqueCharacters: number;
};
