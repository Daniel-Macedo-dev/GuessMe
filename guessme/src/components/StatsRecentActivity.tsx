import type { CaseHistoryEntry } from "../types/guessme";
import PanelSectionHeader from "./PanelSectionHeader";
import { Link } from "react-router-dom";

type Props = {
  cases: CaseHistoryEntry[];
};

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function StatsRecentActivity({ cases }: Props) {
  if (cases.length === 0) return null;

  return (
    <section className="statsPanel panel" aria-labelledby="stats-recent-title" data-testid="stats-recent-panel">
      <PanelSectionHeader icon="archive" title="Atividade recente" id="stats-recent-title" />
      <ul className="statsRecentList" aria-label="Casos resolvidos recentemente">
        {cases.map((entry) => (
          <li key={entry.id} className="statsRecentItem" data-testid="stats-recent-item">
            <div className="statsRecentMeta">
              <Link className="statsRecentName" data-testid="stats-recent-name" to={`/archive?q=${encodeURIComponent(entry.characterName)}`}>{entry.characterName}</Link>
              <span className="statsRecentWork muted small">{entry.work}</span>
            </div>
            <div className="statsRecentInfo">
              <span className="statsRecentCategory caseLabel">{entry.category}</span>
              <span className="statsRecentDate muted small">{fmtDate(entry.createdAt)}</span>
              <span className="statsRecentQ muted small">{entry.questionCount} perguntas</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
