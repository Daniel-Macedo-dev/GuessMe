import type { CaseHistoryEntry } from "../types/guessme";
import { validateCaseHistoryEntry } from "../helpers/caseImport";

const KEY = "guessme.caseHistory.v1";
export const CASE_HISTORY_CAPACITY = 25;

export type ArchiveMergeResult = {
  saved: boolean;
  imported: number;
  skipped: number;
  renamed: number;
  evicted: number;
};

export type CaseSaveResult = { saved: boolean; evicted: boolean };

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
  return saveCaseHistoryEntryWithResult(entry).saved;
}

export function saveCaseHistoryEntryWithResult(entry: CaseHistoryEntry): CaseSaveResult {
  const current = safeRead();
  const isDuplicate = current.some((e) => e.id === entry.id);
  if (isDuplicate) return { saved: true, evicted: false };
  const updated = [entry, ...current].slice(0, CASE_HISTORY_CAPACITY);
  return { saved: safeWrite(updated), evicted: current.length >= CASE_HISTORY_CAPACITY };
}

export function mergeCaseHistory(entries: CaseHistoryEntry[]): ArchiveMergeResult {
  const current = safeRead();
  const merged = [...current];
  const ids = new Set(current.map((entry) => entry.id));
  let imported = 0;
  let skipped = 0;
  let renamed = 0;
  for (const candidate of entries) {
    const duplicate = merged.some((entry) =>
      (entry.id === candidate.id && entry.createdAt === candidate.createdAt && entry.characterName === candidate.characterName) ||
      (entry.createdAt === candidate.createdAt && entry.characterName === candidate.characterName && entry.work === candidate.work && entry.questionCount === candidate.questionCount),
    );
    if (duplicate) {
      skipped++;
      continue;
    }
    let entry = candidate;
    if (ids.has(entry.id)) {
      let suffix = 1;
      while (ids.has(`${entry.id}-imported-${suffix}`)) suffix++;
      entry = { ...entry, id: `${entry.id}-imported-${suffix}` };
      renamed++;
    }
    ids.add(entry.id);
    merged.push(entry);
    imported++;
  }
  merged.sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
  const evicted = Math.max(0, merged.length - CASE_HISTORY_CAPACITY);
  const retained = merged.slice(0, CASE_HISTORY_CAPACITY);
  if (!safeWrite(retained)) return { saved: false, imported: 0, skipped, renamed: 0, evicted: 0 };
  return { saved: true, imported, skipped, renamed, evicted };
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
