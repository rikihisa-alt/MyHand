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

const axisColors: Record<ScoreAxis, string> = {
  romance: '#FF2E8B',
  utility: '#4FC3F7',
  aggression: '#FF6B35',
  stability: '#81C784',
  creative: '#CE93D8',
  strategic: '#FFD54F',
  meme: '#4DD0E1',
}

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

function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; color: string; size: number; rotation: number; delay: number
  }>>([])

  useEffect(() => {
    const colors = ['#FF2E8B', '#4FC3F7', '#81C784', '#FFD54F', '#CE93D8']
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
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
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

function RadarChart({ scores, maxValue }: { scores: Record<ScoreAxis, number>; maxValue: number }) {
  const axes = Object.keys(axisLabels) as ScoreAxis[]
  const cx = 150, cy = 150, r = 100
  const step = (2 * Math.PI) / axes.length

  const pt = (i: number, v: number) => {
    const a = step * i - Math.PI / 2
    const rv = (v / maxValue) * r
    return { x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) }
  }

  const grid = [0.25, 0.5, 0.75, 1].map(lv => {
    const pts = axes.map((_, i) => {
      const a = step * i - Math.PI / 2
      return `${cx + lv * r * Math.cos(a)},${cy + lv * r * Math.sin(a)}`
    })
    return `M${pts.join('L')}Z`
  })

  const dataPoints = axes.map((axis, i) => pt(i, Math.max(scores[axis], 0)))
  const dataPath = `M${dataPoints.map(p => `${p.x},${p.y}`).join('L')}Z`

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {grid.map((d, i) => <path key={i} d={d} fill="none" stroke="#3a3a5a" strokeWidth="0.5" opacity={0.4} />)}
      {axes.map((_, i) => {
        const a = step * i - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#3a3a5a" strokeWidth="0.5" opacity={0.2} />
      })}
      <motion.path d={dataPath} fill="rgba(79,195,247,0.12)" stroke="#4FC3F7" strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
      {dataPoints.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="3.5" fill={axisColors[axes[i]]} stroke="#1a1a2e" strokeWidth="1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }} />
      ))}
      {axes.map((_, i) => {
        const a = step * i - Math.PI / 2
        const lr = r + 24
        return <text key={i} x={cx + lr * Math.cos(a)} y={cy + lr * Math.sin(a)} textAnchor="middle" dominantBaseline="middle"
          fill="#a0a0b0" fontSize="9" fontWeight="600" fontFamily="system-ui">{axisLabels[axes[i]]}</text>
      })}
    </svg>
  )
}

function PlayingCard({ char, suit, delay }: { char: string; suit: string; delay: number }) {
  const isRed = suit === '♥' || suit === '♦'
  const suitColor = isRed ? '#FF2E8B' : '#4FC3F7'

  return (
    <motion.div
      className="w-28 h-40 md:w-36 md:h-52 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
      style={{
        borderColor: `${suitColor}80`,
        background: `linear-gradient(145deg, #252540 0%, #1a1a2e 100%)`,
        boxShadow: `0 0 30px ${suitColor}25`,
      }}
      initial={{ rotateY: 180, y: 50, opacity: 0, scale: 0.6 }}
      animate={{ rotateY: 0, y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 18, delay: delay / 1000 }}
    >
      <motion.div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
        initial={{ x: '-100%', y: '-100%' }} animate={{ x: '200%', y: '200%' }}
        transition={{ duration: 1.5, delay: delay / 1000 + 0.8, ease: 'easeInOut' }} />
      <div className="absolute top-2 left-2.5">
        <span className="text-xs font-mono font-bold block" style={{ color: suitColor }}>{char}</span>
        <span className="text-xs block" style={{ color: suitColor }}>{suit}</span>
      </div>
      <span className="font-display text-4xl md:text-5xl font-black" style={{ color: suitColor }}>{char}</span>
      <span className="text-3xl md:text-4xl mt-1" style={{ color: suitColor }}>{suit}</span>
      <div className="absolute bottom-2 right-2.5 rotate-180">
        <span className="text-xs font-mono font-bold block" style={{ color: suitColor }}>{char}</span>
        <span className="text-xs block" style={{ color: suitColor }}>{suit}</span>
      </div>
    </motion.div>
  )
}

function parseNotation(notation: string) {
  const cards: { char: string; suit: string }[] = []
  const suits = ['♠', '♥', '♦', '♣']
  let i = 0
  while (i < notation.length) {
    let char = notation[i]; i++
    if (char === '1' && notation[i] === '0') { char = '10'; i++ }
    if (i < notation.length && suits.includes(notation[i])) { cards.push({ char, suit: notation[i] }); i++ }
  }
  return cards
}

function ScoreBar({ label, value, maxValue, color, delay }: {
  label: string; value: number; maxValue: number; color: string; delay: number
}) {
  // 100点満点に正規化（最低0、最高100）
  const normalized = Math.round(Math.min(Math.max((value / maxValue) * 100, 0), 100))
  const barWidth = Math.max(normalized, 3) // 最低3%の表示幅
  return (
    <motion.div className="mb-3" initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }} transition={{ delay }}>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-ink-text/70 font-body">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color }}>{normalized}</span>
      </div>
      <div className="w-full h-2.5 bg-ink-card rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} whileInView={{ width: `${barWidth}%` }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }} />
      </div>
    </motion.div>
  )
}

function RevealStage({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay }}>
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
    if (result) setScores(JSON.parse(result).scores)
    const info = sessionStorage.getItem('playerInfo')
    if (info) setPlayerName(JSON.parse(info).pokerName || '')
    setTimeout(() => setRevealPhase(1), 500)
    setTimeout(() => setRevealPhase(2), 1500)
    setTimeout(() => setRevealPhase(3), 2500)
    setTimeout(() => setShowConfetti(false), 4000)
  }, [params.id])

  const handleShare = useCallback(() => {
    if (!hand) return
    const name = playerName || '私'
    const txt = `${hand.notation}（${hand.typeName}）\n\n${name}の魂のハンド、決まりました。\n\n「${hand.message}」\n\n30問であなたのポーカー人格が丸裸に👇\n@My_Hand_Poker\n#マイハン診断 #ポーカー #マイハンでポット獲得投稿`
    if (navigator.share) {
      navigator.share({ title: `${name}のマイハンは${hand.notation}`, text: txt, url: window.location.origin })
    } else {
      navigator.clipboard.writeText(`${txt}\n${window.location.origin}`)
      alert('コピーしたよ！')
    }
  }, [hand, playerName])

  const handleTwitterShare = useCallback(() => {
    if (!hand) return
    const name = playerName || '私'
    const text = encodeURIComponent(`${hand.notation}（${hand.typeName}）\n\n${name}の魂のハンド、決まりました。\n\n「${hand.message}」\n\n30問であなたのポーカー人格が丸裸に👇\n@My_Hand_Poker\n#マイハン診断 #ポーカー #マイハンでポット獲得投稿`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.origin)}`, '_blank')
  }, [hand, playerName])

  if (!hand) {
    return (
      <main className="min-h-screen bg-ink-dark flex items-center justify-center">
        <motion.p className="text-ink-text/50 font-body text-lg"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          結果を読み込み中...
        </motion.p>
      </main>
    )
  }

  const cards = parseNotation(hand.notation)
  const maxScore = scores ? Math.max(...Object.values(scores).map(v => Math.abs(v)), 1) : 20
  const compatible = compatibleHands[hand.id]
  const compatibleHand = compatible ? hands.find(h => h.id === compatible.id) : null

  return (
    <main className="min-h-screen bg-ink-dark ink-dots relative">
      <InkSplats />
      {showConfetti && <Confetti />}

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="relative z-10 text-center">
          <AnimatePresence>
            {revealPhase >= 1 && (
              <motion.p className="text-ink-text/50 font-body text-base md:text-lg mb-8 tracking-wide"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {playerName ? `${playerName}さんの` : 'あなたの'}マイハンは...
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealPhase >= 2 && (
              <motion.div className="flex gap-3 md:gap-5 justify-center mb-8">
                {cards.map((card, idx) => (
                  <PlayingCard key={idx} char={card.char} suit={card.suit} delay={idx * 400} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealPhase >= 3 && (
              <>
                <motion.h1 className="font-display text-3xl md:text-6xl font-black text-ink-text mb-2 tracking-tight"
                  initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
                  {hand.typeName}
                </motion.h1>
                <motion.p className="font-mono text-xl md:text-2xl text-ink-text/60 font-bold"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  {hand.notation}
                </motion.p>
              </>
            )}
          </AnimatePresence>
        </div>

        {revealPhase >= 3 && (
          <motion.div className="absolute bottom-8" initial={{ opacity: 0 }}
            animate={{ opacity: 0.4, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}>
            <svg className="w-5 h-5 text-ink-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        )}
      </section>

      {/* ===== CONTENT ===== */}
      <div className="max-w-xl mx-auto px-5 pb-20 space-y-16 relative z-10">

        {/* Score */}
        {scores && (
          <RevealStage>
            <Section title="ステータス">
              <RadarChart scores={scores} maxValue={maxScore} />
              <div className="mt-5">
                {(Object.keys(axisLabels) as ScoreAxis[]).map((axis, i) => (
                  <ScoreBar key={axis} label={axisLabels[axis]} value={scores[axis]}
                    maxValue={maxScore} color={axisColors[axis]} delay={i * 0.04} />
                ))}
              </div>
            </Section>
          </RevealStage>
        )}

        {/* あなたの性格 */}
        <RevealStage>
          <Section title="あなたの性格">
            <p className="text-ink-text/85 font-body text-base leading-[1.9] whitespace-pre-line">{hand.description}</p>
          </Section>
        </RevealStage>

        {/* ハンドの特性 */}
        <RevealStage>
          <Section title="このハンドの特性">
            <p className="text-ink-text/85 font-body text-base leading-[1.9] whitespace-pre-line">{hand.trait}</p>
          </Section>
        </RevealStage>

        {/* あなたに合う理由 */}
        <RevealStage>
          <Section title="あなたに合う理由">
            <p className="text-ink-text/85 font-body text-base leading-[1.9] whitespace-pre-line">{hand.reason}</p>
          </Section>
        </RevealStage>

        {/* 生きる場面 */}
        <RevealStage>
          <Section title="このハンドが生きる場面">
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'ポジション', value: hand.scene.position },
                { label: '形式', value: hand.scene.format },
                { label: 'スタック', value: hand.scene.stack },
              ].map(({ label, value }) => (
                <div key={label} className="bg-ink-dark/40 border border-ink-border/50 rounded-xl p-3 text-center">
                  <p className="text-ink-text/40 text-xs font-body mb-1">{label}</p>
                  <p className="font-display font-bold text-sm text-ink-text/80">{value}</p>
                </div>
              ))}
            </div>
          </Section>
        </RevealStage>

        {/* 戦略アドバイス */}
        <RevealStage>
          <Section title="戦略アドバイス">
            <ul className="space-y-2.5">
              {hand.strategy.map((s, i) => (
                <motion.li key={i} className="flex items-start gap-3 text-ink-text/85 font-body text-sm leading-relaxed"
                  initial={{ x: -15, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                  <span className="text-ink-text/30 font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{s}</span>
                </motion.li>
              ))}
            </ul>
          </Section>
        </RevealStage>

        {/* 伸びしろ */}
        <RevealStage>
          <Section title="伸びしろ">
            <div className="border-l-2 border-ink-text/10 pl-4">
              <p className="text-ink-text/70 font-body leading-[1.9] text-sm">{hand.demerit}</p>
            </div>
          </Section>
        </RevealStage>

        {/* 相性ハンド */}
        {compatibleHand && (
          <RevealStage>
            <Section title="相性の良いハンド">
              <div className="flex items-center gap-4 bg-ink-dark/40 border border-ink-border/50 rounded-xl px-5 py-4">
                <span className="font-display text-2xl font-black text-ink-text/80">{compatibleHand.notation}</span>
                <div>
                  <p className="font-display font-bold text-ink-text/80 text-sm">{compatibleHand.typeName}</p>
                  <p className="text-ink-text/40 text-xs font-body mt-0.5">{compatible.reason}</p>
                </div>
              </div>
            </Section>
          </RevealStage>
        )}

        {/* メッセージ */}
        <RevealStage>
          <section className="text-center py-10">
            <div className="w-8 h-[1px] bg-ink-text/15 mx-auto mb-6" />
            <p className="font-body text-lg md:text-xl text-ink-text/90 leading-relaxed italic px-2">
              &ldquo;{hand.message}&rdquo;
            </p>
            <div className="w-8 h-[1px] bg-ink-text/15 mx-auto mt-6" />
          </section>
        </RevealStage>

        {/* Action buttons */}
        <RevealStage>
          <div className="space-y-3 text-center pb-8">
            <motion.button onClick={handleTwitterShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full max-w-xs mx-auto block px-6 py-3.5 bg-ink-text text-ink-dark font-display font-bold text-sm rounded-xl
                         hover:bg-ink-text/90 transition-colors">
              X (Twitter) でシェア
            </motion.button>
            <motion.button onClick={handleShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full max-w-xs mx-auto block px-6 py-3.5 bg-ink-card text-ink-text border border-ink-border font-display font-bold text-sm rounded-xl
                         hover:border-ink-text/30 transition-colors">
              結果をシェア
            </motion.button>
            <Link href="/entry" className="block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full max-w-xs mx-auto px-6 py-3.5 text-ink-text/50 font-body text-sm rounded-xl
                           hover:text-ink-text/70 transition-colors">
                もう一度診断する
              </motion.div>
            </Link>
          </div>
        </RevealStage>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-ink-text/90 mb-4 tracking-wide">{title}</h2>
      <div className="bg-ink-card/30 border border-ink-border/50 rounded-2xl p-5 md:p-6">
        {children}
      </div>
    </section>
  )
}
