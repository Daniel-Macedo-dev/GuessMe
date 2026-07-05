import type { CaseHistoryEntry } from "../types/guessme";
import PanelSectionHeader from "./PanelSectionHeader";

type Props = {
  bestCase: CaseHistoryEntry | null;
  longestCase: CaseHistoryEntry | null;
};

function RankCard({
  entry,
  rank,
  label,
  colorClass,
  testId,
}: {
  entry: CaseHistoryEntry;
  rank: string;
  label: string;
  colorClass: string;
  testId: string;
}) {
  return (
    <div className={`statsRankCard ${colorClass}`} data-testid={testId}>
      <span className="statsRankLabel caseLabel">{rank}</span>
      <p className="statsRankName" data-testid={`${testId}-name`}>{entry.characterName}</p>
      <p className="muted small statsRankWork">{entry.work} · {entry.category}</p>
      <p className="statsRankStat muted small">
        <strong>{entry.questionCount}</strong> {label}
      </p>
    </div>
  );
}

export default function StatsCaseRanking({ bestCase, longestCase }: Props) {
  if (!bestCase && !longestCase) return null;

  return (
    <section className="statsPanel panel" aria-labelledby="stats-ranking-title" data-testid="stats-ranking-panel">
      <PanelSectionHeader icon="check" title="Casos de destaque" id="stats-ranking-title" />
      <div className="statsRankGrid">
        {bestCase && (
          <RankCard
            entry={bestCase}
            rank="Mais eficiente"
            label="perguntas"
            colorClass="statsRankCard--green"
            testId="stats-best-case"
          />
        )}
        {longestCase && (
          <RankCard
            entry={longestCase}
            rank="Mais longo"
            label="perguntas"
            colorClass="statsRankCard--amber"
            testId="stats-longest-case"
          />
        )}
      </div>
    </section>
  );
}
