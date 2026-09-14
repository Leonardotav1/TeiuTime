import { DotMatrix } from './DotMatrix'
import { Switch } from './Switch'

export function AlarmPanel({
  alarmTime,
  alarmEnabled,
  setAlarmTime,
  setAlarmEnabled,
}: {
  alarmTime: string
  alarmEnabled: boolean
  setAlarmTime: (t: string) => void
  setAlarmEnabled: (v: boolean) => void
}) {
  return (
    <section className="panel alarm">
      <div className="face">
        <div className="alarm-zone">
          <DotMatrix text={alarmTime} className="dm-med" />
          <div className={`sun${alarmEnabled ? ' on' : ''}`} aria-hidden="true">
            <span>🌅</span>
          </div>
        </div>
      </div>

      <div className="ctrls">
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.currentTarget.value)}
          aria-label="horário"
        />
        <Switch alt="ativar alarme" checked={alarmEnabled} onChange={setAlarmEnabled} />
      </div>
    </section>
  )
}