import DossierIcon from "./DossierIcon";

type IconName = React.ComponentProps<typeof DossierIcon>["name"];

type Metric = {
  label: string;
  value: string | number;
  sub?: string;
  testId: string;
  accent?: "green" | "amber" | "red" | "slate";
  icon?: IconName;
};

type Props = {
  metrics: Metric[];
};

export default function StatsOverviewGrid({ metrics }: Props) {
  return (
    <div className="statsOverviewGrid" data-testid="stats-overview-grid">
      {metrics.map((m) => (
        <div
          key={m.testId}
          className={`statsMetricCard${m.accent ? ` statsMetricCard--${m.accent}` : ""}`}
          data-testid={m.testId}
        >
          {m.icon && (
            <div className="statsMetricIcon" aria-hidden="true">
              <DossierIcon name={m.icon} size={14} aria-hidden={true} />
            </div>
          )}
          <span className="statsMetricValue">{m.value}</span>
          <span className="statsMetricLabel muted small">{m.label}</span>
          {m.sub && <span className="statsMetricSub muted small">{m.sub}</span>}
        </div>
      ))}
    </div>
  );
}
