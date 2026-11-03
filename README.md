# Vishnu Sai Padyala — Portfolio

Animated React/TypeScript portfolio with GSAP transitions, six case studies and a local prepared-answer Manu assistant. Prepared for GitHub Pages under `/portfolio/`.

## Spatial artwork and motion

Work uses generated conceptual images with preserved transparency, floating subjects, separate shadows/ground planes, smooth pointer tilt and scroll camera depth. Project tabs select matching imagery. The generated garment and Reddit-themed sculpture are project illustrations, not official product photographs or logo assets. Images load lazily and idle animation pauses offscreen or when the document is hidden. Exact asset hashes remain enforced by privacy/publication audits.

Experience uses one pinned, reversible six-chapter sequence: Optum, Samsung, Yahoo!, UF IFAS, VIT-AP and SmartInternz. Five independent surfaces retain depth in composed states. The industry chapters use text-only company-name tiles. Existing conceptual SVG illustrations remain available for case-study covers. Mobile uses shallower perspective and a sequential reading layout; reduced motion keeps the artwork still. Pointer and scroll transforms use separate wrappers, and pointer listeners/tweens are disposed on media changes and unmount. These are conceptual illustrations, not application screenshots, laboratory imagery or Blender-rendered models. No additional runtime library is required.

The hero handoff keeps its scroll distance as the chapter count changes. Case-study return links restore the matching Experience chapter or explicit Work-gallery entry. Numerical performance claims from private source material remain excluded. Source publication and website deployment are separate actions; fresh rendered-browser review of the current motion is still pending.

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

Organization logos are original files from UF/IFAS Branding, VIT-AP's official website and SmartInternz's official website. The owner confirmed permission for their use. Source and release audits verify their exact hashes and the exact generated-artwork derivatives; unrelated images remain excluded.

## Hero atmosphere

The hero uses original procedural WebGL artwork with a perspective accretion disk and stylized light-bending halo. It is an artistic effect, not a scientific simulation. No external textures, video assets, 3D libraries or services are required. Rendering targets 30 fps on desktop and 24 fps on mobile, with drawing-buffer budgets of 360,000 and 160,000 pixels respectively; these are caps, not measured frame-rate guarantees. The loop pauses during the intro, after the Experience handoff, when offscreen/hidden, or when motion is paused. Reduced motion keeps a still pose, and CSS artwork remains available if WebGL is unavailable or its context is lost.

## GitHub activity

The GitHub section renders two manually maintained metric cards immediately from `scripts/github-snapshot.json`: public repositories and indexed public commits. It displays the verification date and explains that the counts are not live. There is no browser polling, refresh button, recent-commit feed or server dependency.

Update the saved figures and their verification timestamp only after checking public GitHub data. The Pages build validates and copies that same snapshot without making GitHub requests or changing the saved file. No API key or database is required; Manu continues using prepared answers locally.

## GitHub Pages deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). Pushes and pull requests build and validate an artifact; they do not publish this new version. After reviewing and merging, select **Settings → Pages → Source → GitHub Actions**, then run **Build and publish portfolio** on `main` with **publish** checked. This publishes the website publicly.

Only reviewed source files and approved images are tracked. Private documents and generated `dist/` are excluded. The prior website remains available in Git history.

## If Pages displays this README

The repository root contains source files, not the built website. Publishing directly from "main / (root)" lets the legacy Pages builder render this README. Use **Settings → Pages → Source → GitHub Actions** instead, then publish the reviewed "dist/" artifact using the workflow described above. A successful build-only workflow does not itself update the live site.
