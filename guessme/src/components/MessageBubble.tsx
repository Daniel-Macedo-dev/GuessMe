type Props = {
  sender: "Você" | "AI";
  text: string;
};

export default function MessageBubble({ sender, text }: Props) {
  const isUser = sender === "Você";

  return (
    <div className={`msgRow ${isUser ? "user" : "ai"}`}>
      <div className="bubble">
        <div className="sender">{sender}</div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
}
