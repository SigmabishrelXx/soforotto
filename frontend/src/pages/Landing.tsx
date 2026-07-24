import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { TrustSection } from '../components/TrustSection'
import { ServicePills } from '../components/ServicePills'
import { InquiryForm } from '../components/InquiryForm'
import { InfoSections } from '../components/InfoSections'
import { AIChat } from '../components/AIChat'
import { EmergencyHelp } from '../components/EmergencyHelp'
import { Footer } from '../components/Footer'

export function Landing() {
  const [services, setServices] = useState<string[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { hash } = useLocation()

  // Arriving from another route via /#section: scroll there once laid out.
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }, 60)
    return () => clearTimeout(t)
  }, [hash])

  const scrollToInquiry = () => {
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <Hero onShare={scrollToInquiry} onOpenChat={() => setIsChatOpen(true)} />

      <HowItWorks />

      <TrustSection />

      <section id="share" className="relative z-10 w-full border-t border-[#ece2d9]">
        <div className="w-full max-w-4xl mx-auto px-6 py-24 sm:py-28">
          <div className="lk-share-head">
            <p className="lk-share-eyebrow">Start here</p>
            <h2 className="lk-share-title">Share what&apos;s going on</h2>
          </div>

          <div className="lk-share-panel">
            <ServicePills services={services} setServices={setServices} onGo={scrollToInquiry} />
            <div className="lk-share-divider" />
            <InquiryForm services={services} />
          </div>
        </div>
      </section>

      <InfoSections />

      <Footer />

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <EmergencyHelp />
    </div>
  )
}
