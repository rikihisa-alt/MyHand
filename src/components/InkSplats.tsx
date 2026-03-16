'use client'

export default function InkSplats() {
  const splats = [
    { color: '#00D4FF', size: 180, top: '10%', left: '-5%', opacity: 0.15 },
    { color: '#FF2E8B', size: 140, top: '60%', right: '-3%', opacity: 0.12 },
    { color: '#BFFF00', size: 100, bottom: '15%', left: '10%', opacity: 0.1 },
    { color: '#FF6B35', size: 120, top: '30%', right: '15%', opacity: 0.08 },
    { color: '#00D4FF', size: 80, bottom: '5%', right: '20%', opacity: 0.1 },
    { color: '#FF2E8B', size: 60, top: '5%', left: '40%', opacity: 0.08 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {splats.map((s, i) => (
        <div
          key={i}
          className="splat-blob"
          style={{
            width: s.size,
            height: s.size,
            background: s.color,
            opacity: s.opacity,
            top: s.top,
            left: s.left,
            right: (s as Record<string, unknown>).right as string | undefined,
            bottom: (s as Record<string, unknown>).bottom as string | undefined,
          }}
        />
      ))}
    </div>
  )
}
