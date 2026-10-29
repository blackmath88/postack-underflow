# Photo Frame Commons: the problem index (slice B)

**Index version `commons-v1`. 18 problem records over the snapshot described in [COMMONS-CORPUS.md](COMMONS-CORPUS.md). The records were written by an AI agent and have not been reviewed by a person.**

## Four layers, kept apart

| Layer | File | Written by | Committed? |
|---|---|---|---|
| Source text | `corpus/commons/.cache/` | the 221 GitHub accounts | No: gitignored |
| Provenance | `corpus/commons/manifest.json` | the snapshot script | Yes |
| Problem records | `corpus/commons/problems.json` | the record writer, an agent | Yes |
| Corrections | `corpus/commons/corrections.json` | contributors' own statements, located by the record writer | Yes |

**Records.** Each record holds an observable problem or goal, the device and environment, symptoms, approaches with their reported outcomes, open questions, related problems, and the indexing decisions and uncertainties behind it.

**Evidence.** Every claim in a record points at a thread, a comment or a range of lines in a pinned document. Each evidence item has two parts:
- a `quote`, which must be a verbatim substring of its source, at most 25 words;
- a `says` field, which is the record writer's description and is labelled as such.

`npm run commons:records` checks that every reference resolves to the manifest. With the cache present, it also checks every quote against the cited text. At the time of writing 77 quotes were checked.

**Aliases** are search words that the record writer added and that do not occur in the sources. The interface labels them. The Four Words audit found that most of that index's advantage came from words like these, and that some described symptoms its sources never mention.

## What a record does not claim

- **A merged PR is not a universal fix.** Approaches record each report's result: `worked`, `failed`, `untested`, `unreviewed` or `in-review`. The approach's scope names the firmware and hardware where the result was reported.
- **Closed is not solved, and open is not unsolved.** #208 is still open, yet its reporter says they succeeded by a route the thread does not name. #12 was closed as documented, and its reporter added a correction the next day.
- **A status is the record writer's reading**, chosen from seven labels: Documented, Partly solved, Unsolved, No reviewed route, Fixed in code, In review, Declined.
- **The record writer's own relations are labelled.** Relations come in four kinds:
  - **source-declared**, where the author linked the two;
  - **deterministic**, matched from identifiers;
  - **editorial**, the maintainer's curated tables;
  - **machine-proposal**, the record writer's suggestion.

## Retrieval

`npm run commons:index` builds `src/data/commons-index.json` (522 KiB, 94 KiB gzipped). It holds two indexes. Both use the Four Words tokenizer and the same BM25 family, imported from `src/lib/retrieval.ts`; nothing of Four Words v1 was changed.

- **Records:** BM25F over each record's fields. The weights were fixed before any query was run: title 3, symptoms 2, aliases 2, device 1, environment 1, approaches 1, evidence 1.
- **Threads:** BM25 over the full raw text of all 59 issue and discussion threads, the way someone searching the issues would see them.

`npm run commons:index:check` rebuilds the artifact and compares it byte for byte. That check needs the local cache, so CI only verifies that the artifact's recorded input hashes match the committed records.

**Redaction.** Issue #135 publishes a device test-app password. The raw-thread postings drop it before tokenising, and the records do not repeat it. Other identifiers that people posted in threads, such as hashes and product IDs, remain as tokens. The thread text is public on GitHub. The tokens are not, as far as we checked, credentials.

**No benchmark.** The record writer read every thread before writing either the records or any test query, so a labelled query set written now would not be independent. The interface therefore makes no metric claims. It shows the record ranking and the raw-thread ranking side by side for whatever the visitor types, so the difference can be seen query by query.

## What the index adds, and what it does not

**What the maintainer's index already does.** The repository already has a hand-made index: the firmware table and the symptom → fix → reports table in `docs/pf1007l-start-here.md`. Nine records draw on that page. The records do not replace it.

**What the records add:**
1. **Ordinary-language entry.** Someone who does not know the term `ums` can still reach the right row. The cost is aliases written by the record writer.
2. **Records outside the PF1007L page.** Frameo, PF1506, the dashboard and security findings are not in that table.
3. **Disagreement shown as disagreement.** For example, no-HS fixed some units and failed on #98. The table records both, in prose inside one cell. A record gives each report its own outcome.
4. **Corrections that the curated documents have not absorbed.** At the snapshot revision, the table's `-71` row says "one May `20260519` unit". After #12 was closed, its reporter wrote that the same failure happened on a January unit. That comment is not reflected in the row.

**What a first look at the records' search showed.** For the query "error -71 january", plain search over the raw threads already ranks #12 first. So the correction does not make the problem easier to find. It changes the problem's stated scope. That is a narrower contribution than the original Problem Desk hypothesis, which expected corrections to improve discovery.
