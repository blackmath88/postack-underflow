# ADR-0002: Editorial narrative, artifact-led design, and static hosting

**Status:** Proposed — visual direction approved in conversation. Framework verified by spike on 2026-10-28 (see update below); acceptance and public deployment still need the owner's decision.

## Context
Postack Underflow should demonstrate a two-part research problem through an editorial experience, with source provenance and two distinct interactions. It is a public GitHub repository and the intended deployment is GitHub Pages.

## Proposed decision
Use a narrative-first site with two rabbit holes: Impossible Index (selected) and a community artifact (selection pending). Apply the Lost & Found Office concept and the Colors-derived palette with blue, violet and rose. Explore TanStack Start V1 as a statically exported site, but require a successful minimal GitHub Pages subpath spike before accepting the stack. Separate live services from the static publication if needed.

## Alternatives
Astro static shell with focused React/JS islands (proven in Lumpesammlig); plain HTML/CSS/JS; full dynamic TanStack deployment on a server host. Compare complexity and maintenance before committing.

## Consequences
Original interactive specimens rather than generic product UI. A static site cannot run a federation index or server-backed comment service itself. Community and search V1 can use clearly labeled fixture-backed experiences; any later live index needs an external service.

## References
- [Art direction](../design/ART-DIRECTION.md)
- [V1 plan](../plans/EDITORIAL-SITE-V1.md)
- [Colors](https://github.com/blackmath88/colors)
- [Lumpesammlig](https://github.com/blackmath88/lumpesammlig)

## Update 2026-10-28 — framework verification and recommendation

### Question
Can the current TanStack Start produce a fully static build that works on GitHub Pages under `/postack-underflow/`, including direct navigation, refresh and client-side navigation, without workarounds?

### Spike
A throwaway project (two routes) built with `@tanstack/react-start@1.169.4`, `@tanstack/react-router@1.170.46`, React 19.3.1, Vite 8.3.5 on Node 26:

- Vite `base: '/postack-underflow/'` plus Start `router.basepath: '/postack-underflow'`.
- Start `prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, failOnError: true }`.

Observed: `vite build` wrote `dist/client/index.html` and `dist/client/indexing/index.html`; every asset (`modulepreload`, module script, router manifest) and every `<Link>` href carried the `/postack-underflow/` prefix. No server was needed at runtime.

### Applied to V1 (same configuration)
- Router `trailingSlash: 'always'`, because GitHub Pages answers `/x` with a 301 to `/x/` for folder routes. Links are emitted in the canonical form, so readers never see that redirect.
- An explicit `/404` route is prerendered to `404.html`. Its scripts are stripped after the build (`scripts/finalize-404.mjs`): hydrating router state for `/404` at an arbitrary URL caused React error #418, and a static not-found page needs no JavaScript.
- `scripts/validate-build.mjs` fails the build if a route is missing, a root-relative URL escapes the base path, a URL does not resolve to a built file, or `404.html` contains scripts. It was checked against a deliberately broken build.
- `scripts/serve-pages.mjs` imitates Pages' subpath serving, trailing-slash redirects and 404 fallback for local and browser verification.

Verified in a real browser (Claude desktop browser pane, Chromium) against that server: initial load, hydration, client-side navigation without a full reload, direct load and refresh of every route with and without trailing slash, and an unknown path serving the 404 page with no console errors.

Quirks noted, none blocking: the prerender crawler visits each route both with and without the base prefix and writes the same files twice; prerendering a path that returns 404 aborts the build, hence the explicit `/404` route.

### Recommendation
Proceed with **TanStack Start + React + TypeScript**, prerendered to static files and deployed with GitHub Actions to Pages. The workarounds are small, documented and covered by validation. The site has no server functions, so it could later be moved to a server host without restructuring.

### Trade-offs against the Astro alternative
- *For TanStack Start:* typed routing and links; React is already the likely runtime for the interactive studies; one component model for prose and islands.
- *For Astro:* ships zero JavaScript by default (this site currently hydrates every page even though the prose is static, the shared client bundle is about 347 kB minified, 111 kB gzipped); islands are a first-class concept; Lumpesammlig, where the studies are developed, is already Astro.
- *Risk:* TanStack Start's static mode is less established than Astro's, and its prerender options changed during 1.x. Versions are pinned exactly in `package.json`; upgrades should rerun `npm run check` and the browser checks.

Revisit if integrating the studies needs Astro-specific runtime behaviour, or if the hydration cost of static prose becomes a measured problem.

