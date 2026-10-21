# GitHub Pages deployment

Target repository: `VISHNU07202003/portfolio`. Node.js: 24. Build command:

```sh
PORTFOLIO_BASE=/portfolio/ npm run build:pages
```

Upload only `dist/` to Pages. It includes bundled assets, the home page, six case-study directory entries, a not-found entry, `.nojekyll`, and public timestamped GitHub statistics. There is no server runtime or required secret.

## Build versus publication

The workflow runs tests, lint, type checking, publication/privacy audits and static-route/asset/snapshot checks. Push/PR runs upload a Pages artifact only. No deployment job runs on push, PR, or a manual run with `publish` unchecked.

To publish after review:

1. Merge the upgrade branch into `main`.
2. In repository **Settings → Pages**, select **GitHub Actions** as the source.
3. Run **Build and publish portfolio** from Actions on `main`, checking **publish**.
4. Check the workflow's actual deployment URL. Verify home, all six case routes through direct links and refresh, Manu navigation, GitHub snapshot timestamp, responsive layouts and reduced motion.

The deploy job has Pages and OIDC permissions only and uses the `github-pages` environment. It cannot deploy from a feature branch. Enabling Pages is separate from pushing the source.

## Statistics and routing

The browser reads a base-aware `github-activity.json`, never `/api/github`. Build-time GitHub requests are unauthenticated and can be rate-limited. On failure a previously verified saved snapshot is published with `stale: true`; if no saved snapshot exists, the build fails. Public commit counts represent indexed authored public default-branch commits, not lifetime/private/all-branch activity.

`PORTFOLIO_BASE` controls Vite asset URLs and the base metadata used by internal links and route matching. For this repository it is `/portfolio/`, with lower-case spelling. A custom domain requires `/` and its separate DNS/Pages configuration.

GitHub Pages does not apply `vercel.json` response headers or rewrites. Retained Vercel files are optional compatibility material, not part of the Pages runtime. A Vercel migration would need separate routing/statistics review; no Vercel deployment is performed by this workflow.

## Rollback

The old site remains on the original `main` commit until merge and in Git history afterward. Revert the migration merge to restore its source. Once a Pages deployment occurs, redeploy the desired previous version using its own appropriate build process.
