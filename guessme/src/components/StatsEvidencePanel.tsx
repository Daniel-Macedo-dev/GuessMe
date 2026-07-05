import type { EvidenceStatsSummary } from "../types/stats";
import StatsBarList from "./StatsBarList";
import PanelSectionHeader from "./PanelSectionHeader";

type Props = {
  evidence: EvidenceStatsSummary;
};

export default function StatsEvidencePanel({ evidence }: Props) {
  const maxVal = Math.max(evidence.confirmed, evidence.refuted, evidence.inconclusive, evidence.hints, 1);
  const items = [
    { label: "Confirmadas", value: evidence.confirmed, maxValue: maxVal, colorClass: "statsBarFill--green" },
    { label: "Refutadas", value: evidence.refuted, maxValue: maxVal, colorClass: "statsBarFill--red" },
    { label: "Inconclusivas", value: evidence.inconclusive, maxValue: maxVal, colorClass: "statsBarFill--amber" },
    { label: "Inteligência (pistas)", value: evidence.hints, maxValue: maxVal, colorClass: "statsBarFill--cyan" },
  ];

  return (
    <section className="statsPanel panel" aria-labelledby="stats-evidence-title" data-testid="stats-evidence-panel">
      <PanelSectionHeader icon="clue" title="Evidências coletadas" id="stats-evidence-title" />
      <p className="statsMetricNote muted small">
        Total de entradas: <strong>{evidence.total}</strong>
      </p>
      <StatsBarList items={items} testId="stats-evidence-bars" />
    </section>
  );
}
