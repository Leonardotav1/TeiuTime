# TeiuTime

A digital clock web app for **desktop and mobile** (responsive). Controls are deliberately
**text-free and non-obvious**: each button uses an emoji that *suggests* its action without
being its literal icon. Responsive, offline-first — no backend, no runtime network requests.

## Run

```bash
npm install
npm run dev     # dev server
npm run build   # typecheck + build into dist/
npm run preview # serve the built dist/
```

`dist/` uses relative asset paths (`base: './'`), so it runs offline and even from `file://`.

## Layout

- **Mobile**: bottom tab bar. **Desktop**: icons move to a left sidebar; the Clock and Alarm
  panels spread into two panes.

## Features (tabular navigation by emoji)

| Emoji | Tab | What it does |
| --- | --- | --- |
| ✨ | Relógio | current time (dot-matrix). Toggles: ⚡ seconds · 🌕/🌗 24h/12h · color swatches |
| 🌅 | Alarme | set a time (🌅 pulses when armed); fires full-screen with a beep until ✋ |
| 🏃 | Cronômetro | start/pause 🚀/❄️, lap 📍, reset ♻️ |
| 🍳 | Temporizador | ± to set minutes, draining ring; fires with 🍳 until ✋ |

Sounds use the Web Audio API (no audio files, works offline).

## Stack

Vite + React 18 + TypeScript. Digits are dot-matrix SVG (`src/components/DotMatrix.tsx`).
All state and ticking live in `src/hooks/useTeiuTime.ts`; each tab is a panel under
`src/components/`, shared bits are `EmojiButton`, `Switch`, `Tabs`, `MainDisplay`.