# syntax=docker/dockerfile:1

# Build and runtime in one image: a plain Node image running `next start`,
# rather than a Next standalone bundle, so the migration script can run too.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next needs these at build time; they are placeholders, the real values come
# from the environment at run time.
ENV NEXT_TELEMETRY_DISABLED=1
# The secret is only needed so module-level checks pass while pages are
# pre-rendered; scoping it to this one command keeps it out of the image.
RUN SESSION_SECRET=build-time-placeholder-not-a-real-secret npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src ./src

RUN chown -R nextjs:nodejs /app/.next

USER nextjs
EXPOSE 3000

# Migrations run on every start so a deploy is a single command.
CMD ["sh", "-c", "npm run db:migrate && npm run start"]
