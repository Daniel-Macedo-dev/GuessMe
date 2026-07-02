type Variant = "open" | "clue" | "verdict" | "system";

type Props = {
  label: string;
  variant?: Variant;
};

export default function TranscriptDivider({ label, variant = "system" }: Props) {
  return (
    <div
      className={`transcriptDivider transcriptDivider--${variant}`}
      aria-hidden="true"
    >
      <span className="transcriptDividerLine" />
      <span className="transcriptDividerLabel">{label}</span>
      <span className="transcriptDividerLine" />
    </div>
  );
}
