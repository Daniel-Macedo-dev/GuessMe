type Props = {
  size?: number;
  className?: string;
};

export default function BrandMark({ size = 32, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`brandMark ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.50" />
      <circle cx="20" cy="20" r="13.5" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.28" />
      <line x1="20" y1="1" x2="20" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="20" y1="34.5" x2="20" y2="39" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="1" y1="20" x2="5.5" y2="20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="34.5" y1="20" x2="39" y2="20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" strokeLinecap="round" />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="900"
        fontSize="10.5"
        fill="currentColor"
        fillOpacity="0.90"
        letterSpacing="1.5"
      >
        GM
      </text>
    </svg>
  );
}
