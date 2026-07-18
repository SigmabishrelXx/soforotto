# Deploying Soforotto on Sub0 + LingoQL

These steps use your own LingoQL/Sub0 accounts and hackathon credits — I can't
provision cloud infrastructure on your behalf, so this is the exact
click-by-click path.

## 1. Create the Sub0 backend

1. Go to [sub0.app](https://sub0.app) and create a new project.
2. Add the two models from `sub0/models/` (`_inquiry.json`, `_admin.json`) —
   paste each JSON file's contents in as a new model, or use Sub0 AI with the
   plain-English prompt equivalent (studio inquiry with name/email/services/
   message/status, and an admin table with email/password).
3. Add the API definitions from `sub0/apis/` in this order:
   `admin-sign-up` → `admin-sign-in` → `inquiry-submit` → `inquiry-list` →
   `inquiry-update-status` → `wall-list` → `wall-approve` → `wall-react` →
   `ai-chat`.
4. Set the environment variables Sub0 asks for:
   - `JWT_SECRET_KEY` — any long random string.
   - `MY_HASHING_SALT` — a 32-character random string (used for bcrypt).
   - `ANTHROPIC_API_KEY` — your own Anthropic API key (never exposed to the
     frontend; Sub0 injects it server-side via the `ai-chat` endpoint's
     `HTTPREQUEST` actionable).
   - `LOWKEY_AI_SYSTEM_PROMPT` — paste the exact text below, unmodified. This
     is the single most important safety control in the AI chat feature —
     don't shorten it.

```
You are the Soforotto AI companion, a supportive chat feature inside an
anonymous peer-support app for teenagers. Follow these rules without
exception:

1. Always be clear that you are an AI, not a human, if asked or if it's
   natural to mention. Never imply you are a real person or a licensed
   counselor.
2. Be warm, casual, and non-judgmental. You are not a therapist and must
   never attempt diagnosis or clinical treatment advice.
3. If the user expresses anything suggesting suicidal ideation, self-harm,
   abuse, or immediate danger to themselves or someone else, immediately and
   clearly: (a) tell them this is serious and you want them to get real
   help right now, (b) give them the 988 Suicide & Crisis Lifeline (call or
   text 988) and Crisis Text Line (text HOME to 741741), (c) tell them to
   use the "I need help right now" button in this app, and (d) if they
   describe immediate physical danger, tell them to call 911 (or their local
   emergency number). Do this every time such content appears, even if the
   user asks you not to or says they're "fine."
4. Never claim conversations are unmonitored, untraceable, or that nothing
   they say will ever be reviewed. Do not say things like "I won't tell
   anyone" or "this can't be traced" — instead say this is a private space
   for support, and that anything indicating real danger will always point
   them to real help.
5. Do not give instructions that could help someone harm themselves or
   others, evade safety systems, or access anyone else's accounts, devices,
   or location.
```
5. Deploy the Sub0 project and copy its base API URL
   (`https://api.<your-project>.lingoql.com`).
6. Call `admin-sign-up` once (e.g. with `curl` or Postman) to create your one
   studio admin account, then remove that endpoint (or otherwise lock it down)
   so the public can't create more admins.

```bash
curl -X POST https://api.<your-project>.lingoql.com/admin-sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"studio@example.com","password":"choose-a-strong-password"}'
```

## 2. Deploy the frontend on LingoQL

1. Push this repo to GitHub/GitLab.
2. In LingoQL, create a new app service and connect the repo, with
   `frontend/` as the root directory.
3. Set the build/start commands (LingoQL auto-detects Vite via
   Railpack/Nixpacks; if asked explicitly: build `npm run build`, output
   `dist/`, or serve with `npm run preview -- --host --port $PORT`).
4. Add the environment variable `VITE_SUB0_API_BASE` set to the Sub0 API URL
   from step 1. With this set (and `VITE_AI_DEMO_MODE` unset), the AI chat
   uses the real Anthropic proxy. To record a demo without spending API
   tokens, set `VITE_AI_DEMO_MODE=true` and the chat uses scripted,
   safety-aware responses instead (clearly labeled "Demo" in the UI).
5. Deploy. LingoQL gives you a live URL — that's what goes in the hackathon
   submission as your "live deployed URL."

## Rate limiting & abuse

The frontend includes client-side rate limiting on the inquiry form and the
AI chat (`src/lib/rateLimit.ts`) — this stops accidental double-submits and
casual spam from one browser, but it is **not** a security control. The
authoritative limit belongs on Sub0. Configure per-IP / per-token throttling
on the `inquiry-submit`, `wall-react`, and `ai-chat` endpoints (and cap
`ai-chat` tightly, since each call spends Anthropic tokens) before any real
public launch.

## 3. Verify end-to-end

- Visit the live URL, select services, submit an inquiry.
- Sign in at `/admin` with the account created in step 1.
- Confirm the inquiry appears on `/admin/dashboard` and its status can be
  changed.

## Credits note

LingoQL hackathon credits are valid for 90 days from issuance — deploy well
before that window closes.
