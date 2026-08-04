# BetterCallSol

Evidence-backed Kaggle Solution finder for ML competition practitioners. The Nuxt app reads a static `public/index.json`; a weekly GitHub Action refreshes it with the Kaggle CLI and Cloudflare Workers AI.

## Local development

```bash
npm install
npm run dev
```

The committed index starts with one verified top-10 Solution and illustrative gallery cards. Run the sync to replace the seed file with current evidence.

## Automated sync

Add these GitHub repository secrets:

- `KAGGLE_API_TOKEN`: token from Kaggle account settings
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: token with Workers AI read access

The `Refresh Solution index` workflow runs every Monday at 03:17 UTC and can also be dispatched manually. It scans completed Featured, Research, and Masters competitions in the rolling 18-month window, publishes only top-10% notebooks with conservative author/team evidence, calls Workers AI only for unseen notebook hashes, and commits a changed `public/index.json`.

Workers AI quota errors defer remaining notebooks. Unverifiable team membership and special awards without structured Kaggle evidence are omitted rather than guessed.

## Checks

```bash
npm test
npm run typecheck
npm run build
```
