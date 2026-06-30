import type { Achievement } from "../types/progression";

type Props = {
  achievement: Achievement;
};

export default function AchievementCard({ achievement }: Props) {
  const { title, description, status, progress, goal } = achievement;
  const isUnlocked = status === "unlocked";
  const hasProgress = goal > 1;

  return (
    <li
      className={`achievementCard${isUnlocked ? " achievementCard--unlocked" : ""}`}
      data-testid="achievement-card"
      data-unlocked={isUnlocked}
      aria-label={`${title}: ${isUnlocked ? "desbloqueada" : "bloqueada"}`}
    >
      <div className="achievementCardHeader">
        <span
          className={`achievementStamp${isUnlocked ? " achievementStamp--unlocked" : ""}`}
          aria-hidden="true"
        >
          {isUnlocked ? "◼" : "○"}
        </span>
        <span className="achievementTitle" data-testid="achievement-title">
          {title}
        </span>
      </div>
      <p className="achievementDesc muted small">{description}</p>
      {hasProgress && !isUnlocked && (
        <div
          className="achievementProgressWrap"
          data-testid="achievement-progress"
          aria-label={`Progresso: ${progress} de ${goal}`}
        >
          <div className="achievementProgressTrack">
            <div
              className="achievementProgressFill"
              style={{ width: `${Math.round((progress / goal) * 100)}%` }}
            />
          </div>
          <span className="achievementProgressCount muted small">
            {progress} / {goal}
          </span>
        </div>
      )}
    </li>
  );
}
