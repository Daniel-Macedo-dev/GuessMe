type IconName =
  | "case-file"
  | "magnifier"
  | "evidence"
  | "clue"
  | "archive"
  | "replay"
  | "stats"
  | "agent"
  | "offline"
  | "install"
  | "export"
  | "import"
  | "share"
  | "lock"
  | "check"
  | "warning";

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

const PATHS: Record<IconName, React.ReactNode> = {
  "case-file": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="8" y1="11.5" x2="16" y2="11.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="8" y1="15" x2="13" y2="15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <rect x="9" y="1.5" width="6" height="3" rx="1" strokeWidth="1.25" stroke="currentColor" fill="none" />
    </>
  ),
  magnifier: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  evidence: (
    <>
      <polygon points="12,3 4,8 4,16 12,21 20,16 20,8" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <circle cx="12" cy="12" r="2.5" strokeWidth="1.25" stroke="currentColor" fill="none" />
    </>
  ),
  clue: (
    <>
      <path d="M9 2H15L20 7V22H4V7Z" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round" />
      <polyline points="9,2 9,8 20,8" strokeWidth="1.25" stroke="currentColor" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="2" strokeWidth="1.25" stroke="currentColor" fill="none" />
      <line x1="12" y1="11" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4" rx="1" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <rect x="3" y="10" width="18" height="11" rx="1" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </>
  ),
  replay: (
    <>
      <path d="M3 12a9 9 0 1 0 1.8-5.4" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      <polyline points="3,7 3,12 8,12" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </>
  ),
  stats: (
    <>
      <line x1="3" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <rect x="5" y="13" width="3" height="7" rx="0.75" strokeWidth="1.25" stroke="currentColor" fill="none" />
      <rect x="10.5" y="8" width="3" height="12" rx="0.75" strokeWidth="1.25" stroke="currentColor" fill="none" />
      <rect x="16" y="4" width="3" height="16" rx="0.75" strokeWidth="1.25" stroke="currentColor" fill="none" />
    </>
  ),
  agent: (
    <>
      <circle cx="12" cy="8" r="4" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="12" r="10" strokeWidth="0.75" stroke="currentColor" strokeOpacity="0.35" fill="none" />
    </>
  ),
  offline: (
    <>
      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 8.5A6 6 0 0 0 6.5 13m11-4.5a9 9 0 0 1 1 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M4 4.5A14 14 0 0 0 2 12m20 0a14 14 0 0 0-2-7.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.5" strokeWidth="1.25" stroke="currentColor" fill="none" />
    </>
  ),
  install: (
    <>
      <path d="M12 3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="7,11 12,16 17,11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3" y="17" width="18" height="4" rx="1.5" strokeWidth="1.25" stroke="currentColor" fill="none" />
    </>
  ),
  export: (
    <>
      <path d="M12 16V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="7,8 12,3 17,8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 15v5h18v-5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" fill="none" />
    </>
  ),
  import: (
    <>
      <path d="M12 8v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="7,16 12,21 17,16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M3 4v5h18V4" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" fill="none" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" strokeWidth="1.25" stroke="currentColor" fill="none" />
      <circle cx="6" cy="12" r="2.5" strokeWidth="1.25" stroke="currentColor" fill="none" />
      <circle cx="18" cy="19" r="2.5" strokeWidth="1.25" stroke="currentColor" fill="none" />
      <line x1="8.4" y1="10.7" x2="15.6" y2="6.3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="8.4" y1="13.3" x2="15.6" y2="17.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.25" strokeWidth="1.25" stroke="currentColor" fill="none" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth="1.25" stroke="currentColor" fill="none" strokeOpacity="0.45" />
      <polyline points="7,12 10.5,15.5 17,9" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 3.2L2.1 18a2 2 0 0 0 1.7 3h16.4a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="0.9" fill="currentColor" />
    </>
  ),
};

export default function DossierIcon({
  name,
  size = 20,
  className = "",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: Props) {
  const isDecorative = ariaHidden === true || ariaHidden === "true" || (!ariaLabel && ariaHidden !== false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`dossierIcon ${className}`}
      aria-hidden={isDecorative ? "true" : undefined}
      aria-label={!isDecorative ? ariaLabel : undefined}
      role={!isDecorative ? "img" : undefined}
      focusable="false"
    >
      {!isDecorative && ariaLabel && <title>{ariaLabel}</title>}
      {PATHS[name]}
    </svg>
  );
}
