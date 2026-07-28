import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/* A fixed, always-visible return control for the standalone info pages
   (Privacy, Built-with) that intentionally don't show the floating nav. */
export function ReturnButton() {
  return (
    <Link
      to="/"
      aria-label="Back to Soforotto"
      className="fixed z-[110] top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-[#fffdf9] border border-[#ece2d9] shadow-[0_8px_24px_rgba(120,80,50,0.12)] px-4 py-2 text-sm font-medium text-[#2b2420] hover:opacity-90 transition-opacity"
    >
      <ArrowLeft size={16} /> Back
    </Link>
  )
}
