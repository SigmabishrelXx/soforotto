import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Check, Heart } from 'lucide-react'

/* A small self-playing vignette for the "What happens next" panel: an example
   note is sent, a volunteer types a reply, and the outcome lands (a reply, or
   a spot on The Wall when sharing is on). The three numbered steps light up in
   sync. With reduced motion enabled we render the plain list instead. */

const NOTE = "i bombed my chem test and everyone still thinks i'm the smart one. i can't tell my parents."
const REPLY =
  "That pressure of being the smart one is heavy. One bad test doesn't undo who you are. If telling them feels impossible, we can think through a first step together."

// send card visible, card flies off, volunteer reads, reply types, outcome
const PHASE_MS = [2400, 1200, 1100, REPLY.length * 22 + 900, 3200]

function steps(shareOnWall: boolean) {
  return [
    {
      t: 'You send it, anonymously',
      d: 'No account, no name needed. It leaves your hands the moment you hit send.',
    },
    {
      t: 'A trained volunteer reads it',
      d: 'A real person, not a bot, usually within a day. They respond with care.',
    },
    shareOnWall
      ? {
          t: 'It goes up on The Wall',
          d: 'Once a volunteer approves it, others facing the same thing can find it and send support, never with your name.',
        }
      : {
          t: 'You hear back',
          d: 'If you left an email, a reply comes to you. If not, you can check back here anytime.',
        },
  ]
}

export default function NoteJourney({ shareOnWall }: { shareOnWall: boolean }) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (reduced) return
    const id = setTimeout(() => setPhase((p) => (p + 1) % PHASE_MS.length), PHASE_MS[phase])
    return () => clearTimeout(id)
  }, [phase, reduced])

  useEffect(() => {
    if (phase !== 3) {
      setTyped(phase === 4 ? REPLY : '')
      return
    }
    setTyped('')
    const id = setInterval(() => {
      setTyped((t) => (t.length >= REPLY.length ? t : REPLY.slice(0, t.length + 1)))
    }, 22)
    return () => clearInterval(id)
  }, [phase])

  const items = steps(shareOnWall)

  if (reduced) {
    return (
      <ol className="flex flex-col gap-6">
        {items.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2b2420] text-white text-xs font-semibold">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#2b2420]">{step.t}</p>
              <p className="text-sm text-[#544b43] mt-0.5 leading-relaxed">{step.d}</p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  const active = phase <= 1 ? 0 : phase <= 3 ? 1 : 2
  const typing = phase === 3 && typed.length < REPLY.length

  return (
    <div>
      {/* the vignette stage */}
      <div className="relative h-52 overflow-hidden rounded-2xl border border-[#ece2d9] bg-[#f7f0e9] p-3">
        <AnimatePresence mode="wait">
          {phase <= 1 && (
            <motion.div
              key="send"
              initial={{ opacity: 0, y: 10 }}
              animate={phase === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: -26, scale: 0.96 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="rounded-xl border border-[#ece2d9] bg-[#fffdf9] p-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#fbe6dc] px-2.5 py-0.5 text-[10px] font-semibold text-[#c85a34]">
                  School
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#a4968a]">Example</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#2b2420]">{NOTE}</p>
              <motion.span
                animate={{ scale: [1, 1, 0.94, 1] }}
                transition={{ duration: 0.5, times: [0, 0.7, 0.85, 1], delay: 1.5 }}
                className="mt-3 inline-block rounded-full bg-[#2b2420] px-3.5 py-1.5 text-[11px] font-semibold text-white"
              >
                Send, anonymously
              </motion.span>
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-full bg-[#fffdf9] border border-[#ece2d9] px-3 py-2 text-[11px] font-medium text-[#4e8c63]"
            >
              <Check size={12} /> Sent. No name attached.
            </motion.div>
          )}

          {(phase === 2 || phase === 3) && (
            <motion.div
              key="volunteer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-[#ece2d9] bg-[#fffdf9] p-3.5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbe6dc]">
                  <Heart size={11} className="text-[#c85a34]" />
                </span>
                <p className="text-[11px] font-semibold text-[#2b2420]">Trained volunteer</p>
                <span className="text-[10px] text-[#a4968a]">{phase === 3 ? 'replying…' : 'reading'}</span>
              </div>
              <p className="mt-2 truncate border-l-2 border-[#ece2d9] pl-2 text-[11px] italic text-[#8a7d72]">
                “{NOTE}”
              </p>
              <p className="mt-2 min-h-[3.6rem] text-[12.5px] leading-relaxed text-[#2b2420]">
                {typed}
                {typing && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 bg-[#e8734a]"
                  />
                )}
              </p>
            </motion.div>
          )}

          {phase === 4 && shareOnWall && (
            <motion.div
              key="wall"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-[#ece2d9] bg-[#fffdf9] p-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#fbe6dc] px-2.5 py-0.5 text-[10px] font-semibold text-[#c85a34]">
                  School
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-[#4e8c63]">
                  <Check size={11} /> approved by a volunteer
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#2b2420]">{NOTE}</p>
              <div className="mt-2.5 flex gap-2 text-[11px] text-[#544b43]">
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="rounded-full bg-[#f7f0e9] px-2 py-0.5"
                >
                  🤍 43
                </motion.span>
                <span className="rounded-full bg-[#f7f0e9] px-2 py-0.5">💪 11</span>
                <span className="rounded-full bg-[#f7f0e9] px-2 py-0.5">👋 18</span>
              </div>
            </motion.div>
          )}

          {phase === 4 && !shareOnWall && (
            <motion.div
              key="back"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-xl rounded-tl-sm border border-[#ece2d9] bg-[#fffdf9] p-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbe6dc]">
                    <Heart size={11} className="text-[#c85a34]" />
                  </span>
                  <p className="text-[11px] font-semibold text-[#2b2420]">A reply, back to you</p>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#2b2420]">{REPLY}</p>
              </div>
              <p className="mt-2 text-center text-[10px] text-[#a4968a]">usually within a day</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* step captions, lighting up in sync */}
      <ol className="mt-5 flex flex-col gap-2.5">
        {items.map((step, i) => (
          <li key={i} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-500 ${
                active === i ? 'bg-[#e8734a] text-white' : 'bg-[#f0e7dd] text-[#8a7d72]'
              }`}
            >
              {i + 1}
            </span>
            <p
              className={`text-sm transition-colors duration-500 ${
                active === i ? 'font-semibold text-[#2b2420]' : 'text-[#8a7d72]'
              }`}
            >
              {step.t}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-3 min-h-[2.5rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs leading-relaxed text-[#544b43]"
          >
            {items[active].d}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
