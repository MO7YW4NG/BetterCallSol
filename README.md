# BetterCallSol

Evidence-backed Kaggle Solution finder for ML competition practitioners. The Nuxt app reads a static `public/index.json`; a weekly GitHub Action refreshes it with the Kaggle CLI and Cloudflare Workers AI.

## Local development

```bash
corepack enable
pnpm install
pnpm run dev
```

The committed index starts with one verified top-10 Solution and illustrative gallery cards. Run the sync to replace the seed file with current evidence.

## Automated sync

Add these GitHub repository secrets:

- `KAGGLE_API_TOKEN`: token from Kaggle account settings
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: token with Workers AI read access

The `Refresh Solution index` workflow runs every Monday at 03:17 UTC and can also be dispatched manually. It scans completed Featured, Research, and Masters competitions in the rolling 18-month window, publishes only top-10% notebooks with conservative author/team evidence, calls Workers AI only for unseen notebook hashes, and commits a changed `public/index.json`.

Workers AI quota errors defer remaining notebooks. Unverifiable team membership and special awards without structured Kaggle evidence are omitted rather than guessed.

## Cloudflare Workers deployment

This is a client-rendered Nuxt SPA. `wrangler.jsonc` explicitly deploys `.output/public` as Workers Static Assets and routes unknown paths back to `index.html`; it does not configure an SSR entrypoint.

For Cloudflare Workers Builds, use:

- Build command: `pnpm run build`
- Deploy command: `pnpm exec wrangler deploy`
- Root directory: `/`

For a local deploy, authenticate with `pnpm exec wrangler login` and run `pnpm run deploy`. The deploy token needs Account → Workers Scripts → Edit; the same token can retain Workers AI read access for the weekly sync.

## Checks

```bash
pnpm test
pnpm run typecheck
pnpm run build
```
