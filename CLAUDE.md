# マイハン診断 - CLAUDE.md

## プロジェクト概要
ポーカープレイヤーが質問に回答し「マイハン（象徴ポーカーハンド）」を診断するWebサービス。
ポーカー文化系コンテンツとして、結果をスクショ・シェアしたくなる読み物UIを目指す。

## 技術スタック
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript（strict mode）
- **Styling**: Tailwind CSS v3（v4禁止）
- **DB**: Supabase（MVP段階はJSONで代替可）
- **Deploy**: Vercel

## ディレクトリ構成
```
src/
├── app/
│   ├── page.tsx
│   ├── entry/page.tsx
│   ├── quiz/page.tsx
│   └── result/[id]/page.tsx
├── components/
│   ├── ui/
│   └── quiz/
├── data/
│   ├── questions.json
│   └── hands.json
├── lib/
│   ├── scoring.ts
│   └── supabase.ts
└── types/
    └── index.ts
```

## 開発フロー（必ず守る）
1. 実装前に `npm run dev` で起動確認
2. 各Phase完了後に必ず `npm run build` でエラーチェック
3. Vercel deploy後にURLを出力する
4. ビルドエラーが出たら即修正してから次に進む

## 開発フェーズ
- **Phase1（MVP）**: 診断UI・30問・20ハンド・結果ページ
- **Phase2**: 質問100問・ハンド100種・戦略コメント強化
- **Phase3**: SNS画像生成・ランキング・ハンド比較

## 完璧主義禁止ルール
- 最初から全ハンド・完全ロジックを作らない
- まず動くものを作り、後から拡張する
- データ（質問・ハンド・結果文）はすべてJSONで外出しし追加可能にする

## Tailwind設定（重要）
```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 型定義（必ず守る）
```ts
// types/index.ts
export type ScoreAxis =
  'romance' | 'utility' | 'aggression' | 'stability' | 'creative' | 'strategic' | 'meme'

export interface Question {
  id: string
  text: string
  type: 'binary' | 'quad' | 'scale'
  options: { label: string; scores: Partial<Record<ScoreAxis, number>> }[]
}

export interface Hand {
  id: string
  notation: string
  typeName: string
  description: string
  trait: string
  reason: string
  scene: { position: string; format: string; stack: string }
  strategy: string[]
  demerit: string
  message: string
  thresholds: Partial<Record<ScoreAxis, number>>
}
```

## スキルファイル参照
- `skills/scoring-logic/SKILL.md` — スコアリングロジック実装時に必ず参照
- `skills/ui-design/SKILL.md` — UI実装時に必ず参照
