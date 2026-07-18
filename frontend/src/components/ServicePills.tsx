import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'

const SERVICE_OPTIONS = ['School', 'Friends & Bullying', 'Family', 'Something good', 'Something else']

type ServicePillsProps = {
  services: string[]
  setServices: (services: string[]) => void
  onGo: () => void
}

export function ServicePills({ services, setServices, onGo }: ServicePillsProps) {
  const toggleService = (service: string) => {
    setServices(
      services.includes(service)
        ? services.filter((item) => item !== service)
        : [...services, service],
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-medium tracking-tight mb-2">What&apos;s going on?</h2>
      <p className="opacity-85 text-[#544b43] mb-8">
        The good, the hard, or the complicated. Select all that apply, no wrong answers.
      </p>

      <div className="flex flex-wrap gap-3">
        {SERVICE_OPTIONS.map((service) => {
          const isActive = services.includes(service)
          return (
            <motion.button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-base font-medium transition-colors ${
                isActive
                  ? 'bg-[#2b2420] text-white shadow-md shadow-emerald-950/5 transform'
                  : 'bg-[#fffdf9] text-[#2b2420] border border-[#ece2d9] hover:bg-[#ece2d9]/55'
              }`}
            >
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex"
                  >
                    <Check size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
              {service}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {services.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="italic text-xs mt-6"
          >
            Pick what fits. You can choose more than one.
          </motion.p>
        ) : (
          <motion.div
            key="active"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden mt-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f7f0e9] border border-[#ece2d9] rounded-2xl px-6 py-4">
              <p className="text-sm text-[#2b2420]">
                Ready to talk about: {services.join(', ')}
              </p>
              <button
                type="button"
                onClick={onGo}
                className="text-[#2b2420] uppercase text-xs font-medium hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                Let&apos;s Go &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
