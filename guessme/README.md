# GuessMe — Frontend

React + TypeScript + Vite frontend for the [GuessMe](https://github.com/Daniel-Macedo-dev/guessme-api) guessing game.

## Visual identity — Casefile Noir

GuessMe uses a custom investigation/dossier theme called **Casefile Noir**. It avoids generic dark-mode SaaS conventions in favor of a digital interrogation aesthetic:

| Element | Treatment |
|---------|-----------|
| Background | Obsidian `#070b0f` with petrol-green radial glow (top-left) + navy depth (right) + 40 px investigation grid overlay |
| Panels | Dark petrol-navy surface gradient with `backdrop-filter: blur(14px)` |
| Typography (body) | **Inter** (loaded via Google Fonts) — clean, high-contrast |
| Typography (mono) | **JetBrains Mono** — case stamps, stat counters, badge labels |
| Navbar | Green-glowing bottom border, evidence-green active pill, "DOSSIÊ DIGITAL" monospace sub-mark |
| Accent (evidence) | `#34d399` — bright emerald green (Confirmado, active states, glow) |
| Accent (clue) | `#fbbf24` — amber (Inteligência, hints, MAYBE/Talvez, warnings) |
| Accent (danger) | `#f87171` — soft red (Refutado, error states) |
| Accent (mystery) | `#94a3b8` — slate (Inconclusivo, third step card) |
| Verdict bubbles | 3 px inset `box-shadow` left accent (not border) — communicates verdict without relying solely on color |
| Evidence sections | Same 3 px inset left accent pattern — green / red / amber |
| Case stamp | `CASO ENCERRADO` in mono with text-shadow and border glow |
| Buttons (primary) | Green border + glow shadow, intensifies on hover |
| Home step cards | Each card has a 3 px colored left border: green (01 Abertura), amber (02 Interrogação), slate (03 Encerramento) |
| Error/warning boxes | Inset left-accent matching verdict color (red=error, amber=warning) |

### Design token reference

All visual values live in `:root {}` in `src/styles/index.css`:

```
--bg, --surface, --surface-raised, --surface-chat, --surface-menu
--border, --border2, --border-glow
--text, --muted, --muted-dim
--accent, --accent-dim, --accent-evidence, --danger, --mystery, --intel
--shadow, --shadow-glow, --shadow-float
--radius, --radius-sm, --radius-inner, --radius-pill
--font-display, --font-body, --font-mono
--t-fast, --t-base
```

## Tech stack

- React 19, TypeScript, Vite 7
- React Router DOM (client-side routing)
- Custom CSS only (`src/styles/index.css`) — no CSS framework
- Inter + JetBrains Mono via Google Fonts (`index.html`)

## Routes

| Path | Page |
|------|------|
| `/` | Home — landing page |
| `/game` | Game — investigation interface |
| `/how-it-works` | Manual — rules and tips |
| `/stats` | Personal Statistics — dashboard derived from local case history |

## Project structure

```
src/
  components/   # Shared UI components
  helpers/      # Pure derivation helpers (deriveEvidence, caseStats, caseExport, caseImport)
  hooks/        # useGame, useCaseHistory
  pages/        # Route-level pages (Home, Game, HowItWorks, Stats)
  services/     # api.ts (fetch wrapper), guessme.ts (API calls), caseHistoryStorage.ts
  styles/       # index.css (global styles)
  types/        # TypeScript interfaces (guessme.ts, stats.ts, progression.ts)
```

## Agent Rank and Achievements

The `/stats` page includes a **Dossiê do Agente** (Agent Dossier) panel that tracks your progression as an investigator. All progression is calculated locally from your case history — no login, no sync, no server.

### Agent Rank ladder

| Rank | Cases required |
|------|---------------|
| Recruta | 0 |
| Analista | 1 |
| Investigador | 3 |
| Detetive | 7 |
| Arquivista | 15 |
| Mestre do Dossiê | 25 |

Rank advances automatically as you solve more cases. A progress bar shows how many cases remain to reach the next rank.

### Achievements

Achievements are grouped into five categories:

| Category | Achievements |
|----------|-------------|
| **Casos** | Primeiro Caso (1 case), Sequência Inicial (3 cases), Arquivo Robusto (10 cases) |
| **Eficiência** | Investigação Cirúrgica (solve in ≤5 questions), Sem Ajuda (solve without hints), Caçador de Pistas (10 total hints) |
| **Evidências** | Especialista em Confirmações (20 confirmed), Cético Profissional (20 refuted), Teoria Aberta (20 inconclusive) |
| **Categorias** | Multiverso (3 different categories) |
| **Arquivo** | Arquivista Local (5 cases stored) |

Locked achievements show progress bars where applicable. Unlocked achievements receive the Casefile Noir accent treatment (green inset border + stamp).

### How progression is calculated

- Derived entirely from `localStorage` case history — the same data used by the stats dashboard
- Imported cases count toward rank and achievements identically to played cases
- No XP, no leveling algorithms — rank and achievements are pure functions of the history array
- Clearing history resets all progression to Recruta / all locked

### Privacy

**All progression is derived locally from your case history.** Nothing is stored separately. Nothing is sent to a server. No account required.

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

Navigate to `/stats` (Estatísticas link in the navbar) to see a dashboard derived from your local case history. All data is computed in the browser from `localStorage` — no server call is made.

### Metrics displayed

| Section | What it shows |
|---------|---------------|
| Overview cards | Total cases solved, total questions asked, total hints used, average questions per case |
| Verdict distribution | Bar chart of YES / NO / MAYBE / UNKNOWN responses across all cases |
| Evidence collected | Bar chart of confirmed, refuted, inconclusive entries and hints |
| Categories investigated | Bar chart sorted by case count, with avg questions per category |
| Cases of note | "Mais eficiente" (fewest questions) and "Mais longo" (most questions) |
| Recent activity | Last 5 cases sorted by date, with category badge, date, and question count |

### Empty state

When no cases have been solved yet, the dashboard shows an empty state with a direct link to `/game`.

### Privacy

**All statistics are derived entirely in your browser.** No data is collected or transmitted. Clearing `localStorage` removes the history and returns the dashboard to the empty state.

---

## Case Archive Portability

Solved cases can be exported, shared, and imported between browsers — all locally, without any server or login.

### Copy summary

Open a solved case with **Rever caso**, then click **Copiar resumo**. A Markdown-formatted summary is copied to your clipboard, ready to paste into any document or chat.

The summary includes: character name, work, category, question/hint counts, verdict statistics, winning question, and all evidence entries.

### Download JSON

Click **Baixar JSON** in the replay modal. A versioned JSON file is downloaded (schema below). The file can be imported on any other device or browser.

### Import JSON

Click **Importar caso** in the Histórico de Casos panel and select a `.json` file previously exported from GuessMe. The case is validated and added to your history. If the case ID already exists, a new ID is assigned automatically — your existing cases are never silently overwritten.

### Download share card

Click **Baixar card** in the replay modal. An SVG card (520×300 px) is downloaded with the Casefile Noir visual identity — character name, stats, evidence counts, and the CASO ENCERRADO stamp. Open in any browser or SVG viewer.

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

### Privacy

**All export, import, and share operations happen entirely in your browser.** No files are uploaded anywhere. No data is sent to a server. Exported JSON files live only on your local device.

---

## Case History

The game page shows a **Histórico de Casos** section below the investigation interface. Solved investigations are automatically archived locally so the player can review or replay any past case.

### What is stored

Each solved case saves:

- Character name, work, and category
- Full message sequence (question/answer timeline)
- Evidence snapshot (confirmed, refuted, inconclusive entries + hints)
- Verdict statistics (YES / NO / MAYBE counts)
- Winning question and question/hint counts
- Timestamp of when the case was solved

Storage is limited to 25 most recent entries (oldest are dropped when the cap is reached).

### Privacy

**History is stored only in the browser's `localStorage`.** Nothing is sent to a server. Clearing browser data or clicking "Limpar" removes all stored cases.

### How to clear history

Click the **Limpar** button in the Histórico de Casos panel on the `/game` page to remove all archived cases.

### Replay behavior

Each history card has a **Rever caso** button that opens a read-only replay modal showing:

- Solved character name, work, and category
- Winning question (the question that solved the case)
- Verdict statistics summary
- Full question/answer timeline with verdict badge colors (green = Sim, red = Não, amber = Talvez)
- Evidence snapshot (Confirmado / Refutado / Inconclusivo / Inteligência)

The replay modal is keyboard-dismissible (Escape key). It does not call the backend and does not modify the current game session.

### Where it lives

| File | Role |
|------|------|
| `src/types/guessme.ts` | `CaseHistoryEntry`, `CaseEvidence`, `VerdictStats` types |
| `src/services/caseHistoryStorage.ts` | `getCaseHistory`, `saveCaseHistoryEntry`, `deleteCaseHistoryEntry`, `clearCaseHistory` — localStorage adapter with JSON guard and 25-entry cap |
| `src/hooks/useCaseHistory.ts` | `saveOnVictory`, `deleteEntry`, `clearAll` — state and side-effect layer |
| `src/pages/Game.tsx` | Calls `saveOnVictory` on victory with duplicate-save guard |
| `src/components/CaseHistoryPanel.tsx` | List shell, empty state, clear button |
| `src/components/CaseHistoryCard.tsx` | Individual archived case card with stats and actions |
| `src/components/CaseReplayModal.tsx` | Full read-only replay overlay |

## Evidence Notebook

The game page shows a live **Caderno de Evidências** (Evidence Notebook) alongside the investigation chat.

### What it does

- Classifies each AI answer as **Confirmado**, **Refutado**, or **Inconclusivo** using the structured `verdict` field from the backend, with text-prefix fallback for legacy responses
- Pairs each classified answer with the question that preceded it
- Collects **Inteligência** entries from hint messages
- Shows a **Caso Encerrado** summary block when the player wins

### Structured verdict contract

The backend returns a `verdict` field on every `/api/game/ask` response:

| Verdict | Evidence kind | Typical `answer` text |
|---------|--------------|----------------------|
| `YES` | Confirmado | Starts with "Sim" |
| `NO` | Refutado | Starts with "Não" |
| `MAYBE` | Inconclusivo | Starts with "Talvez" |
| `UNKNOWN` | Not classified | Errors, limits, hints, boot messages |

Classification priority:
1. **`message.verdict`** — used when present (structured backend verdict)
2. **Text prefix** — fallback for old/legacy messages without a `verdict` field

Hint responses always carry `verdict: UNKNOWN` and are collected as intel, never as Sim/Não/Talvez evidence.

### Where it lives

| File | Role |
|------|------|
| `src/types/guessme.ts` | `AnswerVerdict` type; `AIResponse.verdict`; `Message.verdict` |
| `src/hooks/useGame.ts` | Propagates `verdict` from API response into each `Message` |
| `src/helpers/deriveEvidence.ts` | `classifyByVerdict()` (primary) + `classifyByText()` (fallback) |
| `src/components/MessageBubble.tsx` | `resolveAnswerState()` — verdict-first, text fallback |
| `src/components/EvidenceNotebook.tsx` | Renders sections, entries, empty state, and solved summary |
| `src/pages/Game.tsx` | Calls `deriveEvidence`, passes verdict to `<MessageBubble>` and `<EvidenceNotebook>` |

### Layout behavior

- **≥ 901 px:** two-column grid — chat (flex) + notebook (272 px fixed) side-by-side; notebook is sticky to the top
- **≤ 900 px:** single column — notebook collapses below the chat

### Limitations

- UNKNOWN verdicts (ambiguous Gemini answers, errors, limits) are not classified and do not appear in the notebook — this is intentional; only YES/NO/MAYBE are evidence.
- Text-prefix fallback works for messages stored in localStorage before the verdict contract was introduced.
- Notebook state is derived from `messages` in memory; it resets on page refresh if localStorage is cleared.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend base URL (baked at build time) | `http://localhost:8080` |

Create `.env.local` for local development:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run lint      # ESLint check
```

## Backend error handling

The frontend classifies backend `answer` strings into four categories:

| Category | Trigger prefix | UI treatment |
|----------|---------------|--------------|
| `game` | (normal AI response) | Chat bubble |
| `stale-session` | `Sessão não encontrada` | Error box + "Novo caso" button |
| `system-error` | `Config inválida`, `Erro da API Gemini`, `Erro inesperado`, `Resposta vazia`, `Resposta inválida`, `Pergunta inválida` | Error box (red) |
| `user-limit` | `Aguarde`, `Limite`, `Pergunta muito longa` | Warning box (amber) |

`user-limit` responses decrement the question counter so the rejected question is not counted.

## Backend session limits

The backend enforces per-session limits. The frontend handles them transparently via `user-limit` warnings:

- **Cooldown:** 3 s between requests (ask and hint share the timer)
- **Max questions:** 50 per session
- **Max hints:** 10 per session
- **Max question length:** 300 characters (also enforced in UI with counter)
- **Session TTL:** 60 minutes of inactivity

## E2E tests

Playwright 1.61 covers **244 tests** across nine spec files. All API calls are intercepted with `page.route()` — no backend required. History, stats, and progression tests use `localStorage` seeding via `addInitScript`.

### Setup

```bash
npx playwright install --with-deps chromium   # one-time
npm run e2e           # headless run (starts Vite dev server automatically)
npm run e2e:ui        # interactive UI mode
npm run e2e:report    # open last HTML report
```

### Coverage

| Spec | What it covers |
|------|----------------|
| `routes.spec.ts` | Home, HowItWorks, Game render; navigation links; SPA direct URL access; unknown route redirect |
| `game-flow.spec.ts` | Boot; category select; question input (empty, overlong, Enter, clear); Sim/Não/Talvez answer bubbles; hint flow; victory modal |
| `error-states.spec.ts` | Backend unavailable; cooldown; max questions; max hints; stale session; Gemini system error |
| `mobile.spec.ts` | Overflow-free layout at 390 px and 360 px; key controls visible on mobile |
| `notebook.spec.ts` | Notebook presence; empty state; confirmed/refuted/inconclusive entries; intel hints; solved summary; verdict-based YES/NO/MAYBE classification; legacy text fallback; mobile overflow |
| `history.spec.ts` | History empty state; seeded cards (name/work/counts); victory saves case; duplicate-save prevention; reload persistence; replay modal (timeline, verdict badges, evidence snapshot, winning question, keyboard/button close); delete one case; clear all; corrupted storage fallback; game flow not broken; mobile layout at 390 px |
| `portability.spec.ts` | Replay export buttons visible/keyboard reachable; copy summary (clipboard, text content); JSON download (filename, schemaVersion, fields); SVG share card (filename, CASO ENCERRADO, branding); import valid JSON (wrapped + bare, card appears, replay works, localStorage persistence); import invalid JSON (parse error, missing fields, no card); duplicate import prevention (renamed message, two cards); mobile 390 px and 360 px (no overflow) |
| `stats.spec.ts` | Empty state (route, message, CTA, no dashboard); single case totals (cases/questions/hints/avg); multiple cases (totals, verdict panel, category bars, evidence panel, ranking cards — best and longest, recent activity list); navigation (Estatísticas link, active state, existing routes unaffected); import compatibility (missing fields, zero questions, corrupted storage); mobile 390 px and 360 px (no overflow) |
| `progression.spec.ts` | Empty state (Recruta rank, all locked, progress bar 0/1); single case (Analista, Primeiro Caso unlocked); efficiency achievements (Cirúrgica, Sem Ajuda, per-condition); category achievement (Multiverso 3-category unlock); rank ladder (Investigador, Detetive, Mestre); max rank (no progress bar, maxed label); imported cases count; mobile 390 px and 360 px (no overflow) |

### Troubleshooting

- **Port 5173 already in use:** the `webServer` reuses an existing server in non-CI runs; otherwise kill the process and retry.
- **Flaky on slow CI:** each test has Playwright's default 5 s per assertion; increase via `expect.timeout` in `playwright.config.ts` if needed.

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

### Mobile (≤ 640 px)
- [ ] Chat area is readable without scrolling past the input row
- [ ] Category dropdown does not overflow the screen
- [ ] Header stacks vertically on narrow screens
- [ ] History panel and cards render without horizontal overflow on 390 px
- [ ] Export buttons in replay modal are visible and usable on 390 px without overflow
- [ ] Import button in history panel is visible and usable on 390 px
