# Postack Underflow
**Too much code. Not enough shared knowledge.**

An open research and prototype project about two intertwined failures in the agentic software era: **discovery** (finding problems already solved) and **community** (preserving shared, inspectable knowledge outside one platform).

> The answer may already exist. Why does every agent have to discover it again?

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
**Concept / research scaffold with an editorial site V1 (draft).** No live index, ATProto adapter, comment federation, or measured retrieval benchmark is claimed. This public repo starts with questions and testable hypotheses.

## The site
A narrative-first essay: one observation → two problems → two rabbit holes → one possible convergence. Routes: `/`, `/indexing/`, `/community/`, `/convergence/`, `/notes/`, `/about/`. Built with TanStack Start, React and TypeScript, prerendered to static HTML for GitHub Pages at `https://blackmath88.github.io/postack-underflow/` (deploys from `main` via [`.github/workflows/pages.yml`](.github/workflows/pages.yml); see [ADR-0002](docs/adr/0002-editorial-site-direction.md)).

```bash
npm ci
npm run dev        # development server
npm run check      # typecheck, tests, static build, route/asset validation
npm run preview    # serve dist/client like GitHub Pages at http://localhost:4173/postack-underflow/
```

Content lives in `src/routes/` (prose) and `src/content/` (source registry, artifact contracts). The two interactive studies are developed in Lumpesammlig; see the [artifact integration contract](docs/ARTIFACT-INTEGRATION.md). Verification evidence: [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Principles
Index first, search second · Sources over synthesis · Community without platform captivity · Identity is not correctness · AI proposes, humans adjudicate · Own the content, not the audience · Small reproducible experiments.

## Related work
- [GitHub Atlas](https://github.com/blackmath88/github-atlas)
- [br-ai-nstorm](https://github.com/blackmath88/br-ai-nstorm)
- [Syntax #1050 transcript](https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript)
- [AT Protocol](https://atproto.com/) · [Standard.site](https://standard.site/)

Contributions and critique welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
