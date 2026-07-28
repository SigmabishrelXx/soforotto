import { motion } from 'motion/react'

/* US high school students reporting persistent feelings of sadness or hopelessness.
   Real figures from the CDC Youth Risk Behavior Survey (YRBS) trend reports.
   Bars animate up when the chart scrolls into view. Hand-built SVG so it fits this
   project's stack (Vite + motion) with no new charting dependency. */
const DATA = [
  { year: '2011', value: 28 },
  { year: '2013', value: 30 },
  { year: '2015', value: 30 },
  { year: '2017', value: 31 },
  { year: '2019', value: 37 },
  { year: '2021', value: 42 },
  { year: '2023', value: 40 },
]
const AXIS_MAX = 50

export function TrendChart() {
  const W = 720
  const H = 360
  const padL = 44
  const padR = 16
  const padT = 24
  const padB = 44
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const slot = plotW / DATA.length
  const barW = slot * 0.5
  const baseline = padT + plotH
  const yFor = (v: number) => padT + plotH * (1 - v / AXIS_MAX)
  const gridVals = [0, 10, 20, 30, 40, 50]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Percentage of US high school students with persistent feelings of sadness or hopelessness, rising from 28% in 2011 to 42% in 2021, then 40% in 2023. Source: CDC Youth Risk Behavior Survey."
    >
      {gridVals.map((g) => (
        <g key={g}>
          <line x1={padL} x2={W - padR} y1={yFor(g)} y2={yFor(g)} stroke="#ece2d9" strokeWidth={1} />
          <text x={padL - 8} y={yFor(g) + 4} textAnchor="end" fontSize={11} fill="#544b43">
            {g}%
          </text>
        </g>
      ))}

      {DATA.map((d, i) => {
        const cx = padL + slot * i + slot / 2
        const y = yFor(d.value)
        const h = baseline - y
        return (
          <g key={d.year}>
            <motion.rect
              x={cx - barW / 2}
              y={y}
              width={barW}
              height={h}
              rx={5}
              fill="#c85a34"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
            />
            <motion.text
              x={cx}
              y={y - 8}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill="#2b2420"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.08 + 0.35 }}
            >
              {d.value}%
            </motion.text>
            <text x={cx} y={H - padB + 20} textAnchor="middle" fontSize={12} fill="#544b43">
              {d.year}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
