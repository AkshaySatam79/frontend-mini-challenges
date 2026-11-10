import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookMarked, FileJson, RefreshCw } from 'lucide-react'
import { describeError, fetchApiDocs, fetchCatFact, type CatFact } from '../lib/api'
import { useAsync } from '../hooks/useAsync'
import { CopyButton, ErrorState, PawLoader, SectionHeader, ShareButton, Skeleton } from '../components/common'
import { DailyFact } from './Home'

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  POST: 'bg-blush-100 text-blush-500 dark:bg-blush-500/20 dark:text-blush-200',
}

function ApiDocsExplorer() {
  const { data, loading, error, reload } = useAsync((s) => fetchApiDocs(s), [])
  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lav-100 text-lav-500 dark:bg-lav-500/20 dark:text-lav-200"><FileJson size={22} /></span>
        <div>
          <h3 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">{data?.title ?? 'Cat Facts API docs'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loaded live from <code className="rounded bg-lav-50 px-1.5 py-0.5 dark:bg-white/10">catfact.ninja/docs?api-docs.json</code>{data?.version && ` · v${data.version}`}</p>
        </div>
      </div>
      {loading && <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}
      {error && <ErrorState message={error.message} status={error.status} onRetry={reload} compact />}
      {data && (
        <ul className="space-y-3">
          {data.endpoints.map((e, i) => (
            <motion.li key={e.method + e.path} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-lav-50/70 px-4 py-3 dark:bg-white/5">
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${METHOD_COLORS[e.method] ?? 'bg-lav-100 text-lav-500'}`}>{e.method}</span>
              <code className="font-bold text-slate-700 dark:text-slate-100">{e.path}</code>
              {e.summary && <span className="text-sm text-slate-500 dark:text-slate-400">{e.summary}</span>}
              {e.tags.map((t) => <span key={t} className="chip ml-auto">{t}</span>)}
            </motion.li>
          ))}
          {data.endpoints.length === 0 && <p className="text-slate-500">The docs did not list any endpoints.</p>}
        </ul>
      )}
    </div>
  )
}

export default function Facts() {
  const [fact, setFact] = useState<CatFact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)
  const [count, setCount] = useState(0)

  const next = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      setFact(await fetchCatFact())
      setCount((c) => c + 1)
    } catch (e) {
      setError(describeError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void next() }, [next])

  return (
    <section className="space-y-16">
      <div>
        <SectionHeader eyebrow="Cat Facts" title={<>Did you <span className="gradient-text">know?</span></>}>
          One fascinating fact at a time, fresh from catfact.ninja.
        </SectionHeader>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="card relative min-h-[18rem] overflow-hidden p-6 sm:p-10">
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-peach-200 to-blush-200 opacity-50 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <span className="chip w-fit"><BookMarked size={14} className="mr-1" /> Fact #{count || '…'}</span>
              <div className="min-h-[7rem]">
                {error ? <ErrorState message={error.message} status={error.status} onRetry={next} compact /> : (
                  <AnimatePresence mode="wait">
                    {loading && !fact ? (
                      <motion.div key="l" exit={{ opacity: 0 }}><PawLoader label="Asking the cats…" /></motion.div>
                    ) : (
                      <motion.p key={fact?.fact} initial={{ opacity: 0, y: 24, rotateX: -15 }} animate={{ opacity: loading ? 0.4 : 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                        className="font-display text-2xl font-bold leading-snug text-slate-800 dark:text-white sm:text-3xl">
                        {fact?.fact}
                      </motion.p>
                    )}
                  </AnimatePresence>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={next} disabled={loading} className="btn-primary"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Next Fact</button>
                {fact && <CopyButton text={fact.fact} label="Copy fact" className="btn-soft" />}
                {fact && <ShareButton text={fact.fact} className="btn-soft" />}
              </div>
            </div>
          </div>
          <DailyFact />
        </div>
      </div>

      <div>
        <h2 className="mb-6 font-display text-3xl font-extrabold text-slate-800 dark:text-white">Under the hood: <span className="gradient-text">API explorer</span></h2>
        <ApiDocsExplorer />
      </div>
    </section>
  )
}
