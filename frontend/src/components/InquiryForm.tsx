import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, Lock, Sparkles } from 'lucide-react'
import { submitInquiry } from '../lib/api'
import { findEcho, type Echo } from '../lib/echoes'
import { rateLimit, secondsFromMs } from '../lib/rateLimit'

type InquiryFormProps = {
  services: string[]
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function InquiryForm({ services }: InquiryFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [shareOnWall, setShareOnWall] = useState(false)
  const [echo, setEcho] = useState<Echo | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const gate = rateLimit('inquiry-submit', { max: 5, windowMs: 600_000, minGapMs: 4000 })
    if (!gate.allowed) {
      setStatus('error')
      setErrorMessage(
        `You're sending these quickly. Give it ${secondsFromMs(gate.retryAfterMs)}s and try again.`,
      )
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      await submitInquiry({ name, email, services, message, shareOnWall })
      setEcho(findEcho(services, message))
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      setShareOnWall(false)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <motion.div
      id="inquiry"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lk-share-grid"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-[#544b43] leading-relaxed">
          Nickname and email are both optional. Leave them blank and this is completely
          anonymous. An email just lets someone reply to you directly instead of you having to
          check back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Nickname (optional)"
            className="flex-1 px-5 py-3 rounded-xl border-2 border-[#e4d8cc] bg-[#fffdf9] text-sm placeholder:text-[#968b81] transition-all hover:border-[#cbbaa9] focus:outline-none focus:border-[#e8734a] focus:ring-[3px] focus:ring-[#f3b49b] focus:bg-white"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email (optional, only for a reply)"
            className="flex-1 px-5 py-3 rounded-xl border-2 border-[#e4d8cc] bg-[#fffdf9] text-sm placeholder:text-[#968b81] transition-all hover:border-[#cbbaa9] focus:outline-none focus:border-[#e8734a] focus:ring-[3px] focus:ring-[#f3b49b] focus:bg-white"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="What's going on? Something hard, something good, or just venting. Share as much or as little as you want."
          className="px-5 py-3 rounded-xl border-2 border-[#e4d8cc] bg-[#fffdf9] text-sm placeholder:text-[#968b81] transition-all hover:border-[#cbbaa9] focus:outline-none focus:border-[#e8734a] focus:ring-[3px] focus:ring-[#f3b49b] focus:bg-white resize-none"
        />

        <label className="lk-toggle-row">
          <span className="lk-toggle-track" data-on={shareOnWall}>
            <span className="lk-toggle-thumb" />
            <input
              type="checkbox"
              checked={shareOnWall}
              onChange={(e) => setShareOnWall(e.target.checked)}
              className="sr-only"
            />
          </span>
          <span className="lk-toggle-copy">
            <strong>Share anonymously on The Wall</strong>, so other people dealing with the
            same thing can see it too, and send support. A volunteer reviews it first; it&apos;s
            never posted with your nickname or email.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'submitting' || services.length === 0}
          className="w-full px-6 py-3.5 rounded-xl bg-[#2b2420] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {status === 'submitting' ? 'Sending…' : 'Send, anonymously'}
        </button>

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 rounded-2xl border border-[#dbe9dc] bg-[#f2f8f3] px-5 py-4"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2f7d4f] text-white">
              <Check size={13} />
            </span>
            <p className="text-sm text-[#1f4d33] leading-relaxed">
              Thanks for sharing that. Someone will read it and get back to you if you left a way
              to reach you. You&apos;re not alone in this.
            </p>
          </motion.div>
        )}

        {status === 'success' && echo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="rounded-2xl border border-[#f0d9c9] bg-[#fdf3ea] px-5 py-5"
          >
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#c85a34] mb-3">
              <Sparkles size={13} /> An echo from The Wall
            </p>
            <p className="text-sm text-[#544b43] leading-relaxed">
              Someone felt something like this <strong>{echo.agoLabel}</strong>:
            </p>
            <p className="mt-2 pl-3 border-l-2 border-[#e8c9b3] text-sm italic text-[#5c5249] leading-relaxed">
              “{echo.post.message}”
            </p>
            <p className="mt-3 text-sm text-[#544b43] leading-relaxed">
              <strong className="text-[#2b2420]">What helped them:</strong> {echo.helped}
            </p>
            <p className="mt-3 text-xs text-[#8a7d72]">
              {echo.post.reactions.same + echo.post.reactions.not_alone} people said they felt the
              same. <Link to="/wall" className="underline hover:opacity-70">Find them on The Wall</Link>.
            </p>
          </motion.div>
        )}
        {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}
        {services.length === 0 && status === 'idle' && (
          <p className="text-xs opacity-50">Pick at least one thing above to send this.</p>
        )}
      </form>

      <aside className="rounded-3xl border border-[#ece2d9] bg-[#fffdf9] p-6 sm:p-7 self-start">
        <p className="text-xs uppercase tracking-widest text-[#544b43] mb-6">What happens next</p>
        <ol className="flex flex-col gap-6">
          {[
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
          ].map((step, i) => (
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
        <div className="mt-6 pt-5 border-t border-[#ece2d9] flex items-center gap-2 text-xs text-[#544b43]">
          <Lock size={13} className="shrink-0" />
          Nothing here is traced back to you unless you choose to leave an email.
        </div>
      </aside>
    </motion.div>
  )
}
