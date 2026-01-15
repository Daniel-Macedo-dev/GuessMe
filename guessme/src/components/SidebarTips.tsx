import PersonagemCard from "./PersonagemCard";
import AnswerChips from "./AnswerChips";

type Props = {
  lastHint?: string;
  questionsAsked: number;
  elapsedSeconds: number;
  chips: string[];
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SidebarTips({
  lastHint,
  questionsAsked,
  elapsedSeconds,
  chips,
}: Props) {
  return (
    <aside className="panel sidebar-panel">
      <div className="panel-header">
        <span>🎯 Painel</span>
        <span className="muted-chip">
          {questionsAsked} • {formatTime(elapsedSeconds)}
        </span>
      </div>

      <div className="panel-body">
        <PersonagemCard />

        <div className="section mt-3">
          <div className="section-title">Histórico (Sim/Não/Talvez)</div>
          <AnswerChips chips={chips} />
        </div>

        <div className="section mt-3">
          <div className="section-title">Última resposta da IA</div>
          <div className="hint-box">{lastHint ?? "—"}</div>
        </div>

        <div className="section mt-3">
          <div className="section-title">Sugestões</div>
          <ul className="tips-list">
            <li>É real ou fictício?</li>
            <li>É humano?</li>
            <li>É de filme/série/anime/jogo?</li>
            <li>É protagonista?</li>
            <li>Tem poderes?</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
