'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTapTier, saveScore } from '@/lib/games'

type Phase = 'ready' | 'countdown' | 'playing' | 'done'
const GAME_DURATION = 10
const MAX_TAPS_PER_SEC = 15

export default function TapRacePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('ready')
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [taps, setTaps] = useState(0)
  const tapsRef = useRef(0)
  const lastTapTimeRef = useRef(0)
  const tapWindowRef = useRef<number[]>([])
  const animFrameRef = useRef<number | null>(null)
  const endTimeRef = useRef(0)
  const [popKey, setPopKey] = useState(0)

  const startCountdown = useCallback(() => {
    setPhase('countdown')
    setCountdown(3)
    let c = 3
    const id = setInterval(() => {
      c -= 1
      if (c <= 0) {
        clearInterval(id)
        setPhase('playing')
        tapsRef.current = 0
        tapWindowRef.current = []
        endTimeRef.current = Date.now() + GAME_DURATION * 1000
        setTaps(0)
        setTimeLeft(GAME_DURATION)
        const tick = () => {
          const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000)
          setTimeLeft(Math.ceil(remaining))
          if (remaining > 0) {
            animFrameRef.current = requestAnimationFrame(tick)
          } else {
            setPhase('done')
            const finalTaps = tapsRef.current
            const rate = Math.round((finalTaps / GAME_DURATION) * 10) / 10
            const tier = getTapTier(finalTaps)
            saveScore('tapRace', { taps: finalTaps, rate, tier: tier.label, reward: tier.discount })
          }
        }
        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        setCountdown(c)
      }
    }, 1000)
  }, [])

  const handleTap = useCallback(() => {
    if (phase !== 'playing') return
    const now = Date.now()
    // Sliding window rate limiter
    tapWindowRef.current = tapWindowRef.current.filter((t) => now - t < 1000)
    if (tapWindowRef.current.length >= MAX_TAPS_PER_SEC) return
    tapWindowRef.current.push(now)
    lastTapTimeRef.current = now
    tapsRef.current += 1
    setTaps(tapsRef.current)
    setPopKey((k) => k + 1)
  }, [phase])

  useEffect(() => () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
  }, [])

  const tier = getTapTier(taps)
  const rate = taps > 0 ? (taps / Math.max(GAME_DURATION - timeLeft, 1)).toFixed(1) : '0.0'
  const progressPct = ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/arcade')}
          className="text-muted text-sm font-semibold"
        >
          ← Arcade
        </button>
        <div className="ml-auto text-right">
          <p className="text-white/40 text-xs">👆 Tap Race</p>
        </div>
      </div>

      {/* Ready state */}
      {phase === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8" style={{ animation: 'slide-up 0.4s ease-out' }}>
          <div className="text-center">
            <h2 className="text-white font-extrabold text-4xl mb-3">Tap Race</h2>
            <p className="text-muted text-base">Tap as fast as you can for 10 seconds.</p>
            <p className="text-muted text-sm mt-1">Top tappers earn 8% off their next order.</p>
          </div>
          <div className="w-40 h-40 rounded-full bg-dark-3 border-4 border-pink/30 flex items-center justify-center">
            <span className="text-6xl">👆</span>
          </div>
          <button
            onClick={startCountdown}
            className="w-full bg-pink text-white font-extrabold text-xl py-5 rounded-2xl"
            style={{ boxShadow: '0 0 24px rgba(255,45,85,0.4)' }}
          >
            Start →
          </button>
        </div>
      )}

      {/* Countdown */}
      {phase === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center" style={{ animation: 'bounce-in 0.3s ease-out' }}>
          <p className="text-white/40 font-bold text-lg mb-4">Get ready...</p>
          <p
            key={countdown}
            className="text-pink font-extrabold text-[120px] leading-none"
            style={{ animation: 'bounce-in 0.3s ease-out' }}
          >
            {countdown}
          </p>
        </div>
      )}

      {/* Playing */}
      {phase === 'playing' && (
        <div className="flex-1 flex flex-col items-center">
          {/* Timer bar */}
          <div className="w-full h-1.5 bg-dark-3 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-pink rounded-full transition-all duration-100"
              style={{ width: `${100 - progressPct}%` }}
            />
          </div>

          {/* Time + rate */}
          <div className="flex items-center justify-between w-full mb-6">
            <p className="text-white font-bold tabular-nums text-2xl">{timeLeft}s</p>
            <p className="text-muted text-sm">{rate}/sec</p>
          </div>

          {/* Tap counter */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p
              key={popKey}
              className="text-white font-extrabold tabular-nums"
              style={{
                fontSize: 'clamp(80px, 25vw, 140px)',
                lineHeight: 1,
                animation: popKey > 0 ? 'count-pop 0.15s ease-out' : 'none',
              }}
            >
              {taps}
            </p>
            <p className="text-muted text-sm">taps</p>
          </div>

          {/* Tap target */}
          <div className="relative flex items-center justify-center mb-6">
            <div
              className="absolute w-40 h-40 rounded-full border-2 border-pink/30 opacity-60"
              style={{ animation: 'pulse-ring 1.2s ease-out infinite' }}
            />
            <button
              className="w-40 h-40 rounded-full bg-pink active:scale-90 transition-transform flex items-center justify-center"
              style={{ boxShadow: '0 0 40px rgba(255,45,85,0.5)', animation: 'glow-pink 1.5s ease-in-out infinite' }}
              onPointerDown={handleTap}
            >
              <span className="text-5xl">👆</span>
            </button>
          </div>

          <p className="text-white/30 text-sm text-center">
            {taps < 30 ? 'TAP FASTER' : taps < 60 ? 'KEEP GOING' : '🔥 ON FIRE'}
          </p>
        </div>
      )}

      {/* Done */}
      {phase === 'done' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6" style={{ animation: 'slide-up 0.5s ease-out' }}>
          <div className="text-center">
            <p className="text-muted text-sm font-semibold mb-2 uppercase tracking-widest">Result</p>
            <p
              className="text-white font-extrabold tabular-nums"
              style={{ fontSize: 'clamp(72px, 22vw, 120px)', lineHeight: 1 }}
            >
              {taps}
            </p>
            <p className="text-white/40 text-lg mt-1">taps · {(taps / GAME_DURATION).toFixed(1)}/sec</p>
          </div>

          <div className="w-full bg-dark-2 border border-white/10 rounded-2xl px-5 py-5 text-center">
            <p className="text-white font-bold text-base leading-snug whitespace-pre-line">
              {tier.label}
            </p>
          </div>

          <div
            className="w-full bg-pink/10 border border-pink/30 rounded-2xl px-5 py-4 flex items-center justify-between"
          >
            <p className="text-pink font-bold">Reward unlocked</p>
            <p className="text-pink font-extrabold text-2xl">{tier.discount}% off</p>
          </div>

          <button
            onClick={() => router.push('/arcade')}
            className="w-full bg-dark-2 border border-white/10 text-white font-bold py-4 rounded-2xl"
          >
            ← Back to Arcade
          </button>
        </div>
      )}
    </div>
  )
}
