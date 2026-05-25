export const TAP_TIERS = [
  { maxTaps: 30, label: 'Calm. Suspicious.\nAre you even hungry?', discount: 3 },
  { maxTaps: 50, label: 'Standard craving.\nRespectable.', discount: 5 },
  { maxTaps: 70, label: "Now we're talking.", discount: 7 },
  { maxTaps: Infinity, label: 'Medical emergency.\nWe\'re hurrying.', discount: 8 },
]

export function getTapTier(taps: number) {
  return TAP_TIERS.find((t) => taps <= t.maxTaps) ?? TAP_TIERS[TAP_TIERS.length - 1]
}

export const SHAKE_TIERS = [
  { maxIntensity: 3,        item: 'Nimbu Pani',           emoji: '🍋', discount: 3 },
  { maxIntensity: 6,        item: 'Kwality Walls Cornetto',emoji: '🍦', discount: 5 },
  { maxIntensity: 9,        item: 'Magnum Almond',         emoji: '🍫', discount: 7 },
  { maxIntensity: Infinity, item: 'Mystery Box',           emoji: '🎁', discount: 7 },
]

export function getShakeTier(intensity: number) {
  return SHAKE_TIERS.find((t) => intensity <= t.maxIntensity) ?? SHAKE_TIERS[SHAKE_TIERS.length - 1]
}

export function getFrostCopy(score: number): { rank: string; line: string } {
  if (score >= 80) return { rank: 'Top 5%', line: 'You were built for summer.' }
  if (score >= 60) return { rank: 'Top 18%', line: 'Strong lungs. Stronger craving.' }
  if (score >= 40) return { rank: 'Top 42%', line: 'Decent blow. Decent reward.' }
  return { rank: 'Top 70%', line: 'The sun is winning. For now.' }
}

export function getFrostDiscount(score: number): number {
  if (score >= 80) return 5
  if (score >= 60) return 4
  if (score >= 40) return 3
  return 2
}

export const BASELINE_DISCOUNT = 5

export function totalReward(scores: GameScores): number {
  const tap   = scores.tapRace?.reward  ?? 0
  const shake = scores.shake?.reward    ?? 0
  const blow  = scores.blow?.reward     ?? 0
  return Math.min(tap + shake + blow + BASELINE_DISCOUNT, 20)
}

export type GameScores = {
  tapRace?: { taps: number; rate: number; tier: string; reward: number }
  shake?:   { intensity: number; item: string; emoji: string; reward: number }
  blow?:    { frost: number; rank: string; reward: number }
}

export function getScores(): GameScores {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('khelo-khao-scores') ?? '{}')
  } catch {
    return {}
  }
}

export function saveScore<K extends keyof GameScores>(game: K, score: GameScores[K]) {
  const scores = getScores()
  localStorage.setItem('khelo-khao-scores', JSON.stringify({ ...scores, [game]: score }))
}

export function clearScores() {
  localStorage.removeItem('khelo-khao-scores')
}
