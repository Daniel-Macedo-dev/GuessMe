type Props = {
  sender: string;
  text: string;
};

export default function MessageBubble({ sender, text }: Props) {
  const isUser = sender === "Você";
  const isAI = sender === "AI";

  return (
    <div
      className={[
        "message-row",
        isUser ? "message-row-user" : "",
        isAI ? "message-row-ai" : "",
        !isUser && !isAI ? "message-row-system" : "",
      ].join(" ")}
    >
      <div
        className={[
          "message-bubble",
          isUser ? "bubble-user" : "",
          isAI ? "bubble-ai" : "",
          !isUser && !isAI ? "bubble-system" : "",
        ].join(" ")}
      >
        <div className="sender">{sender}</div>
        <div className="message-text">{text}</div>
      </div>
    </div>
  );
}
