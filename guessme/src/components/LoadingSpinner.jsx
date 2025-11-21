export default function LoadingSpinner({ small = false, text = "" }) {
  return (
    <div className={`typing ${small ? "typing-small" : ""}`}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      {text && <div className="typing-text ms-2">{text}</div>}
    </div>
  );
}
