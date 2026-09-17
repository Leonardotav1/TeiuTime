# AGENTS.md

## Stack

- Vite + React 18 + TypeScript single-page app (`src/`).
- No backend, no runtime network requests. `base: './'` in `vite.config.ts` — `dist/` runs offline and from `file://`.
- No test runner, linter, or formatter configured. The only verification command is `npm run build` (`tsc --noEmit && vite build`). Update this file when tooling is added.

## Commands

- `npm run dev` / `npm run preview` — dev / built preview.
- `npm run build` — typecheck then build into `dist/`.

## App notes

- State and all timers (clock tick, alarm check, stopwatch, countdown) live in `src/hooks/useTeiuTime.ts`; tab composition in `src/App.tsx`. Alarms are a user-managed list (`{ id, time, enabled }`); only one rings at a time.
- One panel per tab under `src/components/` (ClockPanel, AlarmPanel, StopwatchPanel, TimerPanel); shared bits are `IconButton`, `Tabs`, `MainDisplay`.
- Digits are dot-matrix SVG (`src/components/DotMatrix.tsx`); only `0-9 : . A M P` have glyphs.
- Icons come from `lucide-react` (SVG, `currentColor`); sizing/stroke is set in CSS (`.tab-icon svg`, `.act svg`, `.step svg`, `.alarm-add svg`), not via props. `IconButton` wraps a Lucide node + `aria-label`. Fantasy glyphs not in Lucide (corredor, pistola, vara de pesca, bandeira quadriculada, caveira com ossos) come from `react-icons/gi` (Game Icons, filled `currentColor`). The alarm on/off is an animated bulb (`.bulb`), and the alarm time input's picker indicator is a CSS mask (`--note-icon`).
- **Product requirement: controls are text-free and non-obvious** — buttons use icons that suggest the action (e.g. cronômetro = timer, pausar = pause, marcar volta = flag). Visible text is only data (time, date) and the brand. No labels or hover tooltips on controls. Keep `aria-label` for accessibility.
- Layout is responsive: bottom tab bar on mobile, left sidebar (with Clock/Alarm in two panes) on desktop — handled in `src/styles.css` via `@media (min-width: 900px)`.
- Sounds are synthesized with the Web Audio API (`src/lib/sound.ts`) — no audio assets.
- The UI is themed by a single fixed CSS custom property `--hue` (green, `150`, hardcoded in `src/styles.css`); there are no color-picker controls.

## Git

- `origin` default branch is `main`, but local work happens on branch `devlopment` (a typo'd branch diverged from `main`). Check `git status` rather than assuming.