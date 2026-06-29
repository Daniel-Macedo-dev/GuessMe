import type { CaseEvidence, CaseExportPayload, CaseHistoryEntry, Message, VerdictStats } from "../types/guessme";

export class CaseImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaseImportError";
  }
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}
function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function validateMessages(raw: unknown): Message[] {
  if (!isArray(raw)) return [];
  return raw.filter(
    (m): m is Message =>
      isObject(m) &&
      isString((m as Record<string, unknown>).id) &&
      isString((m as Record<string, unknown>).text),
  ) as Message[];
}

function validateEvidence(raw: unknown): CaseEvidence {
  const empty: CaseEvidence = { confirmed: [], refuted: [], inconclusive: [], hints: [] };
  if (!isObject(raw)) return empty;
  const toArr = (v: unknown) => (isArray(v) ? v : []);
  return {
    confirmed: toArr(raw.confirmed) as CaseEvidence["confirmed"],
    refuted: toArr(raw.refuted) as CaseEvidence["refuted"],
    inconclusive: toArr(raw.inconclusive) as CaseEvidence["inconclusive"],
    hints: toArr(raw.hints) as CaseEvidence["hints"],
  };
}

function validateVerdictStats(raw: unknown): VerdictStats {
  const def: VerdictStats = { yes: 0, no: 0, maybe: 0, unknown: 0 };
  if (!isObject(raw)) return def;
  return {
    yes: isNumber(raw.yes) ? raw.yes : 0,
    no: isNumber(raw.no) ? raw.no : 0,
    maybe: isNumber(raw.maybe) ? raw.maybe : 0,
    unknown: isNumber(raw.unknown) ? raw.unknown : 0,
  };
}

export function validateCaseHistoryEntry(input: unknown): CaseHistoryEntry | null {
  if (!isObject(input)) return null;

  const id = input.id;
  const createdAt = input.createdAt;
  const characterName = input.characterName;
  const work = input.work;
  const category = input.category;
  const messages = input.messages;
  const evidence = input.evidence;

  if (!isString(id) || id.trim() === "") return null;
  if (!isNumber(createdAt)) return null;
  if (!isString(characterName) || characterName.trim() === "") return null;
  if (!isString(work)) return null;
  if (!isString(category)) return null;
  if (!isArray(messages)) return null;
  if (!isObject(evidence)) return null;

  return {
    id: id.trim(),
    createdAt,
    characterName: characterName.trim(),
    work: (work as string).trim(),
    category: (category as string).trim(),
    questionCount: isNumber(input.questionCount) ? input.questionCount : 0,
    hintCount: isNumber(input.hintCount) ? input.hintCount : 0,
    messages: validateMessages(messages),
    evidence: validateEvidence(evidence),
    solvedSummary: isObject(input.solvedSummary)
      ? (input.solvedSummary as CaseHistoryEntry["solvedSummary"])
      : null,
    winningQuestion: isString(input.winningQuestion) ? input.winningQuestion : null,
    verdictStats: validateVerdictStats(input.verdictStats),
  };
}

export function normalizeImportedCase(
  entry: CaseHistoryEntry,
  existingIds: Set<string>,
): { entry: CaseHistoryEntry; renamed: boolean } {
  if (!existingIds.has(entry.id)) {
    return { entry, renamed: false };
  }
  const newId = `${entry.id}-imported-${Date.now()}`;
  return { entry: { ...entry, id: newId }, renamed: true };
}

export function parseCaseExportJson(raw: string): CaseHistoryEntry {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new CaseImportError("JSON inválido — o arquivo não pôde ser lido.");
  }

  if (!isObject(parsed)) {
    throw new CaseImportError("Formato desconhecido — o arquivo não contém um objeto JSON válido.");
  }

  // Accept both wrapped payload { schemaVersion, case } and bare CaseHistoryEntry
  const candidate: unknown =
    "schemaVersion" in parsed && "case" in parsed
      ? (parsed as CaseExportPayload).case
      : parsed;

  const entry = validateCaseHistoryEntry(candidate);
  if (!entry) {
    throw new CaseImportError(
      "Dados incompletos — o arquivo não contém um caso GuessMe válido. Verifique se exportou o arquivo correto.",
    );
  }
  return entry;
}
