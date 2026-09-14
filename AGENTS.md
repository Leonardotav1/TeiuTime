# AGENTS.md

## Stack

- Vite + React 18 + TypeScript single-page app (`src/`).
- No backend, no runtime network requests. `base: './'` in `vite.config.ts` — `dist/` runs offline and from `file://`.
- No test runner, linter, or formatter configured. The only verification command is `npm run build` (`tsc --noEmit && vite build`). Update this file when tooling is added.

## Commands

- `npm run dev` / `npm run preview` — dev / built preview.
- `npm run build` — typecheck then build into `dist/`.

## App notes

- State and all timers (clock tick, alarm check, stopwatch, countdown) live in `src/hooks/useTeiuTime.ts`; tab composition in `src/App.tsx`.
- One panel per tab under `src/components/` (ClockPanel, AlarmPanel, StopwatchPanel, TimerPanel); shared bits are `EmojiButton`, `Switch`, `Tabs`, `MainDisplay`.
- Digits are dot-matrix SVG (`src/components/DotMatrix.tsx`); only `0-9 : . A M P` have glyphs.
- **Product requirement: controls are text-free and non-obvious** — buttons use emojis/symbols that suggest the action (e.g. cronômetro = 🏃, pausar = ❄️, marcar volta = 📍). Visible text is only data (time, date) and the brand. No labels under controls.
- Layout is responsive: bottom tab bar on mobile, left sidebar (with Clock/Alarm in two panes) on desktop — handled in `src/styles.css` via `@media (min-width: 900px)`.
- Sounds are synthesized with the Web Audio API (`src/lib/sound.ts`) — no audio assets.
- Palettes are driven by a single CSS custom property `--hue` (set on `<html>`); `ClockPanel` swatches rewrite it.

## Git

- `origin` default branch is `main`, but local work happens on branch `devlopment` (a typo'd branch diverged from `main`). Check `git status` rather than assuming.