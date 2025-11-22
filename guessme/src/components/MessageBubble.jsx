export default function MessageBubble({ sender, text }) {
  const isUser = sender === "Você";
  const isSystem = sender === "System";

  return (
    <div className={`message-row ${isUser ? "message-row-user" : isSystem ? "message-row-system" : "message-row-ai"}`}>
      <div className={`message-bubble ${isUser ? "bubble-user" : isSystem ? "bubble-system" : "bubble-ai"}`}>
        <div className="sender">
          {isUser ? "🧑‍💻 Você" : isSystem ? "⚠️ System" : "🤖 IA"}
        </div>
        <div className="message-text">{text}</div>
      </div>
    </div>
  );
}
