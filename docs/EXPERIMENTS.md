# Prototype plan — smallest useful evidence

## P0: Editorial showcase
- Draft the essay and a source-linked problem map with branches **Indexing** and **Community**.
- Show the article's own structured problem/solution/evidence metadata.
- Use an editorial, restrained design; accessible keyboard interactions, reduced-motion support, responsive layouts.
- Keep drafts unpublished until explicitly approved.
**Acceptance:** a reader can understand the problem and inspect every source/claim.

## P1: Four Words — index-first retrieval
- Curate 20–50 public source documents spanning GitHub READMEs, issues, PRs and ATProto articles (respect licensing and access).
- Hand-label 15–25 short problem queries and relevant answers *before* scoring.
- Offline extract normalized problem–solution records; keep raw source URI and snapshot revision.
- Compare baseline keyword/BM25, metadata-enhanced BM25, and optional hybrid index.
- Report Recall@5, MRR@10, query latency, index-build cost, freshness, and failure cases.
- No LLM browsing at query time.
**Acceptance:** reproducible baseline, corpus manifest, ranking explanation, and honest negative results.

## P2: Portable discussion
- One public article, three views: comments, channels, graph.
- Preserve authorship, revisions, replies, disagreements and source URIs.
- First use fixture records, then real ATProto reads; only enable authenticated publishing with explicit review.
- Check moderation, spam, deletion/tombstones, identity changes and availability behavior.
**Acceptance:** no silent data divergence or attribution loss across views.

## P3: Community signals
- Prototype recommendations/endorsements and corrections as attributable records where interoperable standards exist.
- Evaluate whether signals improve retrieval quality; include manipulation/brigading and cold-start cases.
**Acceptance:** demonstrable signal effect or a documented null result.

## Out of scope initially
New social network, full Discord clone, global GitHub crawl, universal reputation score, autonomous public posting, private-chat harvesting, Weavr mission execution.

## Decision gates
Do not implement new Lexicons until existing conventions are checked. Do not publish the essay or ATProto records without human approval. Do not present synthetic demo data as live community activity.
