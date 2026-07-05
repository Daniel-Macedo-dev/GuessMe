import type { VerdictStatsSummary } from "../types/stats";
import StatsBarList from "./StatsBarList";
import PanelSectionHeader from "./PanelSectionHeader";

type Props = {
  verdicts: VerdictStatsSummary;
};

export default function StatsVerdictPanel({ verdicts }: Props) {
  const maxVal = Math.max(verdicts.yes, verdicts.no, verdicts.maybe, verdicts.unknown, 1);
  const items = [
    { label: "Confirmadas (Sim)", value: verdicts.yes, maxValue: maxVal, colorClass: "statsBarFill--green" },
    { label: "Refutadas (Não)", value: verdicts.no, maxValue: maxVal, colorClass: "statsBarFill--red" },
    { label: "Inconclusivas (Talvez)", value: verdicts.maybe, maxValue: maxVal, colorClass: "statsBarFill--amber" },
    { label: "Indefinidas", value: verdicts.unknown, maxValue: maxVal, colorClass: "statsBarFill--slate" },
  ];

  return (
    <section className="statsPanel panel" aria-labelledby="stats-verdict-title" data-testid="stats-verdict-panel">
      <PanelSectionHeader icon="evidence" title="Distribuição de veredictos" id="stats-verdict-title" />
      <p className="statsMetricNote muted small">
        Total de respostas: <strong>{verdicts.total}</strong>
      </p>
      <StatsBarList items={items} testId="stats-verdict-bars" />
    </section>
  );
}
