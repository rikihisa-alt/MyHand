'use client'

import Link from 'next/link'

export default function TopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-deep relative overflow-hidden">
      {/* Background felt texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-felt/30 via-deep to-deep" />

      {/* Facedown card decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="w-48 h-72 rounded-xl border-2 border-gold bg-gradient-to-br from-card-bg to-felt rotate-6" />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-ivory mb-6 tracking-tight">
          My Hand
        </h1>
        <p className="font-body text-lg md:text-xl text-muted mb-2">
          マイハン診断
        </p>
        <p className="font-body text-xl md:text-2xl text-ivory/80 mb-12 max-w-md mx-auto leading-relaxed">
          あなたのハンドが、<br />あなたを語る。
        </p>

        <Link
          href="/entry"
          className="inline-block px-10 py-4 bg-gold text-deep font-body font-bold text-lg rounded-lg hover:bg-gold-dim transition-colors duration-300"
        >
          診断をはじめる
        </Link>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </main>
  )
}
