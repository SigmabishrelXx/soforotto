import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, Send, ShieldAlert } from 'lucide-react'
import { sendAiChatMessage, AI_DEMO_MODE, type ChatMessage } from '../lib/api'
import { detectCrisis } from '../lib/aiDemo'
import { rateLimit, secondsFromMs } from '../lib/rateLimit'

type AIChatProps = {
  isOpen: boolean
  onClose: () => void
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [crisis, setCrisis] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return

    const gate = rateLimit('ai-chat', { max: 15, windowMs: 60_000, minGapMs: 1500 })
    if (!gate.allowed) {
      setNotice(`Give it a moment. Try again in ${secondsFromMs(gate.retryAfterMs)}s.`)
      return
    }
    setNotice('')

    if (detectCrisis(text)) setCrisis(true)

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    setError('')

    try {
      const reply = await sendAiChatMessage(nextMessages)
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch {
      setError("Couldn't reach the AI right now. If this is urgent, use the help button instead.")
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-[#fffdf9] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg h-[85vh] sm:h-[72vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#ece2d9]">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#2b2420]">Soforotto AI</p>
                  {AI_DEMO_MODE && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#544b43] bg-[#f0f0f0] rounded-full px-2 py-0.5">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#544b43] mt-1 max-w-xs leading-relaxed">
                  This is an AI, not a human. It&apos;s here to listen, but for anything urgent,
                  use the “I need help right now” button.
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {crisis && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <ShieldAlert size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 leading-relaxed">
                    It sounds like you&apos;re going through something serious. Please reach out to
                    real help now: call or text <strong>988</strong>, or text{' '}
                    <strong>HOME to 741741</strong>. If you&apos;re in immediate danger, call{' '}
                    <strong>911</strong>.
                  </p>
                </div>
              )}

              {messages.length === 0 && (
                <div className="flex flex-col gap-3 mt-1">
                  <p className="text-sm text-[#544b43] leading-relaxed">
                    There&apos;s no right way to start, and you don&apos;t have to explain it
                    perfectly. Say whatever&apos;s on your mind, in your own words, whenever
                    you&apos;re ready.
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'self-end bg-[#2b2420] text-white'
                      : 'self-start bg-[#f7f0e9] border border-[#ece2d9] text-[#2b2420]'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="self-start text-xs text-[#544b43] px-1">Thinking…</div>
              )}
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div ref={endRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-[#ece2d9] px-4 py-4">
              {notice && <p className="text-xs text-[#544b43] mb-2 px-1">{notice}</p>}
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type something…"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#ece2d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2420]/20"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={sending || !input.trim()}
                  aria-label="Send"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[#2b2420] text-white disabled:opacity-40 shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
