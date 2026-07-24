import { motion } from 'motion/react'

// A quick three-step orientation, placed high on the landing page so a first
// time visitor understands the flow before scrolling. The richer self-playing
// version lives lower, inside the share form (NoteJourney).
const STEPS = [
  {
    t: "Share what's going on",
    d: 'No name, no account needed. Say as much or as little as you want.',
  },
  {
    t: 'A real person reads it',
    d: 'A trained volunteer, not a bot, usually within a day. They respond with care.',
  },
  {
    t: 'You hear back',
    d: 'A reply comes to you if you left an email, or check The Wall anytime.',
  },
]

export function HowItWorks() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] text-center mb-10">
        How it works
      </p>
      <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
        {STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fbe6dc] text-[#c85a34] font-semibold mb-4">
              {i + 1}
            </span>
            <p className="font-semibold text-[#2b2420] mb-1.5">{s.t}</p>
            <p className="text-sm text-[#544b43] leading-relaxed max-w-[16rem]">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
