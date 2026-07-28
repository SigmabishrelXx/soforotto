import { motion } from 'motion/react'

/* "The global picture": real, sourced facts about how the youth mental-health
   burden is distributed worldwide, from the IHME Global Burden of Disease 2021.
   No invented per-country numbers and no fake map: every fact here is published
   and cited. Cards fade up as they scroll into view. */
const FACTS = [
  {
    label: 'Heaviest burden',
    value: 'North America, Western Europe & Asia-Pacific',
    note: 'The highest-income regions carry the most.',
  },
  { label: 'Highest rate of all 204 countries', value: 'Greenland' },
  { label: 'Rising fastest since 1990', value: 'Mexico' },
  { label: 'Falling fastest', value: 'China' },
]

export function GlobalScale() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-4 text-center">
        The global picture
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#2b2420] text-center mb-4">
        It is everywhere, just not evenly
      </h2>
      <p className="text-base text-[#544b43] leading-relaxed text-center max-w-2xl mx-auto mb-10">
        This is not a problem in only one place. But the weight is not spread evenly, and it is
        heaviest where you might least expect it: in wealthy, high-income parts of the world.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {FACTS.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl bg-[#fffdf9] border border-[#ece2d9] p-5"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-[#544b43] mb-1.5">{f.label}</p>
            <p className="text-lg font-semibold text-[#2b2420] leading-snug">{f.value}</p>
            {f.note && <p className="text-sm text-[#544b43] mt-1">{f.note}</p>}
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-xs text-[#544b43] text-center">
        Source:{' '}
        <a
          href="https://www.healthdata.org/research-analysis/gbd"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#c85a34]"
        >
          IHME Global Burden of Disease, 2021
        </a>
        .
      </p>
    </section>
  )
}
