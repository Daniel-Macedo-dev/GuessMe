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

function nonNegativeInteger(v: unknown): number {
  return isNumber(v) && Number.isInteger(v) && v >= 0 ? v : 0;
}

function validateMessages(raw: unknown): Message[] {
  if (!isArray(raw)) return [];
  const senders = new Set<Message["sender"]>(["Você", "AI"]);
  const kinds = new Set<NonNullable<Message["kind"]>>(["ai", "user", "hint", "error"]);
  const verdicts = new Set<NonNullable<Message["verdict"]>>(["YES", "NO", "MAYBE", "UNKNOWN"]);
  return raw.flatMap((value): Message[] => {
    if (!isObject(value) || !isString(value.id) || value.id.trim() === "") return [];
    if (!isString(value.text) || !isNumber(value.ts) || !senders.has(value.sender as Message["sender"])) return [];
    if (value.kind !== undefined && !kinds.has(value.kind as NonNullable<Message["kind"]>)) return [];
    if (value.verdict !== undefined && !verdicts.has(value.verdict as NonNullable<Message["verdict"]>)) return [];
    return [{
      id: value.id.trim(),
      sender: value.sender as Message["sender"],
      text: value.text,
      ts: value.ts,
      ...(value.kind === undefined ? {} : { kind: value.kind as Message["kind"] }),
      ...(value.verdict === undefined ? {} : { verdict: value.verdict as Message["verdict"] }),
    }];
  });
}

function validateEvidence(raw: unknown): CaseEvidence {
  const empty: CaseEvidence = { confirmed: [], refuted: [], inconclusive: [], hints: [] };
  if (!isObject(raw)) return empty;
  const evidenceEntries = (
    value: unknown,
    kind: CaseEvidence["confirmed"][number]["kind"],
  ): CaseEvidence["confirmed"] => {
    if (!isArray(value)) return [];
    return value.flatMap((item) =>
      isObject(item) && isString(item.id) && item.id.trim() !== "" &&
      isString(item.question) && isString(item.answer)
        ? [{ id: item.id.trim(), question: item.question, answer: item.answer, kind }]
        : [],
    );
  };
  const hints = isArray(raw.hints)
    ? raw.hints.flatMap((item) =>
        isObject(item) && isString(item.id) && item.id.trim() !== "" && isString(item.text)
          ? [{ id: item.id.trim(), text: item.text }]
          : [],
      )
    : [];
  return {
    confirmed: evidenceEntries(raw.confirmed, "confirmed"),
    refuted: evidenceEntries(raw.refuted, "refuted"),
    inconclusive: evidenceEntries(raw.inconclusive, "inconclusive"),
    hints,
  };
}

function validateVerdictStats(raw: unknown): VerdictStats {
  const def: VerdictStats = { yes: 0, no: 0, maybe: 0, unknown: 0 };
  if (!isObject(raw)) return def;
  return {
    yes: nonNegativeInteger(raw.yes),
    no: nonNegativeInteger(raw.no),
    maybe: nonNegativeInteger(raw.maybe),
    unknown: nonNegativeInteger(raw.unknown),
  };
}

function validateSolvedSummary(raw: unknown): CaseHistoryEntry["solvedSummary"] {
  if (!isObject(raw) || !isString(raw.name) || raw.name.trim() === "") return null;
  if (!isString(raw.work) || !isString(raw.image)) return null;
  return { name: raw.name.trim(), work: raw.work.trim(), image: raw.image };
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

  return {
    id: id.trim(),
    createdAt,
    characterName: characterName.trim(),
    work: (work as string).trim(),
    category: (category as string).trim(),
    questionCount: nonNegativeInteger(input.questionCount),
    hintCount: nonNegativeInteger(input.hintCount),
    messages: validateMessages(messages),
    evidence: validateEvidence(evidence),
    solvedSummary: validateSolvedSummary(input.solvedSummary),
    winningQuestion: isString(input.winningQuestion) ? input.winningQuestion.trim() || null : null,
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

export function parseArchiveExportJson(raw: string): { entries: CaseHistoryEntry[]; rejected: number } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new CaseImportError("JSON inválido — o arquivo não pôde ser lido.");
  }
  if (!isObject(parsed) || parsed.app !== "GuessMe" || parsed.kind !== "case-archive") {
    throw new CaseImportError("Formato desconhecido — selecione um arquivo de arquivo completo do GuessMe.");
  }
  if (parsed.schemaVersion !== 1) {
    throw new CaseImportError("Versão de arquivo não suportada.");
  }
  if (!isArray(parsed.cases)) throw new CaseImportError("Arquivo incompleto — a lista de casos está ausente.");
  const entries = parsed.cases.flatMap((candidate) => {
    const entry = validateCaseHistoryEntry(candidate);
    return entry ? [entry] : [];
  });
  return { entries, rejected: parsed.cases.length - entries.length };
}
