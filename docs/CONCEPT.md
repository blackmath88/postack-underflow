# Concept: a portable problem commons

## Separation of concerns
1. **Authoritative source:** author's website/blog, GitHub repo, issue, or ATProto record. Attribution and licensing stay with the source.
2. **Interoperable records:** problem, solution, annotation, evidence, relation (proposed vocabulary; investigate existing Lexicons first).
3. **Index:** ingestion, normalization, provenance, deduplication, lexical fields, optional embeddings, citations, graph edges, offline scoring features.
4. **Community views:** blog comments, Stack Overflow-like Q&A, Discord-like channels, br-ai-nstorm graph. Views are projections, not separate canonical truths.
5. **Optional AI:** propose topic relations, summarize with citations, surface conflicts; never erase originals or assert verified status without evidence.

## Data flow
```text
Personal blog / Standard.site ATProto ─┐
GitHub code / issues / PRs / docs ─────┼─> ingest -> normalize -> source-linked index
Community annotations / endorsements ─┘                     |
                                                            v
                         deterministic retrieval + ranking + explanation
                                                            |
                              blog / Q&A / channel / graph / agent API
```

## Minimal indexed object (illustrative, not an ATProto Lexicon)
```json
{
  "id": "problem:oauth-refresh-example",
  "problem": "How to refresh an expired OAuth token?",
  "aliases": ["token refresh", "refresh_token expiry"],
  "constraints": ["provider", "SDK version", "security requirements"],
  "solutions": [{"sourceUri": "https://example.org/source", "status": "unverified"}],
  "evidence": [],
  "communitySignals": {"endorsements": 0, "disputes": 0},
  "provenance": {"indexedFrom": "source URI", "retrievedAt": "timestamp"}
}
```
Illustrative placeholders must never appear as genuine search results.

## Ranking
Start with transparent features: text match (BM25), problem/solution fit, source provenance, evidence, community endorsement, maintenance freshness. Never hardcode a universal scoring formula as truth. Calibrate on a labeled query set; publish failures and ablations. Popularity alone is not correctness. Query-time retrieval should not require an LLM.

## ATProto considerations
Use existing Standard.site publication/document records for article publication where available. Investigate existing reply, interaction, recommendation and group conventions before defining Lexicons. ATProto record identity/ownership and data portability do not imply uptime, universal indexing, moderation or correctness. Preserve original AT URIs and DID attribution. A Discord-like client is a *projection* of portable conversations, not a silo.

## br-ai-nstorm integration
The existing project already distinguishes authored/prepared/submitted/reviewed provenance, keeps conflicts visible, and requires human review for curation. An adapter could import external public records as immutable sourced contributions and export explicitly approved annotations; do not create competing canonical state.

## GitHub Atlas integration
Atlas currently maps repos, topics, and ecosystem health using client-side D3. Reuse its visual vocabulary or components, but keep this indexing experiment separate: persistent offline index generation and benchmark requirements differ from Atlas's no-backend design.

## Weavr boundary
Optional future consumer of source-linked knowledge for bounded missions; no mission dispatch or automatic publication from this experiment.
