import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSignIn } from '../lib/api'

export function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')

    setLoading(true)
    setError('')

    try {
      const result = await adminSignIn({ email, password })
      localStorage.setItem('soforotto_admin_token', result.token as unknown as string)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Volunteer sign in</h1>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="px-4 py-3 rounded-xl border border-[#F1F3F1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E1E]/20"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="px-4 py-3 rounded-xl border border-[#F1F3F1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E1E]/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#1C2E1E] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}
