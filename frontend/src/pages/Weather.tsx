import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, CloudSun, ShieldCheck, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { WEEKS, TREND_SERIES, thisWeekSummary, INSIGHTS } from '../lib/weather'
import { AI_DEMO_MODE } from '../lib/api'

/* Chart geometry */
const W = 720
const H = 260
const PAD_X = 44
const PAD_Y = 22

function TrendChart() {
  const maxY = Math.max(...TREND_SERIES.flatMap((s) => s.counts)) + 6
  const x = (i: number) => PAD_X + (i / (WEEKS.length - 1)) * (W - PAD_X * 2)
  const y = (v: number) => H - PAD_Y - (v / maxY) * (H - PAD_Y * 2)

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label="Ten week trend of notes per topic">
        {/* horizontal gridlines */}
        {[0, 15, 30, 45].map((v) => (
          <g key={v}>
            <line x1={PAD_X} x2={W - PAD_X} y1={y(v)} y2={y(v)} stroke="#ece2d9" strokeWidth="1" />
            <text x={PAD_X - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#8a7d72">
              {v}
            </text>
          </g>
        ))}
        {/* week labels, every other to stay airy */}
        {WEEKS.map((w, i) =>
          i % 2 === 0 ? (
            <text key={w} x={x(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#8a7d72">
              {w}
            </text>
          ) : null,
        )}
        {/* series */}
        {TREND_SERIES.map((s) => {
          const d = s.counts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
          const last = s.counts.length - 1
          return (
            <g key={s.topic}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx={x(last)} cy={y(s.counts[last])} r="4" fill={s.color} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function Weather() {
  const summary = thisWeekSummary()

  return (
    <div className="min-h-screen font-sans px-6 py-16 max-w-4xl mx-auto">
      <Link to="/" className="text-sm text-[#544b43] hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
        <ArrowLeft size={15} /> Back to Soforotto
      </Link>

      <div className="flex items-center gap-3 mt-8 mb-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fbe6dc]">
          <CloudSun size={20} className="text-[#c85a34]" />
        </span>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#544b43]">
          Aggregate &amp; anonymous
        </p>
      </div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#2b2420] mb-4">
        Community weather
      </h1>
      <p className="text-[15px] sm:text-base text-[#544b43] leading-relaxed max-w-2xl">
        Every note shared here carries topic tags. Counted together, and only together, they show
        what teens are carrying this season. No names, no messages, no individuals: just the
        weather over the whole community.
      </p>

      {/* this week */}
      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-5">This week</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((s, i) => (
            <motion.div
              key={s.topic}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-[#ece2d9] bg-[#fffdf9] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: s.color }}>
                {s.topic}
              </p>
              <p className="text-3xl font-black text-[#2b2420] tabular-nums">{s.thisWeek}</p>
              <p className="text-xs text-[#544b43] mt-1">notes this week</p>
              <p className="flex items-center gap-1.5 text-xs font-semibold mt-3 text-[#544b43]">
                {s.delta > 0 ? (
                  <TrendingUp size={13} style={{ color: s.color }} />
                ) : s.delta < 0 ? (
                  <TrendingDown size={13} style={{ color: s.color }} />
                ) : (
                  <Minus size={13} />
                )}
                {s.delta > 0 ? `+${s.delta}` : s.delta} vs last week · {s.sky}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* trend chart */}
      <section className="mt-12">
        <div className="rounded-3xl border border-[#ece2d9] bg-[#fffdf9] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
            <h2 className="text-lg font-semibold text-[#2b2420] mr-auto">The last ten weeks</h2>
            {TREND_SERIES.map((s) => (
              <span key={s.topic} className="flex items-center gap-2 text-xs text-[#544b43]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.topic}
              </span>
            ))}
          </div>
          <TrendChart />
        </div>
      </section>

      {/* insights */}
      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-5">What the season says</h2>
        <ul className="flex flex-col gap-4 max-w-2xl">
          {INSIGHTS.map((line) => (
            <li key={line} className="flex gap-3 text-[15px] text-[#544b43] leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c85a34]" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* for schools */}
      <section className="mt-12">
        <div className="rounded-3xl border border-[#ece2d9] bg-[#f7f0e9] p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#544b43] mb-3">
            <ShieldCheck size={14} /> For schools &amp; counselors
          </p>
          <p className="text-[15px] text-[#544b43] leading-relaxed max-w-2xl">
            This page is the early-warning signal a counselor&apos;s office never had: when school
            stress spikes three weeks before finals, support can arrive before the wave does. And
            it works without anyone being watched, because counselors see the weather, never the
            raindrops. Individual notes stay with the volunteer team, small weekly counts are
            hidden entirely, and nothing here can be traced to a person.
          </p>
        </div>
      </section>

      {AI_DEMO_MODE && (
        <p className="mt-10 text-center text-[11px] text-[#8a7d72] max-w-md mx-auto">
          Preview data. In live mode these numbers come straight from Sub0 aggregate queries over
          real tagged notes, updated as they arrive.
        </p>
      )}
    </div>
  )
}
