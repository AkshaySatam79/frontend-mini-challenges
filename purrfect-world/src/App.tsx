import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Footer, Navbar } from './components/Navbar'
import { PawBackground } from './components/common'
import { SurpriseModal } from './components/SurpriseModal'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Facts from './pages/Facts'
import Breeds from './pages/Breeds'
import Favourites from './pages/Favourites'
import About from './pages/About'

const readRoute = () => {
  const p = location.hash.replace(/^#/, '') || '/'
  return p.startsWith('/') ? p : '/'
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [surprise, setSurprise] = useState(false)

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openSurprise = useCallback(() => setSurprise(true), [])
  const closeSurprise = useCallback(() => setSurprise(false), [])

  const page = (() => {
    switch (route) {
      case '/gallery': return <Gallery />
      case '/facts': return <Facts />
      case '/breeds': return <Breeds />
      case '/favourites': return <Favourites />
      case '/about': return <About />
      default: return <Home onSurprise={openSurprise} />
    }
  })()

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PawBackground />
      <Navbar route={route} onSurprise={openSurprise} />
      <main className="mx-auto max-w-6xl px-4 pb-8 pt-28 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div key={route} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            {page}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <SurpriseModal open={surprise} onClose={closeSurprise} />
    </div>
  )
}
