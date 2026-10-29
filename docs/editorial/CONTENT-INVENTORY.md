# Content inventory — making the story lighter

**2026-10-28 · branch `feat/irresistible-story`.** This file records which content stays on the surface of each page, which moves to a margin note or to the archive, and which is removed as duplication. The decisions came first; the word count followed from them. Frozen Four Words v1 data and its results were not changed. Neither was Motte (`src/features/motte/`).

The full text of the pages before this pass is kept in [`previous-surface/`](previous-surface/README.md), so any cut passage can be brought back in its original wording.

## The three levels
| Level | What it holds | Where it lives |
|---|---|---|
| 1 · Story | The narrative, one example per idea, the turning points and the four experiments | The five story routes |
| 2 · Margin | Explanations, history, source context, counterpoints, research observations. Each opens from a phrase without moving the page. | `src/content/margin.tsx`; opened by `<Ref id>` |
| 3 · Archive | Full results, method, protocol inventory, history, the knowledge record, provenance | `/archive/`, `/archive/four-words/`, `/archive/community/`, `/archive/history/`, `/notes/` |

Each margin note carries a question as its title, a kind, an evidence status, its sources and an optional link into the archive. Every note is used exactly once (see `tests/margin.test.ts`). The archive index lists all notes, so none depends on the story to be found.

## Page by page

### `/` The story (Movements I–III)
| Content | Decision | Now |
|---|---|---|
| Photo frame, Wes, the repository, strangers returning notes | **Keep**, rewritten as short beats around one large line | Surface; plus a five-step "route" visual |
| Episode details (AI models said no; Android hunch) | Keep the one-line version; the detail moves to a margin note | `episode` |
| What the repository contains; how it was identified | Margin | `frameRepo` (links to CASE-PHOTO-FRAME.md) |
| Pull request and issue counts, before-episode counts | Margin plus archive | `frameCounts`; full tally specimen on `/archive/#photo-frame` |
| "For agents" rules; agent-mention sample | Margin | `forAgents` |
| CJ's worry and the hosts' pushback (paraphrase) | One question on the surface; the paraphrase moves to a margin note | `cjWorry` |
| "Someone had already done the work. The trick was finding it." | **Keep** as a statement | Surface, with `googleSo` (new, sourced to Google and Stack Overflow) |
| Scrolly, four steps | **Keep** interaction and diagram; one idea per step; jargon removed | Surface |
| Lumpesammlig and stacked-PR self-examples | Margin | `ownExample` |
| Retrieved vs reconstructed knowledge (one paragraph) | One sentence on the surface; the paragraph moves to a margin note | `sameCode` |
| "This is not nostalgia" paragraph | Kept as a phrase; the argument moves to a margin note | `notNostalgia` |
| Two-problem comparison **table** | **Replaced** by a two-question pair visual | Surface |
| Finding and Keeping paragraphs | One line each in the pair; the detail moves to margin notes | `findingFrame`, `keepingCost` |
| Hypothesis that each problem shows the other | Margin, labelled as a hypothesis | `eachThroughOther` |
| Other problems (applies, verified, documented…) | Margin | `otherProblems` |
| "Not affiliated" notice | Margin (`cjWorry`), footer and About page | — |

### `/indexing/` The Impossible Index
| Content | Decision | Now |
|---|---|---|
| "Everything is filed by where it lives", GitHub Atlas | Margin | `githubAtlas` |
| "Indexing as work done before the question" | Archive | `/archive/four-words/` "Why index before the question" |
| What an index adds; doc2query | One sentence on the surface; the rest moves to a margin note | `whatIndexAdds` |
| **New opening:** "Same words. Different problems." | **Surface**, before any mechanism | The Disputed Neighbour now comes first. The surface says the index gave both reports the same *label* (`asset-404`); the shared *heading* is the essay's hypothetical claim. |
| Source layer vs index layer | Margin | `rawVsAuthored` |
| Controlled term `asset-404`; the source never says 404 | One sentence on the surface; the explanation moves to a margin note | `controlledVocab` |
| Four Words experiment | **Keep** | Surface; header shortened |
| Results table, disagreement table, ablation, audit, method, reproducibility | Archive | `/archive/four-words/` (`#results`, `#reading`, `#method`, `#reproduce`, `#limits`) |
| Headline result | One sentence on the surface (25 vs 17 of 27), stated as one small test | `result` |
| Words the writer added | One sentence on the surface; the list moves to a margin note | `injected` |
| "A description can be very findable and slightly false." | **Keep** as a statement | Surface |
| Card catalogue history (reported, PR #5) | Margin, marked not independently verified | `cardCatalogue` |
| BM25/BM25F, weights | Margin plus archive | `ranking`; weights on `/archive/four-words/#method` |
| "What this does not show" | Two sentences on the surface; the full text moves to the archive | Surface plus `/archive/four-words/#limits` |

### `/community/` The Switchboard
| Content | Decision | Now |
|---|---|---|
| **New opening:** an answer improved by others | **Surface**, as a four-step thread visual, labelled an illustration | `illustration` |
| Stack Overflow signals **table** | Margin summary plus archive table | `soMechanisms`; `/archive/community/#signals` |
| Photo-frame maintenance paragraph | One sentence on the surface; the counts move to a margin note | `frameMaintainer` |
| Where the conversation went (hypothesis) | One sentence on the surface; the argument moves to a margin note | `whereJudgement`, `onePlatform` |
| Two-layer model | One question on the surface; the model moves to a margin note and the archive | `twoLayers`; `/archive/community/#model` |
| Switchboard history (reported, PR #5) | Margin, marked not independently verified | `switchboardHistory` |
| Switchboard experiment | **Keep** | Surface; header shortened |
| Fixtures are invented | **Surface** sentence plus a margin note | `fixtures` |
| Model proposal vs author statement | One sentence on the surface; the line styles move to a margin note | `connectionNotEndorsement` |
| The operator leaves | **Keep** as a statement | Surface |
| Offline and deleted records; power of the popular view | Margin plus archive | `portabilityLimits`; `/archive/community/#limits` |
| ATProto inventory **table** and protocol details | Archive | `/archive/community/#protocol`; `atproto` note on the surface |

### `/convergence/` The Problem Desk
| Content | Decision | Now |
|---|---|---|
| Two framing paragraphs | Cut to one paragraph of four short sentences | Surface |
| Problem Desk | **Keep**; the long in-component explanation is cut to one sentence | Surface |
| "True by construction", circularity, baseline rank 1, dotfiles | Margin | `byConstruction` |
| Maintenance and review; photo-frame maintainer | Two sentences on the surface plus a margin note | `review` |
| Hypothesis statement | **Keep**, with its Hypothesis label | Surface |
| Self-correction example | Margin | `selfCorrection` |
| "What is real today" ledger | Archive | `/archive/#real` |
| Fixture disclaimer | **Keep**, one sentence | Surface |

### `/afterword/`
| Content | Decision | Now |
|---|---|---|
| Self-reflective framing | **Keep**, shorter | Surface |
| Research history (12 entries) | Archive | `/archive/history/#history` |
| Knowledge record and JSON download | Archive | `/archive/history/#record` |
| "What building it changed" (four paragraphs) | Four one-line items on the surface; the full text moves to the archive | `/archive/history/#changed` |
| Metaphor boundaries | Margin | `metaphorLimits` |
| What we would test next | One sentence on the surface; the detail moves to a margin note | `nextTests` |
| Closing question | **Keep** | Surface |

## Duplication removed
- The scrolly's step text, its caption and a following paragraph each explained "agents repeat the work". The step now says it once.
- Photo-frame counts appeared in the opening tally, on the community page and in the afterword. They now live in one note (`frameCounts`) and one archive figure; the community note reads the same data file.
- "Reported, not independently verified (PR #5)" appeared as a separate aside on two pages. It now sits inside the two history notes it qualifies.
- The "What is real today" ledger and the Four Words method were each reachable from two places. Each now has one home in the archive.

## Measured effect
Visible prose on the story routes, measured at 1440 px by `scripts/measure-surface.mjs`. The count covers paragraphs, list items, headings and captions outside tables, experiments and figures; closed notes are hidden, so they do not count.

| Route | Before | After | Change |
|---|---:|---:|---:|
| `/` | 1,422 | 722 | −49% |
| `/indexing/` | 1,575 | 538 | −66% |
| `/community/` | 1,123 | 505 | −55% |
| `/convergence/` | 492 | 259 | −47% |
| `/afterword/` | 1,433 | 252 | −82% |
| **Story total** | **6,045** | **2,276** | **−62%** |

Without the afterword, whose history moved wholesale to the archive, the reduction is 56%. That is beyond the 40–50% target. The reader review (`docs/REFLECTION.md` §7) checked that each turning point is still visible on the surface. Total page height at 1440 px fell 36%, from 45,643 to 29,187 px. Tables on the story routes went from 5 to 0.
