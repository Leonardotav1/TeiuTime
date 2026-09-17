import { Bomb, DoorClosed, Music } from 'lucide-react'
import { GiRun } from 'react-icons/gi'
import type { ReactNode } from 'react'
import type { Tab } from '../hooks/useTeiuTime'

const TABS: { k: Tab; icon: ReactNode; alt: string }[] = [
  { k: 'clock', icon: <DoorClosed />, alt: 'Hora atual' },
  { k: 'alarm', icon: <Music />, alt: 'Alarme' },
  { k: 'stopwatch', icon: <GiRun />, alt: 'Cronômetro' },
  { k: 'timer', icon: <Bomb />, alt: 'Temporizador' },
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
          <span className="tab-icon" aria-hidden="true">
            {t.icon}
          </span>
        </button>
      ))}
    </nav>
  )
}
