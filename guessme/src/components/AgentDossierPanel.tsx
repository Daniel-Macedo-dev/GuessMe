import type { PlayerProgression } from "../types/progression";
import AgentRankCard from "./AgentRankCard";
import RankProgressBar from "./RankProgressBar";
import AchievementGrid from "./AchievementGrid";

type Props = {
  progression: PlayerProgression;
};

export default function AgentDossierPanel({ progression }: Props) {
  const { rank, nextRank, progressToNext, achievements, unlockedCount, totalCount } = progression;

  return (
    <section
      className="agentDossierPanel panel statsPanel"
      data-testid="agent-dossier-panel"
      aria-label="Dossiê do Agente"
    >
      <h2 className="statsPanelTitle">Dossiê do Agente</h2>

      <AgentRankCard
        rank={rank}
        unlockedCount={unlockedCount}
        totalCount={totalCount}
      />

      {nextRank && progressToNext && (
        <RankProgressBar progressToNext={progressToNext} nextRank={nextRank} />
      )}

      {!nextRank && (
        <p className="agentRankMaxed muted small" data-testid="rank-maxed">
          Posto máximo atingido — Mestre do Dossiê
        </p>
      )}

      <div className="divider" />

      <AchievementGrid achievements={achievements} />
    </section>
  );
}
