import { useNavigate } from 'react-router-dom'
import { ImpactStat } from '../components/ImpactStat'
import { TrendChart } from '../components/TrendChart'
import { GlobalScale } from '../components/GlobalScale'

/* A dedicated, source-backed page on the real scale of youth mental health.
   Every figure here is cited (UNICEF, WHO, CDC). No invented or "live" numbers,
   in keeping with the rest of the product's honesty rules. */
export function WhyThisMatters() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-24">
      <div className="w-full max-w-4xl mx-auto px-6 pt-28">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-[#544b43] hover:text-[#2b2420] transition-colors"
        >
          &larr; Back to Soforotto
        </button>
      </div>

      {/* Headline stat, moved here from the landing page */}
      <ImpactStat />

      {/* Real, sourced trend */}
      <section className="w-full max-w-3xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-4 text-center">The trend</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2b2420] text-center mb-4">
          It has been getting harder, not easier
        </h2>
        <p className="text-base text-[#544b43] leading-relaxed text-center max-w-2xl mx-auto mb-10">
          The share of US high school students who felt persistently sad or hopeless climbed for a
          decade. It eased slightly in 2023, but it is still far above where it started.
        </p>

        <div className="rounded-2xl bg-[#fffdf9] border border-[#ece2d9] p-5 sm:p-8">
          <TrendChart />
        </div>

        <p className="mt-4 text-xs text-[#544b43] text-center">
          Persistent feelings of sadness or hopelessness, US high school students. Source:{' '}
          <a
            href="https://www.cdc.gov/yrbs/dstr/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#c85a34]"
          >
            CDC Youth Risk Behavior Survey
          </a>
          .
        </p>
      </section>

      {/* The global picture (real IHME regional data, no fake map) */}
      <GlobalScale />

      {/* Closing tie-in */}
      <section className="w-full max-w-2xl mx-auto px-6 text-center">
        <p className="text-lg text-[#2b2420] leading-relaxed">
          Behind every number is a teenager who did not have anyone to tell. Soforotto exists so that
          reaching out is the easy part.
        </p>
        <button
          onClick={() => navigate('/#share')}
          className="mt-6 inline-flex px-6 py-3 rounded-xl bg-[#2b2420] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Share what&apos;s going on
        </button>
      </section>
    </div>
  )
}
