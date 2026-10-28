# Four Words: method and results (run v1, 2026-10-28)

**Question (H1).** Do offline, structured problem–solution records retrieve the right source for short queries more often than plain keyword search over the same sources?

**Short answer.** On this corpus, in one run: yes. But a post-hoc look shows that much of the gain is vocabulary the record writer added. The one loss was partly a labelling mistake. The test is small and friendly, and the result does not generalise.

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
- **Rank 1 correct.** Queries whose top result is labelled relevant: baseline 17 of 27, structured 25, ablation 22. Counted post-hoc from the same per-query output. Recall@1 is capped below 1 when a query has several relevant sources, so it reads oddly.
- **Not tested.** No significance testing was done; with 27 queries it would mean little.

### Where it helped
The largest gains:

| Query | Plain search: first relevant at rank | Structured: first relevant at rank |
|---|---|---|
| `blank page github pages` | 15 | 1 |
| `trailing slash index html` | 13 | 1 |
| `custom not found page` | 9 | 1 |
| `site shows 404 everywhere` | 6 | 2 |
| `artifact too large` | 4 | 1 |

### Post-hoc analysis (after run v1; nothing re-ranked)
An independent review of the run found that the first draft of this write-up misdiagnosed both the wins and the loss. What the data shows:

- **Supplied vocabulary.** Most wins depend on vocabulary the record writer supplied.
  - In 7 of the 10 queries where the structured index won, its first relevant record matched at least one query word that does not occur anywhere in that source's snapshot. The words were `blank`, `underscore`, `refresh`, `found`, `large`, `show`, and `trailing`/`slash`. This was checked with the shared tokenizer against `corpus/.cache`.
  - That is the intended effect of editorial work: records use the words people search with. It is also a risk. The vite#8073 record's alias "blank page … works locally" is not supported by its source.
- **Tokenizer artefact.** One win is partly a tokenizer artefact. Next.js writes `trailingSlash`, which the tokenizer keeps as a single token, `trailingslash`, so the baseline cannot match `trailing slash`. A camelCase-splitting tokenizer would help both systems; it was not used in v1.
- **The loss was partly mislabelled.** The structured results at ranks 2 and 4 for `css missing after deploy` (`angular-router-reference`, `tanstack-router-deploy`) both describe missing CSS after deployment, and neither was labelled relevant.
  - Adding them post hoc would move the structured index's first relevant result from rank 7 to rank 2; the baseline stays at rank 1.
  - The other cause also stands: generic words (*missing*, *after*, *deploy*) matching heavily weighted fields put the dotfiles issue first.
  - The labels were frozen before the run and are not changed. The episode lowers confidence in the labels for every query.
- **Records with known defects.** These are kept as written for v1 and listed for v2:
  - the vite#8073 "blank page" alias;
  - the upload-pages-artifact#129 record overstating agreement that `.nojekyll` is unnecessary, and omitting a counterpoint in the thread.

### What the ablation suggests
The aliases and symptoms fields account for part of the gain (MRR 0.892 without them, 0.950 with them). A short, plain statement of problem and solution already beats whole-document matching on this corpus.

## Threats to validity
- **Topic.** One narrow topic and 30 documents. All but one document is labelled relevant to at least one query, which is unlike real search.
- **Authorship.** The same project wrote queries and labels; one AI agent wrote all records; no human has reviewed them.
- **Labeller knowledge.** The labeller knew the source summaries when writing queries.
- **No real users.** No query comes from anyone who has not seen the corpus.
- **Shared vocabulary.** Queries and records came from the same project and the same model family, which may share vocabulary habits; the supplied-vocabulary finding above is consistent with that.
- **Corpus scale.** The baseline is disadvantaged by long documents that cover many topics. That is realistic, but a passage-level baseline (chunked raw text) would be a fairer comparison and has not been run.
- **Timing.** Latency was measured in Node on one machine and says nothing about scale.

## Next steps that would make this a real test
1. Re-label with a second labeller, starting with q01, and keep the v1 labels for comparison.
2. Collect short queries from developers who have never seen the index. For example, ask people how they would search for each issue's symptom before showing them anything.
3. Add a passage-level BM25 baseline, and possibly a hybrid embedding baseline.
4. Have a person review a sample of records against their sources, and report the error rate.
5. Grow the corpus with off-topic and near-duplicate documents.
6. Rerun from a clean clone (`npm run corpus:fetch && npm run index && npm run evaluate v2`) and keep every run's results.
