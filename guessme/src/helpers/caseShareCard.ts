import type { CaseHistoryEntry } from "../types/guessme";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export function createCaseShareSvg(entry: CaseHistoryEntry): string {
  const W = 520;
  const H = 300;

  const name = esc(truncate(entry.characterName, 28));
  const work = esc(truncate(entry.work, 36));
  const cat = esc(truncate(entry.category, 20));
  const date = esc(fmtDate(entry.createdAt));
  const { yes, no, maybe } = entry.verdictStats;
  const { confirmed, refuted, inconclusive } = entry.evidence;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1420"/>
      <stop offset="100%" stop-color="#070b0f"/>
    </linearGradient>
    <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)" rx="14"/>

  <!-- Investigation grid overlay (subtle) -->
  <rect width="${W}" height="${H}" fill="none" rx="14"
    stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="4" height="${H}" fill="#34d399" rx="2" opacity="0.7"/>

  <!-- Top accent line -->
  <rect x="20" y="18" width="200" height="1" fill="url(#accent-line)"/>

  <!-- App brand -->
  <text x="22" y="36"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="10" font-weight="700" fill="#34d399"
    letter-spacing="0.12em" text-transform="uppercase">GUESSME</text>
  <text x="82" y="36"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="10" fill="rgba(148,172,208,0.55)"
    letter-spacing="0.08em">— DOSSIÊ DIGITAL</text>

  <!-- CASO ENCERRADO stamp -->
  <rect x="${W - 172}" y="18" width="152" height="22" rx="4"
    fill="none" stroke="rgba(52,211,153,0.45)" stroke-width="1.5"/>
  <text x="${W - 96}" y="33" text-anchor="middle"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="9" font-weight="900" fill="#34d399"
    letter-spacing="0.18em">CASO ENCERRADO</text>

  <!-- Character name -->
  <text x="22" y="74"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="22" font-weight="900" fill="rgba(212,226,244,0.92)"
    letter-spacing="-0.3px">${name}</text>

  <!-- Work & category -->
  <text x="22" y="94"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="13" fill="rgba(148,172,208,0.55)">${work}</text>
  <rect x="22" y="104" width="${Math.min(cat.length * 7.5 + 16, 140)}" height="18" rx="4"
    fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  <text x="30" y="117"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="10" font-weight="700" fill="rgba(148,172,208,0.55)"
    letter-spacing="0.06em">${cat}</text>

  <!-- Divider -->
  <rect x="22" y="132" width="${W - 44}" height="1"
    fill="rgba(255,255,255,0.085)"/>

  <!-- Stats row -->
  <!-- Perguntas -->
  <text x="22" y="152"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="18" font-weight="900" fill="rgba(212,226,244,0.92)">${entry.questionCount}</text>
  <text x="22" y="166"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="11" fill="rgba(148,172,208,0.55)">perguntas</text>

  <!-- Pistas -->
  <text x="110" y="152"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="18" font-weight="900" fill="rgba(212,226,244,0.92)">${entry.hintCount}</text>
  <text x="110" y="166"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="11" fill="rgba(148,172,208,0.55)">pistas</text>

  <!-- Verdict stats -->
  <text x="200" y="152"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="18" font-weight="900" fill="#34d399">${yes}</text>
  <text x="200" y="166"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="11" fill="rgba(148,172,208,0.55)">confirmadas</text>

  <text x="295" y="152"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="18" font-weight="900" fill="#f87171">${no}</text>
  <text x="295" y="166"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="11" fill="rgba(148,172,208,0.55)">refutadas</text>

  <text x="375" y="152"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="18" font-weight="900" fill="#fbbf24">${maybe}</text>
  <text x="375" y="166"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="11" fill="rgba(148,172,208,0.55)">inconclusivas</text>

  <!-- Evidence bar -->
  <text x="22" y="196"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="9" font-weight="700" fill="rgba(148,172,208,0.40)"
    letter-spacing="0.10em">EVIDÊNCIAS</text>

  <!-- Evidence counts row -->
  <rect x="22" y="202" width="90" height="36" rx="6"
    fill="rgba(52,211,153,0.07)" stroke="rgba(52,211,153,0.20)" stroke-width="1"/>
  <text x="67" y="220" text-anchor="middle"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="14" font-weight="900" fill="#34d399">${confirmed.length}</text>
  <text x="67" y="233" text-anchor="middle"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="10" fill="rgba(52,211,153,0.65)">confirmadas</text>

  <rect x="120" y="202" width="90" height="36" rx="6"
    fill="rgba(248,113,113,0.07)" stroke="rgba(248,113,113,0.20)" stroke-width="1"/>
  <text x="165" y="220" text-anchor="middle"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="14" font-weight="900" fill="#f87171">${refuted.length}</text>
  <text x="165" y="233" text-anchor="middle"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="10" fill="rgba(248,113,113,0.65)">refutadas</text>

  <rect x="218" y="202" width="90" height="36" rx="6"
    fill="rgba(251,191,36,0.07)" stroke="rgba(251,191,36,0.20)" stroke-width="1"/>
  <text x="263" y="220" text-anchor="middle"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="14" font-weight="900" fill="#fbbf24">${inconclusive.length}</text>
  <text x="263" y="233" text-anchor="middle"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif"
    font-size="10" fill="rgba(251,191,36,0.65)">inconclusivas</text>

  <!-- Divider bottom -->
  <rect x="22" y="252" width="${W - 44}" height="1"
    fill="rgba(255,255,255,0.085)"/>

  <!-- Footer: date + branding -->
  <text x="22" y="274"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="10" fill="rgba(148,172,208,0.40)">${date}</text>
  <text x="${W - 22}" y="274" text-anchor="end"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="10" fill="rgba(52,211,153,0.45)"
    letter-spacing="0.06em">guessme · dossiê digital</text>
</svg>`;
}
