# Hackathon site

Event info, reading material and a set of minigames with a team leaderboard.
Next.js 15 + Postgres, deployed with Docker Compose behind Caddy.

---

## Deploying on the Hetzner box

You need Docker with the Compose plugin, and a DNS A/AAAA record pointing your
domain at the server. Caddy gets the TLS certificate itself.

```bash
git clone <this repo> hacksite && cd hacksite
cp .env.example .env
```

Fill in `.env`:

```ini
SITE_DOMAIN=hackathon.example.org     # must already resolve to this server
ACME_EMAIL=you@example.org            # optional, for expiry warnings
POSTGRES_PASSWORD=<random>
SESSION_SECRET=<openssl rand -base64 48>
ADMIN_PASSPHRASE=<what the organisers will type>
```

Then:

```bash
docker compose up -d --build
docker compose exec app npm run db:seed   # optional: example quiz + games
```

The site is live on `https://$SITE_DOMAIN`. Database migrations run
automatically on every container start, so deploying an update is:

```bash
git pull && docker compose up -d --build
```

Ports 80 and 443 must be free. If you already run nginx or Traefik on the host,
drop the `caddy` service from `docker-compose.yml`, add `ports: ["127.0.0.1:3000:3000"]`
to the `app` service, and proxy to it — making sure your proxy passes WebSocket
upgrades through to `/ws/live`.

## Local development

```bash
docker run -d --name hacksite-db -e POSTGRES_USER=hacksite \
  -e POSTGRES_PASSWORD=hacksite -e POSTGRES_DB=hacksite -p 5432:5432 postgres:16-alpine

npm install
export DATABASE_URL=postgres://hacksite:hacksite@localhost:5432/hacksite
export SESSION_SECRET=any-long-random-string-for-development
export ADMIN_PASSPHRASE=dev
npm run db:migrate && npm run db:seed
npm run dev          # http://localhost:3000
```

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run db:generate` | Write a migration after editing the schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Insert example content (no-op if a quiz exists) |
| `npm run db:studio` | Browse and edit the database in a UI |

---

## What to change where

Everything you are likely to touch first is data or tokens, not components.

| To change | Edit |
| --- | --- |
| Dates, venue, schedule, FAQ, contact, footer links | `src/content/event.ts` |
| Hardware/software lists and documentation links | `src/content/resources.ts` |
| Any wording on the site | `src/i18n/dictionaries/de.ts` and `en.ts` |
| Colours, fonts, corner radius | the `@theme` block in `src/app/globals.css` |
| Logo | `public/logo.svg` and `src/components/Logo.tsx` |

`de.ts` defines the dictionary shape and `en.ts` is type-checked against it, so
adding a German key and forgetting the English one is a build error, not a
missing label at the event.

### Design

All colour and spacing decisions come from CSS custom properties in the
`@theme` block. Changing the five brand/surface values there re-skins the whole
site, light and dark mode included — no component needs editing. That is the
intended path when the branding lands.

---

## The games page

Signed out, `/games` *is* the sign-up form — a team name and a passphrase,
right there, no separate login page to find first. Signed in, it shows:

1. **Your team** — name, points, rank, a link to the full team dashboard
   (`/team`, with points history) and sign-out.
2. **Leaderboard** — top five, with a link to the full board.
3. **Live now** — every game currently inside its scheduled window, each with
   a countdown to when it closes.
4. **Next up** — the single next thing on the schedule and a countdown to it.

There is deliberately no permanent "here are all our games" section: a game
only appears once its scheduled window has started, and disappears once it
ends. See **Scheduling** below for how that window is set per game type.

The header itself carries no sign-in control — `/games` is the only entry
point, which keeps the header the same whether you're signed in or not.

### Live quiz (Kahoot-style)

Everyone answers the same question at once; a correct answer is always worth
half its points, and the other half decays linearly with how long you took.

1. Organisers open `/de/admin`, sign in with `ADMIN_PASSPHRASE`.
2. **Start live session** on a quiz creates a five-character code and the host
   console. An optional **Scheduled start** controls when it shows up on the
   games page — leave it blank to make it joinable immediately.
3. Teams go to `/de/games/live`, type the code, and play — or, once its
   scheduled time arrives, just click it from "Live now" on the games page.
4. **Next question** / **Reveal** / **End** drive the room. The question also
   reveals itself when the timer runs out or everyone has answered.
5. Ending the quiz writes each team's score into the leaderboard.

Questions are rows in `questions`. `kind` is `choice` (with `options`, and
`answers` holding the correct index as a string, e.g. `["0"]`) or `text`
(`answers` holds every accepted spelling; matching ignores case and extra
whitespace). `imageUrl` puts a picture on the question. Add them with
`npm run db:studio`.

### Submit & vote

Teams submit text or an image, then everyone picks their favourites.
Challenges live in the `challenges` table and carry four timestamps —
`submitStartsAt`/`submitEndsAt`/`voteStartsAt`/`voteEndsAt` — instead of a
manual on/off switch. The current stage (submissions open → between rounds →
voting open → closed) is always computed from those times and "now", so it can
never get stuck because someone forgot to click a button. Teams cannot vote
for themselves and have a fixed vote budget (`votesPerTeam`).

The moment `voteEndsAt` passes, the next visit to the games page, the admin
dashboard, or the challenge's own page converts every vote into points at
`pointsPerVote` each and writes it to the leaderboard — no separate "close"
action needed. It's safe however many times this runs; the score ledger's
unique index makes a repeat award a no-op.

Authors stay hidden during voting and are shown once the round closes.

Create and edit challenges — including their four schedule timestamps — with
`npm run db:studio`.

### Embedded games (OpenGuessr, H5P, anything else)

A row in the `embeds` table gets a page at `/de/games/play/<slug>` with the URL
in a sandboxed iframe, visible between its own `startsAt`/`endsAt`. Adding one
needs no deploy — create it with `npm run db:studio`.

Because we cannot see inside someone else's iframe, points for these are given
by hand: **Award points** at the bottom of the admin page. The label you type
doubles as a deduplication key, so give each round its own label.

> H5P note: self-hosted H5P or an H5P.com embed drops straight in as an embed
> row. If you later want H5P results to score automatically, that means
> accepting xAPI statements from the iframe — a real feature, not a config
> change.

### Scheduling

Every game type carries its own begin/end time(s) rather than a switch an
organiser has to remember to flip — see `src/lib/schedule.ts`. Two functions
turn timestamps into "what's true right now":

- `challengeStage(challenge)` → `upcoming` / `submit` / `waiting` / `vote` / `closed`
- `embedStage(embed)` → `upcoming` / `live` / `closed`

and `getGameSchedule(locale)` builds the "live now" / "next up" lists the
games page renders from those two, plus whichever live-quiz sessions are
either running or past their `scheduledAt`.

---

## Accounts

There are no user accounts and no email addresses. A team registers a **name +
passphrase**; anyone who knows both can play as that team, which is the level
of protection that suits a room where everyone can see each other. Passphrases
are hashed with scrypt; the session is a signed, `httpOnly` cookie valid for
two weeks.

Team names are matched case- and whitespace-insensitively, so `Team Rocket` and
`team  rocket` are the same team and nobody is locked out by a capital letter.

Organiser access is the single shared `ADMIN_PASSPHRASE`. If this outlives the
hackathon, replace it with real accounts.

Points are an append-only ledger (`score_events`) and the leaderboard is a sum
over it. A new game type only has to insert rows there to take part.

---

## Architecture notes

- `server/index.ts` is a custom Node server: it runs Next and serves the quiz
  WebSocket on `/ws/live`, because Next route handlers cannot hold a socket
  open. It is started with `tsx`, so there is no separate build step for it.
- **Live rooms are in-memory and single-process.** Answers are written to
  Postgres as each question is revealed, so a crash loses at most the question
  in flight, and a room reloads from the database when someone reconnects. If
  you ever scale to more than one `app` container, room state has to move to
  Redis or that container has to be pinned — `src/lib/live/engine.ts` says so
  at the top.
- Uploaded images go to the `uploads` Docker volume, not the database, and are
  served back through `/uploads/<name>`.
- The site is multipage: separate routes for info, material, games and the
  leaderboard, with the landing page as a scrollable summary. That keeps the
  game routes independent and lets you hand out direct links.

## Verified

Built and exercised against a real Postgres: a full three-question live quiz
with two teams over WebSockets (speed scoring, free-text matching, duplicate
answers, standings, points persisted to the ledger, idempotent awards, rejected
tokens), passphrase hashing, locale negotiation, upload-path traversal, and the
image booting through Docker end to end.

The scheduling model added afterwards was verified separately: all five
`challengeStage` boundaries and all three `embedStage` boundaries at the exact
transition instants; the games page rendering the signed-out sign-up/sign-in
prompt, then — signed in — the team strip, leaderboard, "live now" and "next
up" sections against seeded data with real overlapping/future windows; the
judge page correctly hiding the submission form and showing a countdown
instead for a challenge scheduled in the future; and `ensureChallengeAwarded`
tallying votes correctly per team and staying idempotent across repeated calls.
