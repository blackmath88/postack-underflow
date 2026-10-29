# Verification

This file records what was actually checked. It is not a claim that the public site is live.

## The Laboratory — 2026-10-29

Branches `feat/lab-foundations` → `feat/lab-divergence` → `feat/lab-critique` → `feat/lab-specimens` → `feat/lab-integration`, as stacked draft PRs. The final run below was made on `feat/lab-integration`, from a clean `npm ci`.

### Automated checks
| Command | Result |
|---|---|
| `npm ci` | passes |
| `npm run typecheck` | passes |
| `npm test` | 63 passed, 0 failed, 1 skipped (the existing snapshot test, which needs `corpus:fetch`) |
| `npm run build` | passes |
| `npm run validate` | 73 pages, 60 of them lab experiments; 4,081 internal URLs under `/postack-underflow/` |
| `npm run index:check` | 30 sources, 30 records; structured index reproduced exactly |
| `npm run browser`, story checks | 226 passed, 0 failed (unchanged from `main`, plus `/lab/` at three widths) |
| `npm run browser`, lab checks | 792 passed, 0 failed, 60 experiments |
| `npm run browser`, specimen checks | 103 passed, 0 failed, 8 specimens, light and dark |

**What the lab checks cover, per pilot:**
- it is prerendered and returns HTTP 200, with an `h1`;
- it logs no console or page errors and no failed requests;
- its declared control is keyboard-reachable, shows a focus outline, and changes its declared output when used;
- nothing overflows horizontally at 390, 768 or 1440 px;
- nothing keeps running under reduced motion, before or after acting;
- without JavaScript, the notebook still renders.

The index check confirms that every pilot is listed, the status filter narrows the list, and the finding view works.

**Frozen data.** `tests/frozen.test.ts` pins the SHA-256 of the six Four Words v1 files, taken on `main` at `6522229`. Outside `src/lab/`, the lab changes only `SiteFooter.tsx` (one link), `vite.config.ts` (chunk names), `package.json` (scripts) and the check scripts.

### Problems the checks caught
- **An underscore chunk.** The dynamic route first built `assets/_n-….js`, which GitHub Pages' Jekyll step would drop. `validate` caught it; chunk names are now made Pages-safe.
- **The whole lab on every page.** The route's loader referenced the pilot map, which put every pilot and the frozen index in the entry chunk: 1.35 MB on every story page. The entry chunk is now 362 KB, against 352 KB on `main`.
- **Builder-level fixes**, found by lab-check and screenshots: overflow at 390 px from long `<select>` options, disabled probes losing focus, and a Motte import that pulled in a tiny CSS chunk that `validate` rejects.

### Sizes
| Asset | Size | Where it loads |
|---|---|---|
| Entry chunk | 362 KB (118 KB gzipped) | every page |
| Pilot chunk | 307 KB (91 KB gzipped) | lab pages only |
| Lab CSS | 135 KB (24 KB gzipped) | lab pages only |

### Manual review
- **In the browser pane:** pilots 03, 25 and 31, the lab index, and specimens 32 and 39, in the dark scheme.
- **Contact sheets** of all 60 specimen regions at 1280 px, light.
- **Screenshots of the final state**, in `docs/screenshots/`:
  - `lab-index-1440-light.jpg` and `lab-index-390-light.jpg`
  - `lab-04-1440-light.jpg`, after "All equal"
  - `lab-17-1440-light.jpg`
  - `lab-32-1440-dark.jpg`, with the agent's hand lifted
  - `lab-03-390-light.jpg`

### Not verified
- **No reader testing of any kind.** Every "happened" and "finding" comes from building and using the pilots ourselves.
- **No screen-reader testing** (NVDA, VoiceOver), and no cross-browser or real-device testing beyond Chromium.
- **The dark scheme** is checked automatically only for the eight specimens, and only that text and ground differ. The other 52 pilots use the site tokens but were not screenshotted dark.
- **CI and deployment.** CI on the stacked PRs uses the runner's Chrome; nothing has been deployed.
- **The lab's own numbers** are computed from frozen data in the browser or in Node. They are demonstrations, not evaluation runs, and none has been reproduced by anyone else.

## Editorial pass: three levels and margin notes — 2026-10-28

**Branch:** `feat/irresistible-story`. **Environment:** Linux, Node 26.8.1, Chromium (system), playwright-core 1.64.1. Nothing was merged or deployed.

### Automated checks
| Check | Result |
|---|---|
| `npm run check` (typecheck, tests, build, validate) | pass. Tests 25/25, including 5 new margin-note registry tests: every note used exactly once, on its chapter's page; sources registered; archive anchors exist; reported history notes say they are not independently verified. Build: 12 pages, 443 internal URLs. |
| `npm run index:check` | frozen artifact reproduced exactly |
| Frozen data | `git diff main -- corpus results src/data/four-words-index.json src/features/motte` is empty |
| `npm run browser` (local Pages emulation) | **214/214**. Every route at 390, 768 and 1440 px: styled, no overflow, no errors. The original experiment, keyboard, reduced-motion and no-JS checks still pass. New checks are listed below. |

**New browser checks, margin notes, at 390 and 1440 px:**
- a click opens the note and the marker reports `aria-expanded="true"`;
- the scroll position is unchanged (< 2 px);
- at 1440 px the note sits beside its paragraph, and at 390 px it opens inline within the viewport;
- opening a second note closes the first;
- Escape closes the note and returns focus to the phrase;
- Enter opens a note and Space toggles it;
- the Close control returns focus;
- a deep link (`/community/#note-switchboardHistory`) opens the note after hydration, is announced as expanded, and scrolls it into view;
- the archive lists every note;
- Escape closes a note when focus is elsewhere (Safari does not focus links on click);
- a note does not reopen after navigating away and back;
- an open note is placed again after a resize from 1440 to 390 px.

**New checks without JavaScript:**
- notes start closed;
- a marker link opens its note through `:target`, and the Close link hides it;
- a deep link shows its note;
- the archive renders the Four Words tables, the protocol inventory, the research history and the knowledge record.

### Manual review
- **Screenshots:** reviewed at 1440 px and 390 px for every story route, in light and dark. Before/after and note screenshots are in `docs/screenshots/08–14`.
- **Note placement at 1440 px:** checked one by one with a script. Most notes open in the margin. Notes directly above a wide figure or experiment open inline: `episode`, `frameRepo`, `googleSo`, `eachThroughOther`, `otherProblems`, `frozenIndex`, `whatIndexAdds`, `ranking`, `switchboardHistory`. Two notes, `rawVsAuthored` and `fixtures`, move up to clear the figure below them.
- **Accessibility tree** (Playwright aria snapshot): a closed marker is a `button` named by its phrase plus "(margin note: <title>)". Open, it reports `[expanded]` and is followed by a `note` with the same name, containing ordinary source links, "Link to this note" and "Close note and return to the text".
- **Prose measurement:** `scripts/measure-surface.mjs` counts visible prose on the story routes: 6,045 → 2,276 words (−62%). See the content inventory.
- **Independent review (AI reviewer, read-only):** confirmed the numbers (25 vs 17 of 27; rank 7 → 2; 201/150/21/30; six of ten wins plus one artefact), the reported status of PR #5 history and the quote lengths, and found no hydration mismatch. Acted on, and listed in REFLECTION §7:
  - three must-fix items: "one heading" vs the shared label, "by construction" back on the surface, and the desk's lost query back on the surface;
  - eight should-fix wording, accuracy and interaction items: global Escape, reset on navigation, re-measure on resize, and "Link to this note" copying instead of jumping.
  - Not acted on: after closing a deep-linked note, its hash stays in the address, so reloading reopens it. Rewriting the address makes the router scroll (ADR-0005).
- **New sources:** the Stack Overflow tour and Google's ranking page were fetched with `curl`, which returned 200 for both, and checked for the claims cited. The tour covers votes, accepted answers, reputation and edits. Google's page covers query words, relevance, and links from prominent sites as a quality signal.

### Not verified
- No real reader has used the revised site. Comprehension, and whether people open notes at all, are unmeasured.
- No screen reader (NVDA, VoiceOver, TalkBack) was used; only the browser's accessibility tree.
- Only Chromium was tested: no Firefox or Safari. The phrase tint and underline use `color-mix()`; where it is unsupported they lose their colour, not their function.
- No real mobile devices; 390 and 768 px are emulated viewports.
- Not deployed. Links to files that exist only on this branch (`CONTENT-INVENTORY.md`, ADR-0005) return 404 until merge.

## Living essay — 2026-10-28

**Environment:** Linux, Node 26.8.1, Chromium 154 (system), playwright-core 1.64.1.

### The deployed site before this slice
- **Live URL check:** `node scripts/browser-check.mjs --url https://blackmath88.github.io/postack-underflow/` passed **101/101** against the public URL after PR #4. Styles were applied, routes and refresh worked, the 404 page and navigation worked, and keyboard, reduced-motion, no-JS and interaction checks passed.
- **Main run:** the Pages workflow on `main` (deploy + smoke) was green. Nothing about the deployment needed fixing.
- **New option:** browser checks can now run against any deployed root with `--url`.

### Automated checks
| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm test` | 20/20, including claim-accountability tests (no reader or model connection attributed to an author; author connections must be backed by a reference in the record; model proposals never shown as accepted), and quotation checks against cited snapshot lines (run locally with snapshots present; skipped in CI) |
| `npm run build` / `npm run validate` | 8 pages, 228 internal URLs under the base path |
| `npm run index:check` | frozen artifact reproduced exactly |
| Frozen v1 data | `git diff main -- corpus results src/data/four-words-index.json` is empty |
| `npm run browser` (local Pages emulation) | **131/131**, including the Disputed Neighbour (flags, verdict, undo, URL check in both directions), the Switchboard (model contract labelled, reader proposal attributed, operator leaves after the 600 ms fade and returns, all eight records listed), the Problem Desk (no preview, 7 → 2 for each part alone), and no-JS rendering of the history, contracts and frozen ranking |

### External links
- 70 external links in the built pages were checked with `curl`.
- **Not resolving yet:** links to repository files that exist only on this branch (`REFLECTION.md`, `CASE-PHOTO-FRAME.md`, the new data files) return 404 until merge.
- **Not fetchable:** the BM25 DOI resolves (doi.org → Emerald, *The Probabilistic Relevance Framework: BM25 and Beyond*), but the publisher refuses automated requests, so the target page itself was not fetched.

### Manual review in the browser pane
- **Opening at 1440 px:** the first build placed movement content in the wrong grid columns, because `display: contents` sections were not covered by the column rules. Fixed.
- **Disputed Neighbour:** checked at 1440 px in light and dark.
- **Switchboard:** checked at 1440 px, before and after the operator leaves, light and dark. An endpoint highlight showed while the operator was present; fixed.
- **Problem Desk:** checked at 390 px.
- **Afterword timeline:** checked at 390 px.
- **Screenshots:** in `docs/screenshots/`.

### Independent reader review (AI reviewer, read-only)
- **Confirmed:** the frozen data is untouched, the photo-frame counts and keyword scan reproduce, and the identification is presented as inference. The desk numbers reproduce (7; 2; 2; 2; baseline 1).
- **Must-fix items acted on:**
  - A symptom was wrongly flagged as absent from its source: "works just fine on local" is in the issue. The flag was removed, and the genuinely absent "404" and "blank" are now flagged and test-verified against the snapshot tokens.
  - The opening example now matches the desk query.
  - The photo-frame identification is labelled as inference everywhere.
  - The desk result is reframed as true by construction and near-circular, with the baseline's rank 1 stated. The "grounded" part is described as describing a mechanism, not the symptom.
  - Afterword and Convergence headings fixed.
- **Should-fix items acted on:**
  - Transcript timestamps and wording.
  - Reconstructed URL and paraphrase labels.
  - The URL-check limit stated.
  - Stale Notes and About text.
  - The real photo-frame maintenance case brought into the Switchboard.
  - Repeated questions trimmed.
  - The win count corrected to "6 plus one tokenizer artefact".
  - Link text.
  - A `declared` status for author connections.
  - The operator-leaves reference count.
  - Tally markup, a labelled speculative example, glosses for Lumpesammlig and H1–H5.
  - A source link for the sibling project's stylesheet repair.
- **Not acted on:**
  - Repository links still use `blob/main`.
  - The disputed cable's status is shown by colour on the board; it is written out in the contract list.
  - The opening tally keeps its three numbers.

### Not verified
- **Comprehension:** no reader has used the experiments; there is no plain-table comparison.
- **Assistive technology:** no screen reader tested.
- **Devices and browsers:** no real devices, and no browsers other than Chromium.
- **The live site after this slice:** nothing is deployed until this PR is merged.

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
