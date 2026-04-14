'use client'

interface Splat {
  color: string
  size: number
  mobileSize: number
  opacity: number
  top?: string
  left?: string
  right?: string
  bottom?: string
}

export default function InkSplats() {
  const splats: Splat[] = [
    { color: '#00D4FF', size: 180, mobileSize: 80, top: '10%', left: '-5%', opacity: 0.1 },
    { color: '#FF2E8B', size: 140, mobileSize: 60, top: '60%', right: '-3%', opacity: 0.08 },
    { color: '#BFFF00', size: 100, mobileSize: 50, bottom: '15%', left: '10%', opacity: 0.06 },
    { color: '#FF6B35', size: 120, mobileSize: 50, top: '30%', right: '15%', opacity: 0.06 },
    { color: '#00D4FF', size: 80, mobileSize: 40, bottom: '5%', right: '20%', opacity: 0.06 },
    { color: '#FF2E8B', size: 60, mobileSize: 30, top: '5%', left: '40%', opacity: 0.05 },
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
            right: s.right,
            bottom: s.bottom,
          }}
        />
      ))}
    </div>
  )
}
