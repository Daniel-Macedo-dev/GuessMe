export default function MessageBubble({ sender, text }) {
  const isUser = sender === "Você";

  return (
    <div
      className={`p-2 mb-2 rounded shadow-sm ${
        isUser
          ? "bg-primary text-white ms-auto w-75 text-end"
          : "bg-light w-75"
      }`}
    >
      <strong>{sender}: </strong>
      {text}
    </div>
  );
}
