# Hackathon site

Event info, reading material and a team overview where teams manage their own entry.
Next.js 15 + Postgres, deployed with Docker Compose.

---

## Deployment

The stack has no reverse proxy of its own. The `app` container joins an
external Docker network `proxy` as `hacksite:3000`; put any TLS-terminating
reverse proxy (Caddy, nginx, Traefik, …) on that network and point it there.

```bash
docker network create proxy        # once per server
cp .env.example .env               # set POSTGRES_PASSWORD, SESSION_SECRET, ADMIN_PASSPHRASE
docker compose up -d
```

The `app` image is built by GitHub Actions on every push to `main` and
published as `ghcr.io/reedu-reengineering-education/heilbronn-hacksite:main`.
Migrations run on every container start, so updating is
`docker compose pull && docker compose up -d`.

## Local development

```bash
docker run -d --name hacksite-db -e POSTGRES_USER=hacksite \
  -e POSTGRES_PASSWORD=hacksite -e POSTGRES_DB=hacksite -p 5432:5432 postgres:16-alpine

npm install
export DATABASE_URL=postgres://hacksite:hacksite@localhost:5432/hacksite
export SESSION_SECRET=any-long-random-string-for-development
export ADMIN_PASSPHRASE=dev
npm run db:migrate
npm run dev          # http://localhost:3000
```

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run db:generate` | Write a migration after editing the schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Browse and edit the database in a UI |

---

## What to change where

Everything you are likely to touch first is data or tokens, not components.

| To change | Edit |
| --- | --- |
| Dates, venue, schedule, FAQ, contact, footer links | `src/content/event.ts` |
| Hardware/software lists and documentation links | `src/content/resources.ts` |
| Any wording on the site | `src/i18n/dictionaries/en.ts` |
| Colours, fonts, corner radius | the `@theme` block in `src/app/globals.css` |
| Logo | `public/logo.svg` and `src/components/Logo.tsx` |

---

## Teams

- **`/teams`** is the public overview: every team with its emoji, idea,
  member list and a **Looking for members** badge. Teams with open spots are
  listed first, so solo participants can find one.
- **`/team`** is where a team registers (name + passphrase) or signs in, and —
  once signed in — edits its name, emoji, idea description, member list
  (added one at a time, up to 6), the "looking for members" flag and, if it
  wants, a new passphrase.

### Organiser password

`ADMIN_PASSPHRASE` is accepted as the passphrase of every team, alongside the
team's own. Click **Manage** under any team on `/teams` (or use the sign-in
form), enter the organiser password, and you can edit or delete that team,
including setting a new passphrase if one was lost. A signed-in team can also
delete itself at the bottom of `/team`.

---

## Accounts

There are no user accounts and no email addresses. A team registers a **name +
passphrase**; anyone who knows both can edit that team, which is the level of
protection that suits a room where everyone can see each other. Passphrases
are hashed with scrypt; the session is a signed, `httpOnly` cookie valid for
two weeks.

Team names are matched case- and whitespace-insensitively, so `Team Rocket` and
`team  rocket` are the same team and nobody is locked out by a capital letter.

If this outlives the hackathon, replace the shared `ADMIN_PASSPHRASE` with real
accounts.

---

## Architecture notes

- A plain Next.js app (`next start`) plus Postgres. Team data is a single
  `teams` table (`src/lib/db/schema.ts`); all writes are server actions in
  `src/app/team/actions.ts`.
- The site is multipage: separate routes for info, material, mentors & jury and
  teams, with the landing page as a scrollable summary.
