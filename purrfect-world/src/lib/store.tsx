import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import type { CatSource } from './api'

/* ---------- localStorage hook ---------- */

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  return [value, setValue] as const
}

/* ---------- toast ---------- */

type ToastKind = 'success' | 'error' | 'info'
interface Toast { id: number; kind: ToastKind; text: string }
interface ToastCtx { toast: (text: string, kind?: ToastKind) => void }
const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

/* ---------- favourites ---------- */

export interface Favourite { id: string; url: string; source: CatSource; addedAt: number }
interface FavCtx {
  favourites: Favourite[]
  isFav: (id: string) => boolean
  toggle: (f: { id: string; url: string; source: CatSource }) => void
  remove: (id: string) => void
  clear: () => void
}
const FavContext = createContext<FavCtx>({ favourites: [], isFav: () => false, toggle: () => {}, remove: () => {}, clear: () => {} })
export const useFavourites = () => useContext(FavContext)

/* ---------- theme ---------- */

interface ThemeCtx { dark: boolean; toggle: () => void }
const ThemeContext = createContext<ThemeCtx>({ dark: false, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

/* ---------- provider ---------- */

export function AppProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [favourites, setFavourites] = useLocalStorage<Favourite[]>('pw-favourites', [])
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toast = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-3), { id, kind, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const toggleTheme = useCallback(() => {
    setDark((d) => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      try { localStorage.setItem('pw-theme', next ? 'dark' : 'light') } catch { /* ignore */ }
      return next
    })
  }, [])

  const favCtx = useMemo<FavCtx>(() => ({
    favourites,
    isFav: (id) => favourites.some((f) => f.id === id),
    toggle: (f) => {
      const exists = favourites.some((x) => x.id === f.id)
      setFavourites(exists ? favourites.filter((x) => x.id !== f.id) : [{ ...f, addedAt: Date.now() }, ...favourites])
      toast(exists ? 'Removed from favourites' : 'Saved to favourites 💕', exists ? 'info' : 'success')
    },
    remove: (id) => { setFavourites(favourites.filter((x) => x.id !== id)); toast('Removed from favourites', 'info') },
    clear: () => { setFavourites([]); toast('Favourites cleared', 'info') },
  }), [favourites, setFavourites, toast])

  const icons = { success: CheckCircle2, error: XCircle, info: Info }

  return (
    <ThemeContext.Provider value={{ dark, toggle: toggleTheme }}>
      <ToastContext.Provider value={{ toast }}>
        <FavContext.Provider value={favCtx}>
          {children}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4" aria-live="polite">
            <AnimatePresence>
              {toasts.map((t) => {
                const Icon = icons[t.kind]
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    className="glass shadow-soft rounded-full pl-3 pr-5 py-2.5 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-white"
                  >
                    <Icon size={18} className={t.kind === 'error' ? 'text-red-400' : t.kind === 'info' ? 'text-lav-400' : 'text-emerald-400'} />
                    {t.text}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </FavContext.Provider>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  )
}
