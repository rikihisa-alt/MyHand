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
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null)
  const [splatPosition, setSplatPosition] = useState<{ x: number; y: number } | null>(null)
  const [direction, setDirection] = useState(1) // 1=forward, -1=back

  useEffect(() => {
    const playerInfo = sessionStorage.getItem('playerInfo')
    if (!playerInfo) {
      router.push('/entry')
    }
  }, [router])

  const question = questions[currentIndex]
  const total = questions.length
  const accentColor = splatColors[currentIndex % splatColors.length]

  // 質問が変わったら、既存回答があればそれをハイライト、なければnull
  useEffect(() => {
    if (question) {
      const existing = answers[question.id]
      setHighlightIdx(existing !== undefined ? existing : null)
    }
  }, [currentIndex, question, answers])

  const handleTap = (optionIndex: number, e: React.MouseEvent) => {
    if (animating) return

    if (highlightIdx === optionIndex) {
      // 2回目のタップ → 確定して次へ
      setAnimating(true)

      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setSplatPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

      const newAnswers = { ...answers, [question.id]: optionIndex }
      setAnswers(newAnswers)

      setTimeout(() => {
        if (currentIndex < total - 1) {
          setDirection(1)
          setCurrentIndex(currentIndex + 1)
          setHighlightIdx(null)
          setSplatPosition(null)
          setAnimating(false)
        } else {
          const scores = calcScores(questions, newAnswers)
          const hand = matchHand(scores, hands)
          sessionStorage.setItem('quizResult', JSON.stringify({ scores, handId: hand.id }))
          router.push(`/result/${hand.id}`)
        }
      }, 400)
    } else {
      // 1回目のタップ → ハイライトのみ
      setHighlightIdx(optionIndex)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0 && !animating) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
      setHighlightIdx(null)
    }
  }

  if (!question) return null

  const progressPercent = ((currentIndex + 1) / total) * 100

  return (
    <main className="min-h-screen bg-ink-dark flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden ink-dots">
      <InkSplats />

      {/* Ink splash effect on confirm */}
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

      {/* Header: Back button + Question counter */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-4 pt-5 pb-3 z-10">
        <div className="absolute left-4">
          {currentIndex > 0 && (
            <motion.button
              onClick={handleBack}
              className="flex items-center gap-1 text-ink-muted hover:text-ink-text transition-colors px-3 py-2 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-body">戻る</span>
            </motion.button>
          )}
        </div>
        <div className="text-center">
          <span className="font-mono text-2xl font-bold" style={{ color: accentColor }}>
            {currentIndex + 1}
          </span>
          <span className="font-mono text-lg text-ink-muted"> / {total}</span>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={question.id}
        className="w-full max-w-lg relative z-10"
        initial={{ x: direction * 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
          <h2 className="font-display text-lg sm:text-xl md:text-2xl text-ink-text text-center mb-8 sm:mb-10 leading-relaxed font-bold px-2">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isHighlighted = highlightIdx === idx
              return (
                <motion.button
                  key={idx}
                  onClick={(e) => handleTap(idx, e)}
                  disabled={animating}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.06, type: 'spring', stiffness: 400, damping: 30 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl border-2 font-display font-bold
                             text-sm sm:text-base transition-all duration-200
                             ${isHighlighted
                      ? 'scale-[1.02] shadow-lg'
                      : 'border-ink-border bg-ink-card text-ink-text hover:border-ink-blue/40'
                    } disabled:cursor-default`}
                  style={{
                    ...(isHighlighted
                      ? { borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}15`, boxShadow: `0 0 20px ${accentColor}20` }
                      : {}),
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-mono shrink-0 transition-colors duration-200
                        ${isHighlighted ? 'bg-current/20' : ''}`}
                      style={{ borderColor: isHighlighted ? accentColor : '#3a3a5a' }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option.label}</span>
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Tap hint - fixed height to prevent layout shift */}
          <p className={`text-center mt-4 text-xs font-body h-5 transition-opacity duration-200
            ${highlightIdx !== null ? 'text-ink-muted opacity-100' : 'opacity-0'}`}>
            もう一度タップで決定
          </p>
        </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10">
        <div className="w-full h-2.5 bg-ink-card rounded-full overflow-hidden border border-ink-border">
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
