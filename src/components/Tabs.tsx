import type { Tab } from '../hooks/useTeiuTime'

const TABS: { k: Tab; e: string; alt: string }[] = [
  { k: 'clock', e: '✨', alt: 'Hora atual' },
  { k: 'alarm', e: '🌅', alt: 'Alarme' },
  { k: 'stopwatch', e: '🏃', alt: 'Cronômetro' },
  { k: 'timer', e: '🍳', alt: 'Temporizador' },
]

export function Tabs({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav className="tabs" aria-label="Seções">
      {TABS.map((t) => (
        <button
          key={t.k}
          className={`tab${active === t.k ? ' active' : ''}`}
          onClick={() => onSelect(t.k)}
          aria-label={t.alt}
        >
          <span className="tab-emoji" aria-hidden="true">
            {t.e}
          </span>
        </button>
      ))}
    </nav>
  )
}