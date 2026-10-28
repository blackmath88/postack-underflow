# Four Words: method and results (run v1, 2026-10-28)

**Question (H1).** Do offline, structured problem–solution records retrieve the right source for short queries more often than plain keyword search over the same sources?

**Short answer.** On this corpus, in one run: yes, clearly, with one instructive failure. The test is small and friendly, so the result does not generalise.

## Corpus
- **30 public sources** on one problem area: publishing a static site under a GitHub Pages subpath. The topic was chosen because this project had just met the problem itself.
  - **Documentation:** 22 docs, from Vite, GitHub Docs, TanStack Router, React Router, Astro, Next.js, SvelteKit, Create React App, Vue Router, Angular, Jekyll, Gatsby and MDN.
  - **READMEs:** 3, from `actions/deploy-pages`, `actions/upload-pages-artifact` and `rafgraph/spa-github-pages`.
  - **GitHub issues:** 4 (vite#8073, vite#9119, next.js#15588, upload-pages-artifact#129).
  - **Manifest:** [`corpus/sources.json`](../../corpus/sources.json).
- **Pinning.**
  - Files are pinned to the newest commit touching the path on 2026-10-28.
  - Issues are pinned to their `updated_at` timestamp, because issues are not versioned.
  - Snapshots are hashed in [`corpus/snapshots.lock.json`](../../corpus/snapshots.lock.json).
- **Licences.**
  - Recorded per source: mostly MIT; GitHub Docs content is CC-BY-4.0; MDN prose is CC-BY-SA-2.5; issue text is user content under GitHub's Terms of Service.
  - Source text is not redistributed. The shipped index contains term statistics, our paraphrased records and links.
- **Selection.** Sources were chosen and pinned by an AI research agent from a candidate list, then verified by fetching. The candidate list was written for coverage of the topic, not to favour either system.

## Queries and labels
- **27 queries of at most four words**, phrased the way a developer with the problem might type them, e.g. `refresh gives 404`, `disable jekyll`, `artifact too large`. File: [`corpus/queries.json`](../../corpus/queries.json).
- **Binary relevance labels.** A source counts as relevant if its content would let a reader fix the described problem. Queries have between 1 and 6 relevant sources.
- **Timing.** Written and committed (`619bd6d`) after the sources were pinned, but **before any record existed and before any ranking ran**.
- **Main weakness.** The same project, and the same implementing agent, wrote both the queries and the labels. The labeller knew the source summaries, which can make queries easier for everything.

## Records
- **One record per source**: problem, aliases, symptoms, context, solution, evidence, limitations, related approaches, controlled terms and extraction provenance. File: [`corpus/records.json`](../../corpus/records.json); schema in [`src/lib/records.ts`](../../src/lib/records.ts).
- **Writer.** A separate AI agent instructed not to read the queries, the evaluation script or the results. It reported that it did not, and saw no query text. Records were committed before the first ranking (`git log corpus/`).
- **Review.** No person has reviewed the records yet; each one says so.

## Systems
Both systems share one tokenizer: lowercase, alphanumeric tokens, a small stopword list, plural folding only. Both use the BM25 family with k1 = 1.2 and b = 0.75. Code: [`src/lib/retrieval.ts`](../../src/lib/retrieval.ts).

| System | Indexed text | Scoring |
|---|---|---|
| `baseline` | full raw text of each source | BM25 |
| `structured` | record fields | BM25F, weights problem 3, aliases 2, symptoms 2, terms 2, context 1, solution 1 (fixed before the run) |
| `structured-without-aliases-symptoms` | record fields minus aliases and symptoms | ablation, same weights |

## Results

| System | Recall@1 | Recall@5 | MRR@10 | Mean query time (Node) |
|---|---|---|---|---|
| Plain keyword search | 40.4% | 70.5% | 0.742 | 0.039 ms |
| Problem-oriented index | 56.0% | 87.2% | 0.950 | 0.062 ms |
| Ablation without aliases/symptoms | 49.5% | 82.3% | 0.892 | 0.041 ms |

- **Paired comparison.** By reciprocal rank of the first relevant source, the structured index was better on 10 queries, worse on 1, and tied on 16.
- **Source data.** Full per-query output, including the top three results and any unknown terms: [`results/four-words-v1.json`](../../results/four-words-v1.json).
- **Build cost.** The index was built in about 50 ms. The artifact is 448 KiB and contains 3,020 baseline terms.
- **Not tested.** No significance testing was done; with 27 queries it would mean little.

### Where it helped
The largest gains came where the problem appears as a symptom inside a long document about something broader:

| Query | Plain search: first relevant at rank | Structured: first relevant at rank |
|---|---|---|
| `blank page github pages` | 15 | 1 |
| `trailing slash index html` | 13 | 1 |
| `custom not found page` | 9 | 1 |
| `site shows 404 everywhere` | 6 | 2 |
| `artifact too large` | 4 | 1 |

### Where it failed
**`css missing after deploy`** is the essay's own opening example. Plain search ranked a relevant source first; the structured index ranked one only seventh.

- **Vocabulary.** The records for the base-path fix (Vite's deploy guide, vite#8073) describe the symptom as a blocked JavaScript module and missing assets, never as missing CSS.
- **Weighting.** The generic words left in the query, *missing*, *after* and *deploy*, then matched heavily weighted fields of an unrelated record. The top result was the dotfiles issue.

The failure is the clearest finding of the run. A structured index is only as good as the vocabulary its writers anticipated, and field weights amplify generic words. The explanation panel in the interface makes this visible: the top hit matched only on *after*, *missing* and *deploy*.

### What the ablation suggests
The aliases and symptoms fields account for some of the gain (MRR 0.892 without them, 0.950 with them). Most of the gain, though, comes simply from indexing a short, plain statement of problem and solution instead of a whole document.

## Threats to validity
- **Topic.** One narrow topic and 30 documents. All but one document is labelled relevant to at least one query, which is unlike real search.
- **Authorship.** The same project wrote queries and labels; one AI agent wrote all records; no human has reviewed them.
- **Labeller knowledge.** The labeller knew the source summaries when writing queries.
- **No real users.** No query comes from anyone who has not seen the corpus.
- **Corpus scale.** The baseline is disadvantaged by long documents that cover many topics. That is realistic, but a passage-level baseline (chunked raw text) would be a fairer comparison and has not been run.
- **Timing.** Latency was measured in Node on one machine and says nothing about scale.

## Next steps that would make this a real test
1. Collect short queries from developers who have never seen the index. For example, ask people how they would search for each issue's symptom before showing them anything.
2. Add a passage-level BM25 baseline, and possibly a hybrid embedding baseline.
3. Have a person review a sample of records against their sources, and report the error rate.
4. Grow the corpus with off-topic and near-duplicate documents.
5. Rerun from a clean clone (`npm run corpus:fetch && npm run index && npm run evaluate v2`) and keep every run's results.
