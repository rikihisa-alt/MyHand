# スコアリングロジック - SKILL.md

## スコア軸（7軸）
| 軸 | 説明 |
|---|---|
| romance | ロマン・夢追い志向 |
| utility | 実利・EV重視 |
| aggression | 攻撃性・アグレッシブ |
| stability | 堅実性・ナイトレンジ志向 |
| creative | クリエイティブ・変則プレイ |
| strategic | 戦略志向・GTO意識 |
| meme | ネタ・エンタメ志向 |

## 実装
```ts
// lib/scoring.ts
import type { Question, Hand, ScoreAxis } from '@/types'

type Answers = Record<string, number>

export function calcScores(
  questions: Question[],
  answers: Answers
): Record<ScoreAxis, number> {
  const scores: Record<ScoreAxis, number> = {
    romance: 0, utility: 0, aggression: 0,
    stability: 0, creative: 0, strategic: 0, meme: 0,
  }
  for (const q of questions) {
    const idx = answers[q.id]
    if (idx === undefined) continue
    for (const [axis, val] of Object.entries(q.options[idx].scores)) {
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
    if (dist < bestDist) { bestDist = dist; best = hand }
  }
  return best
}
```

## hands.json 構造
```json
[
  {
    "id": "78s",
    "notation": "7♠8♠",
    "typeName": "ロマン型アグレッサー",
    "description": "勝ちより美しい手を求める。EVよりドラマを選ぶ。",
    "trait": "コネクテッドスーテッドの象徴。ドローとドローが重なるとき、あなたは最も輝く。",
    "reason": "ロマン・攻撃性・クリエイティブすべてが高水準で一致した。",
    "scene": { "position": "CO / BTN", "format": "トーナメント", "stack": "ディープ" },
    "strategy": ["light 3bet", "セミブラフ多用", "ダブルバレル"],
    "demerit": "ドミネートされる頻度が高い。オーバープレイに注意。",
    "message": "あなたのポーカーには物語がある。それがあなたの強みだ。",
    "thresholds": { "romance": 15, "aggression": 12, "creative": 10, "utility": -5 }
  }
]
```

## questions.json 構造
```json
[
  {
    "id": "q001",
    "text": "ポーカーで一番気持ちいい瞬間は？",
    "type": "quad",
    "options": [
      { "label": "大きなブラフが通ったとき", "scores": { "romance": 3, "aggression": 2, "creative": 2 } },
      { "label": "ナッツでバリューを最大化できたとき", "scores": { "utility": 3, "strategic": 2 } },
      { "label": "完璧なフォールドができたとき", "scores": { "stability": 3, "strategic": 2 } },
      { "label": "クレイジーなハンドで勝ったとき", "scores": { "meme": 4, "romance": 1 } }
    ]
  }
]
```

## 拡張ルール
- 質問追加 → `questions.json` に追記のみ
- ハンド追加 → `hands.json` に追記＋`thresholds` 必須
- 軸追加 → `types/index.ts` の `ScoreAxis` を先に更新
