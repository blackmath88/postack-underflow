# Artifact integration contract

**Status:** Proposed, 2026-10-28. Describes how the two Lumpesammlig studies can join the editorial site without redesigning it. Nothing here is integrated yet.

| | The Impossible Index | The Switchboard |
|---|---|---|
| Study | `012-impossible-index` | `013-switchboard` |
| Rabbit hole | [`/indexing/`](../src/routes/indexing.tsx) | [`/community/`](../src/routes/community.tsx) |
| Source repository | [blackmath88/lumpesammlig](https://github.com/blackmath88/lumpesammlig) | same |
| Current location | draft [PR #8](https://github.com/blackmath88/lumpesammlig/pull/8), branch `feat/012-013-postack-encounters` | same |
| Inspected revision | `f525449b77a00d9ac442eccdbd9bccacf0dcedd5` | same |
| Current entry point | `src/pages/samples/012-impossible-index.astro` | `src/pages/samples/013-switchboard.astro` |
| Site registry entry | `ARTIFACTS.impossibleIndex` in [`src/content/artifacts.ts`](../src/content/artifacts.ts) | `ARTIFACTS.switchboard` |
| Slot | `<ArtifactSlot id="impossibleIndex" />` | `<ArtifactSlot id="switchboard" />` |

## What exists today

On the site, each rabbit hole contains an `ArtifactSlot` with a title, a one-line promise, an honest "not available yet" notice, an editorial fallback that makes sense without the study, and a link to the development PR plus the inspected revision. The surrounding prose explains each rabbit hole fully without the study (definition of done: *the rabbit holes are understandable without the interactive artifacts*).

In Lumpesammlig, at the inspected revision, both studies are **complete Astro pages**. Each has its own `BaseLayout`, back-navigation, `:global(body)` styles, hard-coded light colours, inline `<script>` with synthetic fixtures, and page-level element IDs (`#query`, `#cards`, `#status`, `#lines`, `#nodes`, `#voices`). That is right for a specimen collection. It cannot be dropped into another page unchanged: the styles leak, the IDs collide (both studies use `#status`), and there is no dark mode.

Nothing has been copied from those pages into this repository.

## Integration options

1. **Mount module (recommended).** Lumpesammlig extracts each study's interaction into a framework-neutral module: `mount(element, options) → { destroy() }`. Its page and this site both call it. The editorial frame (encounter, reading, reflection) stays with each host; only the executable reading is shared.
2. **Embedded page (interim).** Embed the deployed Lumpesammlig page in an `<iframe>`. Isolation is free, but you get double navigation, a fixed light theme, awkward height management and a second origin's focus order. Use this only if option 1 is not ready and the owner wants something live.
3. **Copy into this repo.** Rejected for now: the studies are still changing, and a copy would drift.

## Contract for option 1

### Source and revision
- Integrate from a **pinned full commit SHA** on Lumpesammlig `main` (after its PR merges), never a branch.
- Record the SHA in `inspectedRevision` and set `status: 'integrated'` in `src/content/artifacts.ts`.
- Delivery: vendor the built module under `src/artifacts/<study>/` with a `SOURCE.md` naming repository, SHA, licence and build command. Alternatively, depend on a tagged package if Lumpesammlig publishes one. Do not fetch code from another origin at runtime.

### Entry point
```ts
export interface MountOptions {
  /** Prefix for any asset the study loads, e.g. '/postack-underflow/'. */
  baseUrl: string
  /** Respect prefers-reduced-motion even when the host can't detect it. */
  reducedMotion?: boolean
  /** Unique prefix for element ids, so two studies can share a page. */
  idPrefix: string
}
export function mount(root: HTMLElement, options: MountOptions): { destroy(): void }
```
- `root` is the slot's `.artifact-slot__stage` element. The study renders only inside it.
- The site mounts the study in a client-only effect after hydration (`useEffect` in `ArtifactSlot`). The prerendered HTML keeps the fallback, which stays in place if mounting fails or JavaScript is off.

### Assets and base paths
- Every asset URL is derived from `options.baseUrl`; nothing is root-relative. The site's build validator (`npm run validate`) fails on any URL outside `/postack-underflow/`.
- Fixture data ships inside the module or as a JSON file next to it. No network requests to third-party services.
- Assets are bundled by this site's Vite build so they get hashed filenames.

### Styling and container
- Styles are scoped to the root, either with a class prefix such as `.pu-index-*` / `.pu-switchboard-*` or with a shadow root. No `body`, `html` or bare element selectors.
- Colours are read from the host's custom properties (`--fg`, `--bg`, `--rule`, `--accent`, `--accent-community`, `--accent-signal`, `--surface`, `--focus`), with the study's own values as fallbacks. That gives dark mode without extra work.
- The stage is fluid: 100% of the slot width, from 320 px to 1024 px wide. The study must not overflow horizontally at 390 px. Its minimum height is reserved by `.artifact-slot__stage { min-height: 18rem }` to avoid layout shift; the study may grow taller.

### Keyboard and accessibility
- Every control can be reached with Tab in visual order and works with Enter or Space. There are no keyboard traps, and there are no hover-only or pointer-only interactions.
- Focus stays visible and uses the host's `--focus` token.
- State changes are announced through one `aria-live="polite"` region per study. Toggle buttons use `aria-pressed`.
- SVG diagrams carry `role="img"` and a label, and every piece of information they show also exists as text (the Switchboard already lists its contributions as text).
- The study adds `h3` and below only; the slot owns the `h2`.

### Reduced motion
- Under `prefers-reduced-motion: reduce` (or `options.reducedMotion`), all state changes are immediate. No transitions, scroll animation or autoplay.
- No information may depend on motion.

### Provenance and honesty
- The study keeps its own visible labels: synthetic fixtures, no live index, no LLM, no ATProto. These must survive integration.
- The slot footer continues to link to the source repository and to show the pinned revision.
- Nothing in a study may present fixture contributions as real people, votes or results.

### Fallback
- If the module is not integrated, fails to load or throws during `mount`, the slot shows the editorial fallback from `artifacts.ts` along with the notice. A failed mount must not break the rest of the page. Catch the error, `destroy()` if needed, and leave the fallback intact.
- Without JavaScript, the fallback is what readers get.

## Acceptance checklist for an integration PR
- [ ] Pinned SHA and `SOURCE.md` recorded; `status: 'integrated'`.
- [ ] `npm run check` passes (typecheck, tests, build, route and asset validation).
- [ ] Browser check at 390, 768 and 1440 px, light and dark, with no horizontal overflow.
- [ ] Keyboard-only walkthrough of the study, with visible focus and no traps.
- [ ] Reduced-motion check.
- [ ] JavaScript-disabled and mount-failure fallback check.
- [ ] Synthetic-data labels still visible.
