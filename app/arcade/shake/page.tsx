'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getShakeTier, saveScore } from '@/lib/games'
import { useShake } from '@/hooks/useShake'

export default function ShakePage() {
  const router = useRouter()
  const { state, intensity, timeLeft, start, simulateShake } = useShake(3000)
  const [revealed, setRevealed] = useState(false)
  const tier = getShakeTier(intensity)
  const intensityPct = Math.min((intensity / 10) * 100, 100)

  // Save score when game finishes
  useEffect(() => {
    if (state === 'done' && !revealed) {
      saveScore('shake', {
        intensity: Math.round(intensity * 10) / 10,
        item: tier.item,
        emoji: tier.emoji,
        reward: tier.discount,
      })
      setTimeout(() => setRevealed(true), 600)
    }
  }, [state, revealed, intensity, tier])

  // Desktop: spacebar simulates shaking
  useEffect(() => {
    if (state !== 'active') return
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) simulateShake()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, simulateShake])

  // Vending machine shake animation
  const machineShaking = state === 'active' && intensity > 2

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/arcade')} className="text-muted text-sm font-semibold">
          ← Arcade
        </button>
        <div className="ml-auto">
          <p className="text-white/40 text-xs">📳 Shake the Machine</p>
        </div>
      </div>

      {/* Idle state */}
      {state === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8" style={{ animation: 'slide-up 0.4s ease-out' }}>
          <div className="text-center">
            <h2 className="text-white font-extrabold text-4xl mb-3">Shake the Machine</h2>
            <p className="text-muted text-base">Shake your phone for 3 seconds.</p>
            <p className="text-muted text-sm mt-1">Harder shake = better reward drops.</p>
          </div>

          {/* Vending machine */}
          <VendingMachine shaking={false} intensity={0} />

          <div className="w-full space-y-3">
            <button
              onClick={start}
              className="w-full bg-purple text-white font-extrabold text-xl py-5 rounded-2xl"
              style={{ boxShadow: '0 0 24px rgba(107,33,168,0.5)' }}
            >
              Shake It! 📳
            </button>
            <p className="text-center text-white/30 text-xs">
              On desktop: tap above + hold SPACE to shake
            </p>
          </div>
        </div>
      )}

      {/* Permission prompt */}
      {state === 'waiting-permission' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-white font-bold text-xl text-center">
            Allow motion access to play
          </p>
          <p className="text-muted text-sm text-center">
            Tap &quot;Allow&quot; in the prompt to start shaking
          </p>
        </div>
      )}

      {/* Active: shaking */}
      {state === 'active' && (
        <div className="flex-1 flex flex-col items-center gap-6">
          {/* Timer */}
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <p className="text-white font-bold text-xl">{timeLeft}s</p>
              <p className="text-muted text-sm">Intensity: {intensity.toFixed(1)}/10</p>
            </div>
            <div className="h-2 bg-dark-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${intensityPct}%`,
                  background: intensity > 7 ? '#FF2D55' : intensity > 4 ? '#6B21A8' : '#7C3AED',
                }}
              />
            </div>
          </div>

          {/* Machine */}
          <div className="flex-1 flex items-center justify-center">
            <VendingMachine shaking={machineShaking} intensity={intensity} />
          </div>

          <div className="text-center">
            <p className="text-white font-bold text-lg">
              {intensity < 2
                ? '🤔 Is it on?'
                : intensity < 5
                ? '💪 Getting there...'
                : intensity < 8
                ? '🔥 Nice shake!'
                : '💥 DESTROY IT'}
            </p>
            <p className="text-muted text-xs mt-1">Desktop: hold SPACE</p>
          </div>
        </div>
      )}

      {/* Done / reveal */}
      {state === 'done' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6" style={{ animation: 'slide-up 0.4s ease-out' }}>
          <p className="text-muted text-sm uppercase tracking-widest font-bold">Machine says...</p>

          {/* Item reveal */}
          <div
            className="w-full bg-dark-2 border border-white/10 rounded-3xl px-6 py-8 flex flex-col items-center gap-3"
            style={{ animation: revealed ? 'drop-item 0.6s cubic-bezier(0.16,1,0.3,1)' : 'none' }}
          >
            <span className="text-7xl">{tier.emoji}</span>
            <p className="text-white font-extrabold text-2xl text-center">{tier.item}</p>
            <p className="text-muted text-sm">Shake intensity: {intensity.toFixed(1)}/10</p>
          </div>

          <div className="w-full bg-purple/10 border border-purple/30 rounded-2xl px-5 py-4 flex items-center justify-between">
            <p className="text-purple-light font-bold">Reward unlocked</p>
            <p className="text-purple-light font-extrabold text-2xl">{tier.discount}% off</p>
          </div>

          <p className="text-white/30 text-sm text-center italic">
            {intensity >= 9
              ? '"You broke the machine. Here\'s everything."'
              : intensity >= 7
              ? '"The machine respects this."'
              : intensity >= 4
              ? '"Decent shake. Machine approves."'
              : '"Next time, really mean it."'}
          </p>

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

function VendingMachine({ shaking, intensity }: { shaking: boolean; intensity: number }) {
  const scale = shaking ? 1 + (intensity / 10) * 0.05 : 1
  return (
    <div
      style={{
        animation: shaking ? 'shake-anim 0.2s ease-in-out infinite' : 'none',
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
      }}
    >
      <svg width="160" height="220" viewBox="0 0 160 220" fill="none">
        {/* Machine body */}
        <rect x="10" y="20" width="140" height="190" rx="14" fill="#1E1E1E" stroke="#333" strokeWidth="2" />
        {/* Glass display */}
        <rect x="22" y="32" width="116" height="110" rx="8" fill="#0A0A0A" stroke="#6B21A8" strokeWidth="1.5" />
        {/* Shelves */}
        {[0, 1, 2].map((row) => (
          <g key={row}>
            <rect x="28" y={44 + row * 34} width="104" height="22" rx="4" fill="#141414" />
            {/* Items on shelf */}
            {[0, 1, 2].map((col) => (
              <rect
                key={col}
                x={34 + col * 34}
                y={46 + row * 34}
                width="20"
                height="18"
                rx="3"
                fill={
                  intensity > 6 ? '#FF2D55' : intensity > 3 ? '#6B21A8' : '#7C3AED'
                }
                opacity={intensity > 0 ? 0.8 : 0.3}
              />
            ))}
          </g>
        ))}
        {/* Coin slot */}
        <rect x="115" y="155" width="24" height="4" rx="2" fill="#333" />
        {/* Buttons */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={35 + i * 22}
            cy={168}
            r={7}
            fill={intensity > i * 3 ? '#FF2D55' : '#1E1E1E'}
            stroke="#333"
            strokeWidth="1"
          />
        ))}
        {/* Dispense tray */}
        <rect x="22" y="185" width="116" height="18" rx="4" fill="#141414" stroke="#333" strokeWidth="1" />
        {/* Brand text */}
        <text x="80" y="208" textAnchor="middle" fill="#6B21A8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
          ZEPTO
        </text>
      </svg>
    </div>
  )
}
