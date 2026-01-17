type Props = { sender: string; text: string };

export default function MessageBubble({ sender, text }: Props) {
  const isUser = sender === "Você";
  const isAI = sender === "AI";
  const isSystem = !isUser && !isAI;

  return (
    <div className={`msgRow ${isUser ? "msgUser" : isAI ? "msgAI" : "msgSystem"}`}>
      <div className={`bubble ${isUser ? "bubbleUser" : isAI ? "bubbleAI" : "bubbleSystem"}`}>
        <div className="sender">{sender}</div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
}
