type Props = {
  status: "Jogando" | "Finalizado";
  questionsAsked: number;
  elapsedSeconds: number;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function GameHeader({ status, questionsAsked, elapsedSeconds }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%" }}>
      <div>
        <div style={{ fontWeight: 950 }}>💬 Chat</div>
        <div className="muted">
          Status: <span style={{ color: "rgba(255,255,255,0.90)", fontWeight: 900 }}>{status}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="pill">Perguntas: <b style={{ color: "rgba(255,255,255,0.9)" }}>{questionsAsked}</b></span>
        <span className="pill">Tempo: <b style={{ color: "rgba(255,255,255,0.9)" }}>{formatTime(elapsedSeconds)}</b></span>
      </div>
    </div>
  );
}
