import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Heart, Search } from 'lucide-react'
import { HTTP_CODES, httpCatUrl } from '../lib/api'
import { CatMascot, SectionHeader, SmartImage } from '../components/common'

const APIS = [
  { name: 'The Cat API · images', url: 'https://api.thecatapi.com/v1/images/search', use: 'Random photos in the hero, gallery, surprise popup and breed galleries.' },
  { name: 'The Cat API · breeds', url: 'https://api.thecatapi.com/v1/breeds', use: 'Breed cards with search, origin and temperament filters.' },
  { name: 'Cataas · random cat', url: 'https://cataas.com/cat', use: 'The "Surprise Me" tab with a history of recently met cats.' },
  { name: 'Cataas · cute cat says Meow', url: 'https://cataas.com/cat/cute/says/Meow', use: 'Meow Studio: type a message and a cute cat says it.' },
  { name: 'Cataas · mono filter', url: 'https://cataas.com/cat/cute/says/Meow?filter=mono', use: 'Black-and-white version of every Meow Studio cat.' },
  { name: 'Cat Facts · random fact', url: 'https://catfact.ninja/fact', use: 'Next-fact cards, surprise popup and the daily fact.' },
  { name: 'Cat Facts · API docs', url: 'https://catfact.ninja/docs?api-docs.json', use: 'Live API explorer on the Facts page, built from the OpenAPI JSON.' },
  { name: 'http.cat', url: 'https://http.cat/[status_code]', use: 'Status Cat lab below, and the picture shown whenever a request fails.' },
]

export default function About() {
  const [code, setCode] = useState('404')
  const known = HTTP_CODES.find((c) => String(c.code) === code)
  const valid = /^[1-5]\d{2}$/.test(code)

  return (
    <section className="space-y-16">
      <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeader eyebrow="About" title={<>Made for <span className="gradient-text">cat lovers</span></>}>
            Purrfect World is a joyful little corner of the web for discovering cats, learning surprising facts and saving the ones you love. Everything you see is fetched live from public cat APIs.
          </SectionHeader>
          <p className="-mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400">Built with React, TypeScript, Tailwind CSS, Framer Motion and <Heart size={16} className="fill-blush-400 text-blush-400" /></p>
        </div>
        <CatMascot className="mx-auto w-56" />
      </div>

      <div>
        <h2 className="mb-6 font-display text-3xl font-extrabold text-slate-800 dark:text-white">The <span className="gradient-text">APIs</span> behind the purrs</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {APIS.map((a, i) => (
            <motion.div key={a.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }} className="card p-5">
              <h3 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">{a.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.use}</p>
              <a href={a.url.includes('[') ? 'https://http.cat' : a.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 break-all text-xs font-bold text-lav-500 hover:underline dark:text-lav-200">
                {a.url} <ExternalLink size={12} className="shrink-0" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-6 sm:p-10">
        <span className="chip mb-3">Powered by http.cat</span>
        <h2 className="section-title">Status Cat lab</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Pick or type any HTTP status code and meet its cat.</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lav-400" />
              <input className="input !pl-11" inputMode="numeric" maxLength={3} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="404" aria-label="HTTP status code" />
            </div>
            <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto pr-1">
              {HTTP_CODES.map((c) => (
                <button key={c.code} onClick={() => setCode(String(c.code))} title={c.label}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${code === String(c.code) ? 'bg-gradient-to-r from-blush-400 to-lav-400 text-white shadow-pink' : 'bg-lav-50 text-lav-500 hover:bg-lav-100 dark:bg-white/10 dark:text-lav-200'}`}>{c.code}</button>
              ))}
              <button onClick={() => setCode(String(HTTP_CODES[Math.floor(Math.random() * HTTP_CODES.length)].code))} className="btn-soft !py-1.5 !px-3 text-sm">🎲 Random</button>
            </div>
          </div>
          <motion.div key={code} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
            {valid ? (
              <>
                <SmartImage src={httpCatUrl(code)} alt={`HTTP ${code} cat`} ratio="4/3" className="rounded-3xl shadow-soft" />
                <p className="mt-3 text-center font-display text-lg font-bold text-slate-700 dark:text-white">{code} {known?.label ?? ''}</p>
              </>
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-lav-50 text-center text-slate-500 dark:bg-white/5">
                <div><p className="text-4xl">🙀</p><p className="mt-2 font-bold">Enter a 3-digit code (100–599)</p></div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
