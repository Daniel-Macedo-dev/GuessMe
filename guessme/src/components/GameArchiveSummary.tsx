import { Link } from "react-router-dom";
import type { CaseHistoryEntry } from "../types/guessme";
import PanelSectionHeader from "./PanelSectionHeader";
import { CASE_HISTORY_CAPACITY } from "../services/caseHistoryStorage";

export default function GameArchiveSummary({ history, saveStatus }: { history: CaseHistoryEntry[]; saveStatus: "idle" | "saved" | "evicted" | "error" }) {
  const recent = [...history].sort((a, b) => b.createdAt - a.createdAt).slice(0, 2);
  return (
    <section className="gameArchiveSummary panel" aria-labelledby="game-archive-title" data-testid="game-archive-summary">
      <div className="gameArchiveSummaryHeader">
        <PanelSectionHeader icon="archive" title="Arquivo local" id="game-archive-title" flush />
        <span className="caseStamp caseStamp--archived caseStamp--sm">{history.length} caso{history.length === 1 ? "" : "s"}</span>
      </div>
      {recent.length ? (
        <ul className="gameArchiveRecent" aria-label="Casos arquivados recentemente">
          {recent.map((entry) => <li key={entry.id}><span><strong>{entry.characterName}</strong><small>{entry.work}</small></span><Link to={`/archive?q=${encodeURIComponent(entry.characterName)}`}>Localizar</Link></li>)}
        </ul>
      ) : <p className="muted small">Casos resolvidos aparecerão no arquivo deste navegador.</p>}
      {history.length >= CASE_HISTORY_CAPACITY - 1 && <p className="gameArchiveWarning" role="status">O arquivo está próximo do limite. Exporte uma cópia antes de encerrar novos casos.</p>}
      {saveStatus === "evicted" && <p className="gameArchiveWarning" role="status">Caso salvo. O registro mais antigo saiu do limite local; exporte o arquivo para evitar novas perdas.</p>}
      {saveStatus === "error" && <p className="gameArchiveError" role="alert">O caso foi encerrado, mas o navegador recusou o arquivamento. Libere espaço e tente exportar seus casos atuais.</p>}
      <Link className="btn btn-primary gameArchiveCta" to="/archive">Abrir Arquivo de Casos</Link>
    </section>
  );
}
