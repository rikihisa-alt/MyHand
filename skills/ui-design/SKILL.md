# UIデザイン方針 - SKILL.md

## 核心思想
「ポーカーテーブルに座っている感覚」をUIで再現する。
SaaSでも診断LPでもなく、ポーカー文化のコンテンツとして成立させる。

## 絶対禁止
- Inter / Roboto / system-ui フォント
- 紫グラデーション × 白背景
- 均等3カラムカードレイアウト
- ラジオボタン感のある選択肢UI
- アイコン多用の説明ブロック
- 「診断スタート！」系の過剰CTA

## カラーパレット
```css
:root {
  --bg-deep:        #0a0a0a;
  --bg-felt:        #0f1a0f;
  --accent:         #c8a96e;
  --accent-dim:     #8a6f3e;
  --text-primary:   #f0ead8;
  --text-secondary: #7a7060;
  --card-bg:        #1a1a1a;
  --card-border:    #2a2520;
  --danger:         #8b1a1a;
}
```

## フォント
```
Display : "Playfair Display" — タイプ名・ハンド表記
Body    : "Noto Serif JP"    — 日本語本文
Mono    : "JetBrains Mono"   — スコア・数値
```

## tailwind.config.ts
```ts
export default {
  theme: {
    extend: {
      colors: {
        felt: '#0f1a0f', deep: '#0a0a0a',
        gold: '#c8a96e', ivory: '#f0ead8', danger: '#8b1a1a',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body:    ['Noto Serif JP', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

## 画面別指針

### トップ
- 暗いテーブル背景＋伏せカード1枚の演出
- コピー：「あなたのハンドが、あなたを語る。」
- CTAボタン1つのみ（ゴールド）

### 診断画面
- 1問ずつ全画面
- 選択肢はフェードイン（カードを引く感覚）
- プログレス：下部に細く「12 / 34」形式
- 選択後は確認なしで即次問へ

### 結果ページ
- カード2枚を大きく・登場アニメあり
- タイプ名：Playfair Display で大きく
- 縦スクロール型の読み物として展開
- シェアCTAは最下部に控えめに

## アニメーション
```css
@keyframes cardReveal {
  from { opacity: 0; transform: rotateY(90deg) translateY(20px); }
  to   { opacity: 1; transform: rotateY(0deg) translateY(0); }
}
@keyframes questionIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
