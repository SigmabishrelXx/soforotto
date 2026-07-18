import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listInquiries, updateInquiryStatus, approveToWall, type Inquiry } from '../lib/api'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const handleSignOut = () => {
    localStorage.removeItem('soforotto_admin_token')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen font-sans px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Messages</h1>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm text-[#2b2420] uppercase hover:opacity-70 transition-opacity"
        >
          Sign out
        </button>
      </div>

      {loading && <p className="text-sm opacity-60">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && inquiries.length === 0 && (
        <p className="text-sm opacity-60">No messages yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="border border-[#ece2d9] rounded-2xl p-5 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium">{inquiry.name || 'Anonymous'}</p>
                {inquiry.email && <p className="text-sm opacity-60">{inquiry.email}</p>}
              </div>
              <select
                value={inquiry.status}
                onChange={(event) => handleStatusChange(inquiry.id, event.target.value)}
                className="text-xs border border-[#ece2d9] rounded-lg px-2 py-1"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="text-sm">{inquiry.message}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {inquiry.services.map((service) => (
                <span
                  key={service}
                  className="text-xs px-3 py-1 rounded-full bg-[#f7f0e9] border border-[#ece2d9]"
                >
                  {service}
                </span>
              ))}

              {inquiry.wall_status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleApproveToWall(inquiry.id)}
                  className="text-xs px-3 py-1 rounded-full bg-[#2b2420] text-white hover:opacity-80 transition-opacity ml-auto"
                >
                  Approve to Wall
                </button>
              )}
              {inquiry.wall_status === 'approved' && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#ece2d9] text-[#544b43] ml-auto">
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
