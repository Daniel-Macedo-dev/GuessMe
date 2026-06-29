import type { CaseExportPayload, CaseHistoryEntry } from "../types/guessme";

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCaseAsMarkdown(entry: CaseHistoryEntry): string {
  const lines: string[] = [];
  lines.push(`# Dossiê: ${entry.characterName}`);
  lines.push(`**Obra:** ${entry.work}  `);
  lines.push(`**Categoria:** ${entry.category}  `);
  lines.push(`**Encerrado em:** ${fmtDate(entry.createdAt)}  `);
  lines.push(`**Perguntas:** ${entry.questionCount}  `);
  lines.push(`**Pistas:** ${entry.hintCount}  `);
  lines.push(`**Veredictos:** ✅ ${entry.verdictStats.yes} confirmadas · ❌ ${entry.verdictStats.no} refutadas · ❓ ${entry.verdictStats.maybe} inconclusivas`);
  lines.push("");

  if (entry.winningQuestion) {
    lines.push("## Pergunta decisiva");
    lines.push(`> ${entry.winningQuestion}`);
    lines.push("");
  }

  const { confirmed, refuted, inconclusive, hints } = entry.evidence;

  if (confirmed.length > 0) {
    lines.push("## Confirmado");
    for (const e of confirmed) lines.push(`- ✅ ${e.question}`);
    lines.push("");
  }
  if (refuted.length > 0) {
    lines.push("## Refutado");
    for (const e of refuted) lines.push(`- ❌ ${e.question}`);
    lines.push("");
  }
  if (inconclusive.length > 0) {
    lines.push("## Inconclusivo");
    for (const e of inconclusive) lines.push(`- ❓ ${e.question}`);
    lines.push("");
  }
  if (hints.length > 0) {
    lines.push("## Inteligência");
    for (const h of hints) lines.push(`- 🔍 ${h.text}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("*GuessMe — Dossiê Digital*");
  return lines.join("\n");
}

export function formatCaseAsPlainText(entry: CaseHistoryEntry): string {
  const lines: string[] = [];
  lines.push(`DOSSIÊ: ${entry.characterName}`);
  lines.push(`Obra: ${entry.work}`);
  lines.push(`Categoria: ${entry.category}`);
  lines.push(`Encerrado em: ${fmtDate(entry.createdAt)}`);
  lines.push(`Perguntas: ${entry.questionCount}  |  Pistas: ${entry.hintCount}`);
  lines.push(
    `Veredictos: ${entry.verdictStats.yes} confirmadas / ${entry.verdictStats.no} refutadas / ${entry.verdictStats.maybe} inconclusivas`,
  );
  lines.push("");

  if (entry.winningQuestion) {
    lines.push(`Pergunta decisiva: "${entry.winningQuestion}"`);
    lines.push("");
  }

  const { confirmed, refuted, inconclusive, hints } = entry.evidence;
  if (confirmed.length > 0) {
    lines.push("CONFIRMADO:");
    for (const e of confirmed) lines.push(`  [SIM] ${e.question}`);
    lines.push("");
  }
  if (refuted.length > 0) {
    lines.push("REFUTADO:");
    for (const e of refuted) lines.push(`  [NAO] ${e.question}`);
    lines.push("");
  }
  if (inconclusive.length > 0) {
    lines.push("INCONCLUSIVO:");
    for (const e of inconclusive) lines.push(`  [TALVEZ] ${e.question}`);
    lines.push("");
  }
  if (hints.length > 0) {
    lines.push("INTELIGENCIA:");
    for (const h of hints) lines.push(`  [PISTA] ${h.text}`);
    lines.push("");
  }

  lines.push("GuessMe — Dossie Digital");
  return lines.join("\n");
}

export function createCaseExportPayload(entry: CaseHistoryEntry): CaseExportPayload {
  return {
    schemaVersion: 1,
    app: "GuessMe",
    exportedAt: new Date().toISOString(),
    case: entry,
  };
}

export function buildCaseExportFilename(entry: CaseHistoryEntry, extension: string): string {
  const safe = entry.characterName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 40);
  const date = new Date(entry.createdAt).toISOString().slice(0, 10);
  return `guessme-${safe}-${date}.${extension}`;
}
