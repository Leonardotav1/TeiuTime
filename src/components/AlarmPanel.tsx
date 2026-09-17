import { Lightbulb, LightbulbOff, List } from 'lucide-react'
import { GiSkullCrossedBones } from 'react-icons/gi'
import type { Alarm } from '../hooks/useTeiuTime'
import { DotMatrix } from './DotMatrix'
import { IconButton } from './IconButton'

export function AlarmPanel({
  alarms,
  addAlarm,
  updateAlarm,
  removeAlarm,
}: {
  alarms: Alarm[]
  addAlarm: () => void
  updateAlarm: (id: number, patch: Partial<Pick<Alarm, 'time' | 'enabled'>>) => void
  removeAlarm: (id: number) => void
}) {
  return (
    <section className="panel alarm">
      <div className="alarm-list">
        {alarms.map((a) => (
          <div key={a.id} className={`alarm-item${a.enabled ? ' on' : ''}`}>
            <DotMatrix text={a.time} className="dm-med" dim={!a.enabled} />
            <div className="alarm-controls">
              <input
                type="time"
                value={a.time}
                onChange={(e) => updateAlarm(a.id, { time: e.currentTarget.value })}
                aria-label="horário"
              />
              <IconButton
                icon={a.enabled ? <Lightbulb /> : <LightbulbOff />}
                alt={a.enabled ? 'desligar alarme' : 'ligar alarme'}
                className="bulb"
                active={a.enabled}
                onClick={() => updateAlarm(a.id, { enabled: !a.enabled })}
              />
              <IconButton
                icon={<GiSkullCrossedBones />}
                alt="remover alarme"
                onClick={() => removeAlarm(a.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="alarm-add" onClick={addAlarm} aria-label="adicionar alarme">
        <List aria-hidden="true" />
      </button>
    </section>
  )
}
