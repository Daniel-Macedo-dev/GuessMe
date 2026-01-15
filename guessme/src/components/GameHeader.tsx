type Props = {
  status: "Jogando" | "Finalizado";
  questionsAsked: number;
  elapsedSeconds: number;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function GameHeader({ status, questionsAsked, elapsedSeconds }: Props) {
  return (
    <div className="game-header">
      <div className="game-header-left">
        <div className="game-title">💬 Chat</div>
        <div className="game-sub">
          Status: <b>{status}</b>
        </div>
      </div>

      <div className="game-header-right">
        <div className="meta-pill">
          Perguntas: <b>{questionsAsked}</b>
        </div>
        <div className="meta-pill">
          Tempo: <b>{formatTime(elapsedSeconds)}</b>
        </div>
      </div>
    </div>
  );
}
