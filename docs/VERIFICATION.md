# Verification — editorial site V1

**Date:** 2026-10-28 · **Environment:** Linux, Node 26.8.1, npm 11.19.0; browser checks in the Claude desktop app's built-in Chromium browser pane against `scripts/serve-pages.mjs`.

This records what was actually checked. It is not a claim that the public site is live.

## Automated (`npm run check`, also run in CI)
| Check | Result |
|---|---|
| `npm ci` from a clean `node_modules` | pass, 0 vulnerabilities reported |
| `tsc --noEmit` | pass |
| `node --test tests/` (source registry, provenance coverage, artifact contracts, private-repo flags) | 5/5 pass |
| `vite build` with prerender (`failOnError: true`) | 7 HTML pages: `/`, `/indexing/`, `/community/`, `/convergence/`, `/notes/`, `/about/`, `404.html` |
| `scripts/validate-build.mjs` | 186 internal URLs, all under `/postack-underflow/` and resolving to built files; `404.html` script-free |
| Validator negative test (injected `/about/` and a missing stylesheet) | correctly failed with 3 errors |

## Static serving (Pages emulation)
| Request | Result |
|---|---|
| `/postack-underflow` | 301 → `/postack-underflow/`, then 200 |
| `/postack-underflow/indexing` | 301 → `/postack-underflow/indexing/` |
| `/postack-underflow/indexing/` | 200 |
| `/postack-underflow/nope` | 404 with `404.html` |

GitHub Pages' own redirect and 404 behaviour is expected to match this, but it has **not** been verified on Pages itself, because nothing has been deployed.

## Browser
| Check | Result |
|---|---|
| Hydration and client-side navigation through all header links | no full reload (window marker preserved), titles update, `aria-current="page"` on the active link, no console errors |
| Direct load / refresh of every route | correct page and title |
| Unknown path | static "Nobody has solved this one yet." page, correct title, no scripts. An earlier hydrated 404 caused React #418; fixed by `scripts/finalize-404.mjs` |
| 390 px, all 7 pages | no horizontal overflow; text column 343 px with 16 px gutters; nav wraps to two rows, no JS needed |
| 768 px, all 7 pages | no horizontal overflow; 608 px reading column; rabbit-hole fork in two columns |
| 1440 px | 608 px reading column centred; table, fork and artifact slots at 1024 px |
| Light and dark (`prefers-color-scheme`) | both render with explicit backgrounds |
| Keyboard | first Tab reaches "Skip to content"; Enter moves focus to `main`; next Tab lands on the first link in the content; 3 px rose focus outline on every link checked |
| Artifact fallbacks | both slots render `data-artifact-status="in-development"` with notice, fallback prose, PR link and pinned revision |
| External links (`curl -L`) | all 200 after private repos (`colors`, `development-practice`) were changed to unlinked "private repository" credits. Repository doc links to `docs/adr/` and `docs/ARTIFACT-INTEGRATION.md` will 404 until this work is on `main` |

## Contrast (WCAG 2.x, computed)
Paper ground: ink 13.0, muted 5.7, blue links 5.6, violet text shade `#7440D6` 5.5, rose text shade `#C22A5A` 5.0, focus ring `#EE4F7E` 3.1 (non-text, ≥ 3). Raw violet `#A36BFF` (3.1) and rose (3.1) are used only for marks and rules, never body text. Dark ground: all text pairs ≥ 6.9; focus ring 5.1.

## Not verified / limitations
- **Reduced motion:** the browser tool cannot emulate `prefers-reduced-motion`. Verified statically only: the site has no animations, smooth scrolling and 120 ms border transitions sit behind `no-preference`, and a `reduce` block zeroes durations.
- **Screen readers:** not tested with NVDA, VoiceOver or similar. Focus is not moved on client-side route changes (TanStack Router default); worth reviewing.
- **Real devices and touch:** viewport emulation only.
- **GitHub Pages and Actions:** the workflow has not run yet; it will run on the draft PR (checks only). Deployment and public access are unverified and require merging to `main`.
- **Fonts:** Inter is requested but not bundled; readers without it get the system sans.
