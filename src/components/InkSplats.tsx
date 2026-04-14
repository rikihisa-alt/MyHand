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
    { color: '#00D4FF', size: 200, mobileSize: 100, top: '8%', left: '-5%', opacity: 0.15 },
    { color: '#FF2E8B', size: 160, mobileSize: 80, top: '55%', right: '-3%', opacity: 0.12 },
    { color: '#BFFF00', size: 110, mobileSize: 60, bottom: '20%', left: '10%', opacity: 0.1 },
    { color: '#FF6B35', size: 130, mobileSize: 60, top: '30%', right: '15%', opacity: 0.08 },
    { color: '#00D4FF', size: 90, mobileSize: 50, bottom: '8%', right: '25%', opacity: 0.08 },
    { color: '#FF2E8B', size: 70, mobileSize: 40, top: '5%', left: '40%', opacity: 0.07 },
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
