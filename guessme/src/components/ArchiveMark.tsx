type Props = {
  className?: string;
};

/**
 * Archive drawer scene: a filing cabinet with indexed drawers and one
 * retrieved dossier, drawn in the shared linework grammar. Purely
 * decorative: always aria-hidden.
 */
export default function ArchiveMark({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 120 84"
      className={`visualScene archiveMark ${className}`}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Corner registration ticks */}
      <path d="M2 8V2h6M112 2h6v6M118 76v6h-6M8 82H2v-6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.30" strokeLinecap="round" />

      {/* Cabinet body with drawer divisions */}
      <rect x="30" y="10" width="56" height="64" rx="2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.80" />
      <line x1="30" y1="31.3" x2="86" y2="31.3" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="30" y1="52.6" x2="86" y2="52.6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" />

      {/* Drawer handles */}
      <rect x="52" y="19" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.60" />
      <rect x="52" y="40.3" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.60" />
      <rect x="52" y="61.6" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.60" />

      {/* Drawer index labels */}
      <text x="26" y="23" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="currentColor" fillOpacity="0.40">A</text>
      <text x="26" y="44" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="currentColor" fillOpacity="0.40">B</text>
      <text x="26" y="66" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="currentColor" fillOpacity="0.40">C</text>

      {/* Retrieved dossier, pulled from drawer A */}
      <line x1="86" y1="21" x2="96" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" strokeLinecap="round" />
      <rect x="94" y="30" width="16" height="22" rx="1" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" strokeDasharray="3 3" />
      <line x1="97" y1="36" x2="107" y2="36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="97" y1="41" x2="107" y2="41" stroke="currentColor" strokeWidth="1" strokeOpacity="0.28" strokeLinecap="round" />
      <line x1="97" y1="46" x2="103" y2="46" stroke="currentColor" strokeWidth="1" strokeOpacity="0.22" strokeLinecap="round" />
    </svg>
  );
}
