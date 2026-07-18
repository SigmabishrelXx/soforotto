import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, ShieldCheck } from 'lucide-react'

type Props = {
  role: string | null
  onClose: () => void
}

export function VolunteerModal({ role, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [why, setWhy] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    if (role) {
      setName('')
      setEmail('')
      setWhy('')
      setStatus('idle')
    }
  }, [role])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    // Demo: no backend write. Volunteer intake would post to Sub0 here.
    await new Promise((r) => setTimeout(r, 500))
    setStatus('sent')
  }

  return (
    <AnimatePresence>
      {role && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fffdf9] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#ece2d9]">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#544b43]">Volunteer</p>
                <p className="font-semibold text-[#2b2420] text-lg mt-1">Apply as a {role}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-[#544b43] hover:opacity-70 transition-opacity shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5">
              {status === 'sent' ? (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    Thanks, {name || 'friend'}. Your application to be a <strong>{role}</strong> is
                    in. Everyone goes through screening and crisis-response training before they get
                    access. We&apos;ll reach out about next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <p className="text-sm text-[#544b43] leading-relaxed">
                    Volunteers read incoming messages and respond with care. You&apos;ll be
                    screened and trained first. Nobody gets access on day one.
                  </p>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="px-4 py-3 rounded-xl border border-[#ece2d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2420]/20"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Email we can reach you at"
                    className="px-4 py-3 rounded-xl border border-[#ece2d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2420]/20"
                  />
                  <textarea
                    value={why}
                    onChange={(e) => setWhy(e.target.value)}
                    rows={3}
                    placeholder={`Why do you want to be a ${role}? (a sentence or two is fine)`}
                    className="px-4 py-3 rounded-xl border border-[#ece2d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2420]/20"
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="self-start px-6 py-3 rounded-full bg-[#2b2420] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {status === 'sending' ? 'Sending…' : 'Submit application'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
