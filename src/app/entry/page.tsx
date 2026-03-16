'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import InkSplats from '@/components/InkSplats'

const prefectures = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県',
  '岐阜県','静岡県','愛知県','三重県',
  '滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
  '鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県',
  '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]

const experienceOptions = [
  '半年未満',
  '半年〜1年',
  '1〜3年',
  '3〜5年',
  '5年以上',
]

export default function EntryPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    pokerName: '',
    email: '',
    store: '',
    prefecture: '',
    experience: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const fieldsValid =
    form.pokerName && form.email && form.store && form.prefecture && form.experience

  const canSubmit = fieldsValid && agreed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fieldsValid) return
    if (!agreed) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 2000)
      return
    }
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
          {/* ポーカーネーム */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-ink-lime text-sm mb-1.5 font-display font-bold">ポーカーネーム</label>
            <input
              type="text"
              value={form.pokerName}
              onChange={(e) => setForm({ ...form, pokerName: e.target.value })}
              className={inputClass}
              placeholder="Your poker name"
            />
          </motion.div>

          {/* メールアドレス */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-ink-lime text-sm mb-1.5 font-display font-bold">メールアドレス</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="you@example.com"
            />
          </motion.div>

          {/* よく行く店舗 */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-ink-lime text-sm mb-1.5 font-display font-bold">よく行く店舗</label>
            <input
              type="text"
              value={form.store}
              onChange={(e) => setForm({ ...form, store: e.target.value })}
              className={inputClass}
              placeholder="店舗名"
            />
          </motion.div>

          {/* 都道府県 */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-ink-lime text-sm mb-1.5 font-display font-bold">店舗がある都道府県</label>
            <select
              value={form.prefecture}
              onChange={(e) => setForm({ ...form, prefecture: e.target.value })}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled>選択してください</option>
              {prefectures.map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </motion.div>

          {/* ポーカー歴 */}
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

          {/* 利用規約・プライバシーポリシー + チェックボックス */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-2"
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  agreed
                    ? 'bg-ink-blue border-ink-blue'
                    : 'bg-ink-card border-ink-border hover:border-ink-muted'
                }`}
              >
                {agreed && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </button>
              <p className="text-ink-muted text-sm font-body leading-relaxed">
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-ink-blue underline underline-offset-2 hover:text-ink-blue/80 font-bold"
                >
                  利用規約
                </button>
                {' '}および{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-ink-blue underline underline-offset-2 hover:text-ink-blue/80 font-bold"
                >
                  プライバシーポリシー
                </button>
                {' '}に同意します
              </p>
            </div>
          </motion.div>

          {/* 同意警告メッセージ */}
          <AnimatePresence>
            {showWarning && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-ink-magenta font-display font-bold text-sm text-center"
              >
                利用規約とプライバシーポリシーに同意してください
              </motion.p>
            )}
          </AnimatePresence>

          {/* 送信ボタン */}
          <motion.button
            type="submit"
            disabled={!fieldsValid}
            whileHover={canSubmit ? { scale: 1.03 } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            animate={
              fieldsValid && !agreed
                ? { x: [0, -4, 4, -4, 4, 0], backgroundColor: '#FF6B35', borderColor: 'rgba(255,107,53,0.6)' }
                : {}
            }
            transition={
              fieldsValid && !agreed
                ? { x: { duration: 0.5, repeat: Infinity, repeatDelay: 2 } }
                : {}
            }
            className={`w-full py-4 rounded-xl font-display font-black text-lg transition-all mt-4 border-b-4 ${
              canSubmit
                ? 'bg-ink-magenta text-white border-ink-magenta/60 hover:brightness-110 shadow-lg shadow-ink-magenta/30'
                : fieldsValid && !agreed
                  ? 'bg-ink-orange text-white border-ink-orange/60 cursor-pointer'
                  : 'bg-ink-card text-ink-muted border-ink-card cursor-not-allowed'
            }`}
            onClick={fieldsValid && !agreed ? () => { setShowWarning(true); setTimeout(() => setShowWarning(false), 2000) } : undefined}
          >
            {fieldsValid && !agreed ? '規約に同意してね！' : '診断に進む →'}
          </motion.button>
        </form>
      </motion.div>

      {/* 利用規約モーダル */}
      <AnimatePresence>
        {showTerms && (
          <TermsModal onClose={() => setShowTerms(false)} />
        )}
      </AnimatePresence>

      {/* プライバシーポリシーモーダル */}
      <AnimatePresence>
        {showPrivacy && (
          <PrivacyModal onClose={() => setShowPrivacy(false)} />
        )}
      </AnimatePresence>
    </main>
  )
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        className="relative bg-ink-bg border-2 border-ink-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-black text-ink-blue">利用規約</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-text text-2xl font-bold">&times;</button>
        </div>
        <div className="text-ink-text/80 font-body text-sm leading-relaxed space-y-4">
          <p>本利用規約（以下「本規約」）は、マイハン診断（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に同意いただいた上で本サービスをご利用いただきます。</p>

          <h3 className="text-ink-lime font-display font-bold text-base">第1条（適用）</h3>
          <p>本規約は、ユーザーと本サービス運営者との間の本サービスの利用に関わる一切の関係に適用されます。</p>

          <h3 className="text-ink-lime font-display font-bold text-base">第2条（利用登録）</h3>
          <p>本サービスの利用を希望する方は、本規約に同意の上、所定の方法により情報を提供することで利用登録を行うものとします。</p>

          <h3 className="text-ink-lime font-display font-bold text-base">第3条（メールアドレスの利用）</h3>
          <p>ユーザーが提供したメールアドレスは、以下の目的で利用されます。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスに関するお知らせ・ご案内の送信</li>
            <li>本サービスの運営者および提携パートナーからの広告・キャンペーン・お得な情報等の商用メールの送信</li>
            <li>本サービスの改善・新機能開発のための分析</li>
            <li>ユーザーサポートおよびお問い合わせへの対応</li>
          </ul>

          <h3 className="text-ink-lime font-display font-bold text-base">第4条（ユーザー情報の商用利用）</h3>
          <p>ユーザーが本サービスに提供した情報（ポーカーネーム、メールアドレス、店舗情報、都道府県、ポーカー歴、診断結果等）は、以下の目的で商用利用される場合があります。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>マーケティング分析およびターゲティング広告の配信</li>
            <li>提携企業・パートナーへの統計データ（個人を特定しない形式）の提供</li>
            <li>本サービスおよび関連サービスの宣伝・プロモーション</li>
            <li>ユーザーの属性に基づいたパーソナライズされたコンテンツ・広告の提供</li>
          </ul>

          <h3 className="text-ink-lime font-display font-bold text-base">第5条（禁止事項）</h3>
          <p>ユーザーは以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>他のユーザーに迷惑をかける行為</li>
            <li>不正アクセス、なりすまし行為</li>
            <li>本サービスのコンテンツの無断転載・複製</li>
          </ul>

          <h3 className="text-ink-lime font-display font-bold text-base">第6条（免責事項）</h3>
          <p>本サービスはエンターテインメント目的で提供されるものであり、診断結果はポーカー戦略に関する助言を構成するものではありません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。</p>

          <h3 className="text-ink-lime font-display font-bold text-base">第7条（サービス変更・終了）</h3>
          <p>運営者は、ユーザーへの事前通知なく、本サービスの内容を変更、または提供を中止・終了することができるものとします。</p>

          <h3 className="text-ink-lime font-display font-bold text-base">第8条（規約の変更）</h3>
          <p>運営者は、本規約を随時変更できるものとします。変更後の規約は本サービス上に掲載した時点で効力を生じます。</p>

          <h3 className="text-ink-lime font-display font-bold text-base">第9条（準拠法・管轄）</h3>
          <p>本規約の解釈にあたっては日本法を準拠法とし、紛争が生じた場合は運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。</p>

          <p className="text-ink-muted text-xs pt-2">制定日：2025年3月16日</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        className="relative bg-ink-bg border-2 border-ink-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-black text-ink-magenta">プライバシーポリシー</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-text text-2xl font-bold">&times;</button>
        </div>
        <div className="text-ink-text/80 font-body text-sm leading-relaxed space-y-4">
          <p>マイハン診断（以下「本サービス」）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>

          <h3 className="text-ink-magenta font-display font-bold text-base">1. 収集する情報</h3>
          <p>本サービスでは以下の情報を収集します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ポーカーネーム</li>
            <li>メールアドレス</li>
            <li>よく行く店舗名</li>
            <li>店舗所在の都道府県</li>
            <li>ポーカー歴</li>
            <li>診断回答内容および診断結果</li>
            <li>サービス利用時のアクセスログ（IPアドレス、ブラウザ情報、アクセス日時等）</li>
          </ul>

          <h3 className="text-ink-magenta font-display font-bold text-base">2. 情報の利用目的</h3>
          <p>収集した情報は以下の目的で利用します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザーへのメールによる情報提供（新機能、イベント、キャンペーン等のお知らせ）</li>
            <li><strong>運営者および提携パートナーからの広告・プロモーション・商品紹介等の商用メールの送信</strong></li>
            <li>マーケティング調査・統計分析（個人を特定しない形での利用を含む）</li>
            <li>ユーザーの属性・嗜好に基づくパーソナライズされたコンテンツ・広告の提供</li>
            <li>ユーザーサポート・お問い合わせ対応</li>
            <li>利用規約に違反する行為への対応</li>
          </ul>

          <h3 className="text-ink-magenta font-display font-bold text-base">3. 第三者提供</h3>
          <p>運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>統計的なデータなど個人を識別できない形式で提供する場合</li>
            <li>業務委託先に対し、利用目的の達成に必要な範囲で提供する場合（委託先には適切な管理を義務付けます）</li>
            <li>事業承継に伴い個人情報を承継する場合</li>
          </ul>

          <h3 className="text-ink-magenta font-display font-bold text-base">4. 情報の管理</h3>
          <p>運営者は、収集した個人情報について、不正アクセス、紛失、破壊、改ざん、漏洩などが生じないよう、合理的な安全管理措置を講じます。</p>

          <h3 className="text-ink-magenta font-display font-bold text-base">5. Cookie・アクセス解析</h3>
          <p>本サービスでは、利便性向上やアクセス解析のためCookieを使用する場合があります。ユーザーはブラウザの設定でCookieを無効にすることが可能ですが、一部機能が制限される場合があります。</p>

          <h3 className="text-ink-magenta font-display font-bold text-base">6. メール配信の停止</h3>
          <p>商用メールの受信を希望しない場合は、メール内の配信停止リンクまたは運営者への連絡により、いつでも配信を停止することが可能です。</p>

          <h3 className="text-ink-magenta font-display font-bold text-base">7. 個人情報の開示・訂正・削除</h3>
          <p>ユーザーは、自身の個人情報の開示・訂正・削除を運営者に対して請求することができます。請求があった場合、運営者は合理的な期間内に対応します。</p>

          <h3 className="text-ink-magenta font-display font-bold text-base">8. ポリシーの変更</h3>
          <p>運営者は、本ポリシーを随時変更できるものとします。重要な変更がある場合は、本サービス上でお知らせします。</p>

          <h3 className="text-ink-magenta font-display font-bold text-base">9. お問い合わせ</h3>
          <p>個人情報の取扱いに関するお問い合わせは、本サービスのお問い合わせフォームまたは運営者の連絡先までご連絡ください。</p>

          <p className="text-ink-muted text-xs pt-2">制定日：2025年3月16日</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
