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

export interface TeiuTime {
  now: number
  tab: Tab
  setTab: (t: Tab) => void
  hue: number
  setHue: (h: number) => void
  secondsOn: boolean
  toggleSeconds: () => void
  hexMode: boolean
  setHexMode: (v: boolean) => void
  alarmTime: string
  setAlarmTime: (t: string) => void
  alarmEnabled: boolean
  setAlarmEnabled: (v: boolean) => void
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

const dayOf = (t: number) => new Date(t).getDate()

export function useTeiuTime(): TeiuTime {
  const [now, setNow] = useState(() => Date.now())
  const [tab, setTab] = useState<Tab>('clock')
  const [hue, setHue] = useState(190)
  const [secondsOn, setSecondsOn] = useState(false)
  const [hexMode, setHexMode] = useState(true)

  const [alarmTime, setAlarmTime] = useState('07:30')
  const [alarmEnabled, setAlarmEnabled] = useState(false)
  const [alarmFiring, setAlarmFiring] = useState(false)

  const [sw, setSw] = useState<SwState>('idle')
  const [swBase, setSwBase] = useState(0)
  const [swSince, setSwSince] = useState(0)
  const [laps, setLaps] = useState<number[]>([])

  const [timerDur, setTimerDur] = useState(300)
  const [timer, setTimer] = useState<TimerState>('idle')
  const [timerEnd, setTimerEnd] = useState(0)
  const [timerBase, setTimerBase] = useState(300_000)
  const [timerFiring, setTimerFiring] = useState(false)

  const alarmEnabledRef = useRef(alarmEnabled)
  const alarmFiringRef = useRef(alarmFiring)
  const alarmTimeRef = useRef(alarmTime)
  const firedDayRef = useRef(-1)
  const timerRef = useRef(timer)
  const timerEndRef = useRef(timerEnd)
  const timerFiringRef = useRef(timerFiring)

  useEffect(() => {
    alarmEnabledRef.current = alarmEnabled
  }, [alarmEnabled])
  useEffect(() => {
    alarmFiringRef.current = alarmFiring
  }, [alarmFiring])
  useEffect(() => {
    alarmTimeRef.current = alarmTime
  }, [alarmTime])
  useEffect(() => {
    timerRef.current = timer
  }, [timer])
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
      const m = alarmTimeRef.current.match(/(\d{1,2}):(\d{1,2})/)
      const alarmMin = m ? +m[1] * 60 + +m[2] : -1
      if (
        alarmEnabledRef.current &&
        !alarmFiringRef.current &&
        alarmMin >= 0 &&
        curMin >= alarmMin &&
        firedDayRef.current !== dayOf(t)
      ) {
        firedDayRef.current = dayOf(t)
        setAlarmFiring(true)
        ringLoop(880)
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

  return {
    now,
    tab,
    setTab,
    hue,
    setHue,
    secondsOn,
    toggleSeconds: () => setSecondsOn((s) => !s),
    hexMode,
    setHexMode,
    alarmTime,
    setAlarmTime,
    alarmEnabled,
    setAlarmEnabled,
    alarmFiring,
    dismissAlarm: () => {
      stopRing()
      setAlarmFiring(false)
      setAlarmEnabled(false)
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