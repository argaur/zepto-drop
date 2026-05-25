'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getScores, type GameScores, BASELINE_DISCOUNT, totalReward } from '@/lib/games'

const GAMES = [
  {
    id: 'tap-race',
    name: 'Tap Race',
    nameHindi: 'टैप रेस',
    desc: 'Tap as fast as you can. 10 seconds. Go.',
    icon: '👆',
    reward: '+ up to 8% off',
    color: '#FF2D55',
    href: '/arcade/tap-race',
    key: 'tapRace' as keyof GameScores,
  },
  {
    id: 'shake',
    name: 'Shake the Machine',
    nameHindi: 'मशीन हिलाओ',
    desc: 'Shake your phone. Harder = better reward.',
    icon: '📳',
    reward: '+ up to 7% off',
    color: '#6B21A8',
    href: '/arcade/shake',
    key: 'shake' as keyof GameScores,
  },
  {
    id: 'blow',
    name: 'Blow to Beat the Heat',
    nameHindi: 'गर्मी को उड़ाओ',
    desc: 'Blow into your mic. Freeze the screen.',
    icon: '💨',
    reward: '+ up to 5% off',
    color: '#0EA5E9',
    href: '/arcade/blow',
    key: 'blow' as keyof GameScores,
  },
]

export default function ArcadeLobby() {
  const [scores, setScores] = useState<GameScores>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setScores(getScores())
  }, [])

  useEffect(() => {
    if (!mounted) return
    const refresh = () => setScores(getScores())
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [mounted])

  const doneCount = Object.keys(scores).length
  const earned = mounted ? totalReward(scores) : BASELINE_DISCOUNT

  return (
    <div className="flex flex-col px-4 pt-8 pb-4 min-h-screen">
      {/* Header */}
      <div className="mb-8" style={{ animation: 'slide-up 0.4s ease-out' }}>
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M13.5 2L4 14h7.5L10 22l10-12h-7.5L13.5 2z" fill="#FF2D55" />
          </svg>
          <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">
            Zepto
          </span>
        </div>
        <h1 className="text-white font-extrabold text-5xl leading-none tracking-tight">
          KHELO
          <br />
          <span className="text-pink">KHAO.</span>
        </h1>
        <p className="text-white/50 font-semibold mt-2 text-sm">
          Play. Eat. · {10 - doneCount * 3} min left to play
        </p>
      </div>

      {/* Baseline reward chip */}
      <div
        className="bg-dark-3 border border-white/10 rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
        style={{ animation: 'slide-up 0.5s ease-out' }}
      >
        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-success text-sm">✓</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm">
            {BASELINE_DISCOUNT}% off unlocked
          </p>
          <p className="text-muted text-xs">Just for opening. Games earn more.</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-pink font-extrabold text-lg">{earned}%</p>
          <p className="text-muted text-xs">earned so far</p>
        </div>
      </div>

      {/* Game cards */}
      <div className="flex flex-col gap-3 flex-1">
        {GAMES.map((game, i) => {
          const done = mounted && !!scores[game.key]
          return (
            <Link
              key={game.id}
              href={game.href}
              className="relative bg-dark-2 border border-white/10 rounded-2xl px-4 py-5 flex items-center gap-4 active:scale-95 transition-transform"
              style={{ animation: `slide-up ${0.5 + i * 0.1}s ease-out` }}
            >
              {done && (
                <div className="absolute top-3 right-3 bg-success/20 text-success text-xs font-bold px-2 py-0.5 rounded-full">
                  Done ✓
                </div>
              )}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${game.color}20` }}
              >
                {game.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">{game.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{game.nameHindi}</p>
                <p className="text-muted text-xs mt-1 leading-snug">{game.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ color: game.color, background: `${game.color}15` }}
                >
                  {game.reward}
                </span>
                {!done && (
                  <span className="text-white/30 text-xl">›</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* See results CTA */}
      {doneCount > 0 && (
        <div
          className="mt-6"
          style={{ animation: 'slide-up 0.3s ease-out' }}
        >
          <Link
            href="/arcade/results"
            className="block w-full bg-pink text-white font-extrabold text-base py-4 rounded-2xl text-center"
            style={{ boxShadow: '0 0 24px rgba(255,45,85,0.3)' }}
          >
            See My Rewards →
          </Link>
        </div>
      )}
    </div>
  )
}
