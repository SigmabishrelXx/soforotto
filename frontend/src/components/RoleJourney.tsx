import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Mail, ShieldCheck, Award, Heart, LifeBuoy, Check } from 'lucide-react'

/* A self-playing stepper for each volunteer role, shown beside the role on the
   Volunteer section. It walks the path from applying to being active, so the
   "nobody gets access on day one, everyone is screened and trained" promise is
   something you watch rather than just read. Reduced motion gets a static list.
   No real data, purely illustrative. Sibling in spirit to NoteJourney. */

type Role = 'Peer Listener' | 'Community Moderator'
type IconType = React.ComponentType<{ size?: number }>
type Step = { label: string; caption: string; Icon: IconType }

const SHARED: Step[] = [
  { label: 'Application in', caption: 'We read every application by hand.', Icon: Mail },
  {
    label: 'Screening',
    caption: 'A real person checks who you are and why you want to help.',
    Icon: ShieldCheck,
  },
  {
    label: 'Crisis-response training',
    caption: 'You learn how to hold hard conversations safely.',
    Icon: Award,
  },
]

const FINAL: Record<Role, Step> = {
  'Peer Listener': {
    label: 'You start listening',
    caption: 'Now you read a note, and reply with care.',
    Icon: Heart,
  },
  'Community Moderator': {
    label: 'You help route care',
    caption: 'Now you keep replies fast, and flag anything that needs a pro.',
    Icon: LifeBuoy,
  },
}

const ACCENT: Record<Role, string> = {
  'Peer Listener': '#e8734a',
  'Community Moderator': '#4e8c63',
}

const STEP_MS = 1500
const HOLD_MS = 2800

export function RoleJourney({ role }: { role: Role }) {
  const reduced = useReducedMotion()
  const steps = [...SHARED, FINAL[role]]
  const accent = ACCENT[role]
  const last = steps.length - 1
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = setTimeout(
      () => setPhase((p) => (p >= last ? 0 : p + 1)),
      phase === last ? HOLD_MS : STEP_MS,
    )
    return () => clearTimeout(id)
  }, [phase, reduced, last])

  if (reduced) {
    return (
      <div className="rounded-2xl border border-[#ece2d9] bg-[#fffdf9] p-5">
        <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] mb-4">
          What happens after you apply
        </p>
        <ol className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: accent }}
              >
                <s.Icon size={14} />
              </span>
              <span className="text-sm text-[#2b2420]">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const outcome = phase === last

  return (
    <div className="rounded-2xl border border-[#ece2d9] bg-[#fffdf9] p-5">
      <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] mb-4">
        What happens after you apply
      </p>

      <div className="flex items-center">
        {steps.map((step, i) => {
          const done = i < phase
          const active = i === phase
          const lit = done || active
          const StepIcon = step.Icon
          return (
            <div key={i} className={`flex items-center ${i < last ? 'flex-1' : ''}`}>
              <motion.span
                animate={{ scale: active ? [1, 1.14, 1] : 1 }}
                transition={{ duration: 0.5 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500"
                style={{
                  backgroundColor: lit ? accent : '#f0e7dd',
                  borderColor: lit ? accent : '#e6dbd0',
                  color: lit ? '#fff' : '#a4968a',
                }}
              >
                {done ? <Check size={15} /> : <StepIcon size={15} />}
              </motion.span>
              {i < last && (
                <div className="relative mx-1.5 h-[2px] flex-1 overflow-hidden rounded bg-[#ece2d9]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded"
                    style={{ backgroundColor: accent }}
                    initial={false}
                    animate={{ width: phase > i ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 min-h-[3.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-semibold text-[#2b2420]">{steps[phase].label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#544b43]">{steps[phase].caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* role-specific flourish once the path completes */}
      <div className="min-h-[2.5rem]">
        <AnimatePresence>
          {outcome && role === 'Peer Listener' && (
            <motion.div
              key="listen"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-xl rounded-tl-sm border border-[#ece2d9] bg-[#f7f0e9] px-3 py-2 text-[12px] italic leading-relaxed text-[#2b2420]"
            >
              “you&apos;re not alone in this. want to tell me what happened?”
            </motion.div>
          )}
          {outcome && role === 'Community Moderator' && (
            <motion.div
              key="route"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="flex items-center gap-2 text-[12px] text-[#544b43]"
            >
              <span className="rounded-full bg-[#f0e7dd] px-2 py-0.5">note needs a pro</span>
              <span style={{ color: accent }}>&rarr;</span>
              <span className="rounded-full px-2 py-0.5 font-medium text-white" style={{ backgroundColor: accent }}>
                counselor referral
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
