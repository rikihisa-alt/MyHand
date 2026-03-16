'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import questionsData from '@/data/questions.json'
import handsData from '@/data/hands.json'
import { calcScores, matchHand } from '@/lib/scoring'
import type { Question, Hand } from '@/types'
import InkSplats from '@/components/InkSplats'

const questions = questionsData as Question[]
const hands = handsData as Hand[]

const splatColors = ['#00D4FF', '#FF2E8B', '#BFFF00', '#FFE135', '#FF6B35']

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [animating, setAnimating] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [splatPosition, setSplatPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const playerInfo = sessionStorage.getItem('playerInfo')
    if (!playerInfo) {
      router.push('/entry')
    }
  }, [router])

  const question = questions[currentIndex]
  const total = questions.length
  const accentColor = splatColors[currentIndex % splatColors.length]

  const handleSelect = (optionIndex: number, e: React.MouseEvent) => {
    if (animating) return
    setAnimating(true)
    setSelectedIdx(optionIndex)

    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setSplatPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

    const newAnswers = { ...answers, [question.id]: optionIndex }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedIdx(null)
        setSplatPosition(null)
        setAnimating(false)
      } else {
        const scores = calcScores(questions, newAnswers)
        const hand = matchHand(scores, hands)
        sessionStorage.setItem('quizResult', JSON.stringify({ scores, handId: hand.id }))
        router.push(`/result/${hand.id}`)
      }
    }, 500)
  }

  if (!question) return null

  const progressPercent = ((currentIndex + 1) / total) * 100

  return (
    <main className="min-h-screen bg-ink-dark flex flex-col items-center justify-center px-4 relative overflow-hidden ink-dots">
      <InkSplats />

      {/* Ink splash effect on select */}
      <AnimatePresence>
        {splatPosition && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{ left: splatPosition.x - 75, top: splatPosition.y - 75 }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="60" fill={accentColor} opacity="0.4" />
              <circle cx="45" cy="35" r="15" fill={accentColor} opacity="0.3" />
              <circle cx="110" cy="50" r="12" fill={accentColor} opacity="0.3" />
              <circle cx="60" cy="115" r="18" fill={accentColor} opacity="0.3" />
              <circle cx="100" cy="100" r="10" fill={accentColor} opacity="0.3" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question counter */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="font-mono text-2xl font-bold" style={{ color: accentColor }}>
          {currentIndex + 1}
        </span>
        <span className="font-mono text-lg text-ink-muted"> / {total}</span>
      </motion.div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="w-full max-w-lg relative z-10"
          initial={{ x: 100, opacity: 0, rotate: 3 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: -100, opacity: 0, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <h2 className="font-display text-xl md:text-2xl text-ink-text text-center mb-10 leading-relaxed font-bold">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={(e) => handleSelect(idx, e)}
                disabled={animating}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 font-display font-bold
                           transition-all duration-200 ink-splash-effect
                           ${selectedIdx === idx
                    ? 'border-current bg-current/20 scale-[1.02]'
                    : 'border-ink-border bg-ink-card text-ink-text hover:border-ink-blue/50'
                  } disabled:cursor-default`}
                style={{
                  ...(selectedIdx === idx ? { borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}20` } : {}),
                  '--splash-color': accentColor,
                } as React.CSSProperties}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-mono shrink-0"
                    style={{ borderColor: selectedIdx === idx ? accentColor : '#3a3a5a' }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar - ink splat style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10">
        <div className="w-full h-3 bg-ink-card rounded-full overflow-hidden border border-ink-border">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </main>
  )
}
