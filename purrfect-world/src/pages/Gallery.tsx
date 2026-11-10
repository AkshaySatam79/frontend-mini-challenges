import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Download, ExternalLink, Image as ImageIcon, Plus, RefreshCw, Shuffle, Wand2 } from 'lucide-react'
import { describeError, fetchCataasCat, fetchRandomCats, meowCat, type CatImage } from '../lib/api'
import { ErrorState, HeartButton, SectionHeader, Skeleton, SmartImage } from '../components/common'

type Tab = 'photos' | 'cataas' | 'studio'

const TABS: { id: Tab; label: string; icon: typeof Camera }[] = [
  { id: 'photos', label: 'Cat Photos', icon: Camera },
  { id: 'cataas', label: 'Surprise Me', icon: Shuffle },
  { id: 'studio', label: 'Meow Studio', icon: Wand2 },
]

function CatTile({ cat, i }: { cat: CatImage; i: number }) {
  const breed = cat.breeds?.[0]
  return (
    <motion.figure layout initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: (i % 8) * 0.05, duration: 0.5 }}
      whileHover={{ y: -6 }} className="card group relative overflow-hidden p-2">
      <SmartImage src={cat.url} alt={breed ? `${breed.name} cat` : 'A cute cat'} ratio="1/1" className="rounded-2xl" />
      <HeartButton cat={cat} className="absolute right-4 top-4" />
      <div className="absolute inset-x-2 bottom-2 flex translate-y-2 items-end justify-between rounded-b-2xl bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-sm font-bold text-white">{breed?.name ?? 'Mystery kitty'}</span>
        <span className="flex gap-1.5">
          <a href={cat.url} target="_blank" rel="noreferrer" aria-label="Open full size" className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lav-500"><ExternalLink size={15} /></a>
          <a href={cat.url} download target="_blank" rel="noreferrer" aria-label="Download" className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lav-500"><Download size={15} /></a>
        </span>
      </div>
    </motion.figure>
  )
}

const SkeletonGrid = ({ n = 8 }: { n?: number }) => (
  <>{Array.from({ length: n }).map((_, i) => <Skeleton key={i} className="aspect-square w-full !rounded-3xl" />)}</>
)

/* ---------- Tab 1: The Cat API photos ---------- */
function Photos() {
  const [cats, setCats] = useState<CatImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)
  const seen = useRef(new Set<string>())

  const load = useCallback(async (replace = false) => {
    setLoading(true); setError(null)
    if (replace) seen.current.clear()
    try {
      // ask for extra so we can drop duplicates and still add a full row
      let batch = (await fetchRandomCats(12)).filter((c) => !seen.current.has(c.id))
      batch = batch.slice(0, 8)
      batch.forEach((c) => seen.current.add(c.id))
      setCats((prev) => (replace ? batch : [...prev, ...batch]))
    } catch (e) {
      setError(describeError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load(true) }, [load])

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={() => load(true)} disabled={loading} className="btn-primary"><Shuffle size={18} /> Random cats</button>
        <button onClick={() => load(false)} disabled={loading} className="btn-soft"><Plus size={18} /> Load more cats</button>
      </div>
      {error && cats.length === 0 ? <ErrorState message={error.message} status={error.status} onRetry={() => load(true)} /> : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {cats.map((c, i) => <CatTile key={c.id} cat={c} i={i} />)}
            {loading && <SkeletonGrid n={cats.length ? 4 : 8} />}
          </div>
          {error && <div className="mt-6"><ErrorState message={error.message} status={error.status} onRetry={() => load(false)} compact /></div>}
        </>
      )}
    </div>
  )
}

/* ---------- Tab 2: Cataas surprise ---------- */
function CataasSurprise() {
  const [history, setHistory] = useState<CatImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)

  const surprise = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const cat = await fetchCataasCat()
      setHistory((h) => [cat, ...h.filter((x) => x.id !== cat.id)].slice(0, 12))
    } catch (e) {
      setError(describeError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void surprise() }, [surprise])
  const current = history[0]

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="card relative overflow-hidden p-3">
        {error ? <ErrorState message={error.message} status={error.status} onRetry={surprise} /> : (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={current?.id ?? 'loading'} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {current ? <SmartImage src={current.url} alt="A random Cataas cat" ratio="1/1" className="rounded-3xl" /> : <Skeleton className="aspect-square w-full !rounded-3xl" />}
              </motion.div>
            </AnimatePresence>
            {current && <HeartButton cat={current} className="absolute right-3 top-3" />}
            {loading && current && (
              <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white/50 backdrop-blur-sm dark:bg-night-900/50">
                <RefreshCw className="animate-spin text-lav-400" size={36} />
              </div>
            )}
          </div>
        )}
        <button onClick={surprise} disabled={loading} className="btn-primary mt-3 w-full"><Shuffle size={18} /> Surprise me!</button>
      </div>
      <div>
        <h3 className="mb-3 font-display text-xl font-extrabold text-slate-800 dark:text-white">Recently met</h3>
        {history.length <= 1 ? <p className="text-slate-500 dark:text-slate-400">Press the button and your last cats will pile up here.</p> : (
          <div className="grid grid-cols-3 gap-3">
            {history.slice(1).map((c) => (
              <motion.button key={c.id} layout whileHover={{ scale: 1.06 }} onClick={() => setHistory((h) => [c, ...h.filter((x) => x.id !== c.id)])} className="overflow-hidden rounded-2xl shadow-soft" aria-label="Show this cat again">
                <SmartImage src={c.url} alt="Earlier cat" ratio="1/1" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Tab 3: Meow Studio ---------- */
function MeowStudio() {
  const [text, setText] = useState('Meow')
  const [mono, setMono] = useState(false)
  const [cat, setCat] = useState<CatImage>(() => meowCat('Meow', false))

  const make = (t = text, m = mono) => setCat(meowCat(t, m))

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card h-fit space-y-5 p-6">
        <div>
          <label htmlFor="says" className="mb-2 block font-bold text-slate-700 dark:text-slate-200">What should the cat say?</label>
          <input id="says" className="input" value={text} maxLength={60} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && make()} placeholder="Meow" />
          <div className="mt-3 flex flex-wrap gap-2">
            {['Meow', 'Purrr', 'Feed me', 'Hello!', 'Nap time'].map((p) => (
              <button key={p} onClick={() => { setText(p); make(p) }} className="chip transition hover:scale-105">{p}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-bold text-slate-700 dark:text-slate-200">Style</p>
          <div className="inline-flex rounded-full bg-lav-50 p-1 dark:bg-white/10">
            {[{ v: false, l: 'Full colour' }, { v: true, l: 'Mono filter' }].map((o) => (
              <button key={String(o.v)} onClick={() => { setMono(o.v); make(text, o.v) }} aria-pressed={mono === o.v}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${mono === o.v ? 'bg-white text-lav-500 shadow-soft dark:bg-lav-500 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>{o.l}</button>
            ))}
          </div>
        </div>
        <button onClick={() => make()} className="btn-primary w-full"><Wand2 size={18} /> Make a new cat</button>
      </div>
      <div className="card relative p-3">
        <SmartImage key={cat.id} src={cat.url} alt={`Cat saying ${text}`} ratio="1/1" className="rounded-3xl" />
        <HeartButton cat={cat} className="absolute right-6 top-6" />
      </div>
    </div>
  )
}

export default function Gallery() {
  const [tab, setTab] = useState<Tab>('photos')
  return (
    <section>
      <SectionHeader eyebrow="Cat Gallery" title={<>Fresh cats, <span className="gradient-text">every time</span></>}>
        Photos from The Cat API, surprises from Cataas, and a studio where cats say whatever you like.
      </SectionHeader>
      <div className="mb-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/70 p-1.5 shadow-soft dark:bg-white/5" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors sm:px-5 ${tab === t.id ? 'text-white' : 'text-slate-500 hover:text-lav-500 dark:text-slate-300'}`}>
            {tab === t.id && <motion.span layoutId="gallery-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 shadow-pink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className="relative flex items-center gap-2"><t.icon size={16} />{t.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tab === 'photos' && <Photos />}
          {tab === 'cataas' && <CataasSurprise />}
          {tab === 'studio' && <MeowStudio />}
        </motion.div>
      </AnimatePresence>
      <p className="mt-10 flex items-center gap-2 text-sm text-slate-400"><ImageIcon size={14} /> Tip: tap the heart on any cat to save it to your favourites.</p>
    </section>
  )
}
