# Pilot 001 — Photo Frame Commons

**Status:** approved exploratory direction; implementation not yet started.  
**Source project:** https://github.com/wesbos/photo-frame-dashboard  
**Source inspiration:** https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript  
**Related work:** https://github.com/blackmath88/br-ai-nstorm · https://github.com/blackmath88/github-atlas · https://github.com/blackmath88/lumpesammlig

## Why this pilot

The laboratory's 60 executable interaction sketches are not the sixty real-world pilots originally intended. Preserve that work as an optional lab, but **do not treat it as the project's primary roadmap**. This pilot builds one real end-to-end Postack tool, using a public project with actual contributors, issues, PRs, source code and documentation.

**Research question:** Can a real repository's scattered problem-solving history be made discoverable, inspectable and discussable through a source-grounded index, a br-ai-nstorm-style collective sensemaking view and a portable-publication projection?

Postack is an open experiment, not a product pitch. The objective is a usable instrument that can change our understanding. No claims about general performance, community adoption or federation are implied.

## Visitor journey

1. Open the Photo Frame Commons and understand the project and its public provenance.
2. Ask a natural problem question, or browse actual problems. See indexed problems, attempted solutions, unresolved cases, evidence and applicability.
3. Open a problem and inspect the source-linked GitHub issues, PRs, commits and documentation.
4. Switch to a br-ai-nstorm-derived problem map: see questions, approaches, evidence, contradictions, corrections, and source-declared versus proposed connections.
5. Compare the same contributions in a discussion/thread view and a map. Understand what each projection adds or omits.
6. Inspect an ATProto/Standard.site **read-only research adapter or explicitly labelled fixture**: show how independent authored posts could join the same problem without being copied into Postack ownership.
7. Propose a local classification or relation correction, preview the change and see the original source remain untouched. No public write or canonical acceptance.
8. Follow direct links back to the authoritative source and see how the index was built.

## Source and indexing boundary

Start with a **bounded, reproducible snapshot** of wesbos/photo-frame-dashboard using public GitHub API/CLI access. Record snapshot timestamp, commit SHA, issue/PR numbers, source URLs, authors, timestamps, revision/update markers, licensing and pagination coverage. Handle rate limits, missing resources, edits, redactions, duplicates and unavailable discussions honestly.

Index a curated set of actual technical problem threads, including resolved and unresolved cases. Preserve raw material and its provenance separately from authored problem descriptions. Extract symptoms, context, attempted approaches, fixes, verification, version/hardware scope, open questions, and uncertainty **only where evidence supports them**. Mark unsupported or inferred claims explicitly. Avoid generating a fictional public conversation.

Use existing Four Words infrastructure as a reference, not as a dataset to rewrite. **V1 corpus, records, queries, labels and measured results stay frozen.** New corpus, manifest, indexes and evaluations are separately versioned. Retrieval should be cheap, deterministic and inspectable at query time; no roaming agent required per query.

## br-ai-nstorm adaptation

The source project already supports repository adoption via `brainstorm.config.json`, a deterministic Markdown extractor, a static Level-1 view and an optional Level-2 shared room. See https://github.com/blackmath88/br-ai-nstorm/blob/main/docs/ADOPTION.md and its README. **Investigate and reuse those contracts first.** Do not reimplement a generic graph engine or create competing canonical state.

The br-ai-nstorm semantic model distinguishes problem, questions, approaches, evidence, assumptions, contradictions and synthesis. Map and timeline are **derived views**, not source-of-truth. AI may propose relations; it may not silently rewrite shared memory. The Postack pilot should prefer a read-only adapter or static projection of imported public GitHub contributions, with a small local reviewable overlay for proposed relationships.

Keep canonical source content on GitHub. Distinguish author-declared references, deterministic links, editorial annotations and machine proposals. Do not infer author agreement or verified fixes from a merged PR alone.

## ATProto exploration

Investigate current ATProto and Standard.site records and existing reply/recommendation patterns before designing schemas. Begin with a read-only adapter against **public** records where relevant and a clearly marked fixture demonstrating missing semantics. Preserve DIDs, AT URIs, CIDs/revisions, authorship, record type and source links when available. A signed record proves authorship/integrity, not solution truth.

Do not create a new Lexicon, publish records, authenticate accounts, write to third-party services or pretend fixture contributions are live. The pilot should demonstrate a credible *possible* distributed discussion view, including unavailable/deleted source handling and explicit moderation/ranking policy.

## Visual and editorial character

Keep the existing essay and three-level reading model. Add a separate **working tool entry** for this pilot; the essay can link to it but should not become a dashboard. A concrete problem should be the unit of navigation, not the repository file tree. The map should explain relations and evidence, not simply display nodes. Use the Lost & Found Office visual direction, with precise typography, meaningful geometry and playful restraint. Keep source evidence one click away. No generic AI cards or artificial engagement counters.

## Implementation slices

**A — Public corpus:** bounded GitHub snapshot, manifest, reproducible import, provenance and coverage report.

**B — Problem index:** source-grounded records, explainable retrieval, unresolved/ambiguous cases, source inspection.

**C — Collective sensemaking:** br-ai-nstorm adaptation, derived map/thread, inspectable relation types and local corrections.

**D — ATProto projection:** current-protocol research, public read-only adapter or explicitly labelled fixtures, portability and deletion boundaries.

**E — Integrated vertical slice:** one real problem through find → inspect → connect → challenge → preview, with coherent editorial interface and browser verification.

Each slice should be a reviewable PR with tests and honest evidence. Do not stop at planning.

## Evidence and acceptance

A visitor can locate at least one **real documented problem** in the source repository, inspect its original evidence, see why it was classified, navigate real contributions in two derived views, distinguish proposals from facts, and preview a local correction without altering the sources. ATProto integration is labelled accurately as live read-only, fixture, or not implemented.

Compare retrieval to a simple lexical baseline on a small independently checked set if feasible, but do not fabricate performance claims. Include accessibility, keyboard, reduced-motion, 390/768/1440 layouts, Pages base-path, no-JS content fallback and failure states.

## Boundaries

No modification of wesbos/photo-frame-dashboard, br-ai-nstorm, Lumpesammlig or GitHub Atlas without separate approval. No PR merge, production deploy, ATProto write, private-session import, Weavr dispatch or autonomous public posting. No global crawler or premature new backend. Keep 60 UI experiments in /lab/ as a separate archive.

## Open questions

- Does a problem-centric index add useful discovery over ordinary GitHub search and README navigation?
- Which GitHub conversations contain reusable findings versus context-specific investigation?
- Which br-ai-nstorm repository-adoption contracts transfer directly, and where is an adapter justified?
- Can independently authored posts be assembled faithfully without pretending a unified social context exists?
- What happens when the source disappears, changes or contradicts the index?
- Does a source-linked problem page feel like a useful shared place, without owning its contributors?
