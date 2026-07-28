import { motion, useSpring, useTransform, type SpringOptions } from 'motion/react'
import { useEffect } from 'react'

type AnimatedNumberProps = {
  value: number
  className?: string
  springOptions?: SpringOptions
}

/* Springs a number up to `value`. Drive `value` from 0 -> target (e.g. when the
   element scrolls into view) to get the count-up effect. Built on `motion`, the
   animation library already used across this project, so it adds no dependency. */
export function AnimatedNumber({ value, className, springOptions }: AnimatedNumberProps) {
  const spring = useSpring(0, springOptions)
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString('en-US'))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={className}>{display}</motion.span>
}
