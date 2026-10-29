# Photo Frame Commons — br-ai-nstorm adaptation (slice C)

**br-ai-nstorm pinned at [`a96c2dbb`](https://github.com/blackmath88/br-ai-nstorm/tree/a96c2dbb6fb6caf9cbf648107827fec88e3c0961), contract v0.4. br-ai-nstorm was read and run, and not modified.**

## What was investigated

Read in br-ai-nstorm at the pinned revision:

- `docs/ADOPTION.md`: the adoption ladder, the manifest and the five sync rules;
- `server/domain/types.ts`, `events.ts` and `projections.ts`: the ontology, the event log and the fold;
- `server/adoption/manifest.ts`, `markdown.ts`, `plan.ts` and `static-view.ts`: repository adoption;
- `server/curation/deterministic.ts`: the lexical floor;
- `server/application/contribution-service.ts`: how curator drafts become events.

**Can repository adoption import this repository?** Only its Markdown documents.

- `brainstorm.config.json` could declare one problem space per device guide.
- The extractor would then attribute every unit to `repo:wesbos/photo-frame-dashboard`.
- Most of the knowledge, and all of the disagreement, is in 57 issues and 206 pull requests, which adoption does not read.

So repository adoption does not fit this material as it is. The event model and projection do fit.

## The adapter, and what runs where

| Step | Code | Owner |
|---|---|---|
| Map evidence to contributions, provenance and link proposals | `src/commons/brainstorm/adapter.ts` | Postack, about 290 lines, data mapping only |
| Build events, ids, labels and content hashes | `makeEvent`, `createIdSource`, `deriveLabel`, `stableHash` | br-ai-nstorm |
| Classify each contribution's kind | `inferKind`, the lexical floor that adoption also uses | br-ai-nstorm |
| Propose relations, duplicates and conflicts as each contribution arrives | `proposeDeterministically` | br-ai-nstorm |
| Fold events into canonical state | `project` | br-ai-nstorm |
| Static Level-1 view | `renderStaticView` → `public/commons/brainstorm.html` | br-ai-nstorm |

`npm run commons:brainstorm` sets up a read-only checkout of br-ai-nstorm at the pinned revision in the gitignored cache. It refuses to run if that checkout has local changes. It installs br-ai-nstorm's own locked dependencies with install scripts disabled, then runs under br-ai-nstorm's own `tsx`.

Its TypeScript uses parameter properties, which Node cannot strip, so it cannot run under Node directly. br-ai-nstorm has no licence file, so none of its code is copied here; only its output is committed. The result is `src/data/commons-brainstorm.json`, a br-ai-nstorm v0.4 snapshot with events, projected states and the adapter report. It is reproducible byte for byte with `commons:brainstorm:check`.

## How the four kinds of relation map

| Postack basis | br-ai-nstorm form | Proposed by | Count |
|---|---|---|---:|
| **Source-declared:** a GitHub author linked another thread | `RelationProposed`, `relates`, pending | `importer:github-links`, on behalf of `github:<author>` | 31 |
| **Editorial:** a curated table row cites a report | `RelationProposed`, `supports`, pending | `importer:curated-docs`, on behalf of the repository | 10 |
| **Deterministic:** lexical overlap | br-ai-nstorm's own curator | `curator:deterministic` | 2 |
| **Machine proposal:** the record writer's reading | `RelationProposed` (classification) or `ConflictProposed` | `agent:claude-opus-5-5` | 65 |

Nothing is accepted. In br-ai-nstorm only a person may move a proposal out of `pending`, and no person has reviewed these. Every relation in the snapshot is therefore a proposal, including those the authors themselves declared. That is the most important mismatch.

## Mismatches

These are stated in code as `MISMATCHES` in the adapter.

1. **Markdown only.** Adoption reads files. The knowledge is in conversations.
2. **One author per repository.** `repo:<owner/name>` would erase 222 people, so `authoredBy` is `github:<login>`.
3. **Line-anchored references.** A comment has no lines. Its `path` is `issues/<n>#issuecomment-<id>` with lines `0`, so br-ai-nstorm's static view prints `#L0`.
4. **Excerpts instead of units.** Comment text belongs to its author. Each contribution carries the record's 25-word excerpt, or the thread title.
5. **No relations declared by the author.** br-ai-nstorm derives nothing relational on import. A GitHub author's own "#113 reports your exact symptom" can only enter as a pending proposal. The importer files it on the author's behalf, and it has no more standing than the record writer's guesses.
6. **One timestamp.** `Provenance.timestamp` is when a contribution entered shared memory. When the author said it is lost from the event, so Postack carries it beside the snapshot.
7. **Kind from headings.** Comments have no headings, so the floor is br-ai-nstorm's `inferKind`.

Two things could not be represented at all:

- **Relations between problems:** 12 of them. br-ai-nstorm's relations and conflicts live inside a single problem.
- **The record writer’s own text:** 64 approaches, open questions and indexing notes. `authoredBy` may never be an AI.

## What the real material did to the model

- **The lexical floor classified 65 of 74 real contributions as `claim`.** The record writer disagreed with its reading 58 times, filed as classification proposals. Terse technical reports ("Update: it was the cable.") carry none of the cue words `inferKind` looks for.
- **Lexical curation found two candidate relations; the authors' own links found 31.** On real material, the relations people already declare are the most valuable thing an importer could carry. They are also the one thing the contract will not let it carry as anything but a proposal.
- **Provenance fit well.** `authoredBy`, `submittedBy`, `endorsement` and `participant_review_required` all mapped cleanly to GitHub material. "Inclusion does not mean agreement" is exactly the right default for a pile of unit reports.
- **The no-AI-author rule held, and it bit.** Every sentence the record writer wrote stays outside br-ai-nstorm's canonical state. The map therefore shows sources and proposals, and the Postack record keeps the interpretation. That is the boundary the brief asked for. It also means the most useful summary on the page belongs to neither system's canonical memory.

These findings are about this contract and this one repository. They are not a judgement of br-ai-nstorm in general.
