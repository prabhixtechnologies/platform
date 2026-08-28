# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Next inlines NEXT_PUBLIC_* at build time, so these have to be present here — setting them on the
# container at runtime has no effect. An unset NEXT_PUBLIC_ORG_SLUG is the dangerous one: it does
# not fail the build, it silently ships a site with no storefront, chat widget or visitor beacon.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CONSOLE_URL
ARG NEXT_PUBLIC_MOBISTACK_URL
ARG NEXT_PUBLIC_ORG_SLUG
ARG NEXT_PUBLIC_ORG_ID
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_CONSOLE_URL=${NEXT_PUBLIC_CONSOLE_URL}
ENV NEXT_PUBLIC_MOBISTACK_URL=${NEXT_PUBLIC_MOBISTACK_URL}
ENV NEXT_PUBLIC_ORG_SLUG=${NEXT_PUBLIC_ORG_SLUG}
ENV NEXT_PUBLIC_ORG_ID=${NEXT_PUBLIC_ORG_ID}

RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
