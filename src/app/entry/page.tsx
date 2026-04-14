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
  const [triedSubmit, setTriedSubmit] = useState(false)

  const fieldsValid =
    form.pokerName && form.email && form.store && form.prefecture && form.experience

  const canSubmit = fieldsValid && agreed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fieldsValid) return
    if (!agreed) {
      setTriedSubmit(true)
      return
    }
    sessionStorage.setItem('playerInfo', JSON.stringify(form))

    // GASにデータ送信（非同期・エラーでも診断は続行）
    const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL
    if (GAS_URL) {
      try {
        fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pokerName: form.pokerName,
            email: form.email,
            store: form.store,
            prefecture: form.prefecture,
            experience: form.experience,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch {
        // 送信失敗しても診断は続行
      }
    }

    router.push('/quiz')
  }

  const inputClass =
    'w-full bg-ink-card border-2 border-ink-border rounded-xl px-3 py-3 sm:px-4 text-ink-text font-body text-base focus:outline-none focus:border-ink-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-200 placeholder:text-ink-muted'

  return (
    <main className="min-h-screen bg-ink-dark flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 ink-dots relative overflow-hidden">
      <InkSplats />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl font-black text-center mb-1 sm:mb-2"
            style={{ textShadow: '3px 3px 0 #FF2E8B' }}>
          Player Info
        </h1>
        <p className="text-ink-blue text-center mb-6 sm:mb-8 font-display font-bold text-base sm:text-lg">
          あなたについて教えて！
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* ポーカーネーム */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-ink-lime text-xs sm:text-sm mb-1 sm:mb-1.5 font-display font-bold">ポーカーネーム</label>
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
            <label className="block text-ink-lime text-xs sm:text-sm mb-1 sm:mb-1.5 font-display font-bold">メールアドレス</label>
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
            <label className="block text-ink-lime text-xs sm:text-sm mb-1 sm:mb-1.5 font-display font-bold">よく行く店舗</label>
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
            <label className="block text-ink-lime text-xs sm:text-sm mb-1 sm:mb-1.5 font-display font-bold">店舗がある都道府県</label>
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
            <label className="block text-ink-lime text-xs sm:text-sm mb-1 sm:mb-1.5 font-display font-bold">ポーカー歴</label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {experienceOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm({ ...form, experience: opt })}
                  className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 font-display font-bold text-xs sm:text-sm transition-all duration-200 hover-shake ${
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
            className="pt-1 sm:pt-2"
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => { setAgreed(!agreed); if (!agreed) setTriedSubmit(false) }}
                className={`mt-0.5 w-7 h-7 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
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
              <p className="text-ink-muted text-xs sm:text-sm font-body leading-relaxed">
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

            {/* 同意警告メッセージ - チェックするまで常時表示 */}
            <AnimatePresence>
              {!agreed && triedSubmit && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-2.5 flex items-center gap-2 bg-ink-magenta/10 border border-ink-magenta/30 rounded-xl px-3 py-2"
                >
                  <svg className="w-4 h-4 text-ink-magenta shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.66 21H3.34a1 1 0 01-.86-1.41L12 3z" />
                  </svg>
                  <p className="text-ink-magenta font-display font-bold text-xs sm:text-sm">
                    利用規約とプライバシーポリシーに同意してください
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 送信ボタン */}
          <motion.button
            type="submit"
            disabled={!fieldsValid}
            whileHover={canSubmit ? { scale: 1.03 } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            animate={
              fieldsValid && !agreed && triedSubmit
                ? { x: [0, -6, 6, -6, 6, -3, 3, 0] }
                : {}
            }
            transition={
              fieldsValid && !agreed && triedSubmit
                ? { x: { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 } }
                : {}
            }
            className={`w-full py-3.5 sm:py-4 rounded-xl font-display font-black text-base sm:text-lg transition-all mt-3 sm:mt-4 border-b-4 ${
              canSubmit
                ? 'bg-ink-magenta text-white border-ink-magenta/60 hover:brightness-110 shadow-lg shadow-ink-magenta/30'
                : fieldsValid && !agreed
                  ? 'bg-ink-orange text-white border-ink-orange/60 cursor-pointer shadow-lg shadow-ink-orange/20'
                  : 'bg-ink-card text-ink-muted border-ink-card cursor-not-allowed'
            }`}
            onClick={() => { if (fieldsValid && !agreed) setTriedSubmit(true) }}
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
  const h3Class = "text-ink-lime font-display font-bold text-sm sm:text-base"
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        className="relative bg-ink-bg border-2 border-ink-border w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-5 sm:p-6"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-10 h-1 bg-ink-border rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg sm:text-xl font-black text-ink-blue">利用規約</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-text text-2xl font-bold w-8 h-8 flex items-center justify-center">&times;</button>
        </div>
        <div className="text-ink-text/80 font-body text-xs sm:text-sm leading-relaxed space-y-3 sm:space-y-4">
          <p>本利用規約（以下「本規約」）は、マイハン診断運営事務局（以下「運営者」）が提供するWebサービス「マイハン診断」（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただく前に、本規約の全文をお読みいただき、すべての条項に同意いただく必要があります。本サービスの利用を開始した時点で、本規約に同意したものとみなされます。</p>

          <h3 className={h3Class}>第1条（適用）</h3>
          <p>1. 本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。</p>
          <p>2. 運営者が本サービス上で別途定めるガイドライン、注意事項等（以下「個別規定」）は、本規約の一部を構成するものとします。本規約と個別規定が矛盾する場合は、個別規定が優先されます。</p>

          <h3 className={h3Class}>第2条（定義）</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>「ユーザー」とは、本サービスを利用するすべての方をいいます。</li>
            <li>「ユーザー情報」とは、ユーザーが本サービスに提供するポーカーネーム、メールアドレス、店舗情報、都道府県、ポーカー歴、診断回答内容、診断結果その他一切の情報をいいます。</li>
            <li>「コンテンツ」とは、本サービスにおいて提供されるテキスト、画像、デザイン、プログラム、診断ロジック等の一切の著作物をいいます。</li>
          </ul>

          <h3 className={h3Class}>第3条（利用登録・利用資格）</h3>
          <p>1. 本サービスの利用を希望する方は、本規約およびプライバシーポリシーに同意の上、所定の方法によりユーザー情報を提供することで利用登録を行うものとします。</p>
          <p>2. 本サービスは18歳以上の方を対象としています。18歳未満の方が利用する場合は、法定代理人（親権者等）の同意を得た上で利用するものとします。</p>
          <p>3. 運営者は、以下の場合に利用登録を拒否し、または事後的に取り消すことができるものとします。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>虚偽の情報を提供した場合</li>
            <li>過去に本規約に違反したことがある場合</li>
            <li>反社会的勢力等に該当すると判明した場合</li>
            <li>その他運営者が不適当と判断した場合</li>
          </ul>

          <h3 className={h3Class}>第4条（メールアドレスの利用・ポーカー関連情報の配信）</h3>
          <p>1. ユーザーが提供したメールアドレスは、以下の目的で利用されます。ユーザーは、本規約への同意をもって、特定電子メールの送信の受信について同意したものとみなされます（特定電子メールの送信の適正化等に関する法律第3条に基づく同意）。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスに関するお知らせ・ご案内・運営上の連絡の送信</li>
            <li><strong>ポーカーに関連するイベント情報、トーナメント告知、店舗キャンペーン、新サービス情報等の配信</strong></li>
            <li><strong>運営者および提携パートナー企業（ポーカールーム、アミューズメント施設、ポーカー関連商品・サービス提供企業等）からの広告・プロモーション・商品紹介等の商用メール（広告宣伝メール）の送信</strong></li>
            <li>ポーカー戦略・コラム・ニュース等のコンテンツメールの配信</li>
            <li>本サービスの改善・新機能開発のための分析</li>
            <li>ユーザーサポートおよびお問い合わせへの対応</li>
          </ul>
          <p>2. 商用メールの受信を希望しない場合は、メール内に記載の配信停止リンクまたは運営者への連絡により、いつでも受信を停止することができます。ただし、サービス運営上必要な通知メールは対象外とします。</p>

          <h3 className={h3Class}>第5条（ユーザー情報の二次利用・商用利用に関する包括的同意）</h3>
          <p>1. ユーザーは、本規約への同意をもって、本サービスに提供したユーザー情報（ポーカーネーム、メールアドレス、店舗情報、都道府県、ポーカー歴、診断回答内容、診断結果等の一切の情報）が、以下の目的で二次利用・商用利用されることに包括的に同意します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>統計的分析・データ解析：</strong>ユーザー情報を匿名化・集計した上で、ポーカープレイヤーの傾向分析、地域別・経験別の統計データ作成、市場動向調査に利用</li>
            <li><strong>マーケティング活用：</strong>ターゲティング広告の企画・配信、ユーザーセグメントに基づくプロモーション設計、広告効果測定</li>
            <li><strong>提携企業・パートナーへのデータ提供：</strong>個人を特定しない匿名化・集計済み形式での統計データ（例：地域別プレイヤー数、経験年数別傾向等）の第三者提供</li>
            <li><strong>事業開発・新サービス企画：</strong>ユーザーの属性・診断結果に基づく新サービスの企画・開発・テスト</li>
            <li><strong>パーソナライズ配信：</strong>ユーザーの属性・診断結果・行動履歴に基づいたコンテンツ・広告・商品推薦のパーソナライズ</li>
            <li><strong>学術・研究目的：</strong>匿名化データを用いた市場調査、行動心理学的研究、学術論文等への利用</li>
            <li><strong>メディア掲載：</strong>匿名化された統計データや診断傾向を、メディア記事・プレスリリース・SNS投稿等で引用・公開</li>
          </ul>
          <p>2. 上記の二次利用において、個人を直接特定可能な形（氏名・メールアドレス等の生データ）での第三者への販売・譲渡は行いません。統計的処理・匿名化処理を施した上で利用します。</p>
          <p>3. ユーザーは、本サービスの利用を開始した時点で、上記すべての二次利用・商用利用に同意したものとみなされます。</p>

          <h3 className={h3Class}>第6条（知的財産権）</h3>
          <p>1. 本サービスに関するコンテンツの著作権その他の知的財産権は、運営者または正当な権利を有する第三者に帰属します。</p>
          <p>2. ユーザーは、運営者の事前の書面による許可なく、コンテンツの全部または一部を複製、転載、改変、公衆送信、二次利用することはできません。</p>
          <p>3. 診断結果のスクリーンショットをSNS等で個人的にシェアすることは許可されます。ただし、商用目的での利用は禁止します。</p>

          <h3 className={h3Class}>第7条（禁止事項）</h3>
          <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令、条例または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>本サービスのサーバーまたはネットワークの機能を破壊、妨害する行為</li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>他のユーザーの個人情報を不正に収集・蓄積する行為</li>
            <li>他のユーザーに成りすます行為</li>
            <li>不正アクセスまたはこれを試みる行為</li>
            <li>本サービスのコンテンツの無断転載・複製・スクレイピング</li>
            <li>反社会的勢力等への利益供与行為</li>
            <li>自動化されたツール（Bot、クローラー等）を用いたアクセス</li>
            <li>運営者が不適切と合理的に判断する行為</li>
          </ul>

          <h3 className={h3Class}>第8条（サービスの停止・中断）</h3>
          <p>1. 運営者は、以下の事由がある場合、ユーザーへの事前通知なく本サービスの全部または一部を停止・中断することができるものとします。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスに係るシステムの保守・点検・更新を行う場合</li>
            <li>地震、落雷、火災、停電、天災等の不可抗力により本サービスの提供が困難となった場合</li>
            <li>システム障害、通信回線の障害等が発生した場合</li>
            <li>その他運営者が停止・中断を必要と判断した場合</li>
          </ul>
          <p>2. 運営者は、本条に基づき行った措置によりユーザーに生じた損害について、一切の責任を負いません。</p>

          <h3 className={h3Class}>第9条（免責事項・保証の否認）</h3>
          <p>1. 本サービスはエンターテインメント目的で「現状有姿（AS IS）」で提供されるものであり、特定の目的への適合性、正確性、完全性、有用性、安全性について、明示または黙示を問わず一切の保証をしません。</p>
          <p>2. 診断結果はポーカー戦略に関する専門的助言を構成するものではなく、投資・ギャンブル・金銭的判断の根拠として使用することは想定されていません。</p>
          <p>3. 本サービスの利用により生じた直接的・間接的・偶発的・特別・懲罰的損害（逸失利益を含む）について、運営者は故意または重大な過失がある場合を除き、一切の責任を負いません。</p>
          <p>4. 運営者の責任が認められる場合であっても、運営者が負担する損害賠償の額は、当該損害が発生した月にユーザーが本サービスに対して支払った金額（無料サービスの場合は0円）を上限とします。</p>

          <h3 className={h3Class}>第10条（反社会的勢力の排除）</h3>
          <p>1. ユーザーは、現在および将来にわたって、暴力団、暴力団員、暴力団準構成員、暴力団関係企業、総会屋、社会運動標ぼうゴロ、政治活動標ぼうゴロ、特殊知能暴力集団その他反社会的勢力（以下「反社会的勢力」）に該当しないことを表明し保証します。</p>
          <p>2. 運営者は、ユーザーが反社会的勢力に該当すると判明した場合、催告なしに直ちに当該ユーザーの利用を停止し、ユーザー情報を削除することができます。</p>

          <h3 className={h3Class}>第11条（サービス変更・終了）</h3>
          <p>1. 運営者は、運営上の都合により、本サービスの内容を変更し、または提供を終了することができるものとします。</p>
          <p>2. サービス終了の場合、運営者は合理的な範囲で事前に告知するよう努めますが、緊急やむを得ない場合はこの限りではありません。</p>
          <p>3. 運営者は、サービスの変更・終了によりユーザーに生じた損害について、一切の責任を負いません。</p>

          <h3 className={h3Class}>第12条（損害賠償）</h3>
          <p>ユーザーが本規約に違反して運営者に損害を与えた場合、ユーザーは運営者に対し、当該損害（弁護士費用を含む合理的な費用を含む）を賠償するものとします。</p>

          <h3 className={h3Class}>第13条（規約の変更）</h3>
          <p>1. 運営者は、以下の場合に本規約を変更できるものとします。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>変更がユーザーの一般の利益に適合する場合</li>
            <li>変更が契約目的に反せず、変更の必要性・変更内容の相当性等の事情に照らして合理的な場合</li>
          </ul>
          <p>2. 変更後の規約は、本サービス上への掲載その他合理的な方法で通知した時点から効力を生じます。重要な変更の場合は、変更の効力発生の相当期間前に通知します。</p>

          <h3 className={h3Class}>第14条（個人情報の取扱い）</h3>
          <p>ユーザーの個人情報の取扱いについては、別途定めるプライバシーポリシーに従います。ユーザーは、本規約への同意をもって、プライバシーポリシーの内容にも同意したものとします。</p>

          <h3 className={h3Class}>第15条（通知方法）</h3>
          <p>運営者からユーザーへの通知は、本サービス上への掲載、ユーザーが登録したメールアドレスへの送信、その他運営者が適当と判断する方法により行います。メールによる通知は、送信時にユーザーに到達したものとみなします。</p>

          <h3 className={h3Class}>第16条（権利義務の譲渡禁止）</h3>
          <p>ユーザーは、運営者の事前の書面による承諾なく、本規約に基づく権利義務の全部または一部を第三者に譲渡し、または担保に供することはできません。</p>

          <h3 className={h3Class}>第17条（分離可能性）</h3>
          <p>本規約の一部の条項が法令により無効または執行不能と判断された場合であっても、残りの条項は引き続き有効とします。無効または執行不能と判断された条項は、有効かつ執行可能な範囲で可能な限り当初の趣旨に沿って解釈されます。</p>

          <h3 className={h3Class}>第18条（準拠法・管轄）</h3>
          <p>1. 本規約の解釈および適用にあたっては、日本法を準拠法とします。</p>
          <p>2. 本サービスに関連して紛争が生じた場合は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>

          <div className="border-t border-ink-border pt-3 mt-4 space-y-1">
            <p className="text-ink-muted text-xs">制定日：2025年3月16日</p>
            <p className="text-ink-muted text-xs">最終改定日：2025年3月24日</p>
            <p className="text-ink-muted text-xs">マイハン診断運営事務局</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-ink-card border-2 border-ink-border rounded-xl text-ink-text font-display font-bold text-sm hover:bg-ink-border/30 transition-colors"
        >
          閉じる
        </button>
      </motion.div>
    </motion.div>
  )
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  const h3Class = "text-ink-magenta font-display font-bold text-sm sm:text-base"
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        className="relative bg-ink-bg border-2 border-ink-border w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-5 sm:p-6"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-10 h-1 bg-ink-border rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg sm:text-xl font-black text-ink-magenta">プライバシーポリシー</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-text text-2xl font-bold w-8 h-8 flex items-center justify-center">&times;</button>
        </div>
        <div className="text-ink-text/80 font-body text-xs sm:text-sm leading-relaxed space-y-3 sm:space-y-4">
          <p>マイハン診断運営事務局（以下「運営者」）は、Webサービス「マイハン診断」（以下「本サービス」）における個人情報の取扱いについて、個人情報の保護に関する法律（以下「個人情報保護法」）その他関連法令を遵守し、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。</p>

          <h3 className={h3Class}>1. 個人情報の定義</h3>
          <p>本ポリシーにおいて「個人情報」とは、個人情報保護法第2条第1項に定義される個人情報をいい、生存する個人に関する情報であって、当該情報に含まれる氏名、メールアドレスその他の記述等により特定の個人を識別できるもの、または個人識別符号が含まれるものをいいます。</p>

          <h3 className={h3Class}>2. 収集する情報</h3>
          <p>本サービスでは以下の情報を収集します。</p>
          <p className="text-ink-text/60 text-xs">【ユーザーが直接提供する情報】</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ポーカーネーム（ニックネーム）</li>
            <li>メールアドレス</li>
            <li>よく行く店舗名</li>
            <li>店舗所在の都道府県</li>
            <li>ポーカー歴</li>
            <li>診断回答内容および診断結果</li>
          </ul>
          <p className="text-ink-text/60 text-xs">【自動的に収集される情報】</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>IPアドレス</li>
            <li>ブラウザの種類・バージョン、OS情報</li>
            <li>アクセス日時、閲覧ページ、参照元URL</li>
            <li>Cookie情報およびウェブビーコンによる情報</li>
            <li>デバイス情報（画面サイズ、言語設定等）</li>
          </ul>

          <h3 className={h3Class}>3. 情報の利用目的</h3>
          <p>収集した個人情報は、以下の目的の範囲内で利用します。利用目的を変更する場合は、変更前の利用目的と関連性を有すると合理的に認められる範囲内で行い、変更後の目的をユーザーに通知または公表します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスの提供・運営・維持・改善・新機能開発</li>
            <li>ユーザーへのサービス関連通知の送信（メンテナンス、規約変更等）</li>
            <li><strong>ポーカー関連のイベント情報、トーナメント告知、店舗キャンペーン等の配信</strong></li>
            <li><strong>運営者および提携パートナー企業（ポーカールーム、アミューズメント施設等）からの広告・プロモーション・商品紹介等の商用メール（広告宣伝メール）の送信</strong></li>
            <li><strong>ユーザー情報を匿名化・統計処理した上での二次利用（地域別プレイヤー傾向分析、経験年数別統計、市場動向レポート作成等）</strong></li>
            <li><strong>匿名化・集計済み統計データの提携企業・メディア・研究機関等への提供</strong></li>
            <li>ユーザーの属性・嗜好・診断結果に基づくパーソナライズされたコンテンツ・広告・推薦の提供</li>
            <li>ユーザーサポート・お問い合わせへの対応</li>
            <li>利用規約に違反する行為の検知・対応・防止</li>
            <li>不正利用の検知・防止、セキュリティの確保</li>
          </ul>

          <h3 className={h3Class}>4. 個人情報の第三者提供</h3>
          <p>運営者は、以下の場合を除き、ユーザーの個人情報を事前の同意なく第三者に提供しません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合（裁判所の命令、捜査機関からの照会等）</li>
            <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難な場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
            <li>国の機関等への協力が必要な場合</li>
            <li>統計的なデータなど個人を識別できない匿名加工情報として提供する場合</li>
            <li>業務委託先に対し、利用目的の達成に必要な範囲で提供する場合（委託先には個人情報保護法に基づく適切な監督を行います）</li>
            <li>合併、事業譲渡その他事業承継に伴い個人情報を承継する場合</li>
          </ul>
          <p>なお、個人を直接特定可能な形での個人情報の販売・貸与は一切行いません。</p>

          <h3 className={h3Class}>5. 個人情報の安全管理措置</h3>
          <p>運営者は、収集した個人情報の漏洩、滅失、毀損の防止その他安全管理のために、以下の措置を講じます。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>組織的安全管理措置：</strong>個人情報の取扱いに関する責任者の設置、取扱規程の整備</li>
            <li><strong>人的安全管理措置：</strong>従業者への個人情報保護に関する教育・研修の実施</li>
            <li><strong>物理的安全管理措置：</strong>個人情報を取り扱う機器の盗難防止措置</li>
            <li><strong>技術的安全管理措置：</strong>アクセス制御、SSL/TLSによる通信の暗号化、不正アクセスの検知・防御</li>
          </ul>

          <h3 className={h3Class}>6. 個人情報の保存期間</h3>
          <p>1. ユーザーの個人情報は、利用目的の達成に必要な期間保存します。具体的な保存期間は、情報の種類と利用目的に応じて以下のとおりとします。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザー登録情報（ポーカーネーム、メールアドレス等）：アカウント削除依頼後30日以内に削除</li>
            <li>診断回答・結果データ：最終利用日から2年間</li>
            <li>アクセスログ：収集日から1年間</li>
          </ul>
          <p>2. 法令上保存義務がある場合は、当該法令の定める期間保存します。</p>
          <p>3. 保存期間経過後は、復元不可能な方法で速やかに削除・廃棄します。</p>

          <h3 className={h3Class}>7. Cookie・アクセス解析ツール</h3>
          <p>1. 本サービスでは、利便性向上・利用状況の分析・広告配信のためCookieおよび類似技術を使用する場合があります。</p>
          <p>2. 本サービスでは、以下のアクセス解析ツール・広告配信サービスを利用する場合があります。これらのサービスは、Cookieを使用してユーザーの情報を収集する場合があります。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google Analytics（提供：Google LLC）</li>
            <li>Google Ads（提供：Google LLC）</li>
            <li>その他運営者が適宜導入するサービス</li>
          </ul>
          <p>3. ユーザーはブラウザの設定でCookieを無効にすることが可能ですが、一部機能が制限される場合があります。</p>

          <h3 className={h3Class}>8. 個人情報の国外移転</h3>
          <p>本サービスは、クラウドサービス（Vercel、Supabase等）を利用しており、ユーザーの個人情報が日本国外のサーバーに保存される場合があります。その場合、当該国の個人情報保護制度の状況を踏まえ、適切な安全管理措置を講じた上で移転します。</p>

          <h3 className={h3Class}>9. メール配信の停止（オプトアウト）</h3>
          <p>1. 商用メール（広告宣伝メール）の受信を希望しない場合は、以下の方法でいつでも配信を停止（オプトアウト）することができます。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>メール本文内に記載された配信停止（Unsubscribe）リンクのクリック</li>
            <li>運営者への直接の連絡</li>
          </ul>
          <p>2. オプトアウト後も、サービス運営上必要な通知（規約変更、セキュリティに関する連絡等）は引き続き送信される場合があります。</p>

          <h3 className={h3Class}>10. ユーザーの権利（開示・訂正・削除・利用停止）</h3>
          <p>ユーザーは、個人情報保護法に基づき、以下の権利を行使することができます。運営者は、本人確認を行った上で、法令に定める期間内（原則2週間以内）に対応します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>開示請求：</strong>運営者が保有する自身の個人情報の開示を求める権利</li>
            <li><strong>訂正・追加・削除請求：</strong>個人情報の内容が事実でない場合に訂正等を求める権利</li>
            <li><strong>利用停止・消去請求：</strong>違法な取扱いが行われている場合等に利用停止等を求める権利</li>
            <li><strong>第三者提供停止請求：</strong>第三者提供の停止を求める権利</li>
          </ul>
          <p>開示請求等にあたり、手数料を徴収する場合は事前にお知らせします。</p>

          <h3 className={h3Class}>11. 個人情報に関する苦情・相談</h3>
          <p>個人情報の取扱いに関する苦情・相談は、以下の窓口までご連絡ください。</p>
          <div className="bg-ink-card/50 border border-ink-border rounded-xl p-3 space-y-1">
            <p className="text-ink-text text-xs">マイハン診断運営事務局 個人情報相談窓口</p>
            <p className="text-ink-muted text-xs">メール：privacy@myhand-poker.com</p>
            <p className="text-ink-muted text-xs">受付時間：平日 10:00〜18:00（土日祝日・年末年始を除く）</p>
          </div>

          <h3 className={h3Class}>12. 本ポリシーの変更</h3>
          <p>1. 運営者は、法令の改正、社会情勢の変化、その他必要に応じて、本ポリシーを改定する場合があります。</p>
          <p>2. 重要な変更（利用目的の追加、第三者提供先の変更等）を行う場合は、本サービス上での掲示またはメールにより、変更の効力発生日の相当期間前にユーザーに通知します。</p>
          <p>3. 変更後のポリシーは、本サービス上に掲載した時点から効力を生じます。</p>

          <h3 className={h3Class}>13. 継続的改善</h3>
          <p>運営者は、個人情報の保護に関する管理体制および取組みについて、適宜見直しを行い、継続的な改善に努めます。</p>

          <div className="border-t border-ink-border pt-3 mt-4 space-y-1">
            <p className="text-ink-muted text-xs">制定日：2025年3月16日</p>
            <p className="text-ink-muted text-xs">最終改定日：2025年3月24日</p>
            <p className="text-ink-muted text-xs">マイハン診断運営事務局</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-ink-card border-2 border-ink-border rounded-xl text-ink-text font-display font-bold text-sm hover:bg-ink-border/30 transition-colors"
        >
          閉じる
        </button>
      </motion.div>
    </motion.div>
  )
}
