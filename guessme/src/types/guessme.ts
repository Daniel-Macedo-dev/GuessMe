export type ApiCharacterData = {
  name: string;
  work: string;
  image: string;
};

export type AIResponse = {
  answer: string;
  success: boolean;
  character: ApiCharacterData | null;
  sessionId: string | null;
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
};
