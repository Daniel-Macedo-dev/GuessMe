import type { MessageKind } from "../types/guessme";

type Props = {
  sender: "Você" | "AI";
  text: string;
  kind?: MessageKind;
};

type AnswerState = "sim" | "nao" | "talvez" | null;

function classifyAnswer(text: string): AnswerState {
  const normalized = text.trim().toLowerCase();
  if (normalized.startsWith("sim")) return "sim";
  if (normalized.startsWith("não") || normalized.startsWith("nao")) return "nao";
  if (normalized.startsWith("talvez")) return "talvez";
  return null;
}

const SENDER_LABELS: Record<string, string> = {
  hint: "Nova pista",
  error: "Sistema",
};

const ANSWER_STATE_CLASS: Record<NonNullable<AnswerState>, string> = {
  sim: "bubbleSim",
  nao: "bubbleNao",
  talvez: "bubbleTalvez",
};

export default function MessageBubble({ sender, text, kind }: Props) {
  const isUser = sender === "Você";
  const isHint = kind === "hint";
  const isError = kind === "error";

  const answerState = !isUser && kind === "ai" ? classifyAnswer(text) : null;

  const bubbleClass = [
    "bubble",
    isHint ? "bubbleHint" : "",
    isError ? "bubbleError" : "",
    answerState ? ANSWER_STATE_CLASS[answerState] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const displaySender = (kind && SENDER_LABELS[kind]) ?? sender;

  return (
    <div className={`msgRow ${isUser ? "user" : "ai"}`}>
      <div className={bubbleClass}>
        <div className="sender">{displaySender}</div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
}
