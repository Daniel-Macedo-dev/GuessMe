export type ApiCharacterData = {
  name: string;
  work: string;
  image: string;
};

export type AnswerVerdict = "YES" | "NO" | "MAYBE" | "UNKNOWN";

export type AIResponse = {
  answer: string;
  success: boolean;
  character: ApiCharacterData | null;
  sessionId: string | null;
  verdict?: AnswerVerdict;
};

export type WinnerData = {
  name: string;
  work: string;
  image: string;
};

export type MessageKind = "ai" | "user" | "hint" | "error";

export type Message = {
  id: string;
  sender: "Você" | "AI";
  text: string;
  ts: number;
  kind?: MessageKind;
  verdict?: AnswerVerdict;
};

export type VerdictStats = {
  yes: number;
  no: number;
  maybe: number;
  unknown: number;
};

export type CaseEvidenceEntry = {
  id: string;
  question: string;
  answer: string;
  kind: "confirmed" | "refuted" | "inconclusive";
};

export type CaseIntelEntry = {
  id: string;
  text: string;
};

export type CaseEvidence = {
  confirmed: CaseEvidenceEntry[];
  refuted: CaseEvidenceEntry[];
  inconclusive: CaseEvidenceEntry[];
  hints: CaseIntelEntry[];
};

export type CaseHistoryEntry = {
  id: string;
  createdAt: number;
  characterName: string;
  work: string;
  category: string;
  questionCount: number;
  hintCount: number;
  messages: Message[];
  evidence: CaseEvidence;
  solvedSummary: { name: string; work: string; image: string } | null;
  winningQuestion: string | null;
  verdictStats: VerdictStats;
};
