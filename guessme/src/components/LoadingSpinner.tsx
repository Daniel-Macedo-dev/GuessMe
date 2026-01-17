type Props = { small?: boolean; text?: string };

export default function LoadingSpinner({ text = "Carregando..." }: Props) {
  return (
    <div className="typing">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span style={{ marginLeft: 6, color: "rgba(255,255,255,0.65)" }}>{text}</span>
    </div>
  );
}
