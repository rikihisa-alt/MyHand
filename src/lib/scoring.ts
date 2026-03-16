import type { Question, Hand, ScoreAxis } from '@/types'

type Answers = Record<string, number>

export function calcScores(
  questions: Question[],
  answers: Answers
): Record<ScoreAxis, number> {
  const scores: Record<ScoreAxis, number> = {
    romance: 0,
    utility: 0,
    aggression: 0,
    stability: 0,
    creative: 0,
    strategic: 0,
    meme: 0,
  }
  for (const q of questions) {
    const idx = answers[q.id]
    if (idx === undefined) continue
    const option = q.options[idx]
    if (!option) continue
    for (const [axis, val] of Object.entries(option.scores)) {
      scores[axis as ScoreAxis] += val ?? 0
    }
  }
  return scores
}

export function matchHand(
  scores: Record<ScoreAxis, number>,
  hands: Hand[]
): Hand {
  let best = hands[0]
  let bestDist = Infinity
  for (const hand of hands) {
    let dist = 0
    for (const [axis, threshold] of Object.entries(hand.thresholds)) {
      dist += Math.abs(scores[axis as ScoreAxis] - (threshold ?? 0))
    }
    if (dist < bestDist) {
      bestDist = dist
      best = hand
    }
  }
  return best
}
