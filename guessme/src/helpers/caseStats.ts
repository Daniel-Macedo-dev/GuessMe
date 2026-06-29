import type { CaseHistoryEntry } from "../types/guessme";
import type {
  CategoryStats,
  EvidenceStatsSummary,
  PersonalStatsDashboardData,
  VerdictStatsSummary,
} from "../types/stats";

function safeArr<T>(v: T[] | undefined | null): T[] {
  return Array.isArray(v) ? v : [];
}

export function calculateVerdictTotals(entries: CaseHistoryEntry[]): VerdictStatsSummary {
  let yes = 0, no = 0, maybe = 0, unknown = 0;
  for (const e of entries) {
    const vs = e.verdictStats ?? { yes: 0, no: 0, maybe: 0, unknown: 0 };
    yes += vs.yes ?? 0;
    no += vs.no ?? 0;
    maybe += vs.maybe ?? 0;
    unknown += vs.unknown ?? 0;
  }
  const total = yes + no + maybe + unknown;
  return {
    yes,
    no,
    maybe,
    unknown,
    total,
    yesRatio: total > 0 ? yes / total : 0,
    noRatio: total > 0 ? no / total : 0,
    maybeRatio: total > 0 ? maybe / total : 0,
  };
}

export function calculateCategoryBreakdown(entries: CaseHistoryEntry[]): CategoryStats[] {
  const map = new Map<string, { count: number; totalQuestions: number }>();
  for (const e of entries) {
    const cat = (e.category ?? "Desconhecida").trim() || "Desconhecida";
    const prev = map.get(cat) ?? { count: 0, totalQuestions: 0 };
    map.set(cat, {
      count: prev.count + 1,
      totalQuestions: prev.totalQuestions + (e.questionCount ?? 0),
    });
  }
  return Array.from(map.entries())
    .map(([category, { count, totalQuestions }]) => ({
      category,
      count,
      totalQuestions,
      avgQuestions: count > 0 ? Math.round(totalQuestions / count) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateEvidenceTotals(entries: CaseHistoryEntry[]): EvidenceStatsSummary {
  let confirmed = 0, refuted = 0, inconclusive = 0, hints = 0;
  for (const e of entries) {
    const ev = e.evidence ?? {};
    confirmed += safeArr(ev.confirmed).length;
    refuted += safeArr(ev.refuted).length;
    inconclusive += safeArr(ev.inconclusive).length;
    hints += safeArr(ev.hints).length;
  }
  return { confirmed, refuted, inconclusive, hints, total: confirmed + refuted + inconclusive + hints };
}

export function getBestCase(entries: CaseHistoryEntry[]): CaseHistoryEntry | null {
  if (entries.length === 0) return null;
  return entries.reduce((best, e) =>
    (e.questionCount ?? Infinity) < (best.questionCount ?? Infinity) ? e : best,
  );
}

export function getLongestCase(entries: CaseHistoryEntry[]): CaseHistoryEntry | null {
  if (entries.length === 0) return null;
  return entries.reduce((longest, e) =>
    (e.questionCount ?? 0) > (longest.questionCount ?? 0) ? e : longest,
  );
}

export function getRecentCases(entries: CaseHistoryEntry[], limit = 5): CaseHistoryEntry[] {
  return [...entries]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, limit);
}

export function deriveCaseStats(entries: CaseHistoryEntry[]): PersonalStatsDashboardData {
  if (entries.length === 0) {
    const emptyVerdict: VerdictStatsSummary = {
      yes: 0, no: 0, maybe: 0, unknown: 0,
      total: 0, yesRatio: 0, noRatio: 0, maybeRatio: 0,
    };
    const emptyEvidence: EvidenceStatsSummary = {
      confirmed: 0, refuted: 0, inconclusive: 0, hints: 0, total: 0,
    };
    return {
      totalCases: 0,
      totalQuestions: 0,
      totalHints: 0,
      averageQuestions: 0,
      averageHints: 0,
      verdictTotals: emptyVerdict,
      categoryBreakdown: [],
      evidenceTotals: emptyEvidence,
      bestCase: null,
      longestCase: null,
      recentCases: [],
      uniqueCharacters: 0,
    };
  }

  const totalCases = entries.length;
  const totalQuestions = entries.reduce((s, e) => s + (e.questionCount ?? 0), 0);
  const totalHints = entries.reduce((s, e) => s + (e.hintCount ?? 0), 0);
  const uniqueCharacters = new Set(entries.map((e) => e.characterName ?? "")).size;

  return {
    totalCases,
    totalQuestions,
    totalHints,
    averageQuestions: Math.round(totalQuestions / totalCases),
    averageHints: Math.round((totalHints / totalCases) * 10) / 10,
    verdictTotals: calculateVerdictTotals(entries),
    categoryBreakdown: calculateCategoryBreakdown(entries),
    evidenceTotals: calculateEvidenceTotals(entries),
    bestCase: getBestCase(entries),
    longestCase: getLongestCase(entries),
    recentCases: getRecentCases(entries, 5),
    uniqueCharacters,
  };
}
