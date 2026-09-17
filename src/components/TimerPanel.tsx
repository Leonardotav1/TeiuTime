import { useState } from 'react'
import { ArrowDown, ArrowUp, Hand } from 'lucide-react'
import { GiPistolGun, GiSkullCrossedBones } from 'react-icons/gi'
import { pad } from '../hooks/useTeiuTime'
import { DotMatrix } from './DotMatrix'
import { IconButton } from './IconButton'

const CIRC = 2 * Math.PI * 48

const fmtDur = (sec: number) => `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`

const parseDur = (v: string): number => {
  const p = v.trim().split(/[: ]+/)
  if (!p.length) return NaN
  if (p.length === 1) {
    const m = parseInt(p[0], 10)
    return isNaN(m) || m < 0 ? NaN : m * 60
  }
  const m = parseInt(p[0], 10)
  const s = parseInt(p[1], 10)
  return isNaN(m) || isNaN(s) || m < 0 || s < 0 ? NaN : m * 60 + s
}

export function TimerPanel({
  timer,
  timerDur,
  remaining,
  onChangeDur,
  onToggle,
  onReset,
}: {
  timer: 'idle' | 'run' | 'pause' | 'done'
  timerDur: number
  remaining: number
  onChangeDur: (sec: number) => void
  onToggle: () => void
  onReset: () => void
}) {
  const running = timer === 'run'
  const [editing, setEditing] = useState<string | null>(null)
  const frac = Math.max(0, Math.min(1, remaining / (timerDur * 1000)))
  const mins = Math.floor(Math.max(0, Math.round(remaining / 1000)) / 60)
  const secs = Math.round(remaining / 1000) % 60

  return (
    <section className="panel timer">
      <div className="ring-wrap">
        <svg viewBox="0 0 120 120" className="ring">
          <circle className="ring-bg" cx="60" cy="60" r="48" />
          <circle
            className="ring-fg"
            cx="60"
            cy="60"
            r="48"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - frac)}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="ring-time">
          <DotMatrix text={`${pad(mins)}:${pad(secs)}`} className="dm-mini" />
        </div>
      </div>

      {timer === 'idle' && (
        <div className="set-row">
          <button type="button" className="step" onClick={() => onChangeDur(timerDur - 60)} aria-label="diminuir">
            <ArrowDown aria-hidden="true" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className="time-entry"
            value={editing ?? fmtDur(timerDur)}
            onFocus={() => setEditing(fmtDur(timerDur))}
            onChange={(e) => {
              setEditing(e.currentTarget.value)
              const sec = parseDur(e.currentTarget.value)
              if (Number.isFinite(sec) && sec > 0) onChangeDur(sec)
            }}
            onBlur={() => setEditing(null)}
            aria-label="tempo"
          />
          <button type="button" className="step" onClick={() => onChangeDur(timerDur + 60)} aria-label="aumentar">
            <ArrowUp aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="actions">
        {running || timer === 'pause' ? (
          <>
            <IconButton icon={<GiSkullCrossedBones />} alt="recomeçar" onClick={onReset} />
            <IconButton
              icon={running ? <Hand /> : <GiPistolGun />}
              alt={running ? 'pausar' : 'retomar'}
              big
              pulse={running}
              onClick={onToggle}
            />
          </>
        ) : (
          <IconButton icon={<GiPistolGun />} alt="iniciar" big onClick={onToggle} />
        )}
      </div>
    </section>
  )
}
