import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircleHeart } from 'lucide-react'
import { listWallPosts, connectWallSocket, type WallPost } from '../lib/api'
import { WallConnectModal } from '../components/WallConnectModal'

const TOPICS = ['All', 'School', 'Friends & Bullying', 'Family', 'Something else']

type ReactionKey = 'same' | 'strength' | 'not_alone'

const REACTIONS: { key: ReactionKey; label: string; emoji: string }[] = [
  { key: 'same', label: 'Same', emoji: '🤍' },
  { key: 'strength', label: 'Strength', emoji: '💪' },
  { key: 'not_alone', label: "You're not alone", emoji: '👋' },
]

// Your own reactions, remembered per browser so each one counts once and can
// be taken back. Reactions here are an anonymous acknowledgement, not a synced
// vote, so this stays client-side.
const MY_REACTIONS_KEY = 'soforotto_my_reactions'
type MyReactions = Record<string, Partial<Record<ReactionKey, boolean>>>

function loadMyReactions(): MyReactions {
  try {
    return JSON.parse(localStorage.getItem(MY_REACTIONS_KEY) || '{}') as MyReactions
  } catch {
    return {}
  }
}

export function Wall() {
  const [posts, setPosts] = useState<WallPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTopic, setActiveTopic] = useState('All')
  const [connectTo, setConnectTo] = useState<WallPost | null>(null)
  const [mine, setMine] = useState<MyReactions>(loadMyReactions)

  const refresh = useCallback(() => {
    listWallPosts()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
    const disconnect = connectWallSocket(refresh)
    return disconnect
  }, [refresh])

  // One reaction of each kind per person: click to add, click again to take it
  // back. Remembered per browser so it survives reloads.
  const toggleReaction = (id: string, key: ReactionKey) => {
    setMine((prev) => {
      const current = { ...(prev[id] ?? {}) }
      if (current[key]) delete current[key]
      else current[key] = true
      const next = { ...prev, [id]: current }
      try {
        localStorage.setItem(MY_REACTIONS_KEY, JSON.stringify(next))
      } catch {
        /* ignore storage failures */
      }
      return next
    })
  }

  const visible =
    activeTopic === 'All' ? posts : posts.filter((p) => p.services.includes(activeTopic))

  return (
    <div className="min-h-screen font-sans px-6 pt-28 pb-16 max-w-6xl mx-auto">
      <Link to="/" className="text-sm text-[#544b43] hover:opacity-70 transition-opacity">
        &larr; Back to Soforotto
      </Link>

      <h1 className="text-4xl md:text-5xl font-medium tracking-tight mt-6 mb-2">The Wall</h1>
      <p className="text-[#544b43] max-w-xl mb-10">
        Anonymous notes from other teens, shared with permission and reviewed by a volunteer
        before they go up. React to let someone know they&apos;re not the only one.
      </p>

      <div className="lk-topic-filter">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            data-active={activeTopic === topic}
            onClick={() => setActiveTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm opacity-60">Loading…</p>}
      {!loading && visible.length === 0 && (
        <p className="text-sm opacity-60">
          No notes here yet. Be the first to share one from the homepage.
        </p>
      )}

      <div className="lk-wall-grid">
        {visible.map((post) => (
          <div key={post.id} className="lk-note-card">
            <div className="lk-note-topics">
              {post.services.map((s) => (
                <span key={s} className="lk-note-topic">
                  {s}
                </span>
              ))}
              {post.isExample && (
                <span
                  className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: '#f0e7dd', color: '#8a7d72' }}
                  title="An illustrative example, not a real submission"
                >
                  Example
                </span>
              )}
            </div>
            <p className="lk-note-text">{post.message}</p>
            <div className="lk-wall-reactions">
              {REACTIONS.map((r) => {
                const reacted = !!mine[post.id]?.[r.key]
                return (
                  <button
                    key={r.key}
                    type="button"
                    aria-pressed={reacted}
                    className="lk-reaction-btn"
                    style={
                      reacted
                        ? { background: '#fbe6dc', color: '#c85a34', boxShadow: 'inset 0 0 0 1.5px #e8734a' }
                        : undefined
                    }
                    onClick={() => toggleReaction(post.id, r.key)}
                    title={reacted ? 'You reacted. Click to take it back.' : r.label}
                  >
                    <span>{r.emoji}</span>
                    {post.reactions[r.key] + (reacted ? 1 : 0)}
                  </button>
                )
              })}
            </div>
            {!post.isExample && (
              <button
                type="button"
                onClick={() => setConnectTo(post)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#2b2420] hover:opacity-60 transition-opacity"
              >
                <MessageCircleHeart size={15} />
                Reach out to them
              </button>
            )}
          </div>
        ))}
      </div>

      <WallConnectModal post={connectTo} onClose={() => setConnectTo(null)} />
    </div>
  )
}
