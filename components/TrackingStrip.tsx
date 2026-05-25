'use client'
import { useEffect, useState } from 'react'

const TOTAL_SECONDS = 600 // 10 minutes

export default function TrackingStrip() {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  const progress = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100
  const distance = Math.max(0.1, ((seconds / TOTAL_SECONDS) * 1.8)).toFixed(1)

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50">
      {expanded && (
        <div
          className="bg-dark-2 border-t border-white/10 px-4 pt-4 pb-2"
          style={{ animation: 'slide-up 0.2s ease-out' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold text-sm">Order Tracking</p>
            <button
              onClick={() => setExpanded(false)}
              className="text-muted text-xs"
            >
              close ✕
            </button>
          </div>
          <div className="space-y-2 mb-3">
            {['Order placed', 'Picking items', 'Out for delivery'].map((step, i) => {
              const done = i < 2
              return (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      done ? 'bg-success' : i === 2 ? 'bg-pink animate-pulse' : 'bg-dark-3'
                    }`}
                  />
                  <span className={`text-xs ${done ? 'text-muted line-through' : 'text-white'}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="h-1 bg-dark-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-1">Rider is {distance} km away</p>
        </div>
      )}

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full bg-dark-2/95 backdrop-blur border-t border-white/10 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">
            Rider is on the way
          </span>
        </div>
        <span className="text-pink font-bold text-sm tabular-nums">
          {mins}:{secs}
        </span>
      </button>
    </div>
  )
}
