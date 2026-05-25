'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getFrostCopy, getFrostDiscount, saveScore } from '@/lib/games'
import { useMic } from '@/hooks/useMic'

export default function BlowPage() {
  const router = useRouter()
  const { state, frostScore, timeLeft, start, simulateBlow } = useMic(10000)
  const [saved, setSaved] = useState(false)
  const spaceHeldRef = useRef(false)

  const isDesktopDemo = state === 'active'
  const frostCopy = getFrostCopy(frostScore)
  const discount = getFrostDiscount(frostScore)

  // Save score on done
  useEffect(() => {
    if (state === 'done' && !saved) {
      setSaved(true)
      const { rank } = getFrostCopy(frostScore)
      saveScore('blow', { frost: frostScore, rank, reward: getFrostDiscount(frostScore) })
    }
  }, [state, frostScore, saved])

  // Desktop: hold SPACE to blow
  useEffect(() => {
    if (state !== 'active') return
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || spaceHeldRef.current) return
      spaceHeldRef.current = true
    }
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') spaceHeldRef.current = false
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)

    const interval = setInterval(() => {
      if (spaceHeldRef.current) simulateBlow()
    }, 50)

    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      clearInterval(interval)
    }
  }, [state, simulateBlow])

  // Ice cream temperature based on frost
  const temp = Math.round(38 - (frostScore / 100) * 46) // 38°C → -8°C
  const iceAlpha = Math.min(frostScore / 100, 1)

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/arcade')} className="text-muted text-sm font-semibold">
          ← Arcade
        </button>
        <div className="ml-auto">
          <p className="text-white/40 text-xs">💨 Blow to Beat the Heat</p>
        </div>
      </div>

      {/* Idle */}
      {state === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8" style={{ animation: 'slide-up 0.4s ease-out' }}>
          <div className="text-center">
            <h2 className="text-white font-extrabold text-3xl mb-3 leading-tight">
              Blow to Beat<br />the Heat
            </h2>
            <p className="text-muted text-base">
              Blow into your mic for 10 seconds.
            </p>
            <p className="text-muted text-sm mt-1">
              The frost meter fills as you blow.
            </p>
          </div>

          <IceCream frostPct={0} />

          <div className="w-full space-y-3">
            <button
              onClick={start}
              className="w-full text-white font-extrabold text-xl py-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #6B21A8)',
                boxShadow: '0 0 24px rgba(14,165,233,0.4)',
              }}
            >
              Start Blowing 💨
            </button>
            <p className="text-center text-white/30 text-xs">
              We'll ask for mic permission · Desktop: hold SPACE
            </p>
          </div>
        </div>
      )}

      {/* Requesting mic */}
      {state === 'requesting' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-pink border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-bold text-xl text-center">Allow mic access</p>
          <p className="text-muted text-sm text-center">Tap &quot;Allow&quot; in the browser prompt</p>
        </div>
      )}

      {/* Denied */}
      {state === 'denied' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <span className="text-5xl">🎤</span>
          <p className="text-white font-bold text-xl">Mic not available</p>
          <p className="text-muted text-sm">
            Desktop demo mode — hold SPACE to blow.
            <br />Or tap &quot;Try Again&quot; to re-request mic access.
          </p>
          <button
            onClick={start}
            className="bg-dark-3 border border-white/10 text-white font-bold px-6 py-3 rounded-xl"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Active */}
      {state === 'active' && (
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Timer */}
          <div className="w-full flex items-center justify-between">
            <p className="text-white font-bold text-2xl tabular-nums">{timeLeft}s</p>
            <p className="text-muted text-sm">{temp > 0 ? `${temp}°C` : `${temp}°C`} ❄️</p>
          </div>

          {/* Main game area */}
          <div className="flex-1 flex items-center gap-6 w-full">
            {/* Frost meter */}
            <div className="flex flex-col items-center gap-2 h-64">
              <p className="text-white/40 text-xs font-bold">FROST</p>
              <div className="flex-1 w-8 bg-dark-3 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-150"
                  style={{
                    height: `${frostScore}%`,
                    background: 'linear-gradient(to top, #0EA5E9, #7C3AED)',
                    boxShadow: frostScore > 0 ? '0 0 20px rgba(14,165,233,0.5)' : 'none',
                  }}
                />
              </div>
              <p className="text-white font-extrabold text-sm tabular-nums">{frostScore}</p>
            </div>

            {/* Ice cream */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <IceCream frostPct={frostScore / 100} />
              <p className="text-white font-bold text-center text-sm">
                {frostScore === 0
                  ? 'Start blowing!'
                  : frostScore < 30
                  ? 'Keep going...'
                  : frostScore < 60
                  ? 'It\'s working!'
                  : frostScore < 85
                  ? '❄️ Freezing!'
                  : '🧊 ICE COLD'}
              </p>
            </div>
          </div>

          {isDesktopDemo && (
            <div className="bg-dark-3 border border-white/10 rounded-xl px-4 py-2 text-center">
              <p className="text-white/40 text-xs">Demo mode · Hold SPACE to blow</p>
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {state === 'done' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6" style={{ animation: 'slide-up 0.5s ease-out' }}>
          <div className="text-center">
            <p className="text-muted text-sm font-semibold uppercase tracking-widest mb-2">Frost Score</p>
            <p
              className="font-extrabold tabular-nums"
              style={{
                fontSize: 'clamp(80px, 25vw, 120px)',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #0EA5E9, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {frostScore}
            </p>
            <p className="text-white/40 text-base mt-1">/ 100 BFU</p>
          </div>

          <div className="w-full bg-dark-2 border border-white/10 rounded-2xl px-5 py-4 text-center">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">City rank</p>
            <p className="text-white font-extrabold text-xl">{frostCopy.rank} of blowers today</p>
            <p className="text-muted text-sm mt-1 italic">{frostCopy.line}</p>
          </div>

          <div
            className="w-full rounded-2xl px-5 py-4 flex items-center justify-between"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)' }}
          >
            <p className="text-sky-400 font-bold">Reward unlocked</p>
            <p className="text-sky-400 font-extrabold text-2xl">{discount}% off</p>
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

function IceCream({ frostPct }: { frostPct: number }) {
  const meltAmt = 1 - frostPct
  return (
    <div className="relative w-32 h-44 flex flex-col items-center">
      {/* Frost overlay */}
      <div
        className="absolute inset-0 rounded-t-full pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse at center, rgba(14,165,233,${frostPct * 0.4}), transparent 70%)`,
          transition: 'all 0.3s',
        }}
      />
      {/* Ice cream scoop */}
      <svg width="120" height="180" viewBox="0 0 120 180" fill="none" style={{ overflow: 'visible' }}>
        {/* Cone */}
        <polygon points="60,180 25,95 95,95" fill="#D97706" />
        <polygon points="60,180 30,95 60,160" fill="#B45309" opacity="0.5" />
        {/* Cone pattern */}
        <line x1="25" y1="95" x2="60" y2="180" stroke="#B45309" strokeWidth="1" opacity="0.4" />
        <line x1="55" y1="95" x2="60" y2="180" stroke="#B45309" strokeWidth="1" opacity="0.4" />
        <line x1="85" y1="95" x2="60" y2="180" stroke="#B45309" strokeWidth="1" opacity="0.4" />

        {/* Melting drip */}
        {meltAmt > 0.2 && (
          <ellipse
            cx="85"
            cy="108"
            rx="6"
            ry={Math.round(meltAmt * 18)}
            fill="#FCE7F3"
            opacity="0.9"
          />
        )}

        {/* Scoop */}
        <ellipse
          cx="60"
          cy="68"
          rx="35"
          ry={32 + meltAmt * 4}
          fill={frostPct > 0.6 ? '#BAE6FD' : frostPct > 0.3 ? '#FCE7F3' : '#FDF2F8'}
        />
        {/* Scoop shadow */}
        <ellipse cx="60" cy="78" rx="28" ry="8" fill="#E879A0" opacity="0.15" />

        {/* Frost crystals */}
        {frostPct > 0.3 && (
          <>
            <circle cx="45" cy="58" r="3" fill="#BAE6FD" opacity={frostPct} />
            <circle cx="72" cy="52" r="2.5" fill="#BAE6FD" opacity={frostPct} />
            <circle cx="60" cy="72" r="2" fill="#E0F2FE" opacity={frostPct * 0.8} />
          </>
        )}

        {/* Temperature indicator */}
        <text x="60" y="62" textAnchor="middle" fill={frostPct > 0.5 ? '#0369A1' : '#9D174D'} fontSize="10" fontWeight="bold">
          {frostPct > 0.5 ? '❄️' : '🌡️'}
        </text>
      </svg>
    </div>
  )
}
