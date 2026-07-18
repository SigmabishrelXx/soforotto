import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PhoneCall, X, ChevronDown } from 'lucide-react'
import { COUNTRIES, OTHER_COUNTRY, type Hotline } from '../lib/hotlines'

const STORAGE_KEY = 'soforotto_country'

function resolveCountry(code: string) {
  return COUNTRIES.find((c) => c.code === code) ?? (code === 'OTHER' ? OTHER_COUNTRY : null)
}

export function EmergencyHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? '')
  /* How far the button rides up so it never covers the footer's bottom bar
     (the "Built with Sub0 + LingoQL" credit lives there). */
  const [lift, setLift] = useState(0)

  const country = resolveCountry(code)

  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const bar = document.querySelector('.lk-footer-bottom')
      if (!bar) return
      const top = bar.getBoundingClientRect().top
      setLift(Math.max(0, window.innerHeight - top + 12))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const chooseCountry = (value: string) => {
    setCode(value)
    if (value) localStorage.setItem(STORAGE_KEY, value)
  }

  const renderLine = (line: Hotline, i: number) => {
    const external = line.href.startsWith('http')
    return (
      <a
        key={i}
        href={line.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={
          line.primary
            ? 'flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-600 text-white hover:opacity-90 transition-opacity'
            : 'flex items-center gap-3 px-5 py-4 rounded-2xl border border-[#ece2d9] hover:bg-[#f7f0e9] transition-colors'
        }
      >
        <PhoneCall size={18} className="shrink-0" />
        <span>
          <span className="block text-sm font-semibold">{line.title}</span>
          <span className={`block text-xs ${line.primary ? 'opacity-80' : 'text-[#544b43]'}`}>
            {line.subtitle}
          </span>
        </span>
      </a>
    )
  }

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-40 transition-transform duration-150 ease-out"
        style={{ transform: `translateY(-${lift}px)` }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="lk-help-bounce flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
        >
          I need help right now
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center px-4 sm:px-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fffdf9] rounded-3xl max-w-md w-full p-6 sm:p-8 relative max-h-[88vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 text-[#544b43] hover:opacity-70 transition-opacity"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-medium tracking-tight mb-3 text-[#2b2420]">
                Get real help, right now
              </h2>
              <p className="text-sm text-[#544b43] mb-5 leading-relaxed">
                These connect you to a real crisis line or emergency services, not Soforotto.
                Pick where you are so we show the right numbers. We don&apos;t track your
                location.
              </p>

              {/* Country picker */}
              <label className="block mb-5">
                <span className="text-xs uppercase tracking-widest text-[#544b43]">
                  Where are you?
                </span>
                <div className="relative mt-2">
                  <select
                    value={code}
                    onChange={(e) => chooseCountry(e.target.value)}
                    className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 border-[#e4d8cc] bg-white text-sm text-[#2b2420] transition-all hover:border-[#cbbaa9] focus:outline-none focus:border-[#e8734a] focus:ring-4 focus:ring-[#e8734a]/15"
                  >
                    <option value="" disabled>
                      Select your country…
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                    <option value="OTHER">{OTHER_COUNTRY.name}</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#544b43]"
                  />
                </div>
              </label>

              {/* Lines */}
              {country ? (
                <div className="flex flex-col gap-3">{country.lines.map(renderLine)}</div>
              ) : (
                <div className="rounded-2xl border border-[#ece2d9] bg-[#f7f0e9] px-5 py-4 text-sm text-[#544b43] leading-relaxed">
                  Choose your country above to see the crisis lines near you. If someone is in
                  immediate danger right now, call your local emergency number.
                </div>
              )}

              <p className="text-xs text-[#544b43] mt-5 leading-relaxed">
                Don&apos;t see your country?{' '}
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  findahelpline.com
                </a>{' '}
                lists free, confidential lines almost everywhere.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
