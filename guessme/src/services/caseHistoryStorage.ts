import type { CaseHistoryEntry } from "../types/guessme";

const KEY = "guessme.caseHistory.v1";
const MAX_ENTRIES = 25;

function safeRead(): CaseHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is CaseHistoryEntry =>
        e !== null &&
        typeof e === "object" &&
        typeof (e as CaseHistoryEntry).id === "string" &&
        typeof (e as CaseHistoryEntry).createdAt === "number",
    );
  } catch {
    return [];
  }
}

function safeWrite(entries: CaseHistoryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    //
  }
}

export function getCaseHistory(): CaseHistoryEntry[] {
  return safeRead();
}

export function saveCaseHistoryEntry(entry: CaseHistoryEntry): void {
  const current = safeRead();
  const isDuplicate = current.some((e) => e.id === entry.id);
  if (isDuplicate) return;
  const updated = [entry, ...current].slice(0, MAX_ENTRIES);
  safeWrite(updated);
}

export function deleteCaseHistoryEntry(id: string): void {
  const updated = safeRead().filter((e) => e.id !== id);
  safeWrite(updated);
}

export function clearCaseHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    //
  }
}
