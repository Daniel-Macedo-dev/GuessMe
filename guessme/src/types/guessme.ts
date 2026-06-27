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
