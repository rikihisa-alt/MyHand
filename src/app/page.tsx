'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import InkSplats from '@/components/InkSplats'

export default function TopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-ink-dark relative overflow-hidden ink-dots">
      <InkSplats />

      {/* Decorative splat circles */}
      <div className="absolute top-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-ink-magenta/15 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute bottom-20 left-10 w-28 sm:w-40 h-28 sm:h-40 bg-ink-blue/15 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-14 sm:w-20 h-14 sm:h-20 bg-ink-lime/10 rounded-full blur-xl sm:blur-2xl" />

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

      {/* Bottom ink drip decoration */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around">
        {[14, 18, 12, 16, 13, 19, 15, 17].map((w, i) => (
          <div
            key={i}
            className="bg-ink-blue/20 rounded-t-full"
            style={{
              width: `${w}%`,
              height: `${25 + i * 4}px`,
            }}
          />
        ))}
      </div>
    </main>
  )
}
