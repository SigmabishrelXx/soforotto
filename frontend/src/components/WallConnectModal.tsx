import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, ShieldCheck, UserRound, Bot } from 'lucide-react'
import { requestWallConnect, type WallPost } from '../lib/api'

type Props = {
  post: WallPost | null
  onClose: () => void
}

type Via = 'moderator' | 'ai-agent'

export function WallConnectModal({ post, onClose }: Props) {
  const [via, setVia] = useState<Via>('moderator')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    if (post) {
      setVia('moderator')
      setNote('')
      setStatus('idle')
    }
  }, [post])

  const submit = async () => {
    if (!post || status === 'sending') return
    setStatus('sending')
    try {
      await requestWallConnect({ postId: post.id, via, note })
      setStatus('sent')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <AnimatePresence>
      {post && (
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
                <p className="font-semibold text-[#2b2420]">Reach out to this person</p>
                <p className="text-xs text-[#544b43] mt-1 max-w-sm leading-relaxed">
                  You won&apos;t get their contact info, and they won&apos;t get yours. Everything
                  goes through Soforotto so both of you stay anonymous and safe.
                </p>
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

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* The note they're responding to */}
              <div className="bg-[#f7f0e9] border border-[#ece2d9] rounded-2xl p-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {post.services.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#fffdf9] border border-[#ece2d9] text-[#544b43]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="font-serif italic text-[#2b2420] text-[15px] leading-relaxed">
                  {post.message}
                </p>
              </div>

              {status === 'sent' ? (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    Sent. {via === 'moderator' ? 'A Soforotto moderator' : 'The Soforotto AI agent'}{' '}
                    will pass your message along and stay in the middle of the conversation. Nothing
                    identifying is ever shared either way.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#544b43] mb-2">
                      How should we connect you?
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setVia('moderator')}
                        data-active={via === 'moderator'}
                        className="flex items-start gap-3 text-left w-full px-4 py-3 rounded-xl border border-[#ece2d9] hover:bg-[#f7f0e9] transition-colors data-[active=true]:border-[#2b2420] data-[active=true]:bg-[#f7f0e9]"
                      >
                        <UserRound size={18} className="shrink-0 mt-0.5" />
                        <span>
                          <span className="block text-sm font-semibold">Through a moderator</span>
                          <span className="block text-xs text-[#544b43]">
                            A real person on the team relays messages between you two.
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVia('ai-agent')}
                        data-active={via === 'ai-agent'}
                        className="flex items-start gap-3 text-left w-full px-4 py-3 rounded-xl border border-[#ece2d9] hover:bg-[#f7f0e9] transition-colors data-[active=true]:border-[#2b2420] data-[active=true]:bg-[#f7f0e9]"
                      >
                        <Bot size={18} className="shrink-0 mt-0.5" />
                        <span>
                          <span className="block text-sm font-semibold">
                            Through the AI agent
                          </span>
                          <span className="block text-xs text-[#544b43]">
                            Automated intros, instantly. A moderator still reviews anything
                            sensitive.
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#544b43] mb-2">
                      What do you want to say to them?
                    </p>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="e.g. I went through the exact same thing last year. You're not alone."
                      className="w-full px-4 py-3 rounded-xl border border-[#ece2d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2420]/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={status === 'sending' || note.trim().length === 0}
                    className="self-start px-6 py-3 rounded-full bg-[#2b2420] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send it their way'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
