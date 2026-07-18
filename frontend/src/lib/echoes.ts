// ---------------------------------------------------------------------------
// Echoes: match what someone just shared to the most similar past note that
// already received support, so venting becomes connection ("someone felt this
// too, and here's what helped them").
//
// Demo mode runs this matcher client-side over the seeded Wall posts. The
// real backend equivalent is the `echo-find` Sub0 endpoint, which does the
// same thing with Postgres full-text search (ts_rank) over approved posts.
// ---------------------------------------------------------------------------
import { DEMO_WALL_POSTS, type WallPost } from './api'

export type Echo = {
  post: WallPost
  helped: string
  agoLabel: string
  /* 0..1-ish similarity, used to decide whether the match is worth showing */
  score: number
}

/* One honest "what helped" line per seed post: written as the kind of reply a
   trained volunteer actually sends, no miracle cures, no medical claims. */
const WHAT_HELPED: Record<string, string> = {
  'demo-1':
    'A volunteer helped them list what was actually due this week versus what just felt due. Cutting the pile into "today" and "not today" made it breathable again.',
  'demo-2':
    'What helped was sending one low-pressure message to the one person in the group who still felt safe, instead of confronting everyone at once. It didn\'t fix everything, but it broke the silence.',
  'demo-3':
    'They started leaving the house for a 20-minute walk when arguments started, and told their mom about it afterward in a calm moment. Naming the pattern out loud took some of its power away.',
  'demo-4':
    'A volunteer reminded them that "off" is a real feeling that counts, even without a reason attached. Writing one line a day about how they actually felt helped them spot what was draining them.',
  'demo-5':
    'Saying "I\'m actually disappointed" out loud to one person they trusted, instead of performing "fine," was the turning point. The result mattered less once the pretending stopped.',
  'demo-6':
    'They screenshotted everything, told one adult they trusted, and muted the chat instead of checking it. Having proof and one ally made it feel survivable instead of endless.',
}

const STOP_WORDS = new Set([
  'the', 'and', 'that', 'this', 'with', 'just', 'like', 'have', 'about', 'what',
  'when', 'them', 'they', 'were', 'been', 'even', 'dont', 'cant', 'know', 'feel',
  'felt', 'really', 'because', 'something', 'someone', 'anymore', 'still', 'keep',
])

function keywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !STOP_WORDS.has(w)),
  )
}

function agoLabel(iso: string): string {
  const days = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000))
  if (days < 7) return days === 1 ? 'yesterday' : `${days} days ago`
  const weeks = Math.round(days / 7)
  return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`
}

/**
 * Find the strongest echo for a fresh note. Topics carry most of the weight
 * (they're structured data), keyword overlap breaks ties, support received
 * nudges toward posts whose "what helped" is battle-tested.
 */
export function findEcho(topics: string[], message: string): Echo | null {
  const words = keywords(message)

  let best: Echo | null = null
  for (const post of DEMO_WALL_POSTS) {
    const sharedTopics = post.services.filter((s) => topics.includes(s)).length
    const postWords = keywords(post.message)
    let shared = 0
    words.forEach((w) => {
      if (postWords.has(w)) shared += 1
    })
    const overlap = words.size > 0 ? shared / Math.min(words.size, postWords.size) : 0
    const support = post.reactions.same + post.reactions.not_alone
    const score = sharedTopics * 0.45 + overlap * 0.5 + Math.min(support / 400, 0.1)

    if (score > (best?.score ?? 0)) {
      best = {
        post,
        helped: WHAT_HELPED[post.id] ?? 'A volunteer read it and wrote back within a day.',
        agoLabel: agoLabel(post.created_at),
        score,
      }
    }
  }

  /* Below this, the "match" would feel random, which breaks trust. Show
     nothing rather than a stretch. */
  if (!best || best.score < 0.3) return null
  return best
}
