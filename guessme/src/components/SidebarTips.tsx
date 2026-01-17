import AnswerChips from "./AnswerChips";

type Props = {
  lastHint?: string;
  questionsAsked: number;
  elapsedSeconds: number;
  chips: string[];
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SidebarTips({ lastHint, questionsAsked, elapsedSeconds, chips }: Props) {
  return (
    <aside className="panel">
      <div className="panelHeader">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>🎯</span>
          <span style={{ fontWeight: 950 }}>Painel</span>
        </div>
        <span className="pill">{questionsAsked} • {formatTime(elapsedSeconds)}</span>
      </div>

      <div className="panelBody">
        <div className="sideStack">
          <div className="sideCard">
            <div className="h3">Histórico</div>
            <AnswerChips chips={chips} />
          </div>

          <div className="sideCard">
            <div className="h3">Última resposta</div>
            <div className="hint">{lastHint ?? "—"}</div>
          </div>

          <div className="sideCard">
            <div className="h3">Perguntas úteis</div>
            <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>É real ou fictício?</li>
              <li>É humano?</li>
              <li>É de filme/série/anime/jogo?</li>
              <li>É protagonista?</li>
              <li>Tem poderes?</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
