'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import InkSplats from '@/components/InkSplats'

export default function TopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-ink-dark relative overflow-hidden ink-dots">
      <InkSplats />

      {/* Decorative splat circles */}
      <div className="absolute top-10 right-10 w-28 sm:w-40 h-28 sm:h-40 bg-ink-magenta/25 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute bottom-32 left-10 w-32 sm:w-48 h-32 sm:h-48 bg-ink-blue/20 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-ink-lime/15 rounded-full blur-xl sm:blur-2xl" />
      <div className="absolute top-[15%] right-[30%] w-12 sm:w-16 h-12 sm:h-16 bg-ink-yellow/10 rounded-full blur-xl" />

      {/* Tilted background card shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        animate={{ rotate: [6, 8, 6], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-36 h-52 sm:w-48 sm:h-72 rounded-2xl border-2 sm:border-4 border-ink-blue/50 rotate-6" />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-black text-ink-text mb-2 tracking-tight"
              style={{ textShadow: '3px 3px 0 #FF2E8B, -1px -1px 0 #00D4FF' }}>
            My Hand
          </h1>
        </motion.div>

        <motion.p
          className="font-display text-xl md:text-2xl text-ink-blue font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          マイハン診断
        </motion.p>

        <motion.p
          className="font-body text-lg md:text-xl text-ink-text/70 mb-12 max-w-md mx-auto leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          あなたのハンドが、<br />あなたを語る。
        </motion.p>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.8 }}
        >
          <Link
            href="/entry"
            className="inline-block px-10 py-4 sm:px-12 sm:py-5 bg-ink-magenta text-white font-display font-black text-lg sm:text-xl rounded-2xl
                       border-b-4 border-ink-magenta/60 hover-shake ink-splash-effect
                       hover:brightness-110 active:border-b-2 active:translate-y-0.5
                       transition-all duration-150 shadow-lg shadow-ink-magenta/30"
            style={{ '--splash-color': '#FF2E8B' } as React.CSSProperties}
          >
            診断スタート！
          </Link>
        </motion.div>
      </div>

      {/* Bottom ink wave decoration - seamless */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full h-12 sm:h-16" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="rgba(0,212,255,0.12)" />
          <path d="M0,50 C200,20 400,70 720,50 C1040,30 1240,60 1440,50 L1440,80 L0,80 Z" fill="rgba(0,212,255,0.08)" />
        </svg>
      </div>
    </main>
  )
}
