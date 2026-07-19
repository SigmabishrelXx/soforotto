import type { Inquiry, WallPost, WallReactions } from './api'

/* A browser-local stand-in for the moderator's inbox, used only in demo mode
   (no real backend). It lets you live the whole loop offline: submit a note on
   the homepage, see it arrive in /admin, set a status, approve it to the Wall.
   Persisted in localStorage so it survives reloads. On a real deploy none of
   this runs, the Sub0 backend (_inquiry table) is the real inbox. */

const KEY = 'soforotto_demo_inbox'
const MIN = 60_000

export type DemoInquiry = Inquiry & { reactions: WallReactions; isSample?: boolean }

const zero = (): WallReactions => ({ same: 0, strength: 0, not_alone: 0 })
const iso = (msAgo = 0) => new Date(Date.now() - msAgo).toISOString()

// A couple of example incoming notes so the moderator inbox isn't empty the
// first time you open it. Tagged isSample so the UI can mark them.
function seed(): DemoInquiry[] {
  return [
    {
      id: 'sample-1',
      name: '',
      email: '',
      services: ['Friends & Bullying'],
      message:
        "everyone in my class got invited to something this weekend except me. i keep saying it's fine. it's not.",
      status: 'new',
      wall_status: 'pending',
      reactions: zero(),
      created_at: iso(11 * MIN),
      isSample: true,
    },
    {
      id: 'sample-2',
      name: 'jules',
      email: 'jules@example.com',
      services: ['School', 'Something else'],
      message:
        "i can't focus on anything lately and the work keeps piling up. i don't know how to tell anyone i'm drowning.",
      status: 'contacted',
      wall_status: 'none',
      reactions: zero(),
      created_at: iso(96 * MIN),
      isSample: true,
    },
  ]
}

function load(): DemoInquiry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DemoInquiry[]
  } catch {
    /* fall through to seeding */
  }
  const s = seed()
  save(s)
  return s
}

function save(list: DemoInquiry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* localStorage unavailable, stay in-memory for this view */
  }
}

const newestFirst = (a: DemoInquiry, b: DemoInquiry) => (a.created_at < b.created_at ? 1 : -1)

export function listDemoInquiries(): DemoInquiry[] {
  return load().slice().sort(newestFirst)
}

export function addDemoInquiry(p: {
  name: string
  email: string
  services: string[]
  message: string
  shareOnWall: boolean
}): DemoInquiry {
  const item: DemoInquiry = {
    id: 'sub-' + Date.now().toString(36),
    name: p.name,
    email: p.email,
    services: p.services,
    message: p.message,
    status: 'new',
    wall_status: p.shareOnWall ? 'pending' : 'none',
    reactions: zero(),
    created_at: iso(),
  }
  const list = load()
  list.unshift(item)
  save(list)
  return item
}

export function setDemoInquiryStatus(id: string, status: string) {
  const list = load()
  const it = list.find((x) => x.id === id)
  if (it) {
    it.status = status
    save(list)
  }
}

export function approveDemoInquiry(id: string) {
  const list = load()
  const it = list.find((x) => x.id === id)
  if (it) {
    it.wall_status = 'approved'
    save(list)
  }
}

// Approved demo submissions, shaped for the Wall. Not tagged as examples,
// they are "real" notes within the demo narrative.
export function listDemoApprovedWall(): WallPost[] {
  return load()
    .filter((x) => x.wall_status === 'approved')
    .sort(newestFirst)
    .map((x) => ({
      id: x.id,
      services: x.services,
      message: x.message,
      reactions: x.reactions,
      created_at: x.created_at,
      isExample: false,
    }))
}

export function reactDemoApproved(
  id: string,
  reaction: keyof WallReactions,
): WallReactions | null {
  const list = load()
  const it = list.find((x) => x.id === id && x.wall_status === 'approved')
  if (!it) return null
  it.reactions[reaction] += 1
  save(list)
  return { ...it.reactions }
}
