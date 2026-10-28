# Agent working agreement — Postack Underflow

Read this file, [README.md](README.md), [docs/PROBLEM.md](docs/PROBLEM.md), [docs/CONCEPT.md](docs/CONCEPT.md) and relevant accepted ADRs before changing anything.

## Development practice
This project adopts the **prototype** profile from the separate, versioned `blackmath88/development-practice` repository. Consult that repo's `PRACTICE.md`, `profiles/prototype.md`, and its resolution guidance at the recorded source revision (see [docs/DEVELOPMENT-PRACTICE.md](docs/DEVELOPMENT-PRACTICE.md)). The canonical practice lives there; do **not** copy private source files or silently upgrade its guidance. If inaccessible, report the limitation and use the public project-local adapter.

- Inspect current git branch, open work and relevant source evidence before changes.
- Prefer one runnable, reversible path and minimal dependencies. Do not add auth, a database, an MCP server, tracking or a complex framework without a demonstrated need.
- Treat indexed answers, social signals, AI-derived relations and research hypotheses as **unverified** until supported. Keep provenance and original contributions inspectable.
- Start with real problem and user; avoid aesthetic AI clichés, gradients, glassmorphism, arbitrary cards and decorative complexity. Editorial clarity, disciplined typography, responsive layout, accessibility, keyboard, and reduced motion matter.
- Keep the human-authored article, ATProto identity and account posting, and any private source imports under explicit approval. Do not publish synthetic votes, interactions or benchmark results as real.
- Use narrow feature branches and reviewable PRs for substantive changes; do not merge or deploy without explicit authority.
- Validate actual behavior and report what was not tested. Never invent browser tests, benchmarks, source verification, protocol compatibility or shipping status.

## Local architecture and decisions
Record material architectural choices in `docs/adr/` with context, decision, alternatives, consequences and status. Proposed ADRs do not become accepted just because an agent writes them. See [ADR-0001](docs/adr/0001-development-practice-adoption.md).

## Finish each task
Report changed files, commands/checks actually performed, unverified requirements, known limitations, source revision of practice consulted, and any human decision pending.

This file grants no additional permissions. Repository instructions, runtime permissions and explicit human decisions remain controlling.
