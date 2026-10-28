# ADR-0004: The living essay — movements, claim accountability, and a frozen core

**Status:** Proposed, 2026-10-28. Draws on PR #5 and PR #6, which remain open, unmerged proposals.

## Context
The site moves from a narrated proposal to an interactive essay with three new experiments. Three things had to be decided:
- **Structure:** how the pages relate.
- **Claims:** how interpretations are represented without overwriting sources.
- **Frozen data:** how the v1 measurement stays untouched while new experiments read it.

## Decision
1. **Six movements across existing routes plus one new route.**
   - `/` holds the encounter, the lost shortcut and the two problems.
   - `/indexing/` is rabbit hole A, The Impossible Index.
   - `/community/` is rabbit hole B, The Switchboard.
   - `/convergence/` is the Problem Desk.
   - The new `/afterword/` holds the research history, the knowledge record and the closing question.

   Existing URLs keep working.
2. **Claim accountability as the shared unit.** Interpretations are separate records layered over sources:
   - *classification claims* in `src/data/disputed-neighbour.ts`;
   - *relationship claims* (connection contracts) in `src/data/connection-contracts.ts`;
   - *proposed index corrections* in `src/data/problem-desk.ts`.

   Each claim names its proposer, reason, evidence and status.
   - Author-declared relationships must be backed by a reference in the author's record.
   - Model and reader proposals can never be shown as author statements, and model proposals never as accepted. Tests enforce this.
3. **Frozen v1 core.** `corpus/`, `results/four-words-v1.json` and `src/data/four-words-index.json` are read, never written.
   - Experiments share them through `src/lib/four-words-data.ts`.
   - The Problem Desk patches a copy of the records in the browser and rebuilds an index locally.
   - `npm run index:check` and the unchanged results file guard against drift.
4. **Fixture boundaries.** Invented people use reserved `.example` handles and `did:example` DIDs. Hypothetical record types use `example.postack.*`. Every invented element is labelled on the page. Real sources are quoted under 15 words, and a test checks each quotation against its cited snapshot line when snapshots are present.
5. **One relationship model.** The earlier `RELATIONS` and community assembler are replaced by connection contracts. The eight fixture contributions are unchanged.
6. **Visual vocabulary for epistemic status.** Sources, index additions, claims and evidence differ by rule style and by a written tag, never by colour alone. Motion is limited to state changes (cables fading when the operator leaves) and is disabled under reduced motion.

## Alternatives considered
- **A third retro machine for the convergence.** Rejected, as both proposals advise. The desk is a workspace, not an object.
- **Editing the v1 records to fix the audit findings.** Rejected; that would change a published measurement. The fixes belong to a v2 run.
- **Embedding the Lumpesammlig specimens.** Still rejected (ADR-0003). Their principles are credited through `StudyNote`.
- **Merging PR #5 and PR #6 into this branch.** Rejected, because they await their own review. Their ideas are credited through links at their head commits.

## Consequences
- **Page weight.** The Indexing, Community and Convergence pages each load the frozen index artifact (about 69 KB gzipped) when hydrated.
- **No comprehension test yet.** The experiments are demonstrations on fixtures. Comprehension by real readers is untested.
- **Links before merge.** Links to new repository files resolve only after this branch reaches `main`.
