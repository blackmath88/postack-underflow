# Postack Underflow
**Too much code. Not enough shared knowledge.**

An open research and prototype project about two intertwined failures in the agentic software era: **discovery** (finding problems already solved) and **community** (preserving shared, inspectable knowledge outside one platform).

> The answer may already exist. Why does every agent have to discover it again?


## Current direction — an open experiment, not a product pitch

**How does knowledge get found, connected, challenged, and remembered?** Postack uses software as a research medium: indexing and community are two rabbit holes, and their possible connection is something to test, not a platform to sell. Read the [updated conceptual argument](docs/CONCEPT-2026-10-28.md), [narrative plan](docs/plans/EXPLORATORY-NARRATIVE-PLAN.md), and [shared-knowledge case-study leads](docs/research/CASE-STUDY-LEADS.md). The existing Four Words evaluation remains frozen.

## Start here
- [The problem and hypotheses](docs/PROBLEM.md)
- [Concept and architecture](docs/CONCEPT.md)
- [Origins and provenance](docs/PROVENANCE.md)
- [Prototype roadmap and experiments](docs/EXPERIMENTS.md)
- [First public essay draft](writing/WE-ALREADY-SOLVED-THIS.md)
- [Artifact integration contract](docs/ARTIFACT-INTEGRATION.md)

## The two tracks
**Indexing:** Build an *offline*, problem-oriented index over public GitHub code, issues, PRs, docs and ATProto articles. Retrieval at query time should be cheap, fast, explainable and source-linked—not an agent roaming repositories. Compare lexical/BM25, metadata, and hybrid ranking; evaluate against labeled queries.

**Community:** Publish knowledge where authors control it (personal blog/Standard.site/ATProto); attach portable discussions, corrections, references, endorsements and disagreement. Render the same underlying contributions as blog comments, forum/channel view, and problem graph. LLMs can propose connections, not silently decide truth.

## A meta demonstration
The first article **“We Already Solved This”** describes the problem while itself becoming a structured, indexable problem record with an embedded br-ai-nstorm map, source links and a portable discussion experiment. The medium demonstrates the thesis.

## Boundaries
This is **not** a replacement for Stack Overflow, a new centralized social network, or a Weavr mission. Weavr may later consume verified knowledge, but execution is not the center. No public publishing, account writes, or harvesting of private agent sessions without explicit authorization. Human authorship, licenses, source provenance, and disagreement remain visible.

## Status
**Research prototype.** One small, measured retrieval experiment (Four Words) and a fixture-only community demonstration. No live search service, ATProto adapter or comment federation exists, and nothing is published to ATProto. This public repo starts with questions and testable hypotheses.

## The site
An interactive essay in six movements: an encounter (a hacked photo frame) → the lost shortcut → two problems → The Impossible Index → The Switchboard → the Problem Desk, ending with an afterword on how the essay was made. Routes: `/`, `/indexing/`, `/community/`, `/convergence/`, `/afterword/`, `/notes/`, `/about/`. Built with TanStack Start, React and TypeScript, prerendered to static HTML for GitHub Pages at `https://blackmath88.github.io/postack-underflow/` (deploys from `main` via [`.github/workflows/pages.yml`](.github/workflows/pages.yml); see [ADR-0002](docs/adr/0002-editorial-site-direction.md)).

```bash
npm ci
npm run dev           # development server
npm run check         # typecheck, tests, static build, route/asset validation
npm run index:check   # shipped index matches committed corpus and records (offline)
npm run browser       # real-browser checks against a Pages-like server (needs Chromium)
npm run preview       # serve dist/client like GitHub Pages at http://localhost:4173/postack-underflow/
npm run smoke -- URL  # check what a deployed site actually serves
```

**Four Words experiment** (index-first retrieval, see [docs/research/FOUR-WORDS.md](docs/research/FOUR-WORDS.md)):

```bash
npm run corpus:fetch  # snapshot the 30 pinned sources into corpus/.cache (needs network and gh)
npm run index         # build src/data/four-words-index.json deterministically
npm run evaluate v1   # write results/four-words-v1.json from corpus/queries.json
```

Layout:
- `src/routes/`: the prose.
- `src/components/`: Four Words, the community assembler and the scrollytelling.
- `src/lib/`: retrieval and the record format.
- `src/content/`: source registry and study lineage.
- `src/data/`: index artifact and community fixtures.
- `corpus/`: pinned sources, labelled queries and records.
- `results/`: evaluation output.
- `knowledge/`: this essay as a structured record.

Decisions: [ADR-0002](docs/adr/0002-editorial-site-direction.md) (framework), [ADR-0003](docs/adr/0003-native-experiments-and-offline-index.md) (experiments, index artifact, fixtures) and [ADR-0004](docs/adr/0004-living-essay-and-claim-accountability.md) (movements, claim accountability, frozen core). What building it changed: [docs/REFLECTION.md](docs/REFLECTION.md). Community research: [docs/research/ATPROTO-COMMUNITY.md](docs/research/ATPROTO-COMMUNITY.md). Verification evidence: [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Principles
Index first, search second · Sources over synthesis · Community without platform captivity · Identity is not correctness · AI proposes, humans adjudicate · Own the content, not the audience · Small reproducible experiments.

## Related work
- [GitHub Atlas](https://github.com/blackmath88/github-atlas)
- [br-ai-nstorm](https://github.com/blackmath88/br-ai-nstorm)
- [Syntax #1050 transcript](https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript)
- [AT Protocol](https://atproto.com/) · [Standard.site](https://standard.site/)

Contributions and critique welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
