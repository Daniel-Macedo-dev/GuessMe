import type { CategoryStats } from "../types/stats";
import StatsBarList from "./StatsBarList";
import PanelSectionHeader from "./PanelSectionHeader";

type Props = {
  categories: CategoryStats[];
};

export default function StatsCategoryPanel({ categories }: Props) {
  if (categories.length === 0) return null;
  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  const items = categories.map((c) => ({
    label: c.category,
    value: c.count,
    maxValue: maxCount,
    sub: `${c.avgQuestions} perguntas/caso`,
    colorClass: "statsBarFill--green",
  }));

  return (
    <section className="statsPanel panel" aria-labelledby="stats-cat-title" data-testid="stats-category-panel">
      <PanelSectionHeader icon="archive" title="Categorias investigadas" id="stats-cat-title" />
      <StatsBarList items={items} testId="stats-category-bars" />
    </section>
  );
}
