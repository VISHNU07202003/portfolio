# Vishnu Sai Padyala — Portfolio

Animated React/TypeScript portfolio with GSAP transitions, six case studies and a local prepared-answer Manu assistant. This branch migrates the approved portfolio to GitHub Pages under `/portfolio/`.

## Develop and verify

Requires Node.js 24.

```sh
npm ci
npm run dev
npm test
npm run lint
PORTFOLIO_BASE=/portfolio/ npm run build:pages
```

`dist/` contains the complete static site. Case studies each receive their own `work/<id>/index.html`, so opening links directly and refreshing works without server rewrites. Assets, navigation and Manu links respect the deployment base. For a custom domain, build with `PORTFOLIO_BASE=/` and update the workflow accordingly.

## GitHub activity

The public site reads `github-activity.json`, generated at build time from public GitHub data. It does not call a server-only `/api/github` endpoint. The UI shows the check timestamp and identifies the figures as a build snapshot. Counts are not live.

If GitHub is unavailable during a build, the saved `scripts/github-snapshot.json` is used and explicitly marked stale. No counts are invented. Run a new build/deployment to refresh published data. No API key or database is required; Manu uses prepared answers locally.

## GitHub Pages deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). Pushes and pull requests build and validate an artifact; they do not publish this new version. After reviewing and merging, select **Settings → Pages → Source → GitHub Actions**, then run **Build and publish portfolio** on `main` with **publish** checked. This publishes the website publicly.

Only reviewed source files and approved images are tracked. Private documents and generated `dist/` are excluded. The prior website remains in the repository's existing main history until this branch is merged.
