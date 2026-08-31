import type { CaseHistoryEntry } from "../types/guessme";

export type ArchiveHintFilter = "all" | "with" | "without";
export type ArchivePeriodFilter = "all" | "30" | "365";
export type ArchiveSort = "newest" | "oldest" | "fewest" | "most" | "az";

export type ArchiveQuery = {
  search: string;
  category: string;
  hints: ArchiveHintFilter;
  period: ArchivePeriodFilter;
  sort: ArchiveSort;
};

export const DEFAULT_ARCHIVE_QUERY: ArchiveQuery = {
  search: "",
  category: "all",
  hints: "all",
  period: "all",
  sort: "newest",
};

function fold(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

export function queryArchive(entries: CaseHistoryEntry[], query: ArchiveQuery, now = Date.now()): CaseHistoryEntry[] {
  const term = fold(query.search);
  const cutoffDays = query.period === "all" ? null : Number(query.period);
  const filtered = entries.filter((entry) => {
    const searchable = [entry.characterName, entry.work, entry.category, entry.winningQuestion ?? ""].map(fold).join(" ");
    if (term && !searchable.includes(term)) return false;
    if (query.category !== "all" && entry.category !== query.category) return false;
    if (query.hints === "with" && entry.hintCount === 0) return false;
    if (query.hints === "without" && entry.hintCount > 0) return false;
    if (cutoffDays !== null && entry.createdAt < now - cutoffDays * 86_400_000) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (query.sort === "oldest") return a.createdAt - b.createdAt || a.id.localeCompare(b.id);
    if (query.sort === "fewest") return a.questionCount - b.questionCount || b.createdAt - a.createdAt || a.id.localeCompare(b.id);
    if (query.sort === "most") return b.questionCount - a.questionCount || b.createdAt - a.createdAt || a.id.localeCompare(b.id);
    if (query.sort === "az") return a.characterName.localeCompare(b.characterName, "pt-BR", { sensitivity: "base" }) || b.createdAt - a.createdAt;
    return b.createdAt - a.createdAt || a.id.localeCompare(b.id);
  });
}

export function archiveQueryFromParams(params: URLSearchParams): ArchiveQuery {
  const hints = params.get("hints");
  const period = params.get("period");
  const sort = params.get("sort");
  return {
    search: params.get("q")?.trim() ?? "",
    category: params.get("category")?.trim() || "all",
    hints: hints === "with" || hints === "without" ? hints : "all",
    period: period === "30" || period === "365" ? period : "all",
    sort: sort === "oldest" || sort === "fewest" || sort === "most" || sort === "az" ? sort : "newest",
  };
}

export function archiveQueryToParams(query: ArchiveQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("q", query.search);
  if (query.category !== "all") params.set("category", query.category);
  if (query.hints !== "all") params.set("hints", query.hints);
  if (query.period !== "all") params.set("period", query.period);
  if (query.sort !== "newest") params.set("sort", query.sort);
  return params;
}
