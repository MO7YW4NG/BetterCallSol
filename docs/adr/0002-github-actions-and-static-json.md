# Generate a static index with GitHub Actions

BetterCallSol uses scheduled GitHub Actions to run the Kaggle CLI, generate `public/index.json`, commit changes back to the repository, and trigger the Nuxt deployment on Cloudflare Pages. Workers, Wrangler, and databases are omitted until the JSON artifact becomes materially too large or concurrent updates and query performance require a storage service; repository history provides the initial audit trail.
