'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import handsData from '@/data/hands.json'
import type { Hand } from '@/types'

const hands = handsData as Hand[]

function PlayingCard({ char, suit, delay }: { char: string; suit: string; delay: number }) {
  const suitColor = suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-ivory'
  return (
    <div
      className="w-28 h-40 md:w-36 md:h-52 rounded-xl border-2 border-card-border bg-card-bg flex flex-col items-center justify-center shadow-2xl"
      style={{
        animation: `cardReveal 0.8s ease-out ${delay}ms forwards`,
        opacity: 0,
      }}
    >
      <span className={`font-display text-4xl md:text-5xl font-bold ${suitColor}`}>
        {char}
      </span>
      <span className={`font-display text-2xl md:text-3xl ${suitColor}`}>
        {suit}
      </span>
    </div>
  )
}

function parseNotation(notation: string) {
  // Parse e.g. "7♠8♠" → [{char:'7', suit:'♠'}, {char:'8', suit:'♠'}]
  const cards: { char: string; suit: string }[] = []
  const suits = ['♠', '♥', '♦', '♣']
  let i = 0
  while (i < notation.length) {
    let char = notation[i]
    i++
    // Check for '10'
    if (char === '1' && notation[i] === '0') {
      char = '10'
      i++
    }
    if (i < notation.length && suits.includes(notation[i])) {
      cards.push({ char, suit: notation[i] })
      i++
    }
  }
  return cards
}

export default function ResultPage() {
  const params = useParams()
  const [hand, setHand] = useState<Hand | null>(null)

  useEffect(() => {
    const found = hands.find((h) => h.id === params.id)
    if (found) setHand(found)
  }, [params.id])

  if (!hand) {
    return (
      <main className="min-h-screen bg-deep flex items-center justify-center">
        <p className="text-muted font-body">Loading...</p>
      </main>
    )
  }

  const cards = parseNotation(hand.notation)

  return (
    <main className="min-h-screen bg-deep">
      {/* Hero: Cards */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-felt/20 via-deep to-deep" />

        <div className="relative z-10 text-center">
          <p className="text-muted font-body text-sm mb-8">あなたのマイハンは</p>

          <div className="flex gap-4 justify-center mb-8">
            {cards.map((card, idx) => (
              <PlayingCard key={idx} char={card.char} suit={card.suit} delay={idx * 400} />
            ))}
          </div>

          <h1
            className="font-display text-4xl md:text-6xl font-bold text-gold mb-4"
            style={{ animation: 'questionIn 0.6s ease-out 1s forwards', opacity: 0 }}
          >
            {hand.typeName}
          </h1>
          <p
            className="font-mono text-lg text-muted"
            style={{ animation: 'questionIn 0.6s ease-out 1.2s forwards', opacity: 0 }}
          >
            {hand.notation}
          </p>
        </div>

        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Content sections */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-16">
        {/* あなたの性格 */}
        <Section title="あなたの性格">
          <p className="text-ivory/90 font-body text-lg leading-relaxed">{hand.description}</p>
        </Section>

        {/* このハンドの特性 */}
        <Section title="このハンドの特性">
          <p className="text-ivory/90 font-body text-lg leading-relaxed">{hand.trait}</p>
        </Section>

        {/* あなたに合う理由 */}
        <Section title="あなたに合う理由">
          <p className="text-ivory/90 font-body text-lg leading-relaxed">{hand.reason}</p>
        </Section>

        {/* このハンドが生きる場面 */}
        <Section title="このハンドが生きる場面">
          <div className="grid grid-cols-3 gap-4">
            <SceneCard label="ポジション" value={hand.scene.position} />
            <SceneCard label="形式" value={hand.scene.format} />
            <SceneCard label="スタック" value={hand.scene.stack} />
          </div>
        </Section>

        {/* 戦略コメント */}
        <Section title="戦略コメント">
          <ul className="space-y-2">
            {hand.strategy.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gold font-mono text-sm mt-1">▸</span>
                <span className="text-ivory/90 font-body">{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* デメリット */}
        <Section title="デメリット">
          <div className="border-l-2 border-danger pl-4">
            <p className="text-ivory/80 font-body leading-relaxed">{hand.demerit}</p>
          </div>
        </Section>

        {/* メッセージ */}
        <section className="text-center py-12 border-t border-card-border">
          <p className="font-body text-xl md:text-2xl text-gold leading-relaxed italic">
            &ldquo;{hand.message}&rdquo;
          </p>
        </section>

        {/* Share CTA */}
        <div className="text-center pb-8">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `マイハン診断: ${hand.typeName}`,
                  text: `私のマイハンは${hand.notation}（${hand.typeName}）でした！`,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('URLをコピーしました')
              }
            }}
            className="px-8 py-3 border border-gold text-gold font-body rounded-lg hover:bg-gold/10 transition-colors"
          >
            結果をシェアする
          </button>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-gold mb-4 pb-2 border-b border-card-border">
        {title}
      </h2>
      {children}
    </section>
  )
}

function SceneCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-4 text-center">
      <p className="text-muted text-xs font-body mb-1">{label}</p>
      <p className="text-ivory font-body text-sm">{value}</p>
    </div>
  )
}
