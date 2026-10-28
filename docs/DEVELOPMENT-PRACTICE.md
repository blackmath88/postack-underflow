# Development-practice adoption

**Status:** Project adapter, 2026-10-28. This document does not publish or duplicate the private canonical practice.

## Source of development judgment
[blackmath88/development-practice](https://github.com/blackmath88/development-practice) (private) provides the approved/research working baseline, `PRACTICE.md`, and context profiles. Initial adoption was informed by `PRACTICE.md`, `AGENTS.md`, `profiles/prototype.md`, `docs/CONCEPT.md`, and `docs/DECISIONS.md` on its main branch on 2026-10-28. **The exact source commit has not been pinned**, so future agents must resolve and record it before claiming reproducible conformance.

## Selection for this repository
- **Profile:** prototype. Goal: test the indexing and portable-community hypotheses with small runnable experiments, not build a production social platform.
- **Baseline:** development-practice/PRACTICE.md. Read and apply contextually.
- **Skills:** none required by default. Select only a relevant skill for a particular task.
- **Local adapter:** root `AGENTS.md`. Does not replace the original source.
- **Project-specific decisions:** `docs/adr/`. Accepted vs proposed status must remain explicit.

## Authority resolution
Private source practice is a **default**, not a permission grant. Repository-specific requirements and the active task govern local implementation; security, privacy, legal and runtime constraints cannot be waived by style guidance. Unresolved obligation conflicts need a human decision. When the private repository cannot be read, do not fabricate compliance.

## Expected work pattern
1. Inspect current branch, PRs and project documents; read baseline/profile.
2. State the smallest experiment, relevant constraints and an evidence plan.
3. Make bounded changes in a branch; keep drafts and demo fixtures clearly labelled.
4. Check relevant tests, actual UX/keyboard/mobile/reduced motion and provenance paths when tools permit.
5. Hand off changed files, verified evidence, omissions, and open decisions.
6. Propose improvements back to the source practice only after observed correction and review; no automatic learning/promotion.

## Why not vendor-specific files by default?
`AGENTS.md` is the portable first stop. Add `CLAUDE.md`, `.cursor/rules`, or other runtime adapters only where the target runtime actually needs them, and keep each a thin link to this contract. A file named `.agent` has no universal cross-agent semantics.

## Drift check
Before major work, compare this adapter to the latest reviewed source baseline, note the commit and relevant exceptions. Never silently sync private practice into this public repo.
