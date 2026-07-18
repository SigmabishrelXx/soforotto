import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

type ScrollScaleRevealProps = {
  children: ReactNode
  className?: string
  /** Scale the content starts at before it scrolls into view (0-1). */
  startScale?: number
}

/**
 * Scroll-linked scale + fade reveal. As the element scrolls into view its
 * content grows from `startScale` to full size and fades in. Honors
 * prefers-reduced-motion (renders static). Adapted from a video-scroll hero
 * into a calm, asset-free reveal for this project.
 */
export function ScrollScaleReveal({
  children,
  className = '',
  startScale = 0.84,
}: ScrollScaleRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [startScale, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [0.35, 1])

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduceMotion ? undefined : { scale, opacity }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
