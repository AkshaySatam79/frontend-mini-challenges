import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AtSign, Heart, Mail, Menu, Moon, PawPrint, Sparkles, Sun, X } from 'lucide-react'
import { useFavourites, useTheme } from '../lib/store'

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9.5h3.8v11H3.3v-11Zm6.2 0h3.6V11h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7v5.7h-3.8v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.2H9.5v-11Z" />
  </svg>
)

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
  </svg>
)

export const ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/facts', label: 'Facts' },
  { path: '/breeds', label: 'Breeds' },
  { path: '/favourites', label: 'Favourites' },
  { path: '/about', label: 'About' },
] as const

export function Navbar({ route, onSurprise }: { route: string; onSurprise: () => void }) {
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const { favourites } = useFavourites()

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-6">
      <nav className="glass shadow-soft mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6" aria-label="Main">
        <a href="#/" className="flex items-center gap-2 font-display text-xl font-extrabold text-slate-800 dark:text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blush-300 to-lav-300 text-white"><PawPrint size={18} /></span>
          <span className="hidden sm:inline">Purrfect <span className="gradient-text">World</span></span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {ROUTES.map((r) => {
            const active = route === r.path
            return (
              <li key={r.path}>
                <a href={`#${r.path}`} className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${active ? 'text-lav-500 dark:text-white' : 'text-slate-500 hover:text-lav-500 dark:text-slate-300 dark:hover:text-white'}`}>
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-lav-100 dark:bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  {r.label}
                  {r.path === '/favourites' && favourites.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-blush-400 px-1.5 py-0.5 text-[10px] text-white">{favourites.length}</span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={onSurprise} className="btn-primary !px-4 !py-2 text-sm"><Sparkles size={16} /><span className="hidden sm:inline">Surprise</span></button>
          <button onClick={toggle} aria-label="Toggle dark mode" className="grid h-10 w-10 place-items-center rounded-full bg-white/70 dark:bg-white/10 text-lav-500 dark:text-lav-200 transition hover:scale-110">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(dark)} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} className="lg:hidden grid h-10 w-10 place-items-center rounded-full bg-white/70 dark:bg-white/10 text-lav-500 dark:text-lav-200">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.97 }}
            className="glass shadow-soft mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden">
            {ROUTES.map((r) => (
              <a key={r.path} href={`#${r.path}`} onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 font-bold ${route === r.path ? 'bg-lav-100 text-lav-500 dark:bg-white/10 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                {r.label}
                {r.path === '/favourites' && <span className="flex items-center gap-1 text-sm text-blush-400"><Heart size={14} className="fill-current" />{favourites.length}</span>}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  const links = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshay-satam-1b2639335/', icon: LinkedInIcon },
    { label: 'Instagram', href: 'https://www.instagram.com/akshay_satam79/', icon: InstagramIcon },
    { label: 'Threads', href: 'https://www.threads.com/@code_with_ak79?hl=en', icon: AtSign },
    { label: 'Email', href: 'mailto:akshaysatam79@gmail.com', icon: Mail },
  ]

  return (
    <footer className="mt-24 border-t border-lav-100 px-4 py-10 dark:border-white/10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div>
          <p className="font-display text-lg font-bold text-slate-700 dark:text-white">Purrfect World 🐾</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cats by The Cat API &amp; Cataas · Facts by catfact.ninja · Status cats by http.cat</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Made with love, React and a lot of purring.</p>
        </div>
        <div className="h-px w-full max-w-xl bg-gradient-to-r from-transparent via-lav-200 to-transparent dark:via-white/15" />
        <div>
          <p className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            Crafted with <span className="gradient-text">♡</span> by Akshay Satam
          </p>
          <nav aria-label="Akshay Satam social links" className="mt-4 flex flex-wrap justify-center gap-3">
            {links.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} aria-label={label} title={label}
                {...(href.startsWith('https://') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="grid h-11 w-11 place-items-center rounded-full border border-lav-200/70 bg-white/70 text-lav-500 shadow-soft transition hover:-translate-y-1 hover:bg-lav-50 dark:border-white/10 dark:bg-white/5 dark:text-lav-200 dark:hover:bg-white/10">
                <Icon size={18} />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
