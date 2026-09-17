import { Hand } from 'lucide-react'
import { GiCheckeredFlag, GiFishingPole, GiPistolGun } from 'react-icons/gi'
import { fmtStopwatch } from '../hooks/useTeiuTime'
import { DotMatrix } from './DotMatrix'
import { IconButton } from './IconButton'

export function StopwatchPanel({
  sw,
  elapsed,
  laps,
  onToggle,
  onLap,
  onReset,
}: {
  sw: 'idle' | 'run' | 'pause'
  elapsed: number
  laps: number[]
  onToggle: () => void
  onLap: () => void
  onReset: () => void
}) {
  const running = sw === 'run'
  return (
    <section className="panel sw">
      <div className="face">
        <DotMatrix text={fmtStopwatch(elapsed)} className="dm-med" />
      </div>

      <div className="laps">
        {laps.length === 0 && <div className="lap empty" aria-hidden="true" />}
        {laps
          .slice()
          .reverse()
          .map((l, i) => (
            <div key={laps.length - 1 - i} className="lap">
              <DotMatrix text={fmtStopwatch(l)} className="dm-lap" />
            </div>
          ))}
      </div>

      <div className="actions">
        <IconButton icon={<GiCheckeredFlag />} alt="recomeçar" disabled={sw === 'idle'} onClick={onReset} />
        <IconButton
          icon={running ? <Hand /> : <GiPistolGun />}
          alt={running ? 'pausar' : 'iniciar'}
          big
          pulse={running}
          onClick={onToggle}
        />
        <IconButton icon={<GiFishingPole />} alt="marcar volta" disabled={sw === 'idle'} onClick={onLap} />
      </div>
    </section>
  )
}
