import type { Question, Hand, ScoreAxis } from '@/types'

type Answers = Record<string, number>

const ALL_AXES: ScoreAxis[] = [
  'romance', 'utility', 'aggression', 'stability', 'creative', 'strategic', 'meme',
]

// 各軸のランダム回答時の平均スコア（質問構造から算出）
const AXIS_MEAN: Record<ScoreAxis, number> = {
  strategic: 21, utility: 18, stability: 18,
  romance: 16, aggression: 15, creative: 14, meme: 12,
}

export function calcScores(
  questions: Question[],
  answers: Answers
): Record<ScoreAxis, number> {
  const scores: Record<ScoreAxis, number> = {
    romance: 0, utility: 0, aggression: 0, stability: 0,
    creative: 0, strategic: 0, meme: 0,
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

/**
 * マッチング: 偏差ユークリッド距離（正規化済み）
 *
 * 1. ユーザーのスコアから軸平均を引いて偏差を求める
 * 2. 偏差を標準偏差で割って正規化（各軸のスケールを揃える）
 * 3. ハンドのthresholdsも同様に正規化
 * 4. 正規化ベクトル間のユークリッド距離が最小のハンドを選択
 *
 * ランキングベースより値の大きさの違いが反映されるので、
 * 同じTOP軸でも偏差の大きさで細かく差がつく → 分散が広がる
 */
export function matchHand(
  scores: Record<ScoreAxis, number>,
  hands: Hand[]
): Hand {
  // 偏差ベクトル
  const userDev = ALL_AXES.map(a => scores[a] - AXIS_MEAN[a])

  // ユーザー偏差の標準偏差で正規化
  const userMean = userDev.reduce((s, v) => s + v, 0) / userDev.length
  const userStd = Math.sqrt(userDev.reduce((s, v) => s + (v - userMean) ** 2, 0) / userDev.length) || 1
  const userNorm = userDev.map(v => (v - userMean) / userStd)

  let best = hands[0]
  let bestDist = Infinity

  for (const hand of hands) {
    // ハンドのthresholdベクトルも正規化
    const handVec = ALL_AXES.map(a => hand.thresholds[a] ?? 0)
    const handMean = handVec.reduce((s, v) => s + v, 0) / handVec.length
    const handStd = Math.sqrt(handVec.reduce((s, v) => s + (v - handMean) ** 2, 0) / handVec.length) || 1
    const handNorm = handVec.map(v => (v - handMean) / handStd)

    // ユークリッド距離
    let dist = 0
    for (let i = 0; i < ALL_AXES.length; i++) {
      dist += (userNorm[i] - handNorm[i]) ** 2
    }

    if (dist < bestDist) {
      bestDist = dist
      best = hand
    }
  }

  return best
}
