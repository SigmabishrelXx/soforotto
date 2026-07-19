import { demoReply } from './aiDemo'

const API_BASE = import.meta.env.VITE_SUB0_API_BASE ?? 'http://localhost:4000'
const WS_BASE = import.meta.env.VITE_SUB0_WS_BASE ?? API_BASE.replace(/^http/, 'ws')

// Demo mode is on when explicitly enabled, or whenever no real Sub0 backend
// URL is configured, so the AI chat responds during a demo without a
// deployed backend or API key. Set VITE_SUB0_API_BASE (and leave
// VITE_AI_DEMO_MODE unset/false) to use the real Anthropic proxy instead.
export const AI_DEMO_MODE =
  import.meta.env.VITE_AI_DEMO_MODE === 'true' || !import.meta.env.VITE_SUB0_API_BASE

// True only when a real Sub0 backend URL is configured. Distinct from
// AI_DEMO_MODE: a deploy can have a real backend while keeping the AI chat
// scripted (VITE_AI_DEMO_MODE=true), and its form submits must still be real.
const HAS_BACKEND = Boolean(import.meta.env.VITE_SUB0_API_BASE)

export type Inquiry = {
  id: string
  name: string
  email: string
  services: string[]
  message: string
  status: string
  wall_status: string
  created_at: string
}

export type WallReactions = {
  same: number
  strength: number
  not_alone: number
}

export type WallPost = {
  id: string
  services: string[]
  message: string
  reactions: WallReactions
  created_at: string
  // True for the seeded example notes. The UI tags these so a live visitor is
  // never misled into thinking illustrative content is a real submission.
  isExample?: boolean
}

// Seed posts shown on the Wall in demo mode so it isn't empty during a demo.
// These are illustrative, anonymized, everyday-support notes, nothing that
// belongs in a crisis channel. Exported so the Echoes matcher can search them.
export const DEMO_WALL_POSTS: WallPost[] = [
  {
    id: 'demo-1',
    services: ['School'],
    message:
      "everyone acts like junior year is fine but i genuinely don't remember the last time i wasn't behind on something. just needed to say that somewhere.",
    reactions: { same: 42, strength: 11, not_alone: 18 },
    created_at: '2026-07-13T18:20:00Z',
  },
  {
    id: 'demo-2',
    services: ['Friends & Bullying'],
    message:
      "my group slowly stopped inviting me to stuff and no one will say why. i keep replaying everything wondering what i did.",
    reactions: { same: 63, strength: 9, not_alone: 51 },
    created_at: '2026-07-13T15:02:00Z',
  },
  {
    id: 'demo-3',
    services: ['Family'],
    message:
      "my parents argue every night and i just put my headphones in and pretend i can't hear it. i'm so tired of being the calm one.",
    reactions: { same: 28, strength: 34, not_alone: 22 },
    created_at: '2026-07-12T23:41:00Z',
  },
  {
    id: 'demo-4',
    services: ['Something else'],
    message:
      "i smile at school and then cry in the shower. i don't even know what's wrong, i just feel off lately.",
    reactions: { same: 88, strength: 20, not_alone: 40 },
    created_at: '2026-07-12T11:15:00Z',
  },
  {
    id: 'demo-5',
    services: ['School', 'Something else'],
    message:
      "got my results back and they were worse than i hoped. told my family i was 'fine with it'. i am not fine with it.",
    reactions: { same: 19, strength: 25, not_alone: 12 },
    created_at: '2026-07-11T09:30:00Z',
  },
  {
    id: 'demo-6',
    services: ['Friends & Bullying'],
    message:
      "someone made a group chat just to make fun of me. i acted like it didn't bother me. it did.",
    reactions: { same: 15, strength: 47, not_alone: 33 },
    created_at: '2026-07-10T20:05:00Z',
  },
]

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options
  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(body.message ?? `Request failed with ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}

export async function submitInquiry(payload: {
  name: string
  email: string
  services: string[]
  message: string
  shareOnWall: boolean
}) {
  if (!HAS_BACKEND) {
    // Demo mode: accept the note locally so the flow (and the Echo that
    // follows) works without a deployed backend.
    await new Promise((r) => setTimeout(r, 600))
    return { id: `demo-${Date.now()}`, name: payload.name, email: payload.email }
  }
  return request<{ id: string; name: string; email: string }>('/inquiry-submit', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      services: payload.services,
      message: payload.message,
      wall_status: payload.shareOnWall ? 'pending' : 'none',
    }),
  })
}

export async function adminSignIn(payload: { email: string; password: string }) {
  const data = await request<{ id: string; email: string; token: string }>('/admin-sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  // Sub0 answers success with null data when no admin matches.
  if (!data || typeof data.token !== 'string') {
    throw new ApiError('Wrong email or password.', 401)
  }
  return data
}

// Sub0's SQL driver can't decode jsonb columns, so live queries cast them to
// text (services::text). This turns them back into arrays/objects, and also
// covers the backend returning data: null for empty result sets.
function parseJsonish<T>(value: unknown, fallback: T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return (value as T) ?? fallback
}

/* Timestamps also arrive as Postgres text ("2026-07-17 15:54:06.663+00");
   normalize to strict ISO so new Date() parses it in every browser. */
function normalizeTimestamp(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return new Date().toISOString()
  return value.replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00')
}

/* Sub0 returns one row as a bare object and many rows as an array. */
function asRows<T extends { id?: unknown }>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && 'id' in (data as Record<string, unknown>)) {
    return [data as T]
  }
  return []
}

export async function listInquiries(token: string) {
  const data = await request<Inquiry[]>('/inquiry-list', {
    method: 'GET',
    token,
  })
  return asRows<Inquiry>(data).map((row) => ({
    ...row,
    services: parseJsonish<string[]>(row.services, []),
    created_at: normalizeTimestamp(row.created_at),
  }))
}

export function updateInquiryStatus(token: string, id: string, status: string) {
  return request<{ id: string; status: string }>('/inquiry-update-status', {
    method: 'POST',
    token,
    body: JSON.stringify({ id, status }),
  })
}

export function approveToWall(token: string, id: string) {
  return request<{ id: string }>('/wall-approve', {
    method: 'POST',
    token,
    body: JSON.stringify({ id }),
  })
}

// Mutable in-memory copy so reactions persist across calls during a demo.
const demoWall: WallPost[] = DEMO_WALL_POSTS.map((p) => ({ ...p, reactions: { ...p.reactions } }))

// The example notes, tagged so the UI can label them. Shown in demo mode, and
// used to fill the real Wall while it's still sparse so a live visitor never
// lands on an empty page. They are never written to the database.
const exampleWall = (): WallPost[] =>
  demoWall.map((p) => ({ ...p, reactions: { ...p.reactions }, isExample: true }))

export async function listWallPosts() {
  if (AI_DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 300))
    return exampleWall()
  }
  const data = await request<WallPost[]>('/wall-list', { method: 'GET' })
  const real = asRows<WallPost>(data).map((row) => ({
    ...row,
    services: parseJsonish<string[]>(row.services, []),
    reactions: parseJsonish<WallReactions>(row.reactions, { same: 0, strength: 0, not_alone: 0 }),
    created_at: normalizeTimestamp(row.created_at),
    isExample: false,
  }))
  // Real posts first; top up a thin Wall with clearly labeled examples so it
  // never looks dead before real notes come in.
  return real.length >= 4 ? real : [...real, ...exampleWall()]
}

export async function reactToWallPost(id: string, reaction: keyof WallReactions) {
  // Example cards (demo ids) react locally and never hit the network, in any mode.
  if (AI_DEMO_MODE || id.startsWith('demo-')) {
    const post = demoWall.find((p) => p.id === id)
    if (post) post.reactions[reaction] += 1
    return { id, reactions: post ? { ...post.reactions } : { same: 0, strength: 0, not_alone: 0 } }
  }
  const data = await request<{ id: string; reactions: WallReactions }>('/wall-react', {
    method: 'POST',
    body: JSON.stringify({ id, reaction }),
  })
  return {
    ...data,
    reactions: parseJsonish<WallReactions>(data?.reactions, { same: 0, strength: 0, not_alone: 0 }),
  }
}

// A mediated connect request. Nobody exchanges direct contact info. A
// Soforotto moderator (or the AI agent, if the sender opts in) relays messages
// between the two people. In demo mode this just resolves; with a real backend
// it posts to the Sub0 wall-connect endpoint.
export async function requestWallConnect(payload: {
  postId: string
  via: 'moderator' | 'ai-agent'
  note: string
}) {
  if (AI_DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 500))
    return { ok: true as const }
  }
  await request('/wall-connect', { method: 'POST', body: JSON.stringify(payload) })
  return { ok: true as const }
}

export function connectWallSocket(onMessage: () => void) {
  // No backend, no socket: the demo Wall has nothing broadcasting to it.
  if (!HAS_BACKEND) return () => {}
  const socket = new WebSocket(`${WS_BASE}/ws`)
  socket.addEventListener('message', onMessage)
  return () => socket.close()
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function sendAiChatMessage(messages: ChatMessage[]) {
  if (AI_DEMO_MODE) {
    // Scripted, safety-aware responder. Small delay so the "Thinking…"
    // state reads naturally.
    await new Promise((resolve) => setTimeout(resolve, 550 + Math.random() * 500))
    return demoReply(messages)
  }

  // Send only recent turns to bound request size/cost. Odd count keeps the
  // slice starting on a 'user' turn (Anthropic requires user-first alternation).
  const result = await request<{ content: { type?: string; text?: string }[] }>('/ai-chat', {
    method: 'POST',
    body: JSON.stringify({ messages: messages.slice(-11) }),
  })
  // The model can emit a "thinking" block before its reply; take the text block.
  return result.content?.find((block) => block.type === 'text')?.text ?? ''
}

// --- Live-mode counterparts of the demo features (Sub0 query showpieces) ---

/* Echoes: full-text match a fresh note to the most similar supported post. */
export async function echoFindRemote(message: string) {
  const data = await request<WallPost & { rank: number }>('/echo-find', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
  if (!data || !data.id) return null
  return {
    ...data,
    services: parseJsonish<string[]>(data.services, []),
    reactions: parseJsonish<WallReactions>(data.reactions, { same: 0, strength: 0, not_alone: 0 }),
    created_at: normalizeTimestamp(data.created_at),
  }
}

/* Community Weather: week x topic aggregate counts (k-anonymous, HAVING >= 5). */
export function weatherTrendsRemote() {
  return request<{ week: string; tag: string; count: number }[]>('/weather-trends', {
    method: 'GET',
  })
}

/* Volunteer impact stats for the moderator dashboard (JWT protected). */
export function volunteerImpactRemote(token: string) {
  return request<{ responded: number; responded_this_week: number; felt_less_alone: number }>(
    '/volunteer-impact',
    { method: 'GET', token },
  )
}
