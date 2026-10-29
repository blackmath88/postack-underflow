# The Laboratory: method

**Status:** working method, 2026-10-29. Branch `feat/lab-foundations`.

The Laboratory is an optional space beside the essay, at `/lab/`. It holds small, executable propositions about how knowledge gets found, connected, challenged and remembered. It is not part of the story's reading path; the footer links to it, and nothing else on the main site does.

> Encounter → Interpretation → Transgression → Experiment → Reflection.

An experiment should change what we understand, not illustrate what we already believe. A pilot that disproves its own proposition is a result, not a failure.

## 1. What a pilot is

Every pilot has three parts, and only the first is shared.

1. **A catalogue entry** in `src/lab/catalogue/<family>.ts`, typed by `LabEntry` in `src/lab/types.ts`. It is metadata: what the pilot asks, what it claims, where the idea came from, and what happened. The lab index browses these, and the shell prints them as a notebook.
2. **A component** in `src/lab/experiments/<family>/NN-slug.tsx`, registered in that folder's `index.ts`. It is free to be anything: typographic, spatial, procedural, an SVG, a canvas, a small state machine. The shell gives it a plain region and never styles it.
3. **Its styles** in `src/lab/styles/<family>.css`, scoped under the pilot's root class `.xNN`.

There is no universal experiment engine. Two pilots may share data, never a template.

### The proposition
Each entry states a proposition that **could be false**, and a **falsifier**: the observation that would show it wrong. It also says:

- what the visitor may **manipulate**;
- what **changes** because of that;
- what stays **unchanged**;
- a **plainer control** that might do the same job.

After building, the entry records **what happened** and **what remains uncertain**. These are written from building and using the pilot ourselves. Nothing in the Laboratory is a user study, and no entry may say what "users" or "visitors" found.

### The four kinds
| Kind | What it does |
|---|---|
| Behavioural | A physical or conceptual principle becomes an interaction. |
| Epistemic | Shows how knowledge, interpretation or uncertainty is constructed. |
| Editorial | Changes how a reader meets an argument. |
| Architectural | An executable model of how independent systems or records relate. |

### Levels
- **A, research proposition.** An encounter, a hypothesis, a proposed interaction and a falsifier. Not published in the lab as a pilot.
- **B, kernel.** The smallest working interaction that tests the proposition. Every catalogued pilot is at least B.
- **C, specimen.** Refined and tested, with strong visual character, accessibility checks and a written assessment.

Critique may also mark a working pilot **challenged**, **to combine** or **retired direction**. Retired pilots keep running and keep their notebooks: rejected interpretations stay in the record.

## 2. Provenance

Each notebook answers:

- What gave us this idea?
- Which mechanism inspired it?
- What did the source actually demonstrate?
- What is our interpretation?
- What did we build, and what happened?
- What remains uncertain?

Sources carry a **firmness**: checked fact, reported, metaphor, or speculation. A metaphor is never presented as history. Historical claims that have not been checked against a primary source are labelled *reported*, the same rule the margin notes follow. Prior art is welcome, and named.

## 3. Data

- **Four Words v1 is frozen.** Pilots may read `src/lib/four-words-data.ts`, `corpus/queries.json` and `results/four-words-v1.json`, and must never write them. `tests/frozen.test.ts` pins their digests. A pilot may rank with the shared retrieval code to *demonstrate* a mechanism; that is not an evaluation run, and it must not be reported as a retrieval result.
- **New data** lives in `src/lab/data/`, one file per dataset, with a header comment saying what it is, who invented it, and what it may not be used to claim.
- **People and identities** are invented under `.example` and `did:example`, as on the Community page. Placeholder record types use `example.postack.*`.
- **No network.** No API, crawler, model call, database, authentication or tracking. Every pilot works offline from the static build.

## 4. Motte

The Archive Moth lives in `src/features/motte/` and is not production-ready. Pilots may import `MotteSprite`, `Motte` and `publicHistoryFlags`; they may not modify the module, ship a second mascot, or invent history notes. Today `historyFlags` is empty, and only margin notes marked *checked* would pass its filter. A pilot about Motte has to work with that, or show it.

## 5. The browser contract

`npm run browser` runs `scripts/lab-check.mjs` after the story checks. For every catalogued pilot it loads the prerendered page, waits for hydration, and checks:

- it returns 200, has an `h1`, and logs no errors;
- the element marked `data-probe` is keyboard-reachable and shows a focus outline;
- acting on it changes the text of the element marked `data-observe`;
- nothing overflows horizontally at 390, 768 and 1440 px;
- nothing keeps animating under `prefers-reduced-motion: reduce`.

`data-probe` takes `click` (the default), `type:<text>` or `key:<Key>`; a `select` is moved to its second option. The probe proves that one control does something, not that the pilot is good.

## 6. Accessibility, every pilot

- Every control is a native element, or has a role, a name and keyboard handling.
- Focus stays visible. Use the site's `:focus-visible` style unless there is a reason not to.
- Motion runs only under `prefers-reduced-motion: no-preference`; the state change must not depend on it.
- Information is never carried by colour alone.
- Text stays readable at 390 px and in the dark scheme. Use the site tokens (`--fg`, `--bg`, `--muted`, `--rule`, `--accent`, `--accent-signal`, `--accent-community`).

## 7. Visual direction

The Lab belongs to the Lost & Found Office: paper `#F5F3EC`, ink `#252A30`, blue `#4A6288`, violet `#A36BFF`, rose `#EE4F7E`. Violet and rose are for marks, not body text. A pilot may take on a different identity when its source justifies it, such as a terminal, a card, a printed sheet or a switchboard panel. No glassmorphism, decorative gradients, generic rounded cards or AI-product styling.

## 8. Engineering notes

- **Routes.** `/lab/` is `src/routes/lab/index.tsx`; each pilot is served by the one dynamic route `src/routes/lab/$n/index.tsx` and prerendered by crawling the index's links.
- **The underscore trap.** The dynamic route first produced a chunk named `_n-….js`. GitHub Pages' Jekyll step would drop it, which is the exact failure the essay's Disputed Neighbour describes. `validate-build` caught it; `vite.config.ts` now strips leading underscores from chunk names.
- **Styles.** `src/lab/styles/lab.css` is linked only by lab routes and `@import`s the six family files, so the story pages never load lab CSS.

## 9. Adding a pilot

1. Write the entry in the family's catalogue file, with `status: 'kernel'`.
2. Write the component, mark one primary control `data-probe` and its output `data-observe`, and register it.
3. Scope its CSS under `.xNN`.
4. Run `npm run typecheck`, `npm test`, `npm run build`, `npm run validate` and `node scripts/lab-check.mjs --only NN`.
5. Use it. Then write *what happened* honestly, even when it contradicts the proposition.
