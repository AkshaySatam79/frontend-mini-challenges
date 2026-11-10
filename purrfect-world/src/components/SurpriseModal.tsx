import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PartyPopper, RefreshCw, X } from 'lucide-react'
import { describeError, fetchCatFact, fetchRandomCats, type CatFact, type CatImage } from '../lib/api'
import { CopyButton, ErrorState, HeartButton, PawLoader, ShareButton, SmartImage } from './common'

interface Surprise { cat: CatImage; fact: CatFact }

export function SurpriseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [data, setData] = useState<Surprise | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [cats, fact] = await Promise.all([fetchRandomCats(1), fetchCatFact()])
      setData({ cat: cats[0], fact })
    } catch (e) {
      setError(describeError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (open) void load() }, [open, load])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Cat surprise">
          <motion.div onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8, rotate: -4, y: 40 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="card relative w-full max-w-lg overflow-hidden">
            <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full glass"><X size={18} /></button>
            <div className="bg-gradient-to-r from-blush-100 via-lav-100 to-peach-100 dark:from-blush-500/20 dark:via-lav-500/20 dark:to-peach-300/10 px-6 py-4">
              <p className="flex items-center gap-2 font-display text-xl font-extrabold text-slate-800 dark:text-white"><PartyPopper size={22} className="text-blush-400" /> Cat Surprise!</p>
            </div>
            <div className="p-5">
              {loading && !data && <PawLoader />}
              {error && <ErrorState message={error.message} status={error.status} onRetry={load} compact />}
              {data && !error && (
                <motion.div key={data.cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="relative">
                    <SmartImage src={data.cat.url} alt="A random cat" className="rounded-2xl" ratio="4/3" />
                    <HeartButton cat={data.cat} className="absolute right-3 top-3" />
                    {loading && <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/60 dark:bg-night-900/60"><PawLoader label="Another one coming…" /></div>}
                  </div>
                  <blockquote className="rounded-2xl bg-lav-50 dark:bg-white/5 p-4 text-slate-700 dark:text-slate-200">
                    <span className="mr-1">🐾</span>{data.fact.fact}
                  </blockquote>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={load} disabled={loading} className="btn-primary !py-2 !px-4 text-sm"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Another surprise</button>
                    <CopyButton text={data.fact.fact} label="Copy fact" />
                    <ShareButton text={data.fact.fact} url={data.cat.url} />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
