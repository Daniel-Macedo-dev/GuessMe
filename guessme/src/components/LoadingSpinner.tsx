type Props = {
  small?: boolean;
  text?: string;
};

export default function LoadingSpinner({ small = false, text }: Props) {
  return (
    <div className={`typing ${small ? "typing-small" : ""}`}>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      {text && <span className="typing-text">{text}</span>}
    </div>
  );
}
