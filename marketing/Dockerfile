# syntax=docker/dockerfile:1

# Base images come from AWS's public gallery rather than Docker Hub. These are the same
# Docker Official Images, mirrored by AWS, and the move takes Docker Hub's anonymous pull
# limit off the build path: a rate-limited base image fails the build for a reason that has
# nothing to do with the change being built.
FROM public.ecr.aws/docker/library/node:26-alpine AS base
WORKDIR /app

FROM base AS deps
# .npmrc maps the @prabhixtechnologies scope to GitHub Packages. It holds no credential; see the
# file itself.
COPY package.json package-lock.json .npmrc ./
# `npm ci`, where this used to be `npm install` against no lockfile at all. The reason was that
# the committed lock was lockfileVersion 2, written by the npm 8 that is still installed on the
# development machine, and npm 8 records neither a resolved URL nor an integrity hash — so there
# was nothing for `npm ci` to verify and the alpine image's newer npm would not take it.
# Regenerated with npm 11 the lock is v3 and complete, so the image now installs exactly the
# tree the tests ran against.
#
# The token is mounted for this layer only. GitHub Packages demands one even though the package
# is public, and writing it into the image would put a credential in a layer that gets pushed to
# ECR, so the file is created and deleted inside a single RUN.
RUN --mount=type=secret,id=gh_token \
    printf '//npm.pkg.github.com/:_authToken=%s\n' "$(cat /run/secrets/gh_token)" > /root/.npmrc \
 && npm ci --no-audit --no-fund \
 && rm -f /root/.npmrc

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
