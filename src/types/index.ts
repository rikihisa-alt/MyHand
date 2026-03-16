export type ScoreAxis =
  'romance' | 'utility' | 'aggression' | 'stability' | 'creative' | 'strategic' | 'meme'

export interface Question {
  id: string
  text: string
  type: 'binary' | 'quad' | 'scale'
  options: { label: string; scores: Partial<Record<ScoreAxis, number>> }[]
}

export interface Hand {
  id: string
  notation: string
  typeName: string
  description: string
  trait: string
  reason: string
  scene: { position: string; format: string; stack: string }
  strategy: string[]
  demerit: string
  message: string
  thresholds: Partial<Record<ScoreAxis, number>>
}

export interface PlayerInfo {
  name: string
  email: string
  pokerName: string
  store: string
  experience: string
}
