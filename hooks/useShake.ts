'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type ShakeState = 'idle' | 'waiting-permission' | 'active' | 'done'

export function useShake(durationMs = 3000) {
  const [state, setState] = useState<ShakeState>('idle')
  const [intensity, setIntensity] = useState(0)
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000)
  const peakRef = useRef(0)
  const listenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const endTimeRef = useRef(0)

  const stopListening = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener('devicemotion', listenerRef.current)
      listenerRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startListening = useCallback(() => {
    peakRef.current = 0
    endTimeRef.current = Date.now() + durationMs
    setState('active')
    setTimeLeft(durationMs / 1000)

    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity
      if (!a) return
      const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2)
      const normalised = Math.min(mag / 3, 10)
      if (normalised > peakRef.current) {
        peakRef.current = normalised
        setIntensity(normalised)
      }
    }

    listenerRef.current = handler
    window.addEventListener('devicemotion', handler)

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000)
      setTimeLeft(Math.ceil(remaining))
      if (remaining <= 0) {
        stopListening()
        setState('done')
        setIntensity(peakRef.current)
      }
    }, 100)
  }, [durationMs, stopListening])

  const start = useCallback(async () => {
    // iOS 13+ requires explicit permission
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === 'function'
    ) {
      setState('waiting-permission')
      try {
        const result = await (
          DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission()
        if (result !== 'granted') {
          setState('idle')
          return
        }
      } catch {
        setState('idle')
        return
      }
    }
    startListening()
  }, [startListening])

  // Desktop simulation: spacebar held = shake
  const simulateShake = useCallback(() => {
    if (state !== 'active') return
    const simulated = Math.min(peakRef.current + 1.5, 10)
    peakRef.current = simulated
    setIntensity(simulated)
  }, [state])

  useEffect(() => () => stopListening(), [stopListening])

  return { state, intensity, timeLeft, start, simulateShake }
}
