'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import InkSplats from '@/components/InkSplats'

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
    'w-full bg-ink-card border-2 border-ink-border rounded-xl px-4 py-3 text-ink-text font-body focus:outline-none focus:border-ink-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-200 placeholder:text-ink-muted'

  return (
    <main className="min-h-screen bg-ink-dark flex items-center justify-center px-4 py-12 ink-dots relative overflow-hidden">
      <InkSplats />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <h1 className="font-display text-4xl font-black text-center mb-2"
            style={{ textShadow: '3px 3px 0 #FF2E8B' }}>
          Player Info
        </h1>
        <p className="text-ink-blue text-center mb-8 font-display font-bold text-lg">
          あなたについて教えて！
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: '名前', key: 'name', type: 'text', placeholder: '山田太郎' },
            { label: 'メールアドレス', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'ポーカーネーム', key: 'pokerName', type: 'text', placeholder: 'Your poker name' },
            { label: 'よく行く店舗', key: 'store', type: 'text', placeholder: '店舗名' },
          ].map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <label className="block text-ink-lime text-sm mb-1.5 font-display font-bold">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className={inputClass}
                placeholder={field.placeholder}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-ink-lime text-sm mb-1.5 font-display font-bold">ポーカー歴</label>
            <div className="grid grid-cols-2 gap-2">
              {experienceOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm({ ...form, experience: opt })}
                  className={`px-4 py-2.5 rounded-xl border-2 font-display font-bold text-sm transition-all duration-200 hover-shake ${
                    form.experience === opt
                      ? 'border-ink-blue bg-ink-blue/20 text-ink-blue shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                      : 'border-ink-border bg-ink-card text-ink-muted hover:border-ink-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.03 } : {}}
            whileTap={isValid ? { scale: 0.97 } : {}}
            className={`w-full py-4 rounded-xl font-display font-black text-lg transition-all mt-4 border-b-4 ${
              isValid
                ? 'bg-ink-magenta text-white border-ink-magenta/60 hover:brightness-110 shadow-lg shadow-ink-magenta/30'
                : 'bg-ink-card text-ink-muted border-ink-card cursor-not-allowed'
            }`}
          >
            診断に進む →
          </motion.button>
        </form>
      </motion.div>
    </main>
  )
}
