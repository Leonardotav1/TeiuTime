import { pad } from '../hooks/useTeiuTime'
import { EmojiButton } from './EmojiButton'
import { MainDisplay } from './MainDisplay'

const SWATCHES = [
  { h: 190, t: 'Ciano' },
  { h: 150, t: 'Verde' },
  { h: 205, t: 'Azul' },
  { h: 40, t: 'Âmbar' },
  { h: 15, t: 'Laranja' },
  { h: 0, t: 'Vermelho' },
  { h: 280, t: 'Violeta' },
  { h: 320, t: 'Rosa' },
]

const fmtDate = (d: Date) => {
  const raw = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export function ClockPanel({
  now,
  secondsOn,
  hexMode,
  hue,
  onToggleSeconds,
  onToggleHex,
  setHue,
}: {
  now: number
  secondsOn: boolean
  hexMode: boolean
  hue: number
  onToggleSeconds: () => void
  onToggleHex: () => void
  setHue: (h: number) => void
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
          <span className="meridian-emoji" title={h24 < 12 ? 'Dia' : 'Noite'} aria-hidden="true">
            {h24 < 12 ? '🌞' : '🌙'}
          </span>
        </div>
        <div className="date">{fmtDate(d)}</div>
      </div>

      <div className="dock">
        <EmojiButton
          glyph="⚡"
          alt="mostrar segundos"
          title="Segundos"
          active={secondsOn}
          pulse={secondsOn}
          onClick={onToggleSeconds}
        />
        <EmojiButton
          glyph={hexMode ? '🌕' : '🌗'}
          alt="formato do dia"
          title={hexMode ? 'Formato 24 horas' : 'Formato 12 horas'}
          onClick={onToggleHex}
        />
        <div className="swatches" role="group" aria-label="cor de destaque">
          {SWATCHES.map((s) => (
            <button
              key={s.h}
              type="button"
              title={s.t}
              className={`swatch${hue === s.h ? ' sel' : ''}`}
              style={{ background: `hsl(${s.h} 85% 55%)` }}
              onClick={() => setHue(s.h)}
              aria-label={s.t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}