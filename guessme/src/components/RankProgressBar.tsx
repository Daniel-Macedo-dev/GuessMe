import type { AchievementProgress, AgentRank } from "../types/progression";

type Props = {
  progressToNext: AchievementProgress;
  nextRank: AgentRank;
};

export default function RankProgressBar({ progressToNext, nextRank }: Props) {
  const { current, goal, percent } = progressToNext;

  return (
    <div className="rankProgressWrap" data-testid="rank-progress-bar">
      <div className="rankProgressMeta">
        <span className="rankProgressLabel muted small">
          Progresso para <b>{nextRank.title}</b>
        </span>
        <span
          className="rankProgressCount muted small"
          aria-label={`${current} de ${goal} casos resolvidos`}
        >
          {current} / {goal}
        </span>
      </div>
      <div
        className="rankProgressTrack"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={`Progresso para ${nextRank.title}: ${percent}%`}
      >
        <div
          className="rankProgressFill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
