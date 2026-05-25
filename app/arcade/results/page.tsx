'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getScores, totalReward, clearScores, BASELINE_DISCOUNT } from '@/lib/games'
import type { GameScores } from '@/lib/games'

export default function ResultsPage() {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [scores, setScores] = useState<GameScores>({})
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setScores(getScores())
  }, [])

  const reward = totalReward(scores)
  const gamesPlayed = Object.keys(scores).length

  async function handleShare() {
    if (sharing) return
    setSharing(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0A0A',
        scale: 2,
        useCORS: true,
      })
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject()), 'image/png')
      })
      const file = new File([blob], 'khelo-khao.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Khelo Khao — ${reward}% off earned!`,
          text: `I played Zepto's Khelo Khao arcade and earned ${reward}% off. Try to beat my score!`,
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'khelo-khao.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // user cancelled share
    } finally {
      setSharing(false)
    }
  }

  function handlePlayAgain() {
    clearScores()
    router.push('/arcade')
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/arcade')} className="text-muted text-sm font-semibold">
          ← Arcade
        </button>
      </div>

      {/* Share card (html2canvas target) */}
      <div
        ref={cardRef}
        className="bg-dark rounded-3xl border border-white/10 px-6 py-8 mb-6"
        style={{ background: '#0A0A0A' }}
      >
        {/* Zepto header */}
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13.5 2L4 14h7.5L10 22l10-12h-7.5L13.5 2z" fill="#FF2D55" />
          </svg>
          <span className="text-white font-extrabold text-sm tracking-tight">zepto</span>
          <span className="text-white/30 text-sm mx-1">·</span>
          <span className="text-pink font-bold text-sm">KHELO KHAO</span>
        </div>

        {/* Big reward number */}
        <div className="text-center mb-6">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
            Total reward earned
          </p>
          <p
            className="font-extrabold tabular-nums leading-none"
            style={{
              fontSize: 'clamp(80px, 26vw, 110px)',
              background: 'linear-gradient(135deg, #FF2D55, #6B21A8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {reward}%
          </p>
          <p className="text-white/40 text-sm mt-2">off your next order</p>
        </div>

        {/* Game scores */}
        <div className="space-y-2 mb-6">
          {/* Baseline */}
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="text-white/60 text-sm">Just showed up</span>
            </div>
            <span className="text-success text-sm font-bold">+{BASELINE_DISCOUNT}%</span>
          </div>

          {scores.tapRace && (
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">👆</span>
                  <span className="text-white text-sm font-semibold">Tap Race</span>
                </div>
                <p className="text-white/40 text-xs ml-7">
                  {scores.tapRace.taps} taps · {scores.tapRace.rate}/sec
                </p>
              </div>
              <span className="text-pink text-sm font-bold">+{scores.tapRace.reward}%</span>
            </div>
          )}

          {scores.shake && (
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">📳</span>
                  <span className="text-white text-sm font-semibold">Shake the Machine</span>
                </div>
                <p className="text-white/40 text-xs ml-7">
                  {scores.shake.emoji} {scores.shake.item} · intensity {scores.shake.intensity}/10
                </p>
              </div>
              <span className="text-purple-light text-sm font-bold">+{scores.shake.reward}%</span>
            </div>
          )}

          {scores.blow && (
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">💨</span>
                  <span className="text-white text-sm font-semibold">Blow to Beat the Heat</span>
                </div>
                <p className="text-white/40 text-xs ml-7">
                  Frost score: {scores.blow.frost}/100 · {scores.blow.rank}
                </p>
              </div>
              <span className="text-sky-400 text-sm font-bold">+{scores.blow.reward}%</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/30 text-xs">
            Valid 72 hours · zepto.com · Play. Eat.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="w-full bg-pink text-white font-extrabold text-base py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ boxShadow: '0 0 24px rgba(255,45,85,0.35)' }}
        >
          {sharing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : copied ? (
            '✓ Downloaded!'
          ) : (
            <>
              <span>📤</span>
              Share My Score
            </>
          )}
        </button>

        <button
          onClick={handlePlayAgain}
          className="w-full bg-dark-2 border border-white/10 text-white font-bold py-4 rounded-2xl"
        >
          Play Again 🎮
        </button>

        <p className="text-center text-muted text-xs">
          Tap Share to post your score · {gamesPlayed} of 3 games played
        </p>
      </div>
    </div>
  )
}
