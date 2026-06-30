# GuessMe — Dossiê Digital

**Interrogue a IA e descubra o personagem secreto antes de esgotar suas perguntas.**

GuessMe is a browser-based investigation game with a custom Casefile Noir visual identity. You interrogate an AI that secretly plays a character: ask yes/no questions, build an evidence file, collect hints, and crack the case. Every solved case is archived locally — with a full transcript, evidence snapshot, stats dashboard, and agent rank progression.

Built as a portfolio project demonstrating: AI-powered game mechanics, handcrafted CSS design system, zero-backend client architecture, and production-quality E2E coverage.

- **Frontend:** React 19, TypeScript, Vite 7, custom CSS — this repo
- **Backend API:** Java + Spring Boot + Gemini — [guessme-api](https://github.com/Daniel-Macedo-dev/guessme-api)

---

## Product features

| Feature | Details |
|---------|---------|
| **Investigation game** | Ask yes/no questions; AI responds with structured YES/NO/MAYBE/UNKNOWN verdicts |
| **Evidence notebook** | Live sidebar classifies each answer as Confirmado / Refutado / Inconclusivo |
| **Hint system** | Request clues from the AI; collected as Inteligência in the evidence file |
| **Category select** | Anime, Games, Filmes, Séries — changes what character domain the AI plays |
| **Victory modal** | Closed-case report showing the identified character with the decisive question |
| **Case archive** | Every solved case saved locally; replay full question/answer timeline with verdicts |
| **Case export** | Export as JSON (reimportable) or SVG share card; import between browsers |
| **Statistics dashboard** | Verdict distribution, evidence totals, category breakdown, best/longest case ranking |
| **Agent rank** | Six-tier progression ladder (Recruta → Mestre do Dossiê) derived from solved cases |
| **Achievements** | 11 badges across 5 categories (Casos, Eficiência, Evidências, Categorias, Arquivo) |
| **Casefile Noir theme** | Handcrafted investigation/dossier visual identity — zero CSS framework |
| **Fully local** | No auth, no login, no data collection — everything computed from `localStorage` |

---

## Screenshots

Run this to generate screenshots of all routes at five viewport sizes:

```bash
# Terminal 1 — start the dev server
npm run dev

# Terminal 2 — capture screenshots (requires dev server on port 5173)
npm run screenshots
```

Output is saved to `visual-screenshots/` which is gitignored. 35 PNGs are generated (7 routes × 5 viewports).

### Routes captured

| Filename prefix | Route | Seed |
|----------------|-------|------|
| `home` | `/` | — |
| `how-it-works` | `/how-it-works` | — |
| `game-empty` | `/game` | — (shows investigation interface) |
| `game-history` | `/game` | 3 seeded cases (shows populated Histórico de Casos) |
| `stats-empty` | `/stats` | — (empty state with Agent Dossier) |
| `stats-progression` | `/stats` | 3 seeded cases (Analista rank, first achievements) |
| `stats-rich` | `/stats` | 8 seeded cases across 4 categories (full dashboard) |

### Viewports

`desktop-1440` · `desktop-1366` · `tablet-768` · `mobile-390` · `mobile-360`

---

## Getting started

### Prerequisites

- Node.js ≥ 18
- The backend API running locally at `http://localhost:8080` — see [guessme-api](https://github.com/Daniel-Macedo-dev/guessme-api) for setup (requires a Gemini API key)

### Install and run

```bash
cd guessme
npm install
npm run dev       # http://localhost:5173
```

### Environment variable

Create `guessme/.env.local` to point at your backend:

```
VITE_API_BASE_URL=http://localhost:8080
```

If not set, defaults to `http://localhost:8080`.

### All commands

```bash
npm run dev            # start Vite dev server
npm run build          # production build (outputs to dist/)
npm run lint           # ESLint check (zero warnings)
npm run e2e            # Playwright — 244 tests, no backend required
npm run e2e:ui         # Playwright interactive UI mode
npm run e2e:report     # open last Playwright HTML report
npm run screenshots    # capture visual-screenshots/ (requires dev server)
```

---

## Architecture

```
guessme/
├── index.html                  # Document shell — title, favicon, OG, fonts
├── src/
│   ├── app/                    # Entry point (main.tsx, router setup)
│   ├── components/             # Shared UI components
│   │   ├── BrandMark.tsx       # SVG dossier seal — used in Navbar and Home hero
│   │   ├── CaseStamp.tsx       # Status badge primitive (active/closed/archived/…)
│   │   ├── DossierSectionHeader.tsx
│   │   ├── EvidenceNotebook.tsx
│   │   ├── VictoryModal.tsx    # Closed-case report modal
│   │   ├── CaseReplayModal.tsx # Archived dossier transcript modal
│   │   ├── AgentDossierPanel.tsx
│   │   └── …
│   ├── helpers/                # Pure derivation functions (no side effects)
│   │   ├── deriveEvidence.ts   # verdict → Confirmado/Refutado/Inconclusivo
│   │   ├── caseStats.ts        # CaseHistoryEntry[] → StatsData
│   │   ├── progression.ts      # CaseHistoryEntry[] → PlayerProgression
│   │   └── caseExport.ts
│   ├── hooks/                  # React hooks
│   │   ├── useGame.ts          # Game state machine (API calls, session, verdicts)
│   │   └── useCaseHistory.ts   # localStorage read/write with dedup guard
│   ├── pages/                  # Route-level views
│   │   ├── Home.tsx            # Landing page with dossier hero
│   │   ├── Game.tsx            # Investigation desk
│   │   ├── HowItWorks.tsx      # Rules and protocol
│   │   └── Stats.tsx           # Statistics dashboard + Agent Dossier
│   ├── services/               # API adapter + localStorage adapter
│   ├── styles/
│   │   └── index.css           # All styles — single file, CSS custom properties
│   └── types/                  # TypeScript interfaces
│       ├── guessme.ts          # Game, message, verdict, history types
│       ├── stats.ts            # StatsData, category breakdown
│       └── progression.ts      # AgentRank, Achievement, PlayerProgression
└── tests/
    ├── e2e/                    # Nine Playwright spec files — 244 tests
    └── visual/
        └── screenshots.ts      # Multi-viewport screenshot capture script
```

### Key design decisions

- **Zero CSS framework** — all styles in `index.css` with CSS custom properties. The Casefile Noir identity requires precise control of gradients, glows, and backdrop filters; utility classes would fight the design.
- **Pure functional derivation** — stats, progression, and evidence are computed as pure functions of the history array. No secondary localStorage keys, no sync complexity, no reconciliation.
- **API route isolation in tests** — all 244 Playwright tests mock API responses via `page.route()`. The suite runs with no backend and no Gemini key.
- **Single localStorage key** — `guessme.caseHistory.v1` is the only persisted state. Clearing it resets history, stats, and progression simultaneously.

---

## Visual identity — Casefile Noir

GuessMe uses a custom investigation/dossier design system called **Casefile Noir** (Dossiê Digital). It avoids generic dark-mode SaaS conventions in favor of a digital interrogation desk aesthetic.

| Element | Treatment |
|---------|-----------|
| Background | Obsidian `#070b0f` with petrol-green radial glow (top-left) + navy depth (right) + 40 px investigation grid overlay |
| Panels | Dark petrol-navy surface gradient with `backdrop-filter: blur(14px)` |
| Typography (body) | **Inter** — clean, high-contrast |
| Typography (mono) | **JetBrains Mono** — case stamps, stat counters, badge labels |
| Navbar | Green-glowing bottom border, evidence-green active pill, "DOSSIÊ DIGITAL" monospace sub-mark |
| Accent (evidence) | `#34d399` — bright emerald green (Confirmado, active states, glow) |
| Accent (clue) | `#fbbf24` — amber (Inteligência, hints, MAYBE/Talvez, warnings) |
| Accent (danger) | `#f87171` — soft red (Refutado, error states) |
| Accent (mystery) | `#94a3b8` — slate (Inconclusivo, third step card) |
| Verdict bubbles | 3 px inset `box-shadow` left accent (not border) — communicates verdict without relying solely on color |
| Case stamp | `CASO ENCERRADO` in mono with text-shadow and border glow |
| Buttons (primary) | Green border + glow shadow, intensifies on hover |
| Step cards | 3 px colored left border: green (01), amber (02), slate (03) |

### Visual signature components

| Component | Role |
|-----------|------|
| `BrandMark` | SVG dossier seal (two concentric circles + cardinal marks + GM logotype). Used in Navbar and Home hero. |
| `CaseStamp` | Inline status badge — variants: `active`, `closed`, `classified`, `archived`, `intel`. Sizes: `sm`, `md`, `lg`. Optional `pulse` animation. |
| `DossierSectionHeader` | Page section header with classification label, heading, and optional meta line. |

### Dossier UI patterns

| Pattern | Where |
|---------|-------|
| Classification strip (`RELATÓRIO DE CASO · ENCERRADO`) | VictoryModal header |
| Archive label (`DOSSIÊ ARQUIVADO · ACESSO RESTRITO`) | CaseReplayModal header |
| Transcript label (`TRANSCRIÇÃO DE INTERROGAÇÃO`) | Game chat panel |
| Quick queries label (`CONSULTAS RÁPIDAS`) | Answer chips section |
| Intelligence report label (`RELATÓRIO DE INTELIGÊNCIA · USO RESTRITO`) | Stats page header |
| Protocol header (`DOSSIÊ OPERACIONAL · ACESSO RESTRITO`) | HowItWorks page |
| Hero classification strip (`CONFIDENCIAL · PROTOCOLO DE INTERROGAÇÃO · IA-1`) | Home hero |
| Telemetry bar (phase text) | GameStatsBar |
| Footer ref (`GUESSME · DOSSIÊ DIGITAL · v2`) | Footer |

### Design token reference

All values live in `:root {}` in `src/styles/index.css`:

```
--bg, --surface, --surface-raised, --surface-chat, --surface-menu
--border, --border2, --border-glow
--border-accent          /* green accent border: rgba(52,211,153,0.18) */
--accent-faint           /* green fill ghost:   rgba(52,211,153,0.06) */
--surface-desk           /* backdrop tint:      rgba(6,11,18,0.72)   */
--text, --muted, --muted-dim
--accent, --accent-dim, --accent-evidence, --danger, --mystery, --intel
--shadow, --shadow-glow, --shadow-float
--radius, --radius-sm, --radius-inner, --radius-pill
--font-display, --font-body, --font-mono
--t-fast, --t-base
```

---

## Routes

| Path | Page |
|------|------|
| `/` | Home — landing page with dossier hero and how-to-play cards |
| `/game` | Game — investigation desk with chat, evidence notebook, and case history |
| `/how-it-works` | Manual — rules, tips, and protocol guide |
| `/stats` | Statistics — dashboard + Agent Dossier progression panel |

---

## Agent Rank and Achievements

The `/stats` page includes a **Dossiê do Agente** panel tracking your progression as an investigator. All progression is calculated locally from case history — no login, no sync, no server.

### Agent Rank ladder

| Rank | Cases required |
|------|---------------|
| Recruta | 0 |
| Analista | 1 |
| Investigador | 3 |
| Detetive | 7 |
| Arquivista | 15 |
| Mestre do Dossiê | 25 |

Rank advances automatically as you solve more cases. A progress bar shows the distance to the next rank.

### Achievements

| Category | Achievements |
|----------|-------------|
| **Casos** | Primeiro Caso (1 case), Sequência Inicial (3 cases), Arquivo Robusto (10 cases) |
| **Eficiência** | Investigação Cirúrgica (solve in ≤5 questions), Sem Ajuda (no hints), Caçador de Pistas (10 total hints) |
| **Evidências** | Especialista em Confirmações (20 confirmed), Cético Profissional (20 refuted), Teoria Aberta (20 inconclusive) |
| **Categorias** | Multiverso (3 different categories) |
| **Arquivo** | Arquivista Local (5 cases stored) |

Locked achievements show progress bars where applicable. Unlocked achievements receive the Casefile Noir accent treatment (green inset border + stamp). Imported cases count identically to played cases.

### Where it lives

| File | Role |
|------|------|
| `src/types/progression.ts` | `AgentRank`, `Achievement`, `PlayerProgression` types |
| `src/helpers/progression.ts` | `deriveAgentRank`, `deriveAchievements`, `derivePlayerProgression` |
| `src/components/AgentDossierPanel.tsx` | Container panel |
| `src/components/AgentRankCard.tsx` | Current rank display with stamp |
| `src/components/RankProgressBar.tsx` | Progress bar toward next rank |
| `src/components/AchievementGrid.tsx` | Grouped achievement grid |
| `src/components/AchievementCard.tsx` | Individual achievement card (locked / unlocked states) |

---

## Personal Statistics Dashboard

The `/stats` page shows a dashboard derived entirely from local case history. No server call is made.

| Section | What it shows |
|---------|---------------|
| Overview cards | Total cases, total questions, total hints, average questions per case |
| Verdict distribution | Bar chart of YES / NO / MAYBE / UNKNOWN across all cases |
| Evidence collected | Bar chart of confirmed, refuted, inconclusive, and hints |
| Categories investigated | Bar chart sorted by case count, with average questions per category |
| Cases of note | "Mais eficiente" (fewest questions) and "Mais longo" (most questions) |
| Recent activity | Last 5 cases sorted by date, with category badge, date, and question count |

---

## Case Archive Portability

Solved cases can be exported, shared, and imported between browsers — all locally, no server required.

### Copy summary

Open a solved case with **Rever caso** → **Copiar resumo**. A Markdown-formatted summary is copied to clipboard (character, work, category, question/hint counts, verdict stats, winning question, all evidence entries).

### Download JSON

**Baixar JSON** in the replay modal downloads a versioned JSON file that can be imported on any other browser.

### Import JSON

**Importar caso** in the Histórico de Casos panel accepts a `.json` file previously exported from GuessMe. If the case ID already exists, a new ID is assigned — existing cases are never silently overwritten.

### Download share card

**Baixar card** downloads an SVG card (520×300 px) with the Casefile Noir identity — character name, stats, evidence counts, and the CASO ENCERRADO stamp. Opens in any browser or SVG viewer.

### JSON export schema

```json
{
  "schemaVersion": 1,
  "app": "GuessMe",
  "exportedAt": "<ISO 8601 timestamp>",
  "case": {
    "id": "<string>",
    "createdAt": "<unix ms>",
    "characterName": "<string>",
    "work": "<string>",
    "category": "<string>",
    "questionCount": "<number>",
    "hintCount": "<number>",
    "winningQuestion": "<string | null>",
    "verdictStats": { "yes": 0, "no": 0, "maybe": 0, "unknown": 0 },
    "evidence": { "confirmed": [], "refuted": [], "inconclusive": [], "hints": [] },
    "messages": []
  }
}
```

---

## Case History

The `/game` page shows a **Histórico de Casos** panel below the investigation interface. Solved cases are automatically archived locally.

Each saved case contains: character name, work, category, full message sequence, evidence snapshot (confirmed/refuted/inconclusive/hints), verdict stats, winning question, question/hint counts, and timestamp. Storage is capped at 25 most recent entries.

The replay modal is keyboard-dismissible (Escape). It does not call the backend or modify the current game session.

---

## Evidence Notebook

The `/game` page shows a live **Caderno de Evidências** alongside the chat:

- Classifies each AI answer as **Confirmado**, **Refutado**, or **Inconclusivo** using the structured `verdict` field, with text-prefix fallback for legacy responses
- Collects **Inteligência** entries from hint messages
- Shows a **Caso Encerrado** summary block on win

### Structured verdict contract

| Verdict | Evidence kind | Typical `answer` text |
|---------|--------------|----------------------|
| `YES` | Confirmado | Starts with "Sim" |
| `NO` | Refutado | Starts with "Não" |
| `MAYBE` | Inconclusivo | Starts with "Talvez" |
| `UNKNOWN` | Not classified | Errors, limits, hints, boot messages |

Classification priority: `message.verdict` (structured backend field) → text prefix (legacy fallback).

### Layout behavior

- **≥ 901 px:** two-column grid — chat (flex) + notebook (272 px fixed) side-by-side; notebook sticky
- **≤ 900 px:** single column — notebook collapses below the chat

---

## Backend error handling

| Category | Trigger prefix | UI treatment |
|----------|---------------|--------------|
| `game` | (normal AI response) | Chat bubble |
| `stale-session` | `Sessão não encontrada` | Error box + "Novo caso" button |
| `system-error` | `Config inválida`, `Erro da API Gemini`, `Erro inesperado`, others | Error box (red) |
| `user-limit` | `Aguarde`, `Limite`, `Pergunta muito longa` | Warning box (amber) |

`user-limit` responses do not increment the question counter.

## Backend session limits

- **Cooldown:** 3 s between requests (ask and hint share the timer)
- **Max questions:** 50 per session
- **Max hints:** 10 per session
- **Max question length:** 300 characters (also enforced in UI with live counter)
- **Session TTL:** 60 minutes of inactivity

---

## E2E test coverage

Playwright 1.61 — **244 tests** across nine spec files. All API calls are intercepted via `page.route()`. History, stats, and progression tests use `localStorage` seeding via `addInitScript`. No backend or Gemini key required.

```bash
npx playwright install --with-deps chromium   # one-time setup
npm run e2e           # headless (auto-starts dev server)
npm run e2e:ui        # interactive UI mode
npm run e2e:report    # open HTML report
```

| Spec | Coverage |
|------|----------|
| `routes.spec.ts` | Route rendering, navigation links, SPA deep links, unknown route redirect |
| `game-flow.spec.ts` | Boot, category select, question input (empty/overlong/Enter), answer bubbles, hint flow, victory modal |
| `error-states.spec.ts` | Backend unavailable, cooldown, max questions/hints, stale session, Gemini error |
| `mobile.spec.ts` | Overflow-free layout at 390 px and 360 px |
| `notebook.spec.ts` | Notebook presence, empty/confirmed/refuted/inconclusive/intel states, verdict classification, mobile |
| `history.spec.ts` | Empty state, seeded cards, victory save, duplicate prevention, reload persistence, replay modal, delete/clear, mobile |
| `portability.spec.ts` | Copy/JSON/SVG export; import valid/invalid/duplicate JSON; mobile overflow |
| `stats.spec.ts` | Empty state, single/multi case totals, verdict/evidence/category panels, rankings, navigation, mobile |
| `progression.spec.ts` | Recruta empty state, rank ladder, achievement unlocks, max rank, imported cases, mobile |

---

## QA smoke checklist

### Boot
- [ ] Opening `/game` starts a new session and shows the opening AI message
- [ ] If the backend is unreachable, an amber error box appears with "Tentar novamente"

### Asking questions
- [ ] Typing a question and pressing Enter or "Enviar" sends it
- [ ] The character counter appears and turns amber > 264 chars, red > 300 chars
- [ ] The "Enviar" button is disabled when input exceeds 300 chars
- [ ] Rapid repeated questions show the amber cooldown warning ("Aguarde…")
- [ ] After 50 questions the warning "Limite de perguntas" appears

### Hints
- [ ] "Solicitar pista" adds a hint bubble to the chat
- [ ] Button shows "Buscando pista…" and `aria-busy` while in flight
- [ ] After 10 hints the warning "Limite de dicas" appears
- [ ] Hint button is disabled when session has expired

### Session expiry
- [ ] After 60 min idle, the next request shows the red expiry error with "Novo caso"
- [ ] Clicking "Novo caso" restarts with a fresh session

### Category switching
- [ ] Changing domain restarts the game with the new category
- [ ] Dropdown focus moves into the menu when opened

### Win state
- [ ] Correct guess shows VictoryModal with character name and image
- [ ] Input is disabled and session controls lock after win
- [ ] "Novo caso" in modal or header starts a fresh game

### Evidence Notebook
- [ ] Notebook shows "Sem evidências ainda" before any questions are asked
- [ ] After a "Sim" answer the Confirmado section appears with the question
- [ ] After a "Não" answer the Refutado section appears with the question
- [ ] After a "Talvez" answer the Inconclusivo section appears with the question
- [ ] After a hint the Inteligência section appears with the hint text
- [ ] After winning, the notebook shows "Caso Encerrado" with character name and work
- [ ] On desktop (≥ 901 px), notebook appears to the right of the chat
- [ ] On mobile (≤ 900 px), notebook stacks below the chat without horizontal overflow

### Case History
- [ ] "Histórico de Casos" panel appears below the game interface
- [ ] Before any victories, panel shows "Nenhum caso arquivado ainda."
- [ ] After winning a case, a card appears with character name, work, and question count
- [ ] Only one card is saved per victory (no duplicates on modal re-render)
- [ ] Cards persist after page refresh
- [ ] "Rever caso" button opens the replay modal
- [ ] Replay modal shows character name, question/answer timeline, and evidence snapshot
- [ ] Verdict badge colors match the chat bubbles (green / red / amber)
- [ ] Escape key or the ✕ button closes the replay modal
- [ ] Replay does not send requests to the backend
- [ ] "Excluir" removes the card immediately and after reload
- [ ] "Limpar" removes all archived cases
- [ ] History panel does not break existing game chat, hints, or victory flow

### Case Archive Portability
- [ ] **Copiar resumo** button is visible in the replay modal
- [ ] Clicking Copiar resumo copies Markdown text to clipboard
- [ ] Copied text includes character name, category, and evidence summary
- [ ] A success/error status message appears below the Fechar button after the action
- [ ] **Baixar JSON** downloads a `.json` file with `schemaVersion: 1` and `app: "GuessMe"`
- [ ] **Baixar card** downloads a `.svg` file with CASO ENCERRADO and character name
- [ ] **Importar caso** button is visible in the Histórico de Casos panel
- [ ] Clicking Importar caso opens a file picker accepting `.json`
- [ ] Importing a valid exported JSON adds a card to the history panel
- [ ] Importing an invalid file shows a readable error message
- [ ] Importing a case with a duplicate ID assigns a new ID (does not silently overwrite)
- [ ] An imported case opens correctly in the replay modal
- [ ] Imported cases persist across page reload

### Agent Rank and Achievements
- [ ] Visiting `/stats` with no history shows the Dossiê do Agente panel with rank "Recruta"
- [ ] Progress bar toward Analista is visible with 0 solved cases
- [ ] After solving 1 case, rank advances to Analista
- [ ] After solving 3 cases, rank advances to Investigador
- [ ] Achievement grid shows five category sections
- [ ] "Primeiro Caso" achievement unlocks after the first solved case
- [ ] "Sem Ajuda" achievement unlocks when any case was solved with 0 hints
- [ ] "Investigação Cirúrgica" unlocks when any case was solved in 5 or fewer questions
- [ ] "Multiverso" unlocks when cases span 3 different categories
- [ ] Locked achievements show a progress bar (where applicable)
- [ ] At rank "Mestre do Dossiê" (25 cases), the progress bar is replaced with "Posto máximo atingido"
- [ ] Imported cases count toward rank and achievements
- [ ] Clearing history resets rank to Recruta and locks all achievements
- [ ] Progression panel is visible at 390 px and 360 px without horizontal overflow

### Personal Statistics Dashboard
- [ ] Clicking "Estatísticas" in the navbar navigates to `/stats`
- [ ] The Estatísticas link shows an active pill when on `/stats`
- [ ] Without any case history, the empty state message is displayed
- [ ] Empty state CTA "Abrir um caso" links to `/game`
- [ ] After solving a case, visiting `/stats` shows the populated dashboard
- [ ] Overview cards show correct totals (cases, questions, hints, average)
- [ ] Verdict distribution bars are shown for each verdict type
- [ ] Evidence bars show confirmed, refuted, inconclusive, and hints counts
- [ ] Category bars show the categories played, sorted by case count
- [ ] "Mais eficiente" card shows the case solved in fewest questions
- [ ] "Mais longo" card shows the case with the most questions
- [ ] Recent activity lists the last 5 cases with category badges and dates
- [ ] The dashboard does not call the backend at any point
- [ ] Clearing history from `/game` resets the dashboard to empty state

### Visual identity
- [ ] Navbar shows the BrandMark SVG seal to the left of "GuessMe"
- [ ] Home hero has classification strip ("CONFIDENCIAL · PROTOCOLO DE INTERROGAÇÃO · IA-1")
- [ ] Home step cards display protocol numbers (01 / 02 / 03) in the top-right corner
- [ ] Game chat panel shows "TRANSCRIÇÃO DE INTERROGAÇÃO" label above messages
- [ ] Answer chips section shows "CONSULTAS RÁPIDAS" label
- [ ] VictoryModal top reads "RELATÓRIO DE CASO · ENCERRADO" above the stamp
- [ ] CaseReplayModal top reads "DOSSIÊ ARQUIVADO · ACESSO RESTRITO" above the stamp
- [ ] Replay modal transcript section shows "TRANSCRIÇÃO" dossier label
- [ ] Stats page shows "RELATÓRIO DE INTELIGÊNCIA · USO RESTRITO" in the header
- [ ] Footer shows "GUESSME · DOSSIÊ DIGITAL · v2" reference on desktop
- [ ] Modals appear above all other page content (overlay z-index)

### Mobile (≤ 640 px)
- [ ] Chat area is readable without scrolling past the input row
- [ ] Category dropdown does not overflow the screen
- [ ] Header stacks vertically on narrow screens
- [ ] History panel and cards render without horizontal overflow on 390 px
- [ ] Export buttons in replay modal are visible and usable on 390 px without overflow
- [ ] Import button in history panel is visible and usable on 390 px

---

## Privacy and secrets

- **No data collection.** Everything — case history, stats, progression — is computed from a single `localStorage` key (`guessme.caseHistory.v1`). Nothing is sent to a server by this frontend.
- **No secrets committed.** The only configurable value (`VITE_API_BASE_URL`) is a URL, not a key. The Gemini API key lives exclusively in the backend's environment. `.env.local` is gitignored.
- **Clearing `localStorage`** resets all data: history, stats, rank, achievements.
