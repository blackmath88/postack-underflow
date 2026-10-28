# Editorial site V1 — implementation plan

**Status:** proposed, no build/deploy authorized by this document. Intended stack: TanStack Start + TypeScript, static/prerendered GitHub Pages artifact via GitHub Actions, subject to current framework compatibility verification.

## Goal
A public, coherent interactive essay: lost shortcut → two problems → Index rabbit hole → Community rabbit hole → convergence. It demonstrates the indexing/community thesis without claiming real federation or verified search.

## Route plan
- `/`: narrative landing, fork and closing convergence
- `/indexing`: Impossible Index and Four Words reproducible retrieval fixture
- `/community`: one conversation across blog, channel and graph projections; community artifact trial
- `/notes`: source notes, methodology, limitations, provenance
- `/about`: research context and project links

## Implementation slices
1. **Foundation:** verify TanStack Start static export/prerender + GitHub Pages subpath compatibility against current docs; record ADR-0002 with evidence and alternatives (Astro/static fallback if incompatible). Set up CI checks before deployment.
2. **Editorial shell:** responsive typography, navigation, credits, provenance, sources, accessible scrollytelling. Apply proposed palette, record contrast checks and screenshot review.
3. **Index artifact:** deterministic 20–50-document corpus and query fixtures, explicit rank explanations; separate staged demo from measured evaluation. No live agent browsing at query time.
4. **Community artifact:** create a bounded interaction sketch of Switchboard vs Frequency Receiver vs Overlays. Select on reader comprehension and ability to preserve attribution; only then implement fixture-backed three views.
5. **Convergence:** embed br-ai-nstorm-derived problem map or source-linked projection; show this article's own structured index record. No private data import.
6. **Publish gate:** browser verification at mobile/tablet/desktop, keyboard, reduced motion, route refresh, source links, build and GitHub Actions output. Explicit approval before public deployment or ATProto posting.

## Acceptance
- The narrative stands alone without interactive enhancements.
- The two artifacts communicate different underlying behaviours.
- No fabricated real users, votes, comments, tests, or live search results.
- All sourced claims link to originals; borrowed design references are attributed, not copied.
- GitHub Pages routes and assets work at `/postack-underflow/` if static output is verified.
- Visual quality reviewed at 390, 768, 1440 widths; keyboard/reduced motion verified.
- Static site, no auth/database/server until requirements justify them.

## Decisions still open
- Community artifact selection.
- TanStack Start static compatibility and fallback.
- Exact editorial copy, visual sign-off and publication timing.
- ATProto Lexicon interoperability and whether/when to add real write actions.

## Dependencies
Design source: `docs/design/ART-DIRECTION.md`. Research: `docs/PROBLEM.md`, `docs/CONCEPT.md`, `docs/PROVENANCE.md`. Working agreement: root `AGENTS.md` on the development-practice branch (stacked PR). No Weavr mission is created or dispatched.
