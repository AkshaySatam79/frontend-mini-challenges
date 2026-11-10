import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Camera, Heart, Quote, RefreshCw, Shuffle, Sparkles } from 'lucide-react'
import { fetchDailyFact, fetchRandomCats, httpCatUrl, meowUrl } from '../lib/api'
import { useAsync } from '../hooks/useAsync'
import { CatMascot, CopyButton, ErrorState, HeartButton, ShareButton, Skeleton, SmartImage } from '../components/common'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.6, ease: 'easeOut' as const } }) }

export function DailyFact() {
  const { data, loading, error, reload } = useAsync((s) => fetchDailyFact(s), [])
  return (
    <div className="card relative overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blush-200 to-lav-200 opacity-60 blur-2xl" />
      <p className="chip mb-4"><Sparkles size={14} className="mr-1" /> Cat fact of the day</p>
      {loading && <div className="space-y-3"><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-4/5" /><Skeleton className="h-5 w-2/3" /></div>}
      {error && <ErrorState message={error.message} status={error.status} onRetry={reload} compact />}
      {data && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Quote className="mb-2 text-lav-300" size={28} />
          <p className="font-display text-xl font-semibold leading-snug text-slate-800 dark:text-white sm:text-2xl">{data.fact}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <CopyButton text={data.fact} />
            <ShareButton text={data.fact} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function Home({ onSurprise }: { onSurprise: () => void }) {
  const hero = useAsync((s) => fetchRandomCats(1, { signal: s }), [])
  const cat = hero.data?.[0]
  const [meowText, setMeowText] = useState('Meow')
  const [nonce, setNonce] = useState(0)
  const [code, setCode] = useState(404)

  const features = [
    { href: '#/gallery', icon: Camera, title: 'Cat Gallery', text: 'Endless photos from The Cat API and Cataas, plus a Meow Studio.', tint: 'from-blush-100 to-blush-200 dark:from-blush-500/20 dark:to-blush-500/10' },
    { href: '#/facts', icon: BookOpen, title: 'Cat Facts', text: 'Fascinating facts, a daily pick, and a live API docs explorer.', tint: 'from-lav-100 to-lav-200 dark:from-lav-500/20 dark:to-lav-500/10' },
    { href: '#/breeds', icon: Shuffle, title: 'Explore Breeds', text: 'Search and filter dozens of breeds by origin and temperament.', tint: 'from-peach-100 to-peach-200 dark:from-peach-300/20 dark:to-peach-300/10' },
    { href: '#/favourites', icon: Heart, title: 'My Favourites', text: 'Every cat you love, saved right in your browser.', tint: 'from-blush-100 to-lav-100 dark:from-blush-500/20 dark:to-lav-500/10' },
  ]

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div initial="hidden" animate="show" className="order-2 lg:order-1">
          <motion.span variants={fadeUp} custom={0} className="chip mb-5"><Sparkles size={14} className="mr-1" /> The cutest corner of the internet</motion.span>
          <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-800 dark:text-white sm:text-6xl lg:text-7xl">
            A Little World Full of <span className="gradient-text">Cats</span> 🐾
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-300">
            Discover adorable cats, explore fascinating facts, and fall in love with every paw-some moment.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => hero.reload()} disabled={hero.loading} className="btn-primary">
              <RefreshCw size={18} className={hero.loading ? 'animate-spin' : ''} /> Discover a Random Cat
            </button>
            <a href="#/facts" className="btn-soft">Explore Cat Facts <ArrowRight size={18} /></a>
          </motion.div>
          <motion.button variants={fadeUp} custom={4} onClick={onSurprise} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-lav-500 hover:underline dark:text-lav-200">
            <Sparkles size={16} /> or get a full Cat Surprise
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, type: 'spring', bounce: 0.35 }} className="relative order-1 mx-auto w-full max-w-md lg:order-2">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blush-200 via-lav-200 to-peach-200 opacity-70 blur-xl dark:opacity-30" />
          <div className="card relative overflow-hidden !rounded-[2rem] p-3">
            {hero.error ? (
              <div className="p-3"><ErrorState message={hero.error.message} status={hero.error.status} onRetry={hero.reload} /></div>
            ) : (
              <div className="relative">
                {cat ? <SmartImage key={cat.id} src={cat.url} alt="A random cat" ratio="1/1" className="rounded-3xl" /> : <Skeleton className="aspect-square w-full !rounded-3xl" />}
                {cat && <HeartButton cat={cat} className="absolute right-3 top-3" />}
              </div>
            )}
          </div>
          <CatMascot className="absolute -bottom-10 -left-10 w-32 drop-shadow-xl sm:-left-14 sm:w-40" />
        </motion.div>
      </section>

      {/* DAILY FACT */}
      <section><DailyFact /></section>

      {/* FEATURES */}
      <section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.a key={f.title} href={f.href} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }} className={`group card bg-gradient-to-br ${f.tint} p-6`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-lav-500 shadow-soft dark:bg-white/10 dark:text-lav-200"><f.icon size={24} /></span>
              <h3 className="mt-4 font-display text-xl font-extrabold text-slate-800 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{f.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-lav-500 dark:text-lav-200">Open <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* MEOW STUDIO TEASER */}
      <section className="card overflow-hidden p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="chip mb-3">Powered by Cataas</span>
            <h2 className="section-title">Make a cat say anything</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Type a message and watch a cute cat say it, in full colour or classic black &amp; white.</p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setNonce((n) => n + 1) }}>
              <input className="input" value={meowText} maxLength={40} onChange={(e) => setMeowText(e.target.value)} placeholder="Meow" aria-label="What should the cat say?" />
              <button className="btn-primary shrink-0"><Shuffle size={18} /> New cat</button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[false, true].map((mono) => (
              <motion.div key={String(mono)} whileHover={{ scale: 1.04, rotate: mono ? 2 : -2 }} className="overflow-hidden rounded-3xl bg-lav-50 p-2 shadow-soft dark:bg-night-700">
                <SmartImage src={meowUrl(meowText, mono, `home-${nonce}`)} alt={`Cat saying ${meowText}${mono ? ' in black and white' : ''}`} ratio="1/1" className="rounded-2xl" />
                <p className="py-1.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400">{mono ? 'Mono filter' : 'Full colour'}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HTTP CAT TEASER */}
      <section className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <motion.div key={code} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="card overflow-hidden p-3">
          <SmartImage src={httpCatUrl(code)} alt={`HTTP ${code} cat`} ratio="4/3" className="rounded-2xl" />
        </motion.div>
        <div>
          <span className="chip mb-3">Powered by http.cat</span>
          <h2 className="section-title">Every status code, <span className="gradient-text">but a cat</span></h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">When something breaks here, a status cat shows up to explain. Try a few codes:</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[200, 301, 404, 418, 429, 500, 503].map((c) => (
              <button key={c} onClick={() => setCode(c)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${code === c ? 'bg-gradient-to-r from-blush-400 to-lav-400 text-white shadow-pink' : 'bg-white/80 text-lav-500 hover:bg-lav-50 dark:bg-white/10 dark:text-lav-200'}`}>{c}</button>
            ))}
          </div>
          <a href="#/about" className="mt-6 inline-flex items-center gap-1 font-bold text-lav-500 hover:underline dark:text-lav-200">Try the full Status Cat lab <ArrowRight size={16} /></a>
        </div>
      </section>
    </div>
  )
}
