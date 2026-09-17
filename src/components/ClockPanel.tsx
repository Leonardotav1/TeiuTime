import { Microscope, Moon, Sun } from 'lucide-react'
import { GiRooster, GiVampireDracula } from 'react-icons/gi'
import { pad } from '../hooks/useTeiuTime'
import { IconButton } from './IconButton'
import { MainDisplay } from './MainDisplay'

const fmtDate = (d: Date) => {
  const raw = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export function ClockPanel({
  now,
  secondsOn,
  hexMode,
  onToggleSeconds,
  onToggleHex,
}: {
  now: number
  secondsOn: boolean
  hexMode: boolean
  onToggleSeconds: () => void
  onToggleHex: () => void
}) {
  const d = new Date(now)
  const h24 = d.getHours()
  const hour = hexMode ? pad(h24) : pad((h24 + 11) % 12 + 1)
  const text = `${hour}:${pad(d.getMinutes())}${secondsOn ? `:${pad(d.getSeconds())}` : ''}`

  return (
    <section className="panel clock">
      <div className="face">
        <div className="time-flex">
          <MainDisplay text={text} blink={Math.floor(now / 1000) % 2 === 0} />
          <span className="meridian" aria-hidden="true">
            {h24 < 12 ? <Sun /> : <Moon />}
          </span>
        </div>
        <div className="date">{fmtDate(d)}</div>
      </div>

      <div className="dock">
        <IconButton
          icon={<Microscope />}
          alt="mostrar segundos"
          active={secondsOn}
          pulse={secondsOn}
          onClick={onToggleSeconds}
        />
        <IconButton
          icon={hexMode ? <GiVampireDracula /> : <GiRooster />}
          alt="formato do dia"
          onClick={onToggleHex}
        />
      </div>
    </section>
  )
}
