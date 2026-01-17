type Props = {
  questionsAsked: number;
  gameOver: boolean;
};

export default function GameStatsBar({ questionsAsked, gameOver }: Props) {
  return (
    <div className="d-flex gap-2 flex-wrap">
      <div className="meta-pill">
        Perguntas: <b style={{ color: "rgba(255,255,255,0.92)" }}>{questionsAsked}</b>
      </div>
      <div className="meta-pill">
        Status: <b style={{ color: "rgba(255,255,255,0.92)" }}>{gameOver ? "Finalizado" : "Jogando"}</b>
      </div>
    </div>
  );
}
