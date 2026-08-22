type BarItem = {
  label: string;
  value: number;
  maxValue: number;
  sub?: string;
  colorClass?: string;
};

type Props = {
  items: BarItem[];
  testId?: string;
};

export default function StatsBarList({ items, testId }: Props) {
  return (
    <ul className="statsBarList" data-testid={testId} aria-label="Lista de distribuição">
      {items.map((item) => {
        const pct = item.maxValue > 0 ? Math.round((item.value / item.maxValue) * 100) : 0;
        const clampedPct = Math.min(100, Math.max(0, pct));
        return (
          <li key={item.label} className="statsBarItem">
            <div className="statsBarMeta">
              <span className="statsBarLabel">{item.label}</span>
              <span className="statsBarValue muted small">{item.value}</span>
            </div>
            <div
              className="statsBarTrack"
              role="meter"
              aria-label={item.label}
              aria-valuemin={0}
              aria-valuemax={item.maxValue}
              aria-valuenow={item.value}
              aria-valuetext={`${item.value}${item.sub ? `; ${item.sub}` : ""}`}
            >
              <div
                className={`statsBarFill${item.colorClass ? ` ${item.colorClass}` : ""}`}
                style={{ width: `${clampedPct}%` }}
                aria-hidden="true"
              />
            </div>
            {item.sub && <span className="statsBarSub muted small">{item.sub}</span>}
          </li>
        );
      })}
    </ul>
  );
}
