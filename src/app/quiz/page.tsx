'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import questionsData from '@/data/questions.json'
import handsData from '@/data/hands.json'
import { calcScores, matchHand } from '@/lib/scoring'
import type { Question, Hand } from '@/types'

const questions = questionsData as Question[]
const hands = handsData as Hand[]

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const playerInfo = sessionStorage.getItem('playerInfo')
    if (!playerInfo) {
      router.push('/entry')
    }
  }, [router])

  const question = questions[currentIndex]
  const total = questions.length

  const handleSelect = (optionIndex: number) => {
    if (animating) return
    setAnimating(true)

    const newAnswers = { ...answers, [question.id]: optionIndex }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex(currentIndex + 1)
        setAnimating(false)
      } else {
        // All questions answered
        const scores = calcScores(questions, newAnswers)
        const hand = matchHand(scores, hands)
        sessionStorage.setItem('quizResult', JSON.stringify({ scores, handId: hand.id }))
        router.push(`/result/${hand.id}`)
      }
    }, 300)
  }

  if (!question) return null

  return (
    <main className="min-h-screen bg-deep flex flex-col items-center justify-center px-4 relative">
      {/* Question */}
      <div
        key={question.id}
        className="w-full max-w-lg animate-question-in"
      >
        <p className="text-muted text-sm text-center mb-8 font-mono">
          {currentIndex + 1} / {total}
        </p>

        <h2 className="font-body text-xl md:text-2xl text-ivory text-center mb-10 leading-relaxed">
          {question.text}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={animating}
              className="w-full text-left px-6 py-4 rounded-lg border border-card-border bg-card-bg text-ivory font-body hover:border-gold hover:bg-gold/5 transition-all duration-200 disabled:opacity-50"
              style={{
                animationDelay: `${idx * 80}ms`,
                animation: 'questionIn 0.4s ease-out forwards',
                opacity: 0,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="w-full h-0.5 bg-card-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>
    </main>
  )
}
