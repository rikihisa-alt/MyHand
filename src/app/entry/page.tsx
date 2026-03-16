'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EntryPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    pokerName: '',
    store: '',
    experience: '',
  })

  const experienceOptions = [
    '半年未満',
    '半年〜1年',
    '1〜3年',
    '3〜5年',
    '5年以上',
  ]

  const isValid =
    form.name && form.email && form.pokerName && form.store && form.experience

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    sessionStorage.setItem('playerInfo', JSON.stringify(form))
    router.push('/quiz')
  }

  const inputClass =
    'w-full bg-card-bg border border-card-border rounded-lg px-4 py-3 text-ivory font-body focus:outline-none focus:border-gold transition-colors'

  return (
    <main className="min-h-screen bg-deep flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-ivory text-center mb-2">
          Player Info
        </h1>
        <p className="text-muted text-center mb-8 font-body">
          あなたについて教えてください
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-muted text-sm mb-1.5 font-body">名前</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="山田太郎"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-1.5 font-body">メールアドレス</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-1.5 font-body">ポーカーネーム</label>
            <input
              type="text"
              value={form.pokerName}
              onChange={(e) => setForm({ ...form, pokerName: e.target.value })}
              className={inputClass}
              placeholder="Your poker name"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-1.5 font-body">よく行く店舗</label>
            <input
              type="text"
              value={form.store}
              onChange={(e) => setForm({ ...form, store: e.target.value })}
              className={inputClass}
              placeholder="店舗名"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-1.5 font-body">ポーカー歴</label>
            <div className="grid grid-cols-2 gap-2">
              {experienceOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm({ ...form, experience: opt })}
                  className={`px-4 py-2.5 rounded-lg border font-body text-sm transition-all ${
                    form.experience === opt
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-card-border bg-card-bg text-muted hover:border-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-lg font-body font-bold text-lg transition-all mt-4 ${
              isValid
                ? 'bg-gold text-deep hover:bg-gold-dim'
                : 'bg-card-bg text-muted cursor-not-allowed'
            }`}
          >
            診断に進む
          </button>
        </form>
      </div>
    </main>
  )
}
