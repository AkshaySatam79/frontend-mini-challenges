import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Globe2, Search, X } from 'lucide-react'
import { breedImageUrl, fetchBreeds, type Breed } from '../lib/api'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, HeartButton, SectionHeader, Skeleton, SmartImage } from '../components/common'

const STATS: { key: keyof Breed; label: string }[] = [
  { key: 'affection_level', label: 'Affection' }, { key: 'energy_level', label: 'Energy' }, { key: 'intelligence', label: 'Intelligence' },
  { key: 'child_friendly', label: 'Child friendly' }, { key: 'social_needs', label: 'Social needs' }, { key: 'adaptability', label: 'Adaptability' },
]

function BreedModal({ breed, onClose }: { breed: Breed; onClose: () => void }) {
  const img = breedImageUrl(breed)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={breed.name}>
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.94 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="card relative my-8 w-full max-w-3xl overflow-hidden">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full glass"><X size={18} /></button>
        <div className="grid md:grid-cols-2">
          <div className="relative">
            {img && <SmartImage src={img} alt={breed.name} className="h-full min-h-[16rem]" />}
            {img && <HeartButton cat={{ id: `breed-${breed.id}`, url: img, source: 'thecatapi' }} className="absolute left-3 top-3" />}
          </div>
          <div className="space-y-4 p-6">
            <div>
              <h3 className="font-display text-3xl font-extrabold text-slate-800 dark:text-white">{breed.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-lav-500 dark:text-lav-200"><Globe2 size={15} /> {breed.origin}</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{breed.description}</p>
            <div className="flex flex-wrap gap-1.5">{breed.temperament?.split(',').map((t) => <span key={t} className="chip">{t.trim()}</span>)}</div>
            <div className="space-y-2">
              {STATS.filter((s) => typeof breed[s.key] === 'number').map((s) => (
                <div key={s.label} className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="w-28 shrink-0">{s.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-lav-100 dark:bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(Number(breed[s.key]) / 5) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-blush-300 to-lav-400" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              {breed.life_span && <span>Life span: <b>{breed.life_span} yrs</b></span>}
              {breed.weight?.metric && <span>Weight: <b>{breed.weight.metric} kg</b></span>}
            </div>
            {breed.wikipedia_url && <a href={breed.wikipedia_url} target="_blank" rel="noreferrer" className="btn-soft !py-2 text-sm">Read on Wikipedia <ExternalLink size={14} /></a>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Breeds() {
  const { data, loading, error, reload } = useAsync((s) => fetchBreeds(s), [])
  const [q, setQ] = useState('')
  const [origin, setOrigin] = useState('')
  const [trait, setTrait] = useState('')
  const [selected, setSelected] = useState<Breed | null>(null)

  const origins = useMemo(() => [...new Set((data ?? []).map((b) => b.origin).filter(Boolean))].sort(), [data])
  const traits = useMemo(() => [...new Set((data ?? []).flatMap((b) => (b.temperament ?? '').split(',').map((t) => t.trim()).filter(Boolean)))].sort(), [data])

  const list = useMemo(() => (data ?? []).filter((b) =>
    (!q || b.name.toLowerCase().includes(q.toLowerCase())) &&
    (!origin || b.origin === origin) &&
    (!trait || (b.temperament ?? '').toLowerCase().includes(trait.toLowerCase())),
  ), [data, q, origin, trait])

  const filtered = q || origin || trait

  return (
    <section>
      <SectionHeader eyebrow="Explore Breeds" title={<>Meet the <span className="gradient-text">breeds</span></>}>
        Search by name, then filter by origin or temperament. Tap any card for the full profile.
      </SectionHeader>

      <div className="glass shadow-soft mb-8 grid gap-3 rounded-3xl p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lav-400" />
          <input className="input !pl-11" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search breeds…" aria-label="Search breeds by name" />
        </div>
        <select className="input !bg-white dark:!bg-night-800" value={origin} onChange={(e) => setOrigin(e.target.value)} aria-label="Filter by origin">
          <option className="bg-white text-slate-700 dark:bg-night-800 dark:text-slate-200" value="">All origins</option>
          {origins.map((o) => <option className="bg-white text-slate-700 dark:bg-night-800 dark:text-slate-200" key={o}>{o}</option>)}
        </select>
        <select className="input !bg-white dark:!bg-night-800" value={trait} onChange={(e) => setTrait(e.target.value)} aria-label="Filter by temperament">
          <option className="bg-white text-slate-700 dark:bg-night-800 dark:text-slate-200" value="">All temperaments</option>
          {traits.map((t) => <option className="bg-white text-slate-700 dark:bg-night-800 dark:text-slate-200" key={t}>{t}</option>)}
        </select>
        <button onClick={() => { setQ(''); setOrigin(''); setTrait('') }} disabled={!filtered} className="btn-soft">Reset</button>
      </div>

      {error && <ErrorState message={error.message} status={error.status} onRetry={reload} />}
      {loading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 !rounded-3xl" />)}</div>}

      {data && (
        <>
          <p className="mb-4 text-sm font-bold text-slate-500 dark:text-slate-400">{list.length} of {data.length} breeds</p>
          {list.length === 0 ? (
            <div className="card p-10 text-center"><p className="text-4xl">🙀</p><p className="mt-2 font-display text-xl font-bold">No breeds match those filters.</p></div>
          ) : (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {list.map((b, i) => {
                  const img = breedImageUrl(b)
                  return (
                    <motion.button layout key={b.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: Math.min(i, 8) * 0.04 }}
                      whileHover={{ y: -8 }} onClick={() => setSelected(b)} className="card overflow-hidden p-2 text-left">
                      {img ? <SmartImage src={img} alt={b.name} ratio="4/3" className="rounded-2xl" /> : <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-lav-50 text-5xl dark:bg-night-700">🐱</div>}
                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">{b.name}</h3>
                          <span className="chip shrink-0"><Globe2 size={12} className="mr-1" />{b.origin}</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{b.description}</p>
                        <p className="line-clamp-1 text-xs font-bold text-lav-500 dark:text-lav-200">{b.temperament}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      <AnimatePresence>{selected && <BreedModal breed={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  )
}
