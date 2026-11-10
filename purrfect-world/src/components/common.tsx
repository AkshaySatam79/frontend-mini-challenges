import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Heart, PawPrint, RefreshCw, Share2 } from 'lucide-react'
import { FALLBACK_IMG, httpCatUrl, type CatImage } from '../lib/api'
import { useFavourites, useToast } from '../lib/store'

/* ---------- animated background ---------- */

const PAWS = [
  { l: '6%', t: '12%', s: 34, d: 0, r: '-18deg' }, { l: '88%', t: '8%', s: 28, d: 1.2, r: '14deg' },
  { l: '14%', t: '64%', s: 26, d: 2.4, r: '22deg' }, { l: '92%', t: '58%', s: 38, d: 0.6, r: '-12deg' },
  { l: '48%', t: '4%', s: 22, d: 3, r: '8deg' }, { l: '70%', t: '86%', s: 30, d: 1.8, r: '-24deg' },
  { l: '30%', t: '90%', s: 24, d: 2.8, r: '16deg' },
]

export function PawBackground({ paws = true }: { paws?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
      <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-blush-200/60 dark:bg-blush-500/15 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-lav-200/60 dark:bg-lav-500/20 blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />
      <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-peach-200/60 dark:bg-peach-300/10 blur-3xl animate-blob" style={{ animationDelay: '-9s' }} />
      {paws && PAWS.map((p, i) => (
        <PawPrint
          key={i}
          className="absolute text-lav-300/50 dark:text-lav-300/20 animate-float"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: `${p.d}s`, ['--r' as string]: p.r }}
        />
      ))}
    </div>
  )
}

/* ---------- cute animated cat illustration ---------- */

export function CatMascot({ className = '' }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 200 180" className={className} aria-label="A cute cartoon cat" role="img"
      animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
      {/* tail */}
      <motion.path d="M150 140 C185 135 190 95 170 85" fill="none" stroke="#ffb98f" strokeWidth="12" strokeLinecap="round"
        animate={{ rotate: [-8, 10, -8] }} style={{ originX: '150px', originY: '140px' }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
      {/* body */}
      <ellipse cx="100" cy="135" rx="52" ry="38" fill="#ffd2b8" />
      <ellipse cx="100" cy="146" rx="30" ry="24" fill="#fff5f8" />
      {/* head */}
      <path d="M52 62 L58 18 L88 42 Q100 38 112 42 L142 18 L148 62 Q152 108 100 112 Q48 108 52 62Z" fill="#ffd2b8" />
      <path d="M62 30 L66 52 L80 44Z M138 30 L134 52 L120 44Z" fill="#ffa3c4" />
      {/* stripes */}
      <path d="M100 44 V58 M90 46 L92 58 M110 46 L108 58" stroke="#ffb98f" strokeWidth="4" strokeLinecap="round" />
      {/* eyes */}
      <motion.g animate={{ scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.94, 0.98, 1] }} style={{ originY: '78px', originX: '100px' }}>
        <ellipse cx="80" cy="78" rx="7" ry="9" fill="#3b2a52" />
        <ellipse cx="120" cy="78" rx="7" ry="9" fill="#3b2a52" />
        <circle cx="82.5" cy="74" r="2.6" fill="#fff" />
        <circle cx="122.5" cy="74" r="2.6" fill="#fff" />
      </motion.g>
      {/* cheeks, nose, mouth, whiskers */}
      <circle cx="68" cy="94" r="8" fill="#ffa3c4" opacity=".55" />
      <circle cx="132" cy="94" r="8" fill="#ffa3c4" opacity=".55" />
      <path d="M95 91 Q100 97 105 91 Q100 88 95 91Z" fill="#f4568d" />
      <path d="M100 96 Q100 103 93 103 M100 96 Q100 103 107 103" fill="none" stroke="#3b2a52" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M58 90 L34 86 M58 96 L34 100 M142 90 L166 86 M142 96 L166 100" stroke="#b39ad9" strokeWidth="2" strokeLinecap="round" />
      {/* paws */}
      <ellipse cx="78" cy="168" rx="14" ry="9" fill="#fff5f8" />
      <ellipse cx="122" cy="168" rx="14" ry="9" fill="#fff5f8" />
    </motion.svg>
  )
}

/* ---------- loaders ---------- */

export function PawLoader({ label = 'Fetching cuteness…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-lav-400" role="status">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}>
            <PawPrint size={26} />
          </motion.div>
        ))}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
  )
}

export const Skeleton = ({ className = '' }: { className?: string }) => <div className={`skeleton rounded-2xl ${className}`} />

/* ---------- error state (with an http.cat) ---------- */

export function ErrorState({ message, status, onRetry, compact = false }: { message: string; status?: number; onRetry?: () => void; compact?: boolean }) {
  const code = status && status >= 100 && status < 600 ? status : 503
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      className={`card mx-auto flex ${compact ? 'flex-row items-center gap-4 p-4' : 'flex-col items-center gap-4 p-6 max-w-md text-center'}`}>
      <img src={httpCatUrl(code)} alt={`HTTP ${code} cat`} loading="lazy"
        className={`rounded-2xl object-cover ${compact ? 'h-20 w-20' : 'h-48 w-full'}`}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }} />
      <div className={compact ? 'text-left' : ''}>
        <p className="font-display font-bold text-lg text-slate-800 dark:text-white">Oh no, something went wrong{status ? ` (${status})` : ''}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary mt-3 !py-2 !px-4 text-sm"><RefreshCw size={16} /> Try again</button>
        )}
      </div>
    </motion.div>
  )
}

/* ---------- section header ---------- */

export function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.header initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      className="mb-10 max-w-2xl">
      <span className="chip mb-3">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {children && <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">{children}</p>}
    </motion.header>
  )
}

/* ---------- image with skeleton, fade-in and fallback ---------- */

export function SmartImage({ src, alt, className = '', ratio }: { src: string; alt: string; className?: string; ratio?: string }) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => { setState('loading'); setAttempt(0) }, [src])
  const url = attempt > 0 ? `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}` : src
  return (
    <div className={`relative overflow-hidden bg-lav-50 dark:bg-night-700 ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {state === 'loading' && <div className="skeleton absolute inset-0 !rounded-none" />}
      <img
        src={state === 'error' ? FALLBACK_IMG : url}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setState((s) => (s === 'error' ? s : 'ok'))}
        onError={() => { if (attempt < 1) setAttempt(1); else setState('error') }}
        className={`h-full w-full object-cover transition-all duration-700 ${state === 'loading' ? 'opacity-0 scale-105 blur-md' : 'opacity-100 scale-100 blur-0'}`}
      />
    </div>
  )
}

/* ---------- heart button ---------- */

export function HeartButton({ cat, className = '' }: { cat: Pick<CatImage, 'id' | 'url' | 'source'>; className?: string }) {
  const { isFav, toggle } = useFavourites()
  const on = isFav(cat.id)
  return (
    <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggle(cat)} aria-pressed={on} aria-label={on ? 'Remove from favourites' : 'Add to favourites'}
      className={`grid h-10 w-10 place-items-center rounded-full glass shadow-soft transition hover:scale-110 ${className}`}>
      <motion.span key={String(on)} initial={{ scale: 0.4 }} animate={{ scale: [0.4, 1.4, 1] }} transition={{ duration: 0.4 }}>
        <Heart size={20} className={on ? 'fill-blush-400 text-blush-400' : 'text-slate-500 dark:text-slate-200'} />
      </motion.span>
    </motion.button>
  )
}

/* ---------- copy / share buttons ---------- */

export function CopyButton({ text, label = 'Copy', className = 'btn-soft !py-2 !px-4 text-sm' }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false)
  const { toast } = useToast()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { toast('Could not copy', 'error'); ta.remove(); return }
      ta.remove()
    }
    setDone(true); toast('Copied to clipboard 📋')
    setTimeout(() => setDone(false), 1600)
  }
  return <button onClick={copy} className={className}>{done ? <Check size={16} /> : <Copy size={16} />} {done ? 'Copied' : label}</button>
}

export function ShareButton({ text, url, label = 'Share', className = 'btn-soft !py-2 !px-4 text-sm' }: { text: string; url?: string; label?: string; className?: string }) {
  const { toast } = useToast()
  const share = async () => {
    const payload = { title: 'Purrfect World', text, url: url ?? location.href }
    try {
      if (navigator.share) { await navigator.share(payload); return }
      await navigator.clipboard.writeText(url ? `${text} ${url}` : text)
      toast('Share link copied 🔗')
    } catch (e) {
      if ((e as Error).name !== 'AbortError') toast('Sharing is not available here', 'error')
    }
  }
  return <button onClick={share} className={className}><Share2 size={16} /> {label}</button>
}
