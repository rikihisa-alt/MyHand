'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
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
  meme: 'エンタメ',
}

const axisEmoji: Record<ScoreAxis, string> = {
  romance: '💫',
  utility: '💰',
  aggression: '🔥',
  stability: '🛡️',
  creative: '🎨',
  strategic: '🧠',
  meme: '🎪',
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

// Compatible hands mapping
const compatibleHands: Record<string, { id: string; reason: string }> = {
  'AA': { id: 'KQs', reason: '王者を華やかに彩るNo.2' },
  'AKs': { id: 'A5s', reason: '理論派同士、3betレンジで共闘' },
  'AQo': { id: 'JJ', reason: '堅実さを共有する盟友' },
  'JJ': { id: 'TT', reason: 'ミドルペア同士、悩みを分かち合える' },
  'TT': { id: '99', reason: 'バランスと堅実さの共存' },
  '99': { id: '22', reason: '忍耐力の絆で結ばれた仲間' },
  '88': { id: '99', reason: 'セットハンター仲間' },
  'KQs': { id: 'QJs', reason: 'コネクテッドの美学を共有' },
  'QJs': { id: 'JTs', reason: 'ドロー系ハンドの夢の共演' },
  'JTs': { id: '78s', reason: 'ロマン追求者同士の固い絆' },
  'T9s': { id: '98s', reason: 'ステルスとフローの最強コンビ' },
  '98s': { id: '67s', reason: '直感と挑戦心のハーモニー' },
  '78s': { id: 'JTs', reason: '夢とドラマの共演者' },
  '67s': { id: '72o', reason: 'アンダードッグとエンタメの奇跡的融合' },
  'A5s': { id: 'AKs', reason: '理論武装した3betマスターズ' },
  'A4s': { id: 'AQo', reason: '堅実派Ace同士の信頼関係' },
  'K9s': { id: 'T9s', reason: '柔軟性とステルスの相乗効果' },
  'Q9s': { id: 'K9s', reason: 'ダークホース同士、読まれない者たち' },
  '22': { id: '88', reason: 'セットマイニングの師弟関係' },
  '72o': { id: '67s', reason: 'カオスとチャレンジの最強タッグ' },
}

// Confetti particle
function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; color: string; size: number; rotation: number; delay: number
  }>>([])

  useEffect(() => {
    const colors = ['#FF2E8B', '#00D4FF', '#BFFF00', '#FFE135', '#FF6B35', '#A855F7']
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: '2px',
          }}
          initial={{ y: `${p.y}vh`, rotate: p.rotation, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 720,
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Radar chart using SVG
function RadarChart({ scores, maxValue }: { scores: Record<ScoreAxis, number>; maxValue: number }) {
  const axes = Object.keys(axisLabels) as ScoreAxis[]
  const centerX = 150
  const centerY = 150
  const radius = 100
  const angleStep = (2 * Math.PI) / axes.length

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / maxValue) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  // Grid lines
  const gridLevels = [0.25, 0.5, 0.75, 1]
  const gridPaths = gridLevels.map((level) => {
    const points = axes.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2
      const r = level * radius
      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`
    })
    return `M${points.join('L')}Z`
  })

  // Data polygon
  const dataPoints = axes.map((axis, i) => getPoint(i, Math.max(scores[axis], 0)))
  const dataPath = `M${dataPoints.map((p) => `${p.x},${p.y}`).join('L')}Z`

  // Axis lines
  const axisLines = axes.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2
    return {
      x2: centerX + radius * Math.cos(angle),
      y2: centerY + radius * Math.sin(angle),
    }
  })

  // Label positions
  const labelPositions = axes.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2
    const r = radius + 28
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  })

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      {/* Grid */}
      {gridPaths.map((path, i) => (
        <path key={i} d={path} fill="none" stroke="#3a3a5a" strokeWidth="0.5" opacity={0.5} />
      ))}

      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line key={i} x1={centerX} y1={centerY} x2={line.x2} y2={line.y2} stroke="#3a3a5a" strokeWidth="0.5" opacity={0.3} />
      ))}

      {/* Data polygon */}
      <motion.path
        d={dataPath}
        fill="rgba(0, 212, 255, 0.15)"
        stroke="#00D4FF"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
      />

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={axisColors[axes[i]]}
          stroke="#1a1a2e"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.1 }}
        />
      ))}

      {/* Labels */}
      {labelPositions.map((pos, i) => (
        <text
          key={i}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={axisColors[axes[i]]}
          fontSize="10"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          {axisLabels[axes[i]]}
        </text>
      ))}
    </svg>
  )
}

function PlayingCard({ char, suit, delay }: { char: string; suit: string; delay: number }) {
  const isRed = suit === '♥' || suit === '♦'
  const suitColor = isRed ? '#FF2E8B' : '#00D4FF'

  return (
    <motion.div
      className="w-32 h-44 md:w-40 md:h-56 rounded-2xl border-4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
      style={{
        borderColor: suitColor,
        background: `linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%)`,
        boxShadow: `0 0 40px ${suitColor}50, 0 0 80px ${suitColor}20`,
      }}
      initial={{ rotateY: 180, y: 60, opacity: 0, scale: 0.5 }}
      animate={{ rotateY: 0, y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 18, delay: delay / 1000 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%', y: '-100%' }}
        animate={{ x: '200%', y: '200%' }}
        transition={{ duration: 1.5, delay: delay / 1000 + 0.8, ease: 'easeInOut' }}
      />

      <div className="absolute top-2 left-3">
        <span className="text-sm font-mono font-bold" style={{ color: suitColor }}>{char}</span>
        <br />
        <span className="text-xs" style={{ color: suitColor }}>{suit}</span>
      </div>

      <span className="font-display text-5xl md:text-6xl font-black" style={{ color: suitColor }}>
        {char}
      </span>
      <span className="text-4xl md:text-5xl" style={{ color: suitColor }}>
        {suit}
      </span>

      <div className="absolute bottom-2 right-3 rotate-180">
        <span className="text-sm font-mono font-bold" style={{ color: suitColor }}>{char}</span>
        <br />
        <span className="text-xs" style={{ color: suitColor }}>{suit}</span>
      </div>
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

function InkGauge({ label, emoji, value, maxValue, color, delay }: {
  label: string; emoji: string; value: number; maxValue: number; color: string; delay: number
}) {
  const percent = Math.min(Math.max((value / maxValue) * 100, 5), 100)

  return (
    <motion.div
      className="mb-3"
      initial={{ x: -30, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="flex justify-between mb-1">
        <span className="font-display font-bold text-sm text-ink-text">
          {emoji} {label}
        </span>
        <span className="font-mono text-sm font-bold" style={{ color }}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <div className="w-full h-5 bg-ink-card rounded-full overflow-hidden border border-ink-border relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          {/* Glow effect on bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Reveal stage component
function RevealStage({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function ResultPage() {
  const params = useParams()
  const [hand, setHand] = useState<Hand | null>(null)
  const [scores, setScores] = useState<Record<ScoreAxis, number> | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)
  const [revealPhase, setRevealPhase] = useState(0)
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {
    const found = hands.find((h) => h.id === params.id)
    if (found) setHand(found)

    const result = sessionStorage.getItem('quizResult')
    if (result) {
      const parsed = JSON.parse(result)
      setScores(parsed.scores)
    }

    const playerInfo = sessionStorage.getItem('playerInfo')
    if (playerInfo) {
      const parsed = JSON.parse(playerInfo)
      setPlayerName(parsed.pokerName || '')
    }

    // Reveal phases
    setTimeout(() => setRevealPhase(1), 500)
    setTimeout(() => setRevealPhase(2), 1500)
    setTimeout(() => setRevealPhase(3), 2500)

    // Stop confetti after 5s
    setTimeout(() => setShowConfetti(false), 5000)
  }, [params.id])

  const handleShare = useCallback(() => {
    if (!hand) return
    if (navigator.share) {
      navigator.share({
        title: `マイハン診断: ${hand.typeName}`,
        text: `【マイハン診断】\n${playerName ? `${playerName}さんの` : '私の'}マイハンは${hand.notation}（${hand.typeName}）でした！\n\nあなたも診断してみよう！`,
        url: window.location.origin,
      })
    } else {
      navigator.clipboard.writeText(
        `【マイハン診断】\n${playerName ? `${playerName}さんの` : '私の'}マイハンは${hand.notation}（${hand.typeName}）でした！\n${window.location.origin}`
      )
      alert('コピーしたよ！')
    }
  }, [hand, playerName])

  const handleTwitterShare = useCallback(() => {
    if (!hand) return
    const text = encodeURIComponent(
      `【マイハン診断】\n${playerName ? `${playerName}の` : '私の'}マイハンは${hand.notation}（${hand.typeName}）でした！\n\n「${hand.message}」\n\nあなたも診断してみよう！`
    )
    const url = encodeURIComponent(window.location.origin)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }, [hand, playerName])

  if (!hand) {
    return (
      <main className="min-h-screen bg-ink-dark flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🎴
          </motion.div>
          <p className="text-ink-blue font-display font-bold text-xl">結果を読み込み中...</p>
        </motion.div>
      </main>
    )
  }

  const cards = parseNotation(hand.notation)
  const maxScore = scores ? Math.max(...Object.values(scores).map(v => Math.abs(v)), 1) : 20
  const compatible = compatibleHands[hand.id]
  const compatibleHand = compatible ? hands.find(h => h.id === compatible.id) : null

  // Find dominant axis
  const dominantAxis = scores
    ? (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as ScoreAxis)
    : 'strategic'

  return (
    <main className="min-h-screen bg-ink-dark ink-dots relative">
      <InkSplats />
      {showConfetti && <Confetti />}

      {/* ===== HERO: Card Reveal ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
             style={{ backgroundColor: `${axisColors[dominantAxis]}08` }} />

        <div className="relative z-10 text-center">
          {/* Pre-reveal text */}
          <AnimatePresence>
            {revealPhase >= 1 && (
              <motion.p
                className="text-ink-lime font-display font-bold text-lg md:text-xl mb-8"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {playerName ? `${playerName}さんの` : 'あなたの'}マイハンは...
              </motion.p>
            )}
          </AnimatePresence>

          {/* Cards */}
          <AnimatePresence>
            {revealPhase >= 2 && (
              <motion.div className="flex gap-4 md:gap-6 justify-center mb-8">
                {cards.map((card, idx) => (
                  <PlayingCard key={idx} char={card.char} suit={card.suit} delay={idx * 400} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Type name - BIG reveal */}
          <AnimatePresence>
            {revealPhase >= 3 && (
              <>
                <motion.h1
                  className="font-display text-4xl md:text-7xl font-black text-ink-text mb-3"
                  style={{ textShadow: '4px 4px 0 #FF2E8B, -2px -2px 0 #00D4FF' }}
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                >
                  {hand.typeName}
                </motion.h1>

                <motion.p
                  className="font-mono text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: axisColors[dominantAxis] }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {hand.notation}
                </motion.p>

                <motion.p
                  className="text-ink-muted font-body text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {axisEmoji[dominantAxis]} {axisLabels[dominantAxis]}タイプ
                </motion.p>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll indicator */}
        {revealPhase >= 3 && (
          <motion.div
            className="absolute bottom-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ opacity: { delay: 1 }, y: { duration: 1.5, repeat: Infinity } }}
          >
            <p className="text-ink-muted text-xs font-display mb-2">もっと見る</p>
            <svg className="w-6 h-6 text-ink-blue mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        )}
      </section>

      {/* ===== Content sections ===== */}
      <div className="max-w-2xl mx-auto px-5 pb-20 space-y-14 relative z-10">

        {/* Radar chart + Score gauge */}
        {scores && (
          <RevealStage>
            <SplatSection title="あなたのステータス" color="#00D4FF" emoji="📊">
              <RadarChart scores={scores} maxValue={maxScore} />
              <div className="mt-6 space-y-1">
                {(Object.keys(axisLabels) as ScoreAxis[]).map((axis, i) => (
                  <InkGauge
                    key={axis}
                    label={axisLabels[axis]}
                    emoji={axisEmoji[axis]}
                    value={scores[axis]}
                    maxValue={maxScore}
                    color={axisColors[axis]}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            </SplatSection>
          </RevealStage>
        )}

        {/* あなたの性格 */}
        <RevealStage delay={0.1}>
          <SplatSection title="あなたの性格" color="#FF2E8B" emoji="🃏">
            <p className="text-ink-text/90 font-body text-base md:text-lg leading-relaxed whitespace-pre-line">{hand.description}</p>
          </SplatSection>
        </RevealStage>

        {/* このハンドの特性 */}
        <RevealStage delay={0.1}>
          <SplatSection title="このハンドの特性" color="#BFFF00" emoji="♠️">
            <p className="text-ink-text/90 font-body text-base md:text-lg leading-relaxed whitespace-pre-line">{hand.trait}</p>
          </SplatSection>
        </RevealStage>

        {/* あなたに合う理由 */}
        <RevealStage delay={0.1}>
          <SplatSection title="あなたに合う理由" color="#00D4FF" emoji="🎯">
            <p className="text-ink-text/90 font-body text-base md:text-lg leading-relaxed whitespace-pre-line">{hand.reason}</p>
          </SplatSection>
        </RevealStage>

        {/* このハンドが生きる場面 */}
        <RevealStage delay={0.1}>
          <SplatSection title="このハンドが生きる場面" color="#FFE135" emoji="🎰">
            <div className="grid grid-cols-3 gap-3">
              <SceneCard label="ポジション" value={hand.scene.position} color="#00D4FF" icon="📍" />
              <SceneCard label="形式" value={hand.scene.format} color="#FF2E8B" icon="🏆" />
              <SceneCard label="スタック" value={hand.scene.stack} color="#BFFF00" icon="💎" />
            </div>
          </SplatSection>
        </RevealStage>

        {/* 戦略コメント */}
        <RevealStage delay={0.1}>
          <SplatSection title="戦略アドバイス" color="#FF6B35" emoji="⚔️">
            <ul className="space-y-3">
              {hand.strategy.map((s, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 bg-ink-dark/30 rounded-xl px-4 py-3 border border-ink-border/50"
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-ink-lime font-mono text-lg mt-0.5 shrink-0">#{i + 1}</span>
                  <span className="text-ink-text/90 font-body text-sm md:text-base">{s}</span>
                </motion.li>
              ))}
            </ul>
          </SplatSection>
        </RevealStage>

        {/* デメリット */}
        <RevealStage delay={0.1}>
          <SplatSection title="注意ポイント" color="#FF2E8B" emoji="⚠️">
            <div className="border-l-4 border-ink-magenta pl-4 bg-ink-magenta/5 rounded-r-xl py-4 pr-4">
              <p className="text-ink-text/80 font-body leading-relaxed text-sm md:text-base">{hand.demerit}</p>
            </div>
          </SplatSection>
        </RevealStage>

        {/* 相性の良いハンド */}
        {compatibleHand && (
          <RevealStage delay={0.1}>
            <SplatSection title="相性の良いハンド" color="#A855F7" emoji="🤝">
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center gap-3 bg-ink-dark/50 rounded-2xl px-6 py-4 border-2 border-purple-500/30"
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="font-display text-3xl font-black" style={{ color: '#A855F7' }}>
                    {compatibleHand.notation}
                  </span>
                  <div className="text-left">
                    <p className="font-display font-bold text-ink-text text-sm">{compatibleHand.typeName}</p>
                    <p className="text-ink-muted text-xs">{compatible.reason}</p>
                  </div>
                </motion.div>
              </div>
            </SplatSection>
          </RevealStage>
        )}

        {/* メッセージ - Final big message */}
        <RevealStage delay={0.1}>
          <motion.section
            className="text-center py-12 relative"
            whileInView={{ scale: [0.95, 1] }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ink-magenta/5 via-ink-blue/5 to-ink-lime/5 rounded-3xl -rotate-1" />
            <div className="relative px-4">
              <motion.div
                className="text-5xl mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💬
              </motion.div>
              <p className="font-display text-xl md:text-2xl font-black text-ink-text leading-relaxed"
                 style={{ textShadow: '2px 2px 0 rgba(0,212,255,0.2)' }}>
                &ldquo;{hand.message}&rdquo;
              </p>
            </div>
          </motion.section>
        </RevealStage>

        {/* ===== Action buttons ===== */}
        <RevealStage>
          <div className="space-y-4 text-center pb-8">
            {/* Twitter/X Share */}
            <motion.button
              onClick={handleTwitterShare}
              className="w-full max-w-sm mx-auto block px-8 py-4 bg-[#1DA1F2] text-white font-display font-black text-lg rounded-2xl
                         border-b-4 border-[#1DA1F2]/60 hover-shake
                         hover:brightness-110 active:border-b-2 active:translate-y-0.5
                         transition-all duration-150 shadow-lg shadow-[#1DA1F2]/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              𝕏 でシェアする
            </motion.button>

            {/* General Share */}
            <motion.button
              onClick={handleShare}
              className="w-full max-w-sm mx-auto block px-8 py-4 bg-ink-lime text-ink-dark font-display font-black text-lg rounded-2xl
                         border-b-4 border-ink-lime/60 hover-shake
                         hover:brightness-110 active:border-b-2 active:translate-y-0.5
                         transition-all duration-150 shadow-lg shadow-ink-lime/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              結果をシェアする
            </motion.button>

            {/* Retry */}
            <Link href="/entry" className="block">
              <motion.div
                className="w-full max-w-sm mx-auto px-8 py-4 bg-ink-card text-ink-text font-display font-bold text-lg rounded-2xl
                           border-2 border-ink-border hover:border-ink-blue/50
                           transition-all duration-150"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                もう一度診断する
              </motion.div>
            </Link>
          </div>
        </RevealStage>
      </div>
    </main>
  )
}

function SplatSection({ title, color, emoji, children }: { title: string; color: string; emoji?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}60` }} />
        <h2 className="font-display text-xl md:text-2xl font-black" style={{ color }}>
          {title}
        </h2>
      </div>
      <div className="bg-ink-card/50 border-2 border-ink-border rounded-2xl p-5 md:p-6 backdrop-blur-sm">
        {children}
      </div>
    </section>
  )
}

function SceneCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <motion.div
      className="bg-ink-card border-2 border-ink-border rounded-xl p-3 md:p-4 text-center"
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      <p className="text-xl mb-1">{icon}</p>
      <p className="text-ink-muted text-xs font-display font-bold mb-1">{label}</p>
      <p className="font-display font-black text-xs md:text-sm" style={{ color }}>{value}</p>
    </motion.div>
  )
}
