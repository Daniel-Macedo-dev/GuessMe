type Props = {
  questionsCount: number;
};

export default function GameStatsBar({ questionsCount }: Props) {
  return (
    <div className="statsBar">
      <div className="stat">
        <span className="statLabel">Interrogações</span>
        <span className="statValue">{questionsCount}</span>
      </div>
      <div className="statHint muted">Interrogue com foco. Cada pergunta é uma pista.</div>
    </div>
  );
}
