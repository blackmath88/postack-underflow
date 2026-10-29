# ADR-0007: Photo Frame Commons as a static instrument over pinned public sources

**Status:** Proposed, 2026-10-29. Branches `pilot/commons-a-corpus` → `-b-index` → `-c-sensemaking` → `-d-atproto` → `-e-integrated`, as stacked draft PRs #19 onwards.

## Context
Pilot 001 (`docs/pilots/PHOTO-FRAME-COMMONS.md`) asked for one real end-to-end tool over a public repository, wesbos/photo-frame-dashboard. The tool had to cover discovery, interpretation and correction. It had to reuse br-ai-nstorm rather than recreate it, try ATProto honestly, and add no database or live service.

## Decision
1. **Four layers with separate owners.**
   - Source text stays in a gitignored cache.
   - Provenance is committed (`corpus/commons/manifest.json`).
   - Authored records are committed and marked agent-written and unreviewed (`problems.json`).
   - Contributors' own corrections are committed (`corrections.json`).
   - Quotes are checked verbatim against the cache.
2. **A separately versioned index (`commons-v1`).** It uses the shared tokenizer and ranking from `src/lib/retrieval.ts` and does not touch Four Words v1. It has two indexes: records, and the raw issue threads, shown side by side. No benchmark is claimed.
3. **br-ai-nstorm by contract, not by copy.**
   - Postack holds a data-mapping adapter (`src/commons/brainstorm/adapter.ts`).
   - br-ai-nstorm's own code, at pinned `a96c2dbb`, builds events, curates and projects. It runs from a read-only checkout under its own toolchain.
   - Only its output is committed.
   - Every relation, including those the authors declared, stays a pending proposal. Postack separates them by who proposed them.
4. **ATProto read-only and replaceable.**
   - A snapshot script reads public backlinks, search and the authors' own PDSes.
   - A pure projection attaches records to problems by their links, never by wording.
   - Fixtures use `did:example:` and are labelled.
5. **One route family, `/commons/`, linked from the header and the footer.** The essay text is unchanged. Problem pages are prerendered through the index's links. Their loader and head read only `commons-heads.json`, and each route's data loads with its own code-split component.

## Alternatives considered
- **Import through br-ai-nstorm's repository adoption.** Rejected. It reads only Markdown files and attributes everything to the repository. See COMMONS-BRAINSTORM.md.
- **Vendoring br-ai-nstorm's domain code.** Rejected. It has no licence file. Running it pinned keeps it the authority.
- **A live GitHub or ATProto reader in the browser.** Rejected for now. It depends on rate limits and availability, and it would republish more text than the excerpt rule allows. The offline snapshot is labelled with its date.
- **A force-directed graph.** Rejected by the brief. A fixed-row switchboard keeps sources in reading order and makes each connection's reason inspectable.

## Consequences
- **What the visitor can do:** find a real problem, read its sources in the authors' words, inspect why contributions are connected, unplug machine proposals locally, and preview a real correction, with the sources unchanged.
- **Refreshing needs the cache.** Rebuilding the index or the br-ai-nstorm snapshot needs the local cache (`commons:snapshot`) and the pinned checkout. CI checks structure and input hashes, not quotes.
- **The record writer is an AI.** Until a person reviews the records, every status and alias is a proposal.
- **Republication remains an open owner decision:** excerpts, tokens and the cache. See COMMONS-REFLECTION.md.
