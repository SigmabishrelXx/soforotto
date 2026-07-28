import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { AnimatedNumber } from './ui/animated-number'

/* "Why this matters" band: one real, sourced statistic that counts up when it
   scrolls into view. Every number here is cited (UNICEF 2021 + WHO), never
   invented, in keeping with the rest of the product's honesty rules. */
export function ImpactStat() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (inView) setValue(166)
  }, [inView])

  return (
    <section className="w-full">
      <div ref={ref} className="w-full max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-6">Why this matters</p>

        <p className="font-bold leading-none tabular-nums text-7xl sm:text-8xl text-[#c85a34]">
          <AnimatedNumber value={value} springOptions={{ stiffness: 55, damping: 22 }} />
          <span className="text-[#2b2420]">&nbsp;million</span>
        </p>

        <p className="mt-6 text-lg sm:text-xl text-[#2b2420] leading-relaxed max-w-2xl mx-auto">
          young people live with a mental health condition. That is about 1 in 7 worldwide, and most
          never receive care or reach out for help.
        </p>

        <p className="mt-4 text-base text-[#544b43] leading-relaxed max-w-xl mx-auto">
          Soforotto is here for the ones who never say anything.
        </p>

        <p className="mt-8 text-xs text-[#544b43]">
          Sources:{' '}
          <a
            href="https://data.unicef.org/topic/child-health/mental-health/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#c85a34]"
          >
            UNICEF, State of the World&apos;s Children 2021
          </a>{' '}
          and the{' '}
          <a
            href="https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#c85a34]"
          >
            World Health Organization
          </a>
          .
        </p>
      </div>
    </section>
  )
}
