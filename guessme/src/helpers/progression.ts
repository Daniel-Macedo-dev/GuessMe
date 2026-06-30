import type { CaseHistoryEntry } from "../types/guessme";
import type {
  Achievement,
  AchievementId,
  AchievementProgress,
  AgentRank,
  PlayerProgression,
} from "../types/progression";

// ── Rank ladder ─────────────────────────────────────────────────────────────

export const AGENT_RANKS: AgentRank[] = [
  { id: "recruta",      title: "Recruta",          minCases: 0,  stamp: "RECRUTADO"    },
  { id: "analista",     title: "Analista",          minCases: 1,  stamp: "ANALISTA"     },
  { id: "investigador", title: "Investigador",      minCases: 3,  stamp: "INVESTIGADOR" },
  { id: "detetive",     title: "Detetive",          minCases: 7,  stamp: "DETETIVE"     },
  { id: "arquivista",   title: "Arquivista",        minCases: 15, stamp: "ARQUIVISTA"   },
  { id: "mestre",       title: "Mestre do Dossiê",  minCases: 25, stamp: "MESTRE"       },
];

// ── Rank derivation ──────────────────────────────────────────────────────────

export function deriveAgentRank(solvedCount: number): AgentRank {
  let rank = AGENT_RANKS[0];
  for (const r of AGENT_RANKS) {
    if (solvedCount >= r.minCases) rank = r;
  }
  return rank;
}

export function deriveNextRank(solvedCount: number): AgentRank | null {
  return AGENT_RANKS.find((r) => r.minCases > solvedCount) ?? null;
}

export function calculateProgressPercent(
  current: number,
  currentMin: number,
  nextMin: number,
): number {
  const span = nextMin - currentMin;
  if (span <= 0) return 100;
  return Math.min(100, Math.round(((current - currentMin) / span) * 100));
}

// ── Achievement derivation ───────────────────────────────────────────────────

function safeArr<T>(v: T[] | undefined | null): T[] {
  return Array.isArray(v) ? v : [];
}

function ach(
  id: AchievementId,
  title: string,
  description: string,
  category: Achievement["category"],
  progress: number,
  goal: number,
): Achievement {
  return {
    id,
    title,
    description,
    category,
    status: progress >= goal ? "unlocked" : "locked",
    progress: Math.min(progress, goal),
    goal,
  };
}

export function deriveAchievements(history: CaseHistoryEntry[]): Achievement[] {
  const solved = history.length;

  const totalHints = history.reduce((s, e) => s + (e.hintCount ?? 0), 0);

  let totalConfirmed = 0;
  let totalRefuted = 0;
  let totalInconclusive = 0;

  for (const e of history) {
    const ev = e.evidence ?? {};
    totalConfirmed += safeArr(ev.confirmed).length;
    totalRefuted += safeArr(ev.refuted).length;
    totalInconclusive += safeArr(ev.inconclusive).length;
  }

  const uniqueCategories = new Set(
    history.map((e) => (e.category ?? "").trim() || "Desconhecida"),
  ).size;

  const hasCirurgica = history.some((e) => (e.questionCount ?? Infinity) <= 5);
  const hasSemAjuda = history.some((e) => (e.hintCount ?? 1) === 0);

  return [
    // Casos
    ach("primeiro_caso",   "Primeiro Caso",         "Resolver o primeiro caso.",                    "Casos",      solved,       1),
    ach("sequencia_inicial","Sequência Inicial",     "Resolver 3 casos.",                           "Casos",      solved,       3),
    ach("arquivo_robusto", "Arquivo Robusto",        "Resolver 10 casos.",                          "Casos",      solved,       10),
    // Eficiência
    ach("investigacao_cirurgica","Investigação Cirúrgica","Resolver um caso em 5 perguntas ou menos.","Eficiência", hasCirurgica ? 1 : 0, 1),
    ach("sem_ajuda",       "Sem Ajuda",             "Resolver um caso sem usar pistas.",            "Eficiência", hasSemAjuda ? 1 : 0, 1),
    ach("cacador_de_pistas","Caçador de Pistas",    "Usar 10 pistas no total.",                    "Eficiência", totalHints,   10),
    // Evidências
    ach("especialista_confirmacoes","Especialista em Confirmações","Coletar 20 evidências confirmadas.","Evidências",totalConfirmed, 20),
    ach("cetico_profissional","Cético Profissional", "Coletar 20 evidências refutadas.",            "Evidências", totalRefuted,  20),
    ach("teoria_aberta",   "Teoria Aberta",         "Coletar 20 evidências inconclusivas.",        "Evidências", totalInconclusive, 20),
    // Categorias
    ach("multiverso",      "Multiverso",            "Resolver casos em 3 categorias diferentes.",  "Categorias", uniqueCategories, 3),
    // Arquivo
    ach("arquivista_local","Arquivista Local",       "Ter 5 ou mais casos arquivados.",             "Arquivo",    solved,       5),
  ];
}

// ── Full player progression ──────────────────────────────────────────────────

export function derivePlayerProgression(history: CaseHistoryEntry[]): PlayerProgression {
  const solved = history.length;
  const rank = deriveAgentRank(solved);
  const nextRank = deriveNextRank(solved);

  let progressToNext: AchievementProgress | null = null;
  if (nextRank) {
    const percent = calculateProgressPercent(solved, rank.minCases, nextRank.minCases);
    progressToNext = { current: solved, goal: nextRank.minCases, percent };
  }

  const achievements = deriveAchievements(history);
  const unlockedCount = achievements.filter((a) => a.status === "unlocked").length;

  return {
    rank,
    nextRank,
    progressToNext,
    achievements,
    unlockedCount,
    totalCount: achievements.length,
  };
}
