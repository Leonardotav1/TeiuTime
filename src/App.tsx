import { useEffect } from 'react'
import { useTeiuTime } from './hooks/useTeiuTime'
import { AlarmPanel } from './components/AlarmPanel'
import { ClockPanel } from './components/ClockPanel'
import { DotMatrix } from './components/DotMatrix'
import { EmojiButton } from './components/EmojiButton'
import { StopwatchPanel } from './components/StopwatchPanel'
import { Tabs } from './components/Tabs'
import { TimerPanel } from './components/TimerPanel'

export default function App() {
  const t = useTeiuTime()

  useEffect(() => {
    document.documentElement.style.setProperty('--hue', String(t.hue))
  }, [t.hue])

  const d = new Date(t.now)
  const mini = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  const overlay = t.timerFiring || t.alarmFiring

  return (
    <div className="app">
      <header className="appbar">
        <span className="brand">TeiuTime</span>
        <span className="mini-clock">
          <DotMatrix text={mini} className="dm-mini" />
        </span>
      </header>

      <div className="shell">
        <Tabs active={t.tab} onSelect={t.setTab} />

        <main className="panelwrap">
          {t.tab === 'clock' && (
            <ClockPanel
              now={t.now}
              secondsOn={t.secondsOn}
              hexMode={t.hexMode}
              hue={t.hue}
              onToggleSeconds={t.toggleSeconds}
              onToggleHex={() => t.setHexMode(!t.hexMode)}
              setHue={t.setHue}
            />
          )}
          {t.tab === 'alarm' && (
            <AlarmPanel
              alarmTime={t.alarmTime}
              alarmEnabled={t.alarmEnabled}
              setAlarmTime={t.setAlarmTime}
              setAlarmEnabled={t.setAlarmEnabled}
            />
          )}
          {t.tab === 'stopwatch' && (
            <StopwatchPanel
              sw={t.sw}
              elapsed={t.elapsed}
              laps={t.laps}
              onToggle={t.toggleSw}
              onLap={t.addLap}
              onReset={t.resetSw}
            />
          )}
          {t.tab === 'timer' && (
            <TimerPanel
              timer={t.timer}
              timerDur={t.timerDur}
              remaining={t.remaining}
              onChangeDur={t.changeTimerDur}
              onToggle={t.toggleTimer}
              onReset={t.resetTimer}
            />
          )}
        </main>
      </div>

      {overlay && (
        <div className="overlay">
          <div className="overlay-box">
            <div className="overlay-emoji" aria-hidden="true">
              {t.timerFiring ? '🍳' : '🌅'}
            </div>
            <EmojiButton
              glyph="✋"
              alt="parar"
              big
              onClick={() => (t.timerFiring ? t.dismissTimer() : t.dismissAlarm())}
            />
          </div>
        </div>
      )}
    </div>
  )
}