# Soforotto — Demo Video Script (recording-ready)

**Target length:** 4 to 4.5 minutes (hackathon requires 3 to 5).
**Record against the LIVE site:** https://soforotto.lingoql.com

## Guiding principle
Honest and calm, like the product itself. We do NOT claim a "live / instant /
no-refresh" Wall update: the deployed backend's websocket isn't reachable
(LingoQL platform limitation, confirmed 2026-07-27 from two browsers, close code
1006; see CLAUDE.md). The moderation loop is shown honestly: approve, then the
note is live on the public Wall. The technical "wow" is carried by the Sub0
features that provably work.

## Recording setup (before you hit record)
- Screen recorder: macOS **Cmd + Shift + 5** then "Record Entire Screen." If you
  narrate live, enable your mic under **Options -> [your microphone]**.
- Two browser windows, side by side:
  - **Window A (left):** https://soforotto.lingoql.com/wall
  - **Window B (right):** https://soforotto.lingoql.com/admin (sign in just
    before you record Beat 3)
- Have extra tabs ready: /built-with and /weather (for Beat 4).
- Do ONE full dry run without recording, so the clicks feel smooth.

## Pre-flight checklist
- [ ] Signed into /admin on prod with your moderator account.
- [ ] Tested the AI chat once. If it errors ("credit balance too low"), either
      top up Anthropic credits or skip the optional AI beat (mention it verbally).
- [ ] Clean desktop: notifications off, unrelated tabs closed.
- [ ] Decided: your own voice (strongest) or a read-aloud take.

---

## Beat 1 — The problem (~30s)
**SHOW:** Hero of soforotto.lingoql.com, slow scroll down.
**SAY:** "Most teens don't have someone easy to talk to about the everyday
stuff: school stress, friend drama, family, being bullied. Someone who isn't a
parent, a teacher, or a scheduled therapy appointment. And a lot of them won't
reach out at all if it means giving up their name. What's out there is either a
form that vanishes into a void, or expensive software built for adults.
Soforotto is built for exactly that gap."

## Beat 2 — The teen's side (~70s)
**SHOW:** Click "Share, anonymously." Pick a topic (e.g. School). Type a real
message slowly so the live preview updates. Toggle "Share anonymously on The
Wall" ON. Leave nickname and email blank. Click "Send, anonymously."
**SAY:** "Here's a teen's side. You pick what's going on, and you just write. No
name, no email, no account. Anonymity isn't a setting here, it's the default. If
you want, you can ask for your note to be shared on the Wall, so others going
through the same thing can see it. I'll leave my name blank, and send."
**SHOW:** The confirmation, and the "Echo" card that appears.
**SAY:** "And look at this: it surfaced an earlier note from someone who felt the
same way, and what actually helped them. Venting quietly becomes feeling less
alone."
**SHOW:** Tap the red "I need help right now" button, show the crisis resources,
close it.
**SAY:** "There's always a real crisis path: verified hotlines, one tap away.
This isn't a crisis line pretending to be one, it points to the real thing."
*(Optional) SHOW: open the AI chat, type one line, show the reply.*
**SAY (optional):** "There's also an AI companion, and it's honest that it's an
AI, not a person, with crisis safety built in."

## Beat 3 — Moderation and the Wall (the heart) (~80s)
**SHOW:** Window B (/admin/dashboard), already signed in. Point to the note you
just submitted, showing as "New" with "wants to share on the Wall."
**SAY:** "Now the other side. Every note a teen wants made public is reviewed by
a real, trained person first. Never auto-posted. Here's the one I just sent,
waiting for review."
**SHOW:** Click "Approve to Wall."
**SAY:** "I approve it."
**SHOW:** Switch to Window A (/wall) and refresh.
**SAY:** "And now it's live on the public Wall. Anonymized: no name, no email,
just the note and the topic, for anyone facing the same thing to find and react
to. A real person stands between every teen and what goes public. That's the
whole trust model."
**SHOW:** Click a reaction on a card.
**SAY:** "Support is light and safe: preset reactions, never open messaging
between strangers."

## Beat 4 — Why Sub0 (the technical story, your highest-scoring beat) (~70s)
**SHOW:** Navigate to /built-with. Show the architecture diagram and the Sub0
code snippets. Switch to /weather when you reach the k-anonymity line.
**SAY:** "Under the hood, the entire backend is Sub0: declarative, no
hand-written server code, and it's doing real work. Anonymity is enforced in the
database schema itself: name and email are optional at the model level, and the
Wall query structurally can't return them, so it can't leak identity even by
accident. The AI's API key never touches the browser: Sub0 injects it
server-side and proxies to the model. The 'someone felt this too' matching runs
as Postgres full-text search with ranking. And this, Community Weather, shows
what the whole community is carrying, using k-anonymity right in the SQL: it
never shows a trend unless at least five people share it. You see the weather,
never the individual raindrops."

## Beat 5 — The business (~25s)
**SHOW:** Back to the landing page (or a single title slide).
**SAY:** "This live site is the free, public version. The real product is
white-label: a school or district gets its own branded instance, its own
moderation team, its own isolated data, from the same codebase. Schools already
run anonymous tip lines. This is the teen-first, Sub0-backed version of that."

## Beat 6 — Close (~15s)
**SAY:** "Next is partnering with real school-counselor networks, analytics for
district admins, and more categories as real usage grows. That's Soforotto: a
quiet, anonymous place for a teen to be heard, built end-to-end on Sub0 and
LingoQL. Thanks for watching."

---

## Honesty notes (so every claim is defensible)
- **No websocket / no "realtime" claim.** The approve-to-Wall shot uses a manual
  refresh. Don't say "instant" or "updates automatically."
- **The Echo card** shown after submitting is matched client-side for instant
  UX; the real Postgres full-text-search version is the `echo-find` endpoint,
  which you show on /built-with. Fair to say "full-text search" while pointing at
  the backend code; don't claim the on-screen card itself made the DB call.
- **AI chat** is real Claude via the server-side proxy IF Anthropic credits are
  funded; otherwise it's the scripted, clearly-labeled demo responder. Either is
  fine to show; just don't imply a live model if you're in demo mode.
- **Wall notes** are labeled "Example" until real approved ones exist. The one
  you approve on camera appears as a real (untagged) note.

## If you run long
Trim Beat 2's optional AI beat first, then tighten Beat 1. A crisp 4:00 beats a
padded 5:00.
