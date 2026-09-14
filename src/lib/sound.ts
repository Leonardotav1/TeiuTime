let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function beep(freq = 880, dur = 0.16, delay = 0, vol = 0.28) {
  const c = getCtx()
  if (!c) return
  try {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    const t0 = c.currentTime + delay
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    o.connect(g)
    g.connect(c.destination)
    o.start(t0)
    o.stop(t0 + dur + 0.05)
  } catch {
    /* audio unavailable — visual alert still works */
  }
}

export function ring(tone = 880) {
  for (let i = 0; i < 4; i++) beep(tone, 0.2, i * 0.3)
}

let loopTimer: number | undefined

export function ringLoop(tone = 880) {
  stopRing()
  const step = () => {
    beep(tone, 0.22, 0)
    beep(tone * 1.5, 0.22, 0.19)
  }
  step()
  loopTimer = window.setInterval(step, 950)
}

export function stopRing() {
  if (loopTimer !== undefined) {
    window.clearInterval(loopTimer)
    loopTimer = undefined
  }
}