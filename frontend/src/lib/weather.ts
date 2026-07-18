// ---------------------------------------------------------------------------
// Community Weather: anonymous, aggregate-only emotional trends built from
// the topic tags on submitted notes. Nobody's words appear here, only counts.
//
// Demo mode ships this deterministic 10-week series so the chart is stable
// and demoable. Live mode replaces it with the `weather-trends` Sub0 query
// (date_trunc week buckets x jsonb_array_elements_text(services) tags).
// ---------------------------------------------------------------------------

export type TopicSeries = {
  topic: string
  color: string
  counts: number[]
}

export const WEEKS = [
  'May 11',
  'May 18',
  'May 25',
  'Jun 1',
  'Jun 8',
  'Jun 15',
  'Jun 22',
  'Jun 29',
  'Jul 6',
  'Jul 13',
]

export const TREND_SERIES: TopicSeries[] = [
  {
    topic: 'School',
    color: '#c85a34',
    counts: [18, 21, 24, 30, 38, 46, 33, 22, 17, 19],
  },
  {
    topic: 'Friends & Bullying',
    color: '#3f77b3',
    counts: [22, 20, 23, 25, 24, 26, 28, 31, 34, 33],
  },
  {
    topic: 'Family',
    color: '#4e8c63',
    counts: [14, 15, 13, 16, 18, 20, 24, 28, 30, 29],
  },
  {
    topic: 'Something else',
    color: '#9a6b9e',
    counts: [11, 12, 12, 14, 15, 17, 15, 16, 18, 20],
  },
]

export type WeekSummary = {
  topic: string
  color: string
  thisWeek: number
  delta: number
  sky: string
}

/* A little weather in the words, because that's the metaphor. */
function skyFor(delta: number, thisWeek: number, max: number): string {
  if (thisWeek >= max * 0.85) return 'Stormy'
  if (delta >= 3) return 'Clouding over'
  if (delta <= -3) return 'Clearing up'
  return 'Steady'
}

export function thisWeekSummary(): WeekSummary[] {
  return TREND_SERIES.map((s) => {
    const thisWeek = s.counts[s.counts.length - 1]
    const lastWeek = s.counts[s.counts.length - 2]
    const max = Math.max(...s.counts)
    return {
      topic: s.topic,
      color: s.color,
      thisWeek,
      delta: thisWeek - lastWeek,
      sky: skyFor(thisWeek - lastWeek, thisWeek, max),
    }
  })
}

export const INSIGHTS = [
  'School stress peaked the week of Jun 15, right on finals, then dropped 59% within two weeks of summer starting.',
  'Family mentions have climbed every week since school let out: more time at home means more friction at home.',
  'Friendship and bullying notes rise through summer, when group chats replace hallways and exclusion gets more visible.',
]
