import type { Achievement, AchievementCategory } from "../types/progression";
import AchievementCard from "./AchievementCard";

const CATEGORY_ORDER: AchievementCategory[] = [
  "Casos",
  "Eficiência",
  "Evidências",
  "Categorias",
  "Arquivo",
];

type Props = {
  achievements: Achievement[];
};

export default function AchievementGrid({ achievements }: Props) {
  return (
    <div className="achievementGrid" data-testid="achievement-grid">
      {CATEGORY_ORDER.map((cat) => {
        const group = achievements.filter((a) => a.category === cat);
        if (group.length === 0) return null;
        return (
          <section key={cat} className="achievementGroup" aria-label={`Conquistas: ${cat}`}>
            <h3 className="achievementGroupTitle" data-testid="achievement-group-title">
              {cat}
            </h3>
            <ul className="achievementList" role="list">
              {group.map((a) => (
                <AchievementCard key={a.id} achievement={a} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
