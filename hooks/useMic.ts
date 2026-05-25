'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type MicState = 'idle' | 'requesting' | 'active' | 'denied' | 'done'

export function useMic(durationMs = 10000) {
  const [state, setState] = useState<MicState>('idle')
  const [frostScore, setFrostScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000)

  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scoreRef = useRef(0)
  const endTimeRef = useRef(0)

  const BLOW_THRESHOLD = 0.04   // RMS amplitude threshold to count as blowing
  const BLOW_INCREMENT = 1.8    // points per frame above threshold

  const getRMS = useCallback((analyser: AnalyserNode): number => {
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteTimeDomainData(data)
    let sum = 0
    for (const v of data) {
      const norm = (v - 128) / 128
      sum += norm * norm
    }
    return Math.sqrt(sum / data.length)
  }, [])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    ctxRef.current?.close().catch(() => {})
    rafRef.current = null
    timerRef.current = null
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('denied')
      return
    }
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream
      const ctx = new AudioContext()
      ctxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.3
      analyserRef.current = analyser
      ctx.createMediaStreamSource(stream).connect(analyser)

      scoreRef.current = 0
      endTimeRef.current = Date.now() + durationMs
      setState('active')
      setTimeLeft(durationMs / 1000)

      const tick = () => {
        const rms = getRMS(analyser)
        if (rms > BLOW_THRESHOLD) {
          scoreRef.current = Math.min(100, scoreRef.current + BLOW_INCREMENT)
          setFrostScore(Math.round(scoreRef.current))
        }
        if (Date.now() < endTimeRef.current) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)

      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000)
        setTimeLeft(Math.ceil(remaining))
        if (remaining <= 0) {
          stop()
          setState('done')
          setFrostScore(Math.round(scoreRef.current))
        }
      }, 200)
    } catch {
      setState('denied')
    }
  }, [durationMs, getRMS, stop])

  // Desktop: spacebar held increments frost score
  const simulateBlow = useCallback(() => {
    if (state !== 'active') return
    scoreRef.current = Math.min(100, scoreRef.current + 3)
    setFrostScore(Math.round(scoreRef.current))
  }, [state])

  useEffect(() => () => stop(), [stop])

  return { state, frostScore, timeLeft, start, simulateBlow }
}
