import DossierIcon from "./DossierIcon";
import type { AnswerVerdict, MessageKind } from "../types/guessme";

type Props = {
  sender: "Você" | "AI";
  text: string;
  kind?: MessageKind;
  verdict?: AnswerVerdict;
};

type AnswerState = "sim" | "nao" | "talvez" | null;

function resolveAnswerState(verdict?: AnswerVerdict, text?: string): AnswerState {
  // Structured verdict takes priority over text parsing.
  if (verdict === "YES") return "sim";
  if (verdict === "NO") return "nao";
  if (verdict === "MAYBE") return "talvez";
  // Text-prefix fallback for old/local/mock messages without a verdict field.
  const normalized = (text || "").trim().toLowerCase();
  if (normalized.startsWith("sim")) return "sim";
  if (normalized.startsWith("não") || normalized.startsWith("nao")) return "nao";
  if (normalized.startsWith("talvez")) return "talvez";
  return null;
}

const SENDER_LABELS: Record<string, string> = {
  hint: "Nova pista",
  error: "Sistema",
};

const VERDICT_BADGE: Record<NonNullable<AnswerState>, string> = {
  sim:    "SIM",
  nao:    "NÃO",
  talvez: "TALVEZ",
};

const VERDICT_BADGE_CLASS: Record<NonNullable<AnswerState>, string> = {
  sim:    "msgVerdictBadge msgVerdictBadge--sim",
  nao:    "msgVerdictBadge msgVerdictBadge--nao",
  talvez: "msgVerdictBadge msgVerdictBadge--talvez",
};

const ANSWER_STATE_CLASS: Record<NonNullable<AnswerState>, string> = {
  sim:    "bubbleSim",
  nao:    "bubbleNao",
  talvez: "bubbleTalvez",
};

export default function MessageBubble({ sender, text, kind, verdict }: Props) {
  const isUser = sender === "Você";
  const isHint = kind === "hint";
  const isError = kind === "error";

  const answerState = !isUser && kind === "ai" ? resolveAnswerState(verdict, text) : null;

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
        <div className="msgMeta">
          <span className="sender">
            {isHint && (
              <DossierIcon name="clue" size={9} aria-hidden={true} className="msgSenderIcon" />
            )}
            {isError && (
              <DossierIcon name="warning" size={9} aria-hidden={true} className="msgSenderIcon" />
            )}
            {displaySender}
          </span>
          {answerState && (
            <span className={VERDICT_BADGE_CLASS[answerState]} aria-hidden="true">
              {VERDICT_BADGE[answerState]}
            </span>
          )}
        </div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
}
