# Demo video outline (3–5 minutes)

The realtime Wall approval is the single strongest technical asset — it
proves Sub0's websocket usage, the moderation model, and the product in one
shot. Build the whole video around getting to that shot cleanly.

1. **Problem (30s)** — Teens don't have someone easy to talk to who isn't a
   parent, teacher, or scheduled therapy appointment, and won't reach out at
   all if it means giving up their identity. Existing anonymous tip-line
   tools are either a form that disappears into a void, or enterprise
   software not built for teens.

2. **Teen flow (60s)** — Show the live site: the hero, picking topics, the
   live note preview as you type, the "Share anonymously on The Wall" toggle,
   submitting. Briefly show the emergency button opening (don't dwell — it's
   there, it's real, move on) and the AI chat opening (be honest on camera
   about what it does; don't demo a failed/fallback response — if it's not
   deployed and working by recording time, cut this beat and mention it as
   roadmap instead).

3. **Admin dashboard + live Wall approval (90s) — THE key shot.** Two browser
   windows side by side:
   - Window A: the public `/wall` page, open and idle.
   - Window B: `/admin/dashboard`, signed in, showing the pending
     Wall-share request from step 2.
   - Click "Approve to Wall" in Window B — the post appears in Window A
     within a second, live, via websocket, with zero refresh.
   This single shot proves realtime Sub0 usage, the moderation model, and a
   working end-to-end product simultaneously.

4. **Architecture (45s)** — Show the architecture diagram from the README.
   Call out specifically: (a) name/email are `optional` at the Sub0 schema
   level, not just hidden in the UI, (b) the AI chat's API key never reaches
   the browser — it's injected server-side by a Sub0 `HTTPREQUEST`
   actionable, (c) `wall-list` structurally never returns name/email, so the
   Wall can't leak identity even by accident.

5. **Business framing (30s)** — This demo is the free consumer instance;
   the licensable product is a white-label version schools and districts pay
   for per-deployment, isolated data per school, same codebase. Real-world
   value: schools already run tip-line tools, this is a teen-first,
   Sub0-backed version of that category.

6. **Close (15s)** — What's next: partnering with a real school counselor
   network for moderation at scale, CSV/analytics export for district
   admins, and expanding the topic/category set based on real usage.
