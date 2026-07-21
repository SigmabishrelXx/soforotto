import { Link } from 'react-router-dom'

// Shown for any URL that doesn't match a real route, so a typo or a stale link
// lands somewhere warm with a way back, instead of a blank page.
export function NotFound() {
  return (
    <div className="min-h-screen font-sans px-6 pt-32 pb-20 max-w-2xl mx-auto flex flex-col items-center text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-3">Page not found</p>
      <h1
        className="font-bold tracking-tight text-[#2b2420] leading-[1.05] mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
      >
        There&apos;s nothing at this address
      </h1>
      <p className="text-[#544b43] leading-relaxed mb-8 max-w-md">
        The page you were looking for moved, or never existed. That&apos;s on us, not you. Let&apos;s
        get you back somewhere that helps.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-[#2b2420] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back to Soforotto
        </Link>
        <Link
          to="/wall"
          className="px-6 py-3 rounded-full border border-[#ece2d9] text-[#2b2420] text-sm font-medium hover:bg-[#f7f0e9] transition-colors"
        >
          Visit The Wall
        </Link>
      </div>
    </div>
  )
}
