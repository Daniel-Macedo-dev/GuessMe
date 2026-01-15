type Props = {
  questionsAsked: number;
  gameOver: boolean;
};

export default function GameStatsBar({ questionsAsked, gameOver }: Props) {
  return (
    <div className="stats-bar">
      <div className="stat-pill">
        Perguntas: <b>{questionsAsked}</b>
      </div>

      <div className="stat-pill">
        Status: <b>{gameOver ? "Finalizado" : "Jogando"}</b>
      </div>
    </div>
  );
}
