import type { Message, WinnerData } from "../types/guessme";

export type EvidenceKind = "confirmed" | "refuted" | "inconclusive";

export type EvidenceEntry = {
  id: string;
  question: string;
  answer: string;
  kind: EvidenceKind;
};

export type IntelEntry = {
  id: string;
  text: string;
};

export type Evidence = {
  confirmed: EvidenceEntry[];
  refuted: EvidenceEntry[];
  inconclusive: EvidenceEntry[];
  hints: IntelEntry[];
};

export type SolvedSummary = {
  name: string;
  work: string;
  image: string;
};

function classifyAIText(text: string): EvidenceKind | null {
  const lower = text.trim().toLowerCase();
  if (lower.startsWith("sim")) return "confirmed";
  if (lower.startsWith("não") || lower.startsWith("nao")) return "refuted";
  if (lower.startsWith("talvez")) return "inconclusive";
  return null;
}

function precedingQuestion(messages: Message[], aiIndex: number): string {
  for (let j = aiIndex - 1; j >= 0; j--) {
    if (messages[j].kind === "user") return messages[j].text;
  }
  return "";
}

export function deriveEvidence(messages: Message[]): Evidence {
  const confirmed: EvidenceEntry[] = [];
  const refuted: EvidenceEntry[] = [];
  const inconclusive: EvidenceEntry[] = [];
  const hints: IntelEntry[] = [];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];

    if (m.kind === "hint") {
      hints.push({ id: m.id, text: m.text });
      continue;
    }

    if (m.kind === "ai") {
      const kind = classifyAIText(m.text);
      if (!kind) continue;

      const entry: EvidenceEntry = {
        id: m.id,
        question: precedingQuestion(messages, i),
        answer: m.text,
        kind,
      };

      if (kind === "confirmed") confirmed.push(entry);
      else if (kind === "refuted") refuted.push(entry);
      else inconclusive.push(entry);
    }
  }

  return { confirmed, refuted, inconclusive, hints };
}

export function deriveSolvedSummary(winner: WinnerData | null): SolvedSummary | null {
  if (!winner) return null;
  return { name: winner.name, work: winner.work, image: winner.image };
}
