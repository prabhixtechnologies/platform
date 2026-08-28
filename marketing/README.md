# Prabhix Technologies — Marketing Site

Public marketing website for [Prabhix Technologies](https://prabhixtechnologies.com), built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

**Tagline:** Building software that simplifies business.

## Prerequisites

- Node.js 20+ (22 recommended for Docker parity)
- npm 10+

## Setup

```bash
cd marketing
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Spring Boot backend base URL | `http://localhost:8080` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO/sitemap | `https://prabhixtechnologies.com` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint via Next.js |
| `npm run typecheck` | TypeScript strict check (`tsc --noEmit`) |

## Docker

```bash
docker build -t prabhix-marketing .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8080 prabhix-marketing
```

## Page inventory

| Route | Description |
|---|---|
| `/` | Home — hero, PRABHIX acronym, capabilities, MobiStack feature, platform grid |
| `/about` | Company story, mission, values, timeline |
| `/platform` | Enterprise platform architecture and modules |
| `/products` | Product listing |
| `/products/mobistack` | MobiStack product detail |
| `/services` | Custom software, cloud, AI/ML, mobile, consulting |
| `/pricing` | 4-tier pricing with annual toggle and FAQ |
| `/case-studies` | Customer outcomes |
| `/case-studies/[slug]` | Case study detail |
| `/blog` | Engineering blog listing |
| `/blog/[slug]` | Blog post detail |
| `/careers` | Open roles |
| `/careers/[slug]` | Role detail with application form |
| `/contact` | Contact / demo form |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of service |
| `/legal/security` | Security practices |
| `/legal/dpa` | Data Processing Agreement |

## Forms & API

Server Actions in `src/app/actions.ts` proxy form submissions to the backend:

- `POST /api/v1/site/leads` — contact and demo requests
- `POST /api/v1/site/subscribers` — newsletter
- `POST /api/v1/site/applications` — job applications

Forms degrade gracefully when the API is unreachable.

## Architecture context

See [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) for the full Prabhix platform architecture. This app is the public surface at `prabhixtechnologies.com`.
