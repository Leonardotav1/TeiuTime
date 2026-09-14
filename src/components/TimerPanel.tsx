import { pad } from '../hooks/useTeiuTime'
import { DotMatrix } from './DotMatrix'
import { EmojiButton } from './EmojiButton'

const CIRC = 2 * Math.PI * 48

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
  const frac = Math.max(0, Math.min(1, remaining / (timerDur * 1000)))
  const mins = Math.floor(Math.max(0, Math.round(remaining / 1000)) / 60)
  const secs = Math.round(remaining / 1000) % 60
  const setMins = Math.floor(timerDur / 60)

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
            <span aria-hidden="true">−</span>
          </button>
          <div className="set-val">
            <DotMatrix text={`${pad(setMins)}:00`} className="dm-mini" />
          </div>
          <button type="button" className="step" onClick={() => onChangeDur(timerDur + 60)} aria-label="aumentar">
            <span aria-hidden="true">+</span>
          </button>
        </div>
      )}

      <div className="actions">
        {running || timer === 'pause' ? (
          <>
            <EmojiButton glyph="♻️" alt="recomeçar" onClick={onReset} />
            <EmojiButton
              glyph={running ? '❄️' : '🚀'}
              alt={running ? 'pausar' : 'retomar'}
              big
              pulse={running}
              onClick={onToggle}
            />
          </>
        ) : (
          <EmojiButton glyph="🚀" alt="iniciar" big onClick={onToggle} />
        )}
      </div>
    </section>
  )
}