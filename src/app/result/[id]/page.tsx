'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import handsData from '@/data/hands.json'
import type { Hand, ScoreAxis } from '@/types'
import InkSplats from '@/components/InkSplats'

const hands = handsData as Hand[]

const axisLabels: Record<ScoreAxis, string> = {
  romance: 'ロマン',
  utility: '実利',
  aggression: '攻撃性',
  stability: '堅実性',
  creative: 'クリエイティブ',
  strategic: '戦略',
  meme: 'ネタ',
}

const axisColors: Record<ScoreAxis, string> = {
  romance: '#FF2E8B',
  utility: '#00D4FF',
  aggression: '#FF6B35',
  stability: '#BFFF00',
  creative: '#A855F7',
  strategic: '#FFE135',
  meme: '#00D4FF',
}

function PlayingCard({ char, suit, delay }: { char: string; suit: string; delay: number }) {
  const isRed = suit === '♥' || suit === '♦'
  const suitColor = isRed ? '#FF2E8B' : '#00D4FF'

  return (
    <motion.div
      className="w-28 h-40 md:w-36 md:h-52 rounded-2xl border-4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
      style={{
        borderColor: suitColor,
        background: `linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%)`,
        boxShadow: `0 0 30px ${suitColor}40`,
      }}
      initial={{ rotateY: 90, y: 40, opacity: 0 }}
      animate={{ rotateY: 0, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: delay / 1000 }}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-6 h-6 rounded-br-xl" style={{ backgroundColor: `${suitColor}30` }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 rounded-tl-xl" style={{ backgroundColor: `${suitColor}30` }} />

      <span className="font-display text-4xl md:text-5xl font-black" style={{ color: suitColor }}>
        {char}
      </span>
      <span className="text-3xl md:text-4xl" style={{ color: suitColor }}>
        {suit}
      </span>
    </motion.div>
  )
}

function parseNotation(notation: string) {
  const cards: { char: string; suit: string }[] = []
  const suits = ['♠', '♥', '♦', '♣']
  let i = 0
  while (i < notation.length) {
    let char = notation[i]
    i++
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

function InkGauge({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const percent = Math.min(Math.max((value / maxValue) * 100, 5), 100)

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="font-display font-bold text-sm text-ink-text">{label}</span>
        <span className="font-mono text-sm" style={{ color }}>{value}</span>
      </div>
      <div className="w-full h-4 bg-ink-card rounded-full overflow-hidden border border-ink-border">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
        />
      </div>
    </div>
  )
}

export default function ResultPage() {
  const params = useParams()
  const [hand, setHand] = useState<Hand | null>(null)
  const [scores, setScores] = useState<Record<ScoreAxis, number> | null>(null)

  useEffect(() => {
    const found = hands.find((h) => h.id === params.id)
    if (found) setHand(found)

    const result = sessionStorage.getItem('quizResult')
    if (result) {
      const parsed = JSON.parse(result)
      setScores(parsed.scores)
    }
  }, [params.id])

  if (!hand) {
    return (
      <main className="min-h-screen bg-ink-dark flex items-center justify-center">
        <motion.p
          className="text-ink-blue font-display font-bold text-xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </main>
    )
  }

  const cards = parseNotation(hand.notation)
  const maxScore = scores ? Math.max(...Object.values(scores), 1) : 20

  return (
    <main className="min-h-screen bg-ink-dark ink-dots relative">
      <InkSplats />

      {/* Hero: Cards */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        {/* Big background splat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ink-magenta/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <motion.p
            className="text-ink-lime font-display font-bold text-lg mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            あなたのマイハンは...
          </motion.p>

          <div className="flex gap-4 justify-center mb-8">
            {cards.map((card, idx) => (
              <PlayingCard key={idx} char={card.char} suit={card.suit} delay={idx * 400 + 500} />
            ))}
          </div>

          <motion.h1
            className="font-display text-4xl md:text-6xl font-black text-ink-text mb-3"
            style={{ textShadow: '3px 3px 0 #FF2E8B, -1px -1px 0 #00D4FF' }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1.2 }}
          >
            {hand.typeName}
          </motion.h1>

          <motion.p
            className="font-mono text-xl text-ink-blue font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {hand.notation}
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-ink-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Content sections */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-12 relative z-10">

        {/* Score gauge section */}
        {scores && (
          <SplatSection title="スコア" color="#00D4FF">
            <div className="space-y-1">
              {(Object.keys(axisLabels) as ScoreAxis[]).map((axis) => (
                <InkGauge
                  key={axis}
                  label={axisLabels[axis]}
                  value={scores[axis]}
                  maxValue={maxScore}
                  color={axisColors[axis]}
                />
              ))}
            </div>
          </SplatSection>
        )}

        {/* あなたの性格 */}
        <SplatSection title="あなたの性格" color="#FF2E8B">
          <p className="text-ink-text/90 font-body text-lg leading-relaxed">{hand.description}</p>
        </SplatSection>

        {/* このハンドの特性 */}
        <SplatSection title="このハンドの特性" color="#BFFF00">
          <p className="text-ink-text/90 font-body text-lg leading-relaxed">{hand.trait}</p>
        </SplatSection>

        {/* あなたに合う理由 */}
        <SplatSection title="あなたに合う理由" color="#00D4FF">
          <p className="text-ink-text/90 font-body text-lg leading-relaxed">{hand.reason}</p>
        </SplatSection>

        {/* このハンドが生きる場面 */}
        <SplatSection title="このハンドが生きる場面" color="#FFE135">
          <div className="grid grid-cols-3 gap-3">
            <SceneCard label="ポジション" value={hand.scene.position} color="#00D4FF" />
            <SceneCard label="形式" value={hand.scene.format} color="#FF2E8B" />
            <SceneCard label="スタック" value={hand.scene.stack} color="#BFFF00" />
          </div>
        </SplatSection>

        {/* 戦略コメント */}
        <SplatSection title="戦略コメント" color="#FF6B35">
          <ul className="space-y-2">
            {hand.strategy.map((s, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-ink-lime font-mono text-lg mt-0.5">▸</span>
                <span className="text-ink-text/90 font-body">{s}</span>
              </motion.li>
            ))}
          </ul>
        </SplatSection>

        {/* デメリット */}
        <SplatSection title="デメリット" color="#FF2E8B">
          <div className="border-l-4 border-ink-magenta pl-4 bg-ink-magenta/5 rounded-r-xl py-3 pr-4">
            <p className="text-ink-text/80 font-body leading-relaxed">{hand.demerit}</p>
          </div>
        </SplatSection>

        {/* メッセージ */}
        <motion.section
          className="text-center py-12 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-ink-blue/5 rounded-3xl -rotate-1" />
          <div className="relative">
            <p className="font-display text-2xl md:text-3xl font-black text-ink-text leading-relaxed px-4"
               style={{ textShadow: '2px 2px 0 rgba(0,212,255,0.3)' }}>
              &ldquo;{hand.message}&rdquo;
            </p>
          </div>
        </motion.section>

        {/* Share CTA */}
        <motion.div
          className="text-center pb-8"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
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
                alert('URLをコピーしたよ！')
              }
            }}
            className="px-10 py-4 bg-ink-lime text-ink-dark font-display font-black text-lg rounded-2xl
                       border-b-4 border-ink-lime/60 hover-shake
                       hover:brightness-110 active:border-b-2 active:translate-y-0.5
                       transition-all duration-150 shadow-lg shadow-ink-lime/30"
          >
            結果をシェアする！
          </button>
        </motion.div>
      </div>
    </main>
  )
}

function SplatSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }} />
        <h2 className="font-display text-2xl font-black" style={{ color }}>
          {title}
        </h2>
      </div>
      <div className="bg-ink-card/50 border-2 border-ink-border rounded-2xl p-6">
        {children}
      </div>
    </motion.section>
  )
}

function SceneCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      className="bg-ink-card border-2 border-ink-border rounded-xl p-4 text-center"
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      <p className="text-ink-muted text-xs font-display font-bold mb-1">{label}</p>
      <p className="font-display font-black text-sm" style={{ color }}>{value}</p>
    </motion.div>
  )
}
