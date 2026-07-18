import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircleHeart } from 'lucide-react'
import { listWallPosts, reactToWallPost, connectWallSocket, type WallPost } from '../lib/api'
import { WallConnectModal } from '../components/WallConnectModal'

const TOPICS = ['All', 'School', 'Friends & Bullying', 'Family', 'Something else']

const REACTIONS: { key: 'same' | 'strength' | 'not_alone'; label: string; emoji: string }[] = [
  { key: 'same', label: 'Same', emoji: '🤍' },
  { key: 'strength', label: 'Strength', emoji: '💪' },
  { key: 'not_alone', label: "You're not alone", emoji: '👋' },
]

export function Wall() {
  const [posts, setPosts] = useState<WallPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTopic, setActiveTopic] = useState('All')
  const [connectTo, setConnectTo] = useState<WallPost | null>(null)

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

  const react = async (id: string, reaction: 'same' | 'strength' | 'not_alone') => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, reactions: { ...p.reactions, [reaction]: p.reactions[reaction] + 1 } } : p,
      ),
    )
    try {
      await reactToWallPost(id, reaction)
    } catch {
      refresh()
    }
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
            </div>
            <p className="lk-note-text">{post.message}</p>
            <div className="lk-wall-reactions">
              {REACTIONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className="lk-reaction-btn"
                  onClick={() => react(post.id, r.key)}
                >
                  <span>{r.emoji}</span>
                  {post.reactions[r.key]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setConnectTo(post)}
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#2b2420] hover:opacity-60 transition-opacity"
            >
              <MessageCircleHeart size={15} />
              Reach out to them
            </button>
          </div>
        ))}
      </div>

      <WallConnectModal post={connectTo} onClose={() => setConnectTo(null)} />
    </div>
  )
}
