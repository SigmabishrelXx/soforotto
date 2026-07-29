import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/* Honest, plain-language FAQ. Answers reflect what the product actually is: a
   solo hackathon build, not a staffed service, with no invented claims. */
const FAQS = [
  {
    q: 'Is it really anonymous?',
    a: 'Yes. You don’t need a name, an email, or an account to send a message. Those two fields are optional, and an email is only stored if you choose to leave one so someone can reply.',
  },
  {
    q: 'Who reads my message?',
    a: 'A real person on the moderation team, not a bot. Messages are read from a private dashboard, and the AI companion is always labeled as an AI, never posing as a human.',
  },
  {
    q: 'Is this a crisis line?',
    a: 'No. Soforotto is for everyday support and isn’t monitored around the clock. If you or someone else is in immediate danger, call or text 988, text HOME to 741741, or call 911.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, completely. There’s nothing to pay and nothing to sign up for.',
  },
  {
    q: 'What if I share on The Wall?',
    a: 'A volunteer reviews it first. If it’s approved, only the topic and the message text appear, never your nickname or email. The public feed is built so it can’t return those fields.',
  },
  {
    q: 'Who built this?',
    a: 'Soforotto was built by one person for a hackathon. It’s a student project showing how anonymous, human-backed support could work, not a licensed counseling service.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="w-full max-w-3xl mx-auto px-6 py-24 sm:py-32 border-t border-[#ece2d9]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-3">Common questions</p>
      <h2
        className="font-bold tracking-tight text-[#2b2420] leading-[1.05] mb-10 sm:mb-12"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
      >
        FAQ
      </h2>

      <div className="flex flex-col">
        {FAQS.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q} className="border-b border-[#ece2d9]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base sm:text-lg font-semibold text-[#2b2420]">{item.q}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c85a34"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 transition-transform duration-300"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm sm:text-base text-[#544b43] leading-relaxed pb-5 max-w-2xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
