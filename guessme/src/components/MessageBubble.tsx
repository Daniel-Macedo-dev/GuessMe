import type { MessageKind } from "../types/guessme";

type Props = {
  sender: "Você" | "AI";
  text: string;
  kind?: MessageKind;
};

const SENDER_LABELS: Record<string, string> = {
  hint: "Dica",
  error: "Sistema",
};

export default function MessageBubble({ sender, text, kind }: Props) {
  const isUser = sender === "Você";
  const isHint = kind === "hint";
  const isError = kind === "error";

  const bubbleClass = [
    "bubble",
    isHint ? "bubbleHint" : "",
    isError ? "bubbleError" : "",
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
