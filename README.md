# Vishnu Sai Padyala — Portfolio

Animated React/TypeScript portfolio with GSAP transitions, six case studies and a local prepared-answer Manu assistant. Prepared for GitHub Pages under `/portfolio/`.

## Develop and verify

Requires Node.js 24.

```sh
npm ci
npm run dev
npm test
npm run lint
PORTFOLIO_BASE=/portfolio/ npm run build:pages
```

`dist/` contains the complete static site. The Work gallery receives `work/index.html`; case studies each receive their own `work/<id>/index.html`, so opening links directly and refreshing works without server rewrites. Assets, navigation and Manu links respect the deployment base. For a custom domain, build with `PORTFOLIO_BASE=/` and update the workflow accordingly.

## Work collection

The hero navigation's Work link opens a separate gallery with organization-themed chapters for UF/IFAS, University of Florida, VIT-AP and SmartInternz. Only Cell Counter and Plant Cropper belong to UF/IFAS; TransGIS and the other UF projects appear in the university chapter. Accessible project tabs switch approved summaries and conceptual illustrations. Six existing case studies remain available; four additional repository-backed studies link to their source repositories. Native scrolling drives visual depth without scroll hijacking. Mobile panels stack naturally and reduced motion disables choreography. The original homepage flow, three Selected Work cards and Experience stage remain intact. Case-study returns preserve whether the visitor came from the gallery or the homepage.

Organization logos are original files from UF/IFAS Branding, VIT-AP's official website and SmartInternz's official website. The owner confirmed permission for their use. Source and release audits verify their exact hashes; other imagery remains excluded.

## GitHub activity

The GitHub section renders two manually maintained metric cards immediately from `scripts/github-snapshot.json`: public repositories and indexed public commits. It displays the verification date and explains that the counts are not live. There is no browser polling, refresh button, recent-commit feed or server dependency.

Update the saved figures and their verification timestamp only after checking public GitHub data. The Pages build validates and copies that same snapshot without making GitHub requests or changing the saved file. No API key or database is required; Manu continues using prepared answers locally.

## GitHub Pages deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). Pushes and pull requests build and validate an artifact; they do not publish this new version. After reviewing and merging, select **Settings → Pages → Source → GitHub Actions**, then run **Build and publish portfolio** on `main` with **publish** checked. This publishes the website publicly.

Only reviewed source files and approved images are tracked. Private documents and generated `dist/` are excluded. The prior website remains available in Git history.

## If Pages displays this README

The repository root contains source files, not the built website. Publishing directly from "main / (root)" lets the legacy Pages builder render this README. Use **Settings → Pages → Source → GitHub Actions** instead, then publish the reviewed "dist/" artifact using the workflow described above. A successful build-only workflow does not itself update the live site.
