# Verification

This file records what was actually checked. It is not a claim that the public site is live.

## Phase 2 — 2026-10-28

**Environment:** Linux, Node 26.8.1, npm 11.19.0, Chromium 154 (system), playwright-core 1.64.1.

### Deployment state at the start of Phase 2
- **What was on `main`.** PRs #1 → #2 → #3 were merged *as a stack*: #2 into #1's branch and #3 into #2's branch. Only PR #1 reached `main` (`eebc4c8`), so `main` held documentation only.
  - No Pages workflow had ever run on `main`.
  - `https://blackmath88.github.io/postack-underflow/` returned **404 on every route** (`npm run smoke` against the public URL: 7 failures).
- **What Phase 2 does about it.** The Phase 2 branch is based on the tip of the stack (`cf19112`), so its pull request against `main` carries V1 and Phase 2 together. Merging it is the first time the site can deploy. **Nothing has been deployed by this work.**
- **Regression coverage added for "green build, broken page":**
  - `scripts/validate-build.mjs` fails if any output path starts with `_`, if `.nojekyll` is missing, if a page links no stylesheet, or if a stylesheet is suspiciously small.
  - `scripts/smoke-deployed.mjs` runs as a new `smoke` job after `deploy`. It fetches every route at the real Pages URL and checks HTML, CSS (content type and size), module JS (content type) and 404 behaviour.
  - `scripts/browser-check.mjs` asserts in a real browser that the stylesheet is *applied* (computed body background), at three widths.

### Automated checks (all run locally and wired into CI)
| Check | Result |
|---|---|
| `npm ci` (clean install from the lockfile) | pass |
| `npm run typecheck` | pass |
| `npm test`: retrieval, metrics, content registry, corpus schema, queries, knowledge record, fixtures | 15/15 pass |
| `npm run build` | 7 pages; `404.html` is script-free |
| `npm run validate` | 202 internal URLs, all under `/postack-underflow/`, all resolving; no underscore paths; `.nojekyll` present; stylesheet linked on every page |
| `npm run index:check` | artifact matches `corpus/`; structured index reproduced byte-for-byte from the committed records |
| `npm run browser` | **101/101 pass**, stable across repeated runs (details below) |
| `npm run smoke` against the local Pages emulation | pass (6 routes, 9 URLs) |

### Browser checks (`npm run browser`, Chromium, Pages-like server)
- **Every route at 390, 768 and 1440 px:**
  - HTTP 200;
  - stylesheet applied (paper ground `rgb(245, 243, 236)`);
  - no horizontal overflow;
  - an `h1`;
  - no console or page errors.
- **Dark scheme.** The night ground applies.
- **Routing.**
  - A folder route without a trailing slash redirects to the canonical form.
  - An unknown route returns HTTP 404 with the site's 404 page.
  - Header navigation is client-side (no reload), and the title updates.
- **Keyboard.** The first Tab reaches the skip link, which has a visible solid outline; Enter moves focus to `main`.
- **Reduced motion** (emulated `prefers-reduced-motion: reduce`). `scroll-behavior: auto`; zero running animations after scrolling.
- **Four Words.**
  - A query returns ranked records with field-level explanations, and unmatched records stay listed.
  - A nonsense query reports "No record matched" and names the unknown words.
  - A stopword-only query is handled.
  - No errors.
- **Community.**
  - "Remove every relation" leaves every contribution shown.
  - The source ledger lists all of them.
  - Model proposals appear only when switched on. This check caught a real bug (a second relation was dropped); it was fixed.
- **JavaScript disabled.**
  - The record catalogue on the Indexing page renders all 30 records.
  - Every scrolly step has its own figure.
  - The knowledge record renders.

### Manual review in the browser pane
- **Home at 1440 px.** The sticky diagram follows the active step.
- **Four Words.** Query `spa refresh 404` shows the structured and baseline columns side by side; record details expand with context, solution, evidence, limitations and related records.
- **Community at 390 px.** With every relation removed, the 8 contributions remain, shown under "Not connected in this view".
- **Convergence at 768 px, dark.** The knowledge record renders from the JSON file, and its download link resolves to a hashed asset.
- **Fixes made after review:**
  - The H1 and H2 status pills read "Implemented"; they now read "Tested" and "Demonstrated".
  - On mobile, the checkbox notes are laid out below their labels.
  - A fixture's "twenty-odd records" now says "thirty".

### Independent review (AI reviewer, read-only)
A separate agent reviewed the site as a sceptical reader. It re-ran retrieval, fetched the Syntax transcript, and spot-checked five records against their snapshots. Findings acted on:

- **Wrong results diagnosis.** The diagnosis was corrected and reframed as a post-hoc analysis; run v1's labels and records were not changed. 7 of 10 structured wins rely on vocabulary the record writer supplied; one win is a tokenizer artefact (`trailingSlash`); the CSS loss was partly a labelling gap (rank 7 becomes rank 2 if the two missed sources are added post hoc).
- **Caveats.** They now sit next to the numbers on the Indexing page, and "rank 1 correct" was added as a metric: baseline 17 of 27, structured 25 of 27.
- **Syntax paraphrase.** Stack Overflow "built agents of its own", with Wes's doubt; "anonymised" removed.
- **ATProto claims.** Hedged to match the research notes. The niche vote and question/answer Lexicons were added to the table; recommend is marked "adoption unmeasured".
- **Knowledge record.** Removed the palette source, narrowed E3 (issues are not truly pinned), and added corpus pointers; revision 0.2.1.
- **Unsupported phrasing.** Softened the slogan and the "clean, confident and alone" line; acknowledged agent-made issues and PRs; sourced the stacked-PR anecdote with a link.
- **Convergence.** It now argues through the CSS miss as a worked example of the community → index loop, and marks that loop as not built (H3).
- **Assembler wording.** Offline and deleted records say their metadata comes from an index's earlier copy, and the contribution count is correct.
- **Smaller fixes.** The diagram's probes now go to docs, issues and READMEs, not the old thread. About no longer says there is no index. Notes statuses are consistent.
- **Accessibility.** No `h5` flood (headings h1, h2, h3 only on the Indexing page); a space after status chips; source links carry the repository name for screen readers.

Not acted on, and recorded as v2 work:
- Records with known defects (the vite#8073 "blank page" alias; the upload-pages-artifact#129 wording) were kept as written, because changing them would change run v1.
- Re-labelling with a second labeller.

### Sizes
- Index artifact: 448 KiB JSON. The Indexing route chunk is 475 KB minified, 69 KB gzipped.
- The shared client bundle is about 351 KB minified.

### Not verified / limitations
- **Not deployed.** The live site, the Pages deploy and the new `smoke` job have not run. They run only after a merge to `main`.
- **CI browser step.** It relies on the runner's preinstalled Chrome at `/usr/bin/google-chrome`. It will first run on this PR.
- **Accessibility.** No screen-reader test (NVDA, VoiceOver). Focus is not moved on client-side route changes.
- **Devices.** No real-device or touch testing, and no cross-browser testing beyond Chromium.
- **Corpus baseline.** The baseline index can only be rebuilt with network access and the `gh` CLI (`npm run corpus:fetch`). CI checks the structured index only.
- **Record review.** The records have not been reviewed by a human. An independent agent review spot-checked five of them (see the PR).

## V1 — 2026-10-28 (summary)
- **Framework spike and baseline checks.** TanStack Start static-export spike, build validation, Pages-emulated serving, and a manual browser review at 390/768/1440 px, with keyboard, contrast and external-link checks. See [ADR-0002](adr/0002-editorial-site-direction.md).
- **Contrast.** Computed WCAG ratios: every text pair meets AA in both schemes, and the focus ring is 3.1:1 or better.
