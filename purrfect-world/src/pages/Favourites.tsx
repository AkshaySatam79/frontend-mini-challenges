import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Trash2, X } from 'lucide-react'
import { useFavourites } from '../lib/store'
import { SectionHeader, SmartImage } from '../components/common'

const SOURCE_LABEL = { thecatapi: 'The Cat API', cataas: 'Cataas', meow: 'Meow Studio', mono: 'Mono Meow' } as const

export default function Favourites() {
  const { favourites, remove, clear } = useFavourites()
  return (
    <section>
      <SectionHeader eyebrow="My Favourites" title={<>Cats you <span className="gradient-text">love</span> 💕</>}>
        Saved in your browser, so they will be here next time you visit.
      </SectionHeader>

      {favourites.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-lg p-10 text-center">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-blush-100 text-blush-400 dark:bg-blush-500/20">
            <Heart size={36} className="fill-current" />
          </motion.div>
          <h3 className="font-display text-2xl font-extrabold text-slate-800 dark:text-white">No favourites yet</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Tap the heart on any cat to keep it here.</p>
          <a href="#/gallery" className="btn-primary mt-6">Find some cats</a>
        </motion.div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-bold text-slate-500 dark:text-slate-400">{favourites.length} saved {favourites.length === 1 ? 'cat' : 'cats'}</p>
            <button onClick={() => { if (confirm('Remove all favourites?')) clear() }} className="btn-soft !py-2 text-sm"><Trash2 size={16} /> Clear all</button>
          </div>
          <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {favourites.map((f) => (
                <motion.figure layout key={f.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6, rotate: 8 }} whileHover={{ y: -6 }} className="card group relative overflow-hidden p-2">
                  <SmartImage src={f.url} alt="A favourite cat" ratio="1/1" className="rounded-2xl" />
                  <button onClick={() => remove(f.id)} aria-label="Remove from favourites" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full glass text-slate-600 transition hover:scale-110 hover:text-red-400 dark:text-slate-200">
                    <X size={18} />
                  </button>
                  <figcaption className="px-2 pb-1 pt-2 text-xs font-bold text-lav-500 dark:text-lav-200">{SOURCE_LABEL[f.source]}</figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </section>
  )
}
