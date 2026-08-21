import type { CaseHistoryEntry } from "../types/guessme";
import { validateCaseHistoryEntry } from "../helpers/caseImport";

const KEY = "guessme.caseHistory.v1";
const MAX_ENTRIES = 25;

function safeRead(): CaseHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      const validated = validateCaseHistoryEntry(entry);
      return validated ? [validated] : [];
    });
  } catch {
    return [];
  }
}

function safeWrite(entries: CaseHistoryEntry[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function getCaseHistory(): CaseHistoryEntry[] {
  return safeRead();
}

export function saveCaseHistoryEntry(entry: CaseHistoryEntry): boolean {
  const current = safeRead();
  const isDuplicate = current.some((e) => e.id === entry.id);
  if (isDuplicate) return true;
  const updated = [entry, ...current].slice(0, MAX_ENTRIES);
  return safeWrite(updated);
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
