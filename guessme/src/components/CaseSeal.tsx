type Variant = "closed" | "archived" | "install" | "agent";

type Props = {
  variant?: Variant;
  size?: number;
  className?: string;
};

const RING_TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x1: 48 + 32 * cos,
    y1: 48 + 32 * sin,
    x2: 48 + 36 * cos,
    y2: 48 + 36 * sin,
  };
});

const VARIANT_LABEL: Record<Variant, string> = {
  closed: "ENCERRADO",
  archived: "ARQUIVADO",
  install: "PACOTE",
  agent: "AGENTE",
};

function VariantGlyph({ variant }: { variant: Variant }) {
  if (variant === "closed") {
    return (
      <polyline
        points="40,50 46,56 58,42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );
  }
  if (variant === "archived") {
    return (
      <>
        <rect x="38" y="40" width="20" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="38" y="47" width="20" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="44" y1="52.5" x2="52" y2="52.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </>
    );
  }
  if (variant === "install") {
    return (
      <>
        <line x1="48" y1="38" x2="48" y2="52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <polyline points="42,46 48,52 54,46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="40" y1="57" x2="56" y2="57" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <circle cx="48" cy="44" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 58c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </>
  );
}

/**
 * Official GuessMe document seal: concentric rings, radial ticks, cardinal
 * crosshair marks (echoing the brand mark) and a variant glyph + mono label.
 * Purely decorative: always aria-hidden.
 *
 * Below 64px the mono micro-labels degrade into unreadable texture, so
 * compact renders drop the text and let rings + glyph carry the identity.
 */
export default function CaseSeal({ variant = "closed", size = 96, className = "" }: Props) {
  const compact = size < 64;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={`visualScene caseSeal caseSeal--${variant} ${className}`}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Concentric seal rings */}
      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" />
      <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.40" strokeDasharray="2 4" />
      <circle cx="48" cy="48" r="28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.65" />

      {/* Radial ticks between inner and dashed rings */}
      {RING_TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
      ))}

      {/* Cardinal crosshair marks crossing the outer ring (brand echo) */}
      <line x1="48" y1="1" x2="48" y2="7" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="48" y1="89" x2="48" y2="95" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="1" y1="48" x2="7" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="89" y1="48" x2="95" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />

      {/* Header + variant label in mono (legible sizes only) */}
      {!compact && (
        <>
          <text x="48" y="32" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="6" letterSpacing="1.5" fill="currentColor" fillOpacity="0.80">
            GUESSME
          </text>
          <text x="48" y="68" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="5.5" letterSpacing="1" fill="currentColor" fillOpacity="0.70">
            {VARIANT_LABEL[variant]}
          </text>
        </>
      )}
      {/* Compact stand-in: geometric ticks keep the band occupied where the
          micro-labels would otherwise dissolve into noise */}
      {compact && (
        <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round">
          <line x1="42" y1="30" x2="54" y2="30" />
          <line x1="44" y1="66" x2="52" y2="66" />
        </g>
      )}

      <VariantGlyph variant={variant} />
    </svg>
  );
}
