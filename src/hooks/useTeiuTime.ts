import { useEffect, useRef, useState } from 'react'
import { ringLoop, stopRing } from '../lib/sound'

export type Tab = 'clock' | 'alarm' | 'stopwatch' | 'timer'
export type SwState = 'idle' | 'run' | 'pause'
export type TimerState = 'idle' | 'run' | 'pause' | 'done'

export function pad(n: number, w = 2): string {
  return String(n).padStart(w, '0')
}

export function fmtStopwatch(ms: number): string {
  const tenth = Math.floor(Math.max(0, ms) / 100) % 10
  const sec = Math.floor(Math.max(0, ms) / 1000) % 60
  const min = Math.floor(Math.max(0, ms) / 60000)
  return `${pad(min)}:${pad(sec)}.${tenth}`
}

export interface Alarm {
  id: number
  time: string
  enabled: boolean
}

export interface TeiuTime {
  now: number
  tab: Tab
  setTab: (t: Tab) => void
  secondsOn: boolean
  toggleSeconds: () => void
  hexMode: boolean
  setHexMode: (v: boolean) => void
  alarms: Alarm[]
  addAlarm: () => void
  updateAlarm: (id: number, patch: Partial<Pick<Alarm, 'time' | 'enabled'>>) => void
  removeAlarm: (id: number) => void
  alarmFiring: boolean
  dismissAlarm: () => void
  sw: SwState
  elapsed: number
  laps: number[]
  toggleSw: () => void
  addLap: () => void
  resetSw: () => void
  timer: TimerState
  timerDur: number
  remaining: number
  changeTimerDur: (sec: number) => void
  toggleTimer: () => void
  resetTimer: () => void
  timerFiring: boolean
  dismissTimer: () => void
}

const dayOf = (t: number) => {
  const d = new Date(t)
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

const nowTime = () => {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function useTeiuTime(): TeiuTime {
  const [now, setNow] = useState(() => Date.now())
  const [tab, setTab] = useState<Tab>('clock')
  const [secondsOn, setSecondsOn] = useState(false)
  const [hexMode, setHexMode] = useState(true)

  const [alarms, setAlarms] = useState<Alarm[]>(() => [{ id: 1, time: nowTime(), enabled: false }])
  const [alarmFiring, setAlarmFiring] = useState(false)
  const [firingId, setFiringId] = useState<number | null>(null)

  const [sw, setSw] = useState<SwState>('idle')
  const [swBase, setSwBase] = useState(0)
  const [swSince, setSwSince] = useState(0)
  const [laps, setLaps] = useState<number[]>([])

  const [timerDur, setTimerDur] = useState(300)
  const [timer, setTimer] = useState<TimerState>('idle')
  const [timerEnd, setTimerEnd] = useState(0)
  const [timerBase, setTimerBase] = useState(300_000)
  const [timerFiring, setTimerFiring] = useState(false)

  const alarmsRef = useRef(alarms)
  const alarmFiringRef = useRef(alarmFiring)
  const firingIdRef = useRef(firingId)
  const firedRef = useRef<Record<number, string>>({})
  const armedRef = useRef<Record<number, { day: number; min: number }>>({})
  const nextAlarmIdRef = useRef(2)
  const timerRef = useRef(timer)
  const timerEndRef = useRef(timerEnd)
  const timerFiringRef = useRef(timerFiring)

  useEffect(() => {
    alarmsRef.current = alarms
  }, [alarms])
  useEffect(() => {
    alarmFiringRef.current = alarmFiring
  }, [alarmFiring])
  useEffect(() => {
    firingIdRef.current = firingId
  }, [firingId])
  useEffect(() => {
    timerRef.current = timer
  }, [timer])

  useEffect(() => {
    const t = Date.now()
    const d = new Date(t)
    const day = dayOf(t)
    const curMin = d.getHours() * 60 + d.getMinutes()
    const nextArmed: Record<number, { day: number; min: number }> = {}
    const nextFired: Record<number, string> = {}
    for (const a of alarms) {
      if (!a.enabled) continue
      const prev = armedRef.current[a.id]
      nextArmed[a.id] = prev && prev.day === day ? prev : { day, min: curMin }
      const pf = firedRef.current[a.id]
      if (pf && pf.startsWith(`${day}:`)) nextFired[a.id] = pf
    }
    armedRef.current = nextArmed
    firedRef.current = nextFired
  }, [alarms])
  useEffect(() => {
    timerEndRef.current = timerEnd
  }, [timerEnd])
  useEffect(() => {
    timerFiringRef.current = timerFiring
  }, [timerFiring])

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)

      const d = new Date(t)
      const curMin = d.getHours() * 60 + d.getMinutes()
      const day = dayOf(t)
      if (!alarmFiringRef.current) {
        for (const a of alarmsRef.current) {
          if (!a.enabled) continue
          const m = a.time.match(/(\d{1,2}):(\d{1,2})/)
          if (!m) continue
          const alarmMin = +m[1] * 60 + +m[2]
          const key = `${day}:${a.time}`
          if (firedRef.current[a.id] === key) continue
          const armed = armedRef.current[a.id]
          if (!armed) continue
          const armedBefore = armed.day < day || (armed.day === day && armed.min < alarmMin)
          if (alarmMin >= 0 && armedBefore && curMin >= alarmMin) {
            firedRef.current[a.id] = key
            setFiringId(a.id)
            setAlarmFiring(true)
            ringLoop(880)
            break
          }
        }
      }

      if (timerRef.current === 'run' && t >= timerEndRef.current && !timerFiringRef.current) {
        setTimer('done')
        setTimerFiring(true)
        ringLoop(660)
      }
    }, 200)
    return () => clearInterval(id)
  }, [])

  const elapsed = sw === 'run' ? swBase + (now - swSince) : swBase
  const remaining = timer === 'run' ? Math.max(0, timerEnd - now) : timerBase

  const toggleSw = () => {
    if (sw === 'run') {
      setSwBase(swBase + (now - swSince))
      setSw('pause')
    } else if (sw === 'idle' || sw === 'pause') {
      setSwSince(now)
      setSw('run')
    }
  }

  const addLap = () => {
    if (sw === 'idle' || elapsed <= 0) return
    setLaps((l) => [...l, elapsed])
  }

  const resetSw = () => {
    setSw('idle')
    setSwBase(0)
    setSwSince(0)
    setLaps([])
  }

  const changeTimerDur = (sec: number) => {
    const v = Math.min(Math.max(1, sec), 23 * 3600)
    setTimerDur(v)
    if (timer === 'idle') setTimerBase(v * 1000)
  }

  const toggleTimer = () => {
    if (timer === 'run') {
      setTimerBase(Math.max(0, timerEnd - now))
      setTimer('pause')
    } else {
      const base = timer === 'pause' ? timerBase : timerDur * 1000
      setTimerEnd(now + base)
      setTimer('run')
    }
  }

  const resetTimer = () => {
    stopRing()
    setTimer('idle')
    setTimerEnd(0)
    setTimerBase(timerDur * 1000)
    setTimerFiring(false)
  }

  const addAlarm = () => {
    const id = nextAlarmIdRef.current++
    setAlarms((list) => [...list, { id, time: nowTime(), enabled: false }])
  }

  const updateAlarm = (id: number, patch: Partial<Pick<Alarm, 'time' | 'enabled'>>) => {
    setAlarms((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  const removeAlarm = (id: number) => {
    if (firingIdRef.current === id) {
      stopRing()
      setAlarmFiring(false)
      setFiringId(null)
    }
    delete firedRef.current[id]
    delete armedRef.current[id]
    setAlarms((list) => list.filter((a) => a.id !== id))
  }

  return {
    now,
    tab,
    setTab,
    secondsOn,
    toggleSeconds: () => setSecondsOn((s) => !s),
    hexMode,
    setHexMode,
    alarms,
    addAlarm,
    updateAlarm,
    removeAlarm,
    alarmFiring,
    dismissAlarm: () => {
      stopRing()
      setAlarmFiring(false)
      const id = firingIdRef.current
      if (id !== null) {
        setAlarms((list) => list.map((a) => (a.id === id ? { ...a, enabled: false } : a)))
        setFiringId(null)
      }
    },
    sw,
    elapsed,
    laps,
    toggleSw,
    addLap,
    resetSw,
    timer,
    timerDur,
    remaining,
    changeTimerDur,
    toggleTimer,
    resetTimer,
    timerFiring,
    dismissTimer: resetTimer,
  }
}