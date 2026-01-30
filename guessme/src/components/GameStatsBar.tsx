type Props = {
  questionsCount: number;
};

export default function GameStatsBar({ questionsCount }: Props) {
  return (
    <div className="statsBar">
      <div className="stat">
        <span className="statLabel">Perguntas</span>
        <span className="statValue">{questionsCount}</span>
      </div>
      <div className="statHint muted">Dica: comece amplo e afunile.</div>
    </div>
  );
}
