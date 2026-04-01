import type { Question, Hand, ScoreAxis } from '@/types'

type Answers = Record<string, number>

const ALL_AXES: ScoreAxis[] = [
  'romance', 'utility', 'aggression', 'stability', 'creative', 'strategic', 'meme',
]

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

/**
 * マッチング: スコアの上位軸・下位軸の「ランキング順位」で比較する
 *
 * 方式:
 * 1. ユーザーのスコアを7軸でランキング（1位〜7位）
 * 2. 各ハンドのthresholdsも同様にランキング
 * 3. ランキングの一致度（スピアマン相関的）でマッチ
 * 4. さらに、thresholdsの上位2軸がユーザーのTOP3に入っているかのボーナス
 *
 * これにより:
 * - 「全軸均等」な人はTTに行く（正しい）
 * - 「特定軸が突出」な人はそれに合うハンドに行く
 * - 絶対値ではなく相対的な傾向でマッチするため、回答パターンに依存しない
 */
export function matchHand(
  scores: Record<ScoreAxis, number>,
  hands: Hand[]
): Hand {
  // ユーザースコアのランキング（高い順）
  const userRanked = ALL_AXES
    .map(a => ({ axis: a, value: scores[a] }))
    .sort((a, b) => b.value - a.value)
  const userRankMap: Record<string, number> = {}
  userRanked.forEach((item, idx) => { userRankMap[item.axis] = idx })

  let best = hands[0]
  let bestScore = -Infinity

  for (const hand of hands) {
    // ハンドのthresholdsランキング（高い順）
    const handRanked = ALL_AXES
      .map(a => ({ axis: a, value: hand.thresholds[a] ?? 0 }))
      .sort((a, b) => b.value - a.value)
    const handRankMap: Record<string, number> = {}
    handRanked.forEach((item, idx) => { handRankMap[item.axis] = idx })

    // ランキング距離（スピアマン的）: 各軸のランク差の二乗和
    let rankDist = 0
    for (const axis of ALL_AXES) {
      const diff = userRankMap[axis] - handRankMap[axis]
      rankDist += diff * diff
    }
    // 低いほど良い → 負にして最大化問題に変換
    let similarity = -rankDist

    // ボーナス: ハンドのTOP2軸がユーザーのTOP3に入っていれば加点
    const handTop2 = handRanked.slice(0, 2).map(r => r.axis)
    const userTop3 = userRanked.slice(0, 3).map(r => r.axis)
    for (const topAxis of handTop2) {
      if (userTop3.includes(topAxis)) {
        similarity += 8 // 強い一致ボーナス
      }
    }

    // ボーナス: ハンドのBOTTOM2軸がユーザーのBOTTOM3に入っていれば加点
    const handBottom2 = handRanked.slice(-2).map(r => r.axis)
    const userBottom3 = userRanked.slice(-3).map(r => r.axis)
    for (const botAxis of handBottom2) {
      if (userBottom3.includes(botAxis)) {
        similarity += 4 // 弱い一致ボーナス
      }
    }

    // ボーナス: ユーザーのTOP1軸がハンドのTOP1軸と完全一致
    if (userRanked[0].axis === handRanked[0].axis) {
      similarity += 6
    }

    if (similarity > bestScore) {
      bestScore = similarity
      best = hand
    }
  }

  return best
}
