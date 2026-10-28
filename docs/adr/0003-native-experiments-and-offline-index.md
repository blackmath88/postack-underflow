# ADR-0003: Native experiments, an offline index artifact, and fixture-only community

**Status:** Proposed, 2026-10-28. Awaiting the owner's review in the Phase 2 pull request.

## Context
Phase 2 turns the editorial scaffold into a working research publication. Three choices shape the architecture:

- **The studies.** The two Lumpesammlig studies (012 The Impossible Index, 013 The Switchboard) were merged independently at `23c9c443`. Their reflections produced transferable principles, but their visual development continues separately.
- **The indexing experiment.** It must be reproducible and measurable, and it must not crawl or call a model at query time.
- **The community model.** It must be honest about what ATProto supports today, without publishing anything.

## Decision

1. **Implement Postack's interactions natively; learn from the Lumpesammlig studies and link to them, rather than embed them.** Four Words and the community demonstration are React components in this repository. A small `StudyNote` credits each study, links its live page and its notes at the merge commit, and states the principle carried over.
   - This supersedes the option-1 "mount module" recommendation in `docs/ARTIFACT-INTEGRATION.md`. The specimens stay in Lumpesammlig.
2. **Build the index offline into a committed artifact.**
   - `corpus/sources.json` pins 30 public sources: files to a commit SHA, issues to `updated_at`.
   - `npm run corpus:fetch` snapshots them into a gitignored cache and verifies `snapshots.lock.json` hashes.
   - `npm run index` writes `src/data/four-words-index.json`, deterministically. It holds a BM25 baseline over the raw text and a BM25F index over the structured records.
   - The browser loads that file statically and ranks in under a millisecond per query (measured in Node). There is no network access at query time.
   - CI runs `npm run index:check`, which rebuilds the structured index from the committed records without network access and fails if anything is stale.
3. **Ship derived term statistics, not source text.** The artifact contains postings (term frequencies), our paraphrased records, and links. Snapshots of the sources stay local, because the licences vary: MIT, CC-BY-4.0, CC-BY-SA-2.5, and GitHub's terms for issue content.
4. **Separate evaluation from shipping.** Queries and labels were committed before any record existed (`619bd6d`). Records were written by an agent instructed not to read them. `npm run evaluate` writes `results/four-words-<run>.json`, and the site renders numbers from that file, so the page cannot drift from the measurement.
5. **Community is fixtures only.**
   - Contributions use real NSIDs where a Lexicon exists, and `example.postack.*` where none does (see `docs/research/ATPROTO-COMMUNITY.md`).
   - Every identity uses reserved `.example` and `did:example` names.
   - Relations live in a separate layer, with an origin (author-declared, view-curated or model-proposed) and a reason.
   - No network reads and no publishing.
6. **The essay is a file.** `knowledge/we-already-solved-this.json` is the structured record. Tests validate it, the Convergence page renders it, and it is offered for download. Its publication status is `not-published`.
7. **Real-browser checks in CI.** `npm run browser` uses `playwright-core` with the runner's preinstalled Chrome; locally it uses system Chromium. `npm run smoke` runs after each deploy and checks what Pages actually serves.

## Alternatives considered
- **Embed the Astro specimens in an iframe or a mount module.** Rejected for now. It couples two visual languages that are still developing, and it would import synthetic records into a page that now has a real corpus.
- **Build the index in the browser from raw text at load time.** Rejected. It ships source text, and it makes "prior work" invisible.
- **Use a hosted search service, or embeddings.** Deferred. Neither is needed to test H1 on 30 documents; both add cost and opacity. A hybrid index can be a later ablation.
- **Read real ATProto records.** Deferred. That needs an app view or backlink index, and decisions about moderation. Publishing needs explicit approval.

## Consequences
- **Bundle size.** The Indexing route's bundle includes the index artifact. Its size is reported in `docs/VERIFICATION.md` and should be watched as the corpus grows.
- **Rebuild prerequisites.** Rebuilding the baseline needs network access and the `gh` CLI (issues are fetched through the API).
- **Issue drift.** Issue snapshots can drift, because issues are not versioned. `corpus:fetch` reports drift instead of accepting it.
- **Unreviewed records.** The records have not been reviewed by a human. The site says so on every record.
- **Ownership of interactions.** The Lumpesammlig studies remain the place for metaphor and visual exploration; Postack owns its working interactions.

## References
- [ARTIFACT-INTEGRATION.md](../ARTIFACT-INTEGRATION.md)
- [FOUR-WORDS.md](../research/FOUR-WORDS.md)
- [ATPROTO-COMMUNITY.md](../research/ATPROTO-COMMUNITY.md)
- [Lumpesammlig at the merge commit](https://github.com/blackmath88/lumpesammlig/tree/23c9c443686e5e49138ddd336d27b590421bd605)
