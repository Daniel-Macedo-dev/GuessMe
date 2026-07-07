type Variant = "hero" | "compact";

type Props = {
  variant?: Variant;
  className?: string;
};

/**
 * Original GuessMe linework scene: an evidence network converging on an
 * unidentified target. Shared grammar — strokes 1/1.5, round caps, dashed
 * links "2 4", nodes r2.5 with halo rings, corner registration ticks and
 * mono coordinate labels. Purely decorative: always aria-hidden.
 */
export default function EvidenceNetwork({ variant = "hero", className = "" }: Props) {
  if (variant === "compact") {
    return (
      <svg
        viewBox="0 0 120 84"
        className={`visualScene evidenceNetwork evidenceNetwork--compact ${className}`}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* Corner registration ticks */}
        <path d="M2 8V2h6M112 2h6v6M118 76v6h-6M8 82H2v-6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.30" strokeLinecap="round" />

        {/* Links: evidence nodes → target */}
        <line x1="23" y1="21" x2="52" y2="35" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="2 4" strokeLinecap="round" />
        <line x1="21" y1="60" x2="51" y2="49" stroke="var(--accent-evidence)" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" strokeLinecap="round" />
        <line x1="99" y1="26" x2="80" y2="35" stroke="var(--mystery)" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" strokeLinecap="round" />

        {/* Evidence nodes with halos */}
        <circle cx="18" cy="18" r="2.5" fill="currentColor" fillOpacity="0.80" />
        <circle cx="18" cy="18" r="5.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.30" />
        <circle cx="16" cy="62" r="2.5" fill="var(--accent-evidence)" fillOpacity="0.75" />
        <circle cx="16" cy="62" r="5.5" stroke="var(--accent-evidence)" strokeWidth="1" strokeOpacity="0.28" />
        <circle cx="104" cy="24" r="2.5" fill="var(--mystery)" fillOpacity="0.70" />
        <circle cx="104" cy="24" r="5.5" stroke="var(--mystery)" strokeWidth="1" strokeOpacity="0.26" />

        {/* Unidentified target */}
        <circle cx="66" cy="42" r="18" stroke="currentColor" strokeWidth="1" strokeOpacity="0.30" strokeDasharray="2 4" />
        <circle cx="66" cy="42" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.85" />
        <line x1="66" y1="28" x2="66" y2="32" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
        <line x1="66" y1="52" x2="66" y2="56" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
        <line x1="52" y1="42" x2="56" y2="42" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
        <line x1="76" y1="42" x2="80" y2="42" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
        <text x="66" y="46" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="10" fill="currentColor" fillOpacity="0.85">?</text>

        {/* Redacted metadata bar + coordinate label */}
        <rect x="10" y="72" width="26" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.14" />
        <text x="86" y="20" fontFamily="JetBrains Mono, monospace" fontSize="5" letterSpacing="0.5" fill="currentColor" fillOpacity="0.40">IA-1</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 208"
      className={`visualScene evidenceNetwork evidenceNetwork--hero ${className}`}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Corner registration ticks */}
      <path d="M2 12V2h10M308 2h10v10M318 196v10h-10M12 206H2v-10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.30" strokeLinecap="round" />

      {/* Links: evidence nodes → target */}
      <line x1="42" y1="42" x2="154" y2="87" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="2 4" strokeLinecap="round" />
      <line x1="57" y1="148" x2="154" y2="106" stroke="var(--accent-evidence)" strokeWidth="1" strokeOpacity="0.38" strokeDasharray="2 4" strokeLinecap="round" />
      <line x1="124" y1="31" x2="161" y2="77" stroke="currentColor" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" strokeLinecap="round" />
      <line x1="276" y1="54" x2="198" y2="87" stroke="var(--mystery)" strokeWidth="1" strokeOpacity="0.38" strokeDasharray="2 4" strokeLinecap="round" />
      <line x1="257" y1="157" x2="195" y2="110" stroke="currentColor" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" strokeLinecap="round" />
      {/* Secondary link between peripheral nodes */}
      <line x1="93" y1="176" x2="57" y2="153" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 4" strokeLinecap="round" />

      {/* Evidence nodes with halos */}
      <circle cx="36" cy="40" r="2.5" fill="currentColor" fillOpacity="0.80" />
      <circle cx="36" cy="40" r="5.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.30" />
      <circle cx="52" cy="150" r="2.5" fill="var(--accent-evidence)" fillOpacity="0.75" />
      <circle cx="52" cy="150" r="5.5" stroke="var(--accent-evidence)" strokeWidth="1" strokeOpacity="0.28" />
      <circle cx="120" cy="26" r="2.5" fill="currentColor" fillOpacity="0.65" />
      <circle cx="282" cy="52" r="2.5" fill="var(--mystery)" fillOpacity="0.70" />
      <circle cx="282" cy="52" r="5.5" stroke="var(--mystery)" strokeWidth="1" strokeOpacity="0.26" />
      <circle cx="262" cy="160" r="2.5" fill="currentColor" fillOpacity="0.65" />
      <circle cx="96" cy="178" r="1.75" fill="currentColor" fillOpacity="0.45" />

      {/* Unidentified target: dashed halo, ring, crosshair ticks, mono glyph */}
      <circle cx="176" cy="96" r="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.28" strokeDasharray="2 4" />
      <circle cx="176" cy="96" r="16" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.85" />
      <line x1="176" y1="74" x2="176" y2="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
      <line x1="176" y1="112" x2="176" y2="118" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
      <line x1="154" y1="96" x2="160" y2="96" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
      <line x1="192" y1="96" x2="198" y2="96" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.70" strokeLinecap="round" />
      <text x="176" y="101" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="15" fill="currentColor" fillOpacity="0.85">?</text>

      {/* Redacted metadata bars */}
      <rect x="26" y="52" width="34" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.16" />
      <rect x="26" y="59" width="22" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.10" />
      <rect x="258" y="64" width="36" height="3.5" rx="1.75" fill="var(--mystery)" fillOpacity="0.16" />
      <rect x="270" y="71" width="24" height="3.5" rx="1.75" fill="var(--mystery)" fillOpacity="0.10" />
      <rect x="246" y="172" width="30" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.13" />

      {/* Mono coordinate labels */}
      <text x="30" y="32" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="0.6" fill="currentColor" fillOpacity="0.40">A-3</text>
      <text x="127" y="20" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="0.6" fill="currentColor" fillOpacity="0.35">C-7</text>
      <text x="272" y="44" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="0.6" fill="currentColor" fillOpacity="0.35">F-2</text>
      <text x="202" y="68" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="0.6" fill="currentColor" fillOpacity="0.45">IA-1</text>
      <text x="8" y="201" fontFamily="JetBrains Mono, monospace" fontSize="5.5" letterSpacing="0.8" fill="currentColor" fillOpacity="0.35">GM-0001</text>

      {/* Scan tick ruler along the bottom edge */}
      <path
        d="M128 204v3M136 204v3M144 204v3M152 204v3M160 204v3M168 204v3M176 204v3M184 204v3M192 204v3"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
