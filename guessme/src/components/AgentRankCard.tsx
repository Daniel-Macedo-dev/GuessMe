import type { AgentRank } from "../types/progression";
import CaseSeal from "./CaseSeal";

type Props = {
  rank: AgentRank;
  unlockedCount: number;
  totalCount: number;
};

export default function AgentRankCard({ rank, unlockedCount, totalCount }: Props) {
  return (
    <div className="agentRankCard" data-testid="agent-rank-card">
      <div className="agentRankStamp" aria-label={`Posto: ${rank.title}`}>
        {rank.stamp}
      </div>
      <div className="agentRankMeta">
        <p className="agentRankLabel muted small">Posto atual</p>
        <h2 className="agentRankTitle" data-testid="agent-rank-title">
          {rank.title}
        </h2>
        <p className="agentRankBadgeCount muted small" data-testid="achievement-count">
          {unlockedCount} / {totalCount} conquistas desbloqueadas
        </p>
      </div>
      <CaseSeal variant="agent" size={64} className="agentCredentialSeal" />
    </div>
  );
}
