const STATIONS = [
  { x: 28, label: "01" },
  { x: 94, label: "02" },
  { x: 160, label: "03" },
  { x: 226, label: "04" },
  { x: 292, label: "05" },
];

const ARROWS = [61, 127, 193, 259];

type Props = {
  className?: string;
};

/**
 * Field-manual route map: five numbered stations on a dashed protocol line,
 * mirroring the Etapa 01–05 sequence below it. Purely decorative (the steps
 * themselves carry the information): always aria-hidden.
 */
export default function ProtocolRouteMap({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 320 44"
      className={`visualScene protocolRouteMap ${className}`}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Protocol baseline */}
      <line x1="24" y1="26" x2="296" y2="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 6" strokeLinecap="round" />

      {/* Direction chevrons between stations */}
      {ARROWS.map((x) => (
        <polyline
          key={x}
          points={`${x - 3},23 ${x + 3},26 ${x - 3},29`}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}

      {/* Stations with index labels */}
      {STATIONS.map((s, i) => (
        <g key={s.label}>
          <circle cx={s.x} cy="26" r="3.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.80" fill="var(--surface-solid)" />
          {i === 0 && <circle cx={s.x} cy="26" r="1.5" fill="currentColor" fillOpacity="0.85" />}
          {i === STATIONS.length - 1 && (
            <circle cx={s.x} cy="26" r="7.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" />
          )}
          <line x1={s.x} y1="15" x2={s.x} y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
          <text
            x={s.x}
            y="11"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            fontSize="6.5"
            letterSpacing="0.6"
            fill="currentColor"
            fillOpacity="0.55"
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
