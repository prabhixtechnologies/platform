# Platform

The Prabhix marketing site: `prabhixtechnologies.com`. Next.js, in [`marketing/`](marketing/).

This repository used to be the monorepo — backend, both consoles, mobile, the mail transport and the
whole deployment. It was split because one release tag stood for all of it, so a copy change on this
site re-tagged the backend, and rolling that back moved services nobody had touched. Everything else
moved out and only the public site remained; the history of what left is still here, and continues
in the repositories below.

| Repo | |
| --- | --- |
| `oneOps` | The backend, the OneOps and Admin consoles, mobile |
| `Identity` | Sign-in for all of it |
| `Mailroom` | The mail product, and the Postfix/Dovecot/Rspamd transport |
| `MobiStack` | Component compatibility and per-shop inventory |
| `Infra` | Compose, Caddy, deploy scripts, and the system documents |

## Running it

```bash
cd marketing
npm install
npm run dev
```

The site calls the backend through a Next rewrite, so `NEXT_PUBLIC_API_URL` has to point at one that
is running — either `https://api.prabhixtechnologies.com`, or a local backend from `oneOps`. See
[`marketing/README.md`](marketing/README.md).

## Releases

CI pushes the `marketing` image to ECR on every push to `main`, tagged with the short SHA and
`latest`. Deploying it is a separate step, from `Infra`:

```powershell
cd ../Infra
.\deploy\deploy-remote.ps1 -MarketingTag <sha>
```

`-MarketingTag` rather than `-Tag`: every service carries its own now, because the six images in
production are built from five repositories and no single commit describes them all.
