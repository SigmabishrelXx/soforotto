import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  Database,
  Braces,
  KeyRound,
  Lock,
  ListChecks,
  Hash,
  Radio,
  EyeOff,
  ShieldCheck,
  Cloud,
  Server,
  Sparkles,
  CloudSun,
} from 'lucide-react'

const SUB0_CAPABILITIES = [
  {
    icon: Database,
    title: 'Declarative data models',
    body: 'Two typed models (inquiries and admins) defined as JSON schema. No ORM, no migration scripts.',
  },
  {
    icon: Braces,
    title: 'Zero backend server code',
    body: 'All nine endpoints are JSON “actionables.” The API is configuration, not a codebase to maintain.',
  },
  {
    icon: KeyRound,
    title: 'Auth without a server',
    body: 'Admin sign-in issues a JWT (HS256) and checks the password against a bcrypt hash, declaratively.',
  },
  {
    icon: Lock,
    title: 'Protected endpoints',
    body: 'The moderator dashboard requires a valid JWT; Sub0 extracts the token claims before running any SQL.',
  },
  {
    icon: ListChecks,
    title: 'Validation at the edge',
    body: 'payload_validation checks types, lengths and shapes before anything reaches the database.',
  },
  {
    icon: Hash,
    title: 'Server-generated IDs & time',
    body: 'IDs come from $GENERATOR.KSUID and timestamps from $DATETIME, so the client can’t forge them.',
  },
  {
    icon: Radio,
    title: 'Real-time built in',
    body: 'broadcast_websocket_message pushes updates to every browser, so The Wall and its reactions move live.',
  },
  {
    icon: EyeOff,
    title: 'Secrets stay server-side',
    body: 'The Anthropic key and JWT secret live in $ENV on Sub0 and are never shipped to the browser.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by construction',
    body: 'The public Wall query can only SELECT non-identifying columns: name and email are structurally unreachable.',
  },
  {
    icon: Sparkles,
    title: 'Echo matching in one query',
    body: 'echo-find uses Postgres full-text search (ts_rank) to pair a fresh note with the most similar past post that got support.',
  },
  {
    icon: CloudSun,
    title: 'K-anonymous aggregation',
    body: 'weather-trends unnests the topic tags (jsonb_array_elements_text), buckets by week, and HAVING >= 5 hides small counts.',
  },
]

const LINGOQL_POINTS = [
  'Hosts the React + Vite frontend. Its buildpack (Railpack / Nixpacks) auto-detects the app and builds it, no Dockerfile needed.',
  'Runs the managed Postgres database that every Sub0 model reads from and writes to.',
  'Provides the managed websocket layer that carries Sub0’s live broadcasts back to the browser.',
  'Serves the Sub0 API alongside the app (at api.<project>.lingoql.com) and gives the single live URL used for the submission.',
]

const VERIFY = [
  'The live site’s URL is a LingoQL URL. The hosting itself is the proof.',
  'Open DevTools → Network and submit the form: the requests hit the Sub0 API base.',
  'The repo’s sub0/ folder holds every model and endpoint as declarative JSON.',
  'Approve a post in /admin/dashboard and watch The Wall update with no refresh. That’s the websocket broadcast.',
]

const AI_PROXY_SNIPPET = `{
  "resource": "ai-chat",
  "actionables": [{
    "mode": "HTTPREQUEST",
    "http": {
      "url": "https://api.anthropic.com/v1/messages",
      "headers": { "x-api-key": "$ENV.ANTHROPIC_API_KEY" },
      "request_body": {
        "model": "claude-sonnet-5",
        "system": "$ENV.LOWKEY_AI_SYSTEM_PROMPT",
        "messages": "$PAYLOAD.messages"
      }
    }
  }]
}`

const WEATHER_SNIPPET = `SELECT to_char(date_trunc('week', created_at),
               'YYYY-MM-DD')            AS week,
       tag,
       COUNT(*)::int                    AS count
FROM _inquiry,
     jsonb_array_elements_text(services) AS tag
GROUP BY 1, 2
HAVING COUNT(*) >= 5   -- k-anonymity: small counts never leave the database
ORDER BY 1 ASC`

const WALL_APPROVE_SNIPPET = `{
  "resource": "wall-approve",
  "protected": { "extract_claims": ["id"] },
  "actionables": [{
    "sql_query": {
      "query": "UPDATE _inquiry SET wall_status = 'approved'
                WHERE id = $1 AND wall_status = 'pending'"
    },
    "broadcast_websocket_message": {
      "broadcast_type": "ALL",
      "action": "wall_updated"
    }
  }]
}`

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#544b43] mb-2">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2b2420]">{title}</h2>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ background: '#2b2420' }}>
      <pre
        className="p-4 sm:p-5 text-[12px] leading-relaxed"
        style={{ color: '#f0e6dc', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

function FlowNode({ label, sub, accent }: { label: string; sub: string; accent?: boolean }) {
  return (
    <div
      className="w-full rounded-2xl border px-5 py-4 text-center"
      style={{
        borderColor: accent ? '#f0c3ad' : '#ece2d9',
        background: accent ? '#fff6f0' : '#fffdf9',
      }}
    >
      <p className="font-semibold text-[#2b2420]">{label}</p>
      <p className="text-[13px] text-[#544b43] mt-0.5 leading-snug">{sub}</p>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1" aria-hidden="true">
      <span className="h-3 w-px" style={{ background: '#d8cabb' }} />
      <span className="text-[10px] uppercase tracking-[0.14em] text-[#544b43] bg-[#f3ece4] rounded-full px-2.5 py-0.5">
        {label}
      </span>
      <span className="h-3 w-px" style={{ background: '#d8cabb' }} />
    </div>
  )
}

export function BuiltWith() {
  const [tool, setTool] = useState<'sub0' | 'lingoql'>('sub0')

  return (
    <div className="min-h-screen font-sans px-6 py-16 max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-[#544b43] hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
        <ArrowLeft size={15} /> Back to Soforotto
      </Link>

      <p className="text-[11px] uppercase tracking-[0.18em] text-[#544b43] mt-8 mb-3">
        Zero to Query hackathon · How it’s built
      </p>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#2b2420] mb-4">
        Under the hood
      </h1>
      <p className="text-[15px] sm:text-base text-[#544b43] leading-relaxed max-w-2xl">
        Soforotto’s entire backend is declarative, with no traditional server code. The data models,
        the API, authentication, validation and real-time updates are all defined as JSON on{' '}
        <strong className="text-[#2b2420]">Sub0</strong>, and the whole thing is deployed on{' '}
        <strong className="text-[#2b2420]">LingoQL</strong>. Click a card below to see exactly
        how each one is used.
      </p>

      {/* Stack cards: click to switch the deep-dive below */}
      <div className="grid sm:grid-cols-2 gap-4 mt-12">
        <button
          type="button"
          onClick={() => setTool('sub0')}
          aria-pressed={tool === 'sub0'}
          className="rounded-3xl border p-6 text-left cursor-pointer transition-all hover:-translate-y-0.5"
          style={{
            borderColor: '#f0c3ad',
            background: '#fff6f0',
            boxShadow: tool === 'sub0' ? '0 0 0 3px rgba(200,90,52,0.35), 0 12px 30px rgba(200,90,52,0.12)' : 'none',
            opacity: tool === 'sub0' ? 1 : 0.75,
          }}
        >
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl mb-4"
            style={{ background: '#fbe6dc' }}
          >
            <Server size={22} style={{ color: '#c85a34' }} />
          </span>
          <p className="text-xs uppercase tracking-widest text-[#c85a34] font-semibold mb-1">Backend</p>
          <h3 className="text-xl font-semibold text-[#2b2420] mb-2">Sub0</h3>
          <p className="text-sm text-[#544b43] leading-relaxed">
            Nine endpoints and two data models, all JSON. Auth, validation, generated IDs,
            server-side secrets and websocket broadcasts, with no server to write or run.
          </p>
          <p className="text-xs font-semibold mt-4" style={{ color: '#c85a34' }}>
            {tool === 'sub0' ? 'Showing below ↓' : 'See how we used it →'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTool('lingoql')}
          aria-pressed={tool === 'lingoql'}
          className="rounded-3xl border p-6 text-left cursor-pointer transition-all hover:-translate-y-0.5"
          style={{
            borderColor: '#bcd4ec',
            background: '#f3f8fd',
            boxShadow: tool === 'lingoql' ? '0 0 0 3px rgba(63,119,179,0.35), 0 12px 30px rgba(63,119,179,0.12)' : 'none',
            opacity: tool === 'lingoql' ? 1 : 0.75,
          }}
        >
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl mb-4"
            style={{ background: '#e3edf7' }}
          >
            <Cloud size={22} style={{ color: '#3f77b3' }} />
          </span>
          <p className="text-xs uppercase tracking-widest text-[#3f77b3] font-semibold mb-1">Hosting</p>
          <h3 className="text-xl font-semibold text-[#2b2420] mb-2">LingoQL</h3>
          <p className="text-sm text-[#544b43] leading-relaxed">
            Builds and serves the React frontend, runs the Sub0 backend beside it, and provides the
            managed Postgres and websockets underneath. One deploy, one live URL.
          </p>
          <p className="text-xs font-semibold mt-4" style={{ color: '#3f77b3' }}>
            {tool === 'lingoql' ? 'Showing below ↓' : 'See how we used it →'}
          </p>
        </button>
      </div>

      {/* Deep-dive for the selected tool */}
      <AnimatePresence mode="wait" initial={false}>
        {tool === 'sub0' ? (
          <motion.div
            key="sub0"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Sub0 capabilities */}
            <section className="mt-16">
              <Heading eyebrow="The backend" title="What Sub0 is doing" />
              <div className="grid sm:grid-cols-2 gap-3">
                {SUB0_CAPABILITIES.map((cap) => {
                  const Icon = cap.icon
                  return (
                    <div
                      key={cap.title}
                      className="rounded-2xl border border-[#ece2d9] bg-[#fffdf9] p-5"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon size={18} className="text-[#c85a34] shrink-0" />
                        <h3 className="text-[15px] font-semibold text-[#2b2420]">{cap.title}</h3>
                      </div>
                      <p className="text-[13px] text-[#544b43] leading-relaxed">{cap.body}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Evidence snippets */}
            <section className="mt-16">
              <Heading eyebrow="Straight from the repo" title="Three snippets, no server code" />
              <p className="text-[14px] text-[#544b43] leading-relaxed mb-5">
                The AI companion never lets the API key touch the browser. The key lives in{' '}
                <code className="text-[#c85a34]">$ENV.ANTHROPIC_API_KEY</code> on Sub0, and the
                frontend only ever talks to Sub0:
              </p>
              <CodeBlock code={AI_PROXY_SNIPPET} />
              <p className="text-[14px] text-[#544b43] leading-relaxed mt-8 mb-5">
                Approving a Wall post is moderator-only (it&apos;s <code>protected</code> by a JWT)
                and, in the same declaration, broadcasts a websocket message so every open browser
                updates live:
              </p>
              <CodeBlock code={WALL_APPROVE_SNIPPET} />
              <p className="text-[14px] text-[#544b43] leading-relaxed mt-8 mb-5">
                And the Community Weather page is one aggregate query: unnest the topic tags,
                bucket by week, and suppress anything small enough to identify someone. The
                privacy promise is enforced by the SQL itself:
              </p>
              <CodeBlock code={WEATHER_SNIPPET} />
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="lingoql"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* LingoQL points */}
            <section className="mt-16">
              <Heading eyebrow="The hosting" title="What LingoQL is doing" />
              <ul className="flex flex-col gap-3">
                {LINGOQL_POINTS.map((point) => (
                  <li key={point} className="flex gap-3 text-[14px] text-[#544b43] leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f77b3]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Flow diagram */}
            <section className="mt-16">
              <Heading eyebrow="At a glance" title="How a request flows through it" />
              <div className="mx-auto max-w-md">
                <FlowNode label="Teen&apos;s browser" sub="React + Vite single-page app" />
                <Connector label="HTTPS" />
                <FlowNode label="LingoQL" sub="Serves the frontend and hosts the Sub0 backend" accent />
                <Connector label="declarative API call" />
                <FlowNode label="Sub0" sub="JSON models + endpoints, the whole backend" accent />
                <Connector label="SQL" />
                <FlowNode label="Postgres" sub="Managed by LingoQL" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl border border-[#ece2d9] bg-[#fffdf9] p-4 flex gap-3">
                  <Radio size={18} className="shrink-0 mt-0.5 text-[#3f77b3]" />
                  <p className="text-[13px] text-[#544b43] leading-relaxed">
                    <strong className="text-[#2b2420]">Real-time:</strong> LingoQL&apos;s managed
                    websockets carry Sub0&apos;s broadcasts to every browser, so The Wall updates
                    live.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#ece2d9] bg-[#fffdf9] p-4 flex gap-3">
                  <EyeOff size={18} className="shrink-0 mt-0.5 text-[#3f77b3]" />
                  <p className="text-[13px] text-[#544b43] leading-relaxed">
                    <strong className="text-[#2b2420]">One URL:</strong> the app and its API ship
                    from the same deploy, and secrets stay in the platform&apos;s env, never in the
                    bundle.
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify */}
      <section className="mt-16">
        <div className="rounded-3xl border border-[#ece2d9] bg-[#f7f0e9] p-6 sm:p-8">
          <Heading eyebrow="For judges" title="How to verify it end-to-end" />
          <ol className="flex flex-col gap-3">
            {VERIFY.map((step, i) => (
              <li key={step} className="flex gap-3 text-[14px] text-[#544b43] leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2b2420] text-white text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <p className="text-[13px] text-[#544b43] mt-12 leading-relaxed">
        Soforotto is a student hackathon project, not a licensed counseling service. If the AI runs
        without an Anthropic key configured, it falls back to clearly-labeled scripted responses so
        the app can be demoed without spending tokens, and the crisis-safety behavior stays on in both
        modes.
      </p>

      <div className="mt-8">
        <Link to="/" className="text-sm text-[#544b43] hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to Soforotto
        </Link>
      </div>
    </div>
  )
}
