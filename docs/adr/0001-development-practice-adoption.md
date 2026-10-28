# ADR-0001: Adopt the portable development-practice baseline

**Status:** Accepted for this repository by the request to implement development-practice standards (2026-10-28). Specific runtime integrations remain proposed.

## Context
Postack Underflow is a new public research prototype. It must preserve human design judgment, evidence and source provenance without copying private operating documents or introducing a second orchestration layer.

## Decision
Use root `AGENTS.md` as a lightweight project-specific adapter to the separately versioned `blackmath88/development-practice` baseline, initially selecting its prototype profile. Keep architectural decisions in `docs/adr/`. Record applicability, actual source revision when resolved, deviations, and test evidence in work handoffs.

## Alternatives
- Copy all practice files into the public repo: rejected due to drift, verbosity and private/public boundaries.
- Rely only on chat prompts: rejected because instructions are not durable in the codebase.
- Introduce a central MCP resolver or automated policy system: deferred; no demonstrated need.
- Use `.agent` as universal standard: rejected; runtime support is not universal.

## Consequences
Agents have a clear entry point and explicit source. Future runtime adapters can stay thin. Access to private canonical practice may be unavailable to external contributors, so the public adapter must be sufficiently actionable on its own; compliance with unseen source versions must never be claimed.

## References
- [Development Practice](https://github.com/blackmath88/development-practice)
- [Adoption adapter](../DEVELOPMENT-PRACTICE.md)
- [Research goals](../EXPERIMENTS.md)
