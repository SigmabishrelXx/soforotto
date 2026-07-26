import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { listInquiries, updateInquiryStatus, approveToWall, type Inquiry } from '../lib/api'
import { detectCrisis } from '../lib/aiDemo'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.round(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.round(h / 24)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

type FlaggedInquiry = Inquiry & { flagged: boolean }

export function AdminDashboard() {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const token = localStorage.getItem('soforotto_admin_token')

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }

    listInquiries(token)
      .then(setInquiries)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load inquiries'))
      .finally(() => setLoading(false))
  }, [token, navigate])

  const handleStatusChange = async (id: string, status: string) => {
    if (!token) return
    await updateInquiryStatus(token, id, status)
    setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const handleApproveToWall = async (id: string) => {
    if (!token) return
    await approveToWall(token, id)
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, wall_status: 'approved' } : item)),
    )
  }

  // A volunteer replies from their own email. We open a pre-addressed draft, so
  // the reply is a real message from a real person (no server email needed).
  const openReply = (inquiry: Inquiry) => {
    const subject = encodeURIComponent('A reply from Soforotto')
    const body = encodeURIComponent(drafts[inquiry.id] ?? '')
    window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`
    handleStatusChange(inquiry.id, 'contacted')
    setReplyingId(null)
  }

  const handleSignOut = () => {
    localStorage.removeItem('soforotto_admin_token')
    navigate('/admin')
  }

  // Crisis triage: flag notes that trip crisis detection and float them to the
  // top so risk never sits buried in a flat list.
  const flagged: FlaggedInquiry[] = useMemo(
    () => inquiries.map((i) => ({ ...i, flagged: detectCrisis(i.message) })),
    [inquiries],
  )
  const sorted = useMemo(
    () => [...flagged].sort((a, b) => Number(b.flagged) - Number(a.flagged)),
    [flagged],
  )
  const newCount = inquiries.filter((i) => i.status === 'new').length
  const flaggedCount = flagged.filter((i) => i.flagged).length

  return (
    <div className="min-h-screen font-sans px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-medium tracking-tight">Messages</h1>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm text-[#2b2420] uppercase hover:opacity-70 transition-opacity"
        >
          Sign out
        </button>
      </div>
      <p className="text-sm mb-8">
        <span className="text-[#544b43]">
          Notes teens have sent in. {newCount > 0 ? `${newCount} new to read.` : 'All caught up.'}
        </span>
        {flaggedCount > 0 && (
          <span className="text-red-700 font-medium">
            {' '}
            {flaggedCount} flagged for urgent attention.
          </span>
        )}
      </p>

      {loading && <p className="text-sm opacity-60">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && inquiries.length === 0 && (
        <p className="text-sm opacity-60">No messages yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {sorted.map((inquiry) => (
          <div
            key={inquiry.id}
            className={`rounded-2xl p-5 flex flex-col gap-3 border ${
              inquiry.flagged ? 'border-red-300 bg-red-50/40' : 'border-[#ece2d9] bg-[#fffdf9]'
            }`}
          >
            {inquiry.flagged && (
              <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <ShieldAlert size={14} className="shrink-0" />
                Possible crisis. Read this first, and consider a professional referral.
              </div>
            )}

            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{inquiry.name || 'Anonymous'}</p>
                  {inquiry.status === 'new' && (
                    <span className="h-2 w-2 rounded-full bg-[#e8734a]" title="New" />
                  )}
                  {inquiry.isSample && (
                    <span
                      className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: '#f0e7dd', color: '#8a7d72' }}
                    >
                      Sample
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8a7d72] mt-0.5">
                  {inquiry.email || 'no email left'} · {timeAgo(inquiry.created_at)}
                </p>
              </div>
              <select
                value={inquiry.status}
                onChange={(event) => handleStatusChange(inquiry.id, event.target.value)}
                className="text-xs border border-[#ece2d9] rounded-lg px-2 py-1 bg-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <p className="text-sm leading-relaxed">{inquiry.message}</p>

            {/* Reply */}
            {inquiry.email ? (
              replyingId === inquiry.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={drafts[inquiry.id] ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [inquiry.id]: e.target.value }))}
                    rows={3}
                    autoFocus
                    placeholder="Write back as a real person, in your own words. This opens your email with the reply ready to send."
                    className="px-3 py-2 rounded-xl border border-[#ece2d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2420]/20"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openReply(inquiry)}
                      disabled={!(drafts[inquiry.id] ?? '').trim()}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#2b2420] text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
                    >
                      Open email to send
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="text-xs text-[#544b43] hover:opacity-70 transition-opacity"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setReplyingId(inquiry.id)}
                  className="self-start text-xs px-3 py-1.5 rounded-full border border-[#ece2d9] text-[#2b2420] hover:bg-[#f7f0e9] transition-colors"
                >
                  Reply
                </button>
              )
            ) : (
              <p className="text-xs text-[#8a7d72] italic">
                No email left, so there is no way to reply directly. They can check The Wall.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-1 pt-3 border-t border-[#ece2d9]">
              {inquiry.services.map((service) => (
                <span
                  key={service}
                  className="text-xs px-3 py-1 rounded-full bg-[#f7f0e9] border border-[#ece2d9]"
                >
                  {service}
                </span>
              ))}

              {inquiry.wall_status === 'pending' && (
                <>
                  <span className="text-xs text-[#8a7d72] italic">wants to share on the Wall</span>
                  <button
                    type="button"
                    onClick={() => handleApproveToWall(inquiry.id)}
                    className="text-xs px-3 py-1 rounded-full bg-[#2b2420] text-white hover:opacity-80 transition-opacity ml-auto"
                  >
                    Approve to Wall
                  </button>
                </>
              )}
              {inquiry.wall_status === 'approved' && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#eaf3ee] text-[#4e8c63] ml-auto">
                  On the Wall
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
