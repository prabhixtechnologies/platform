# syntax=docker/dockerfile:1

# Base images come from AWS's public gallery rather than Docker Hub. These are the same
# Docker Official Images, mirrored by AWS, and the move takes Docker Hub's anonymous pull
# limit off the build path: a rate-limited base image fails the build for a reason that has
# nothing to do with the change being built.
FROM public.ecr.aws/docker/library/node:22-alpine AS base
WORKDIR /app
# Marketing only needs brand tokens. Copying all of web-kit pulls @prabhix/ui into tsc.
COPY --from=webkit packages/brand ./vendor/web-kit/packages/brand

FROM base AS deps
COPY package.json ./
# Host lockfiles are npm 8 / lockfileVersion 2. node:22-alpine ships npm 10, which
# rejects those on `npm ci` and crashes on `npm install` if the old lock is present.
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));if(p.dependencies?.['@prabhix/brand']?.startsWith('file:'))p.dependencies['@prabhix/brand']='file:./vendor/web-kit/packages/brand';fs.writeFileSync('package.json',JSON.stringify(p,null,2));"
RUN npm install --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));if(p.dependencies?.['@prabhix/brand']?.startsWith('file:'))p.dependencies['@prabhix/brand']='file:./vendor/web-kit/packages/brand';fs.writeFileSync('package.json',JSON.stringify(p,null,2));"
ENV NEXT_TELEMETRY_DISABLED=1

# Next inlines NEXT_PUBLIC_* at build time, so these have to be present here — setting them on the
# container at runtime has no effect. An unset NEXT_PUBLIC_ORG_SLUG is the dangerous one: it does
# not fail the build, it silently ships a site with no storefront, chat widget or visitor beacon.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CONSOLE_URL
ARG NEXT_PUBLIC_MOBISTACK_URL
ARG NEXT_PUBLIC_MAILROOM_URL
ARG NEXT_PUBLIC_STORE_URL
ARG NEXT_PUBLIC_IDENTITY_ISSUER
ARG NEXT_PUBLIC_ORG_SLUG
ARG NEXT_PUBLIC_ORG_ID
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_CONSOLE_URL=${NEXT_PUBLIC_CONSOLE_URL}
ENV NEXT_PUBLIC_MOBISTACK_URL=${NEXT_PUBLIC_MOBISTACK_URL}
ENV NEXT_PUBLIC_MAILROOM_URL=${NEXT_PUBLIC_MAILROOM_URL}
ENV NEXT_PUBLIC_STORE_URL=${NEXT_PUBLIC_STORE_URL}
ENV NEXT_PUBLIC_IDENTITY_ISSUER=${NEXT_PUBLIC_IDENTITY_ISSUER}
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
