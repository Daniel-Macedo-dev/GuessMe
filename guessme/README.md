# GuessMe — Frontend

React + TypeScript + Vite frontend for the [GuessMe](https://github.com/Daniel-Macedo-dev/guessme-api) guessing game.

## Tech stack

- React 19, TypeScript, Vite 6
- React Router DOM (client-side routing)
- Custom CSS only (`src/styles/index.css`) — no CSS framework

## Routes

| Path | Page |
|------|------|
| `/` | Home — landing page |
| `/game` | Game — investigation interface |
| `/how-it-works` | Manual — rules and tips |

## Project structure

```
src/
  components/   # Shared UI components
  helpers/      # Pure derivation helpers (deriveEvidence)
  hooks/        # useGame — all game state logic
  pages/        # Route-level pages
  services/     # api.ts (fetch wrapper), guessme.ts (API calls)
  styles/       # index.css (global styles)
  types/        # TypeScript interfaces
```

## Evidence Notebook

The game page shows a live **Caderno de Evidências** (Evidence Notebook) alongside the investigation chat.

### What it does

- Classifies each AI answer as **Confirmado** (starts with "Sim"), **Refutado** (starts with "Não"), or **Inconclusivo** (starts with "Talvez")
- Pairs each classified answer with the question that preceded it
- Collects **Inteligência** entries from hint messages
- Shows a **Caso Encerrado** summary block when the player wins

### Where it lives

| File | Role |
|------|------|
| `src/helpers/deriveEvidence.ts` | Pure function — takes `Message[]` + `WinnerData`, returns structured `Evidence` |
| `src/components/EvidenceNotebook.tsx` | Renders sections, entries, empty state, and solved summary |
| `src/pages/Game.tsx` | Calls `deriveEvidence`, passes result to `<EvidenceNotebook>` |

### Layout behavior

- **≥ 901 px:** two-column grid — chat (flex) + notebook (272 px fixed) side-by-side; notebook is sticky to the top
- **≤ 900 px:** single column — notebook collapses below the chat

### Limitations

- Classification relies on the AI answer starting with "Sim", "Não", or "Talvez". If Gemini returns a multi-sentence answer where the verdict is not the first word, it will not be classified.
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

Playwright 1.61 covers 93 tests across five spec files. All API calls are intercepted with `page.route()` — no backend required.

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
| `notebook.spec.ts` | Notebook presence; empty state; confirmed/refuted/inconclusive entries; intel hints; solved summary; mobile overflow |

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

### Mobile (≤ 640 px)
- [ ] Chat area is readable without scrolling past the input row
- [ ] Category dropdown does not overflow the screen
- [ ] Header stacks vertically on narrow screens
