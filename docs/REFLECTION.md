# What building the living essay changed

**2026-10-28 · living-essay slice.** Notes on what implementation revealed, kept separate from what we hoped it would show. This document adds no new measured results: the only measurement in the project is still Four Words v1, which is frozen.

## 1. The opening contradicted the premise
PR #6 recorded the photo-frame story as an unverified lead. Tracing it led to [wesbos/photo-frame-dashboard](https://github.com/wesbos/photo-frame-dashboard); see [CASE-PHOTO-FRAME.md](research/CASE-PHOTO-FRAME.md).

We expected an example of a commons being bypassed by private agent sessions. What we found was a repository that addresses agents directly, gives them rules, and asks them to send findings back. On 2026-10-28 it had 201 pull requests, 150 of them merged.

**What changed:** the essay no longer argues that agents drain the commons. It asks what made this one work: an explicit route back, and a maintainer who reviews what arrives. That question sharpened the community half more than any fixture did.

**Caveat:** we identified the repository by inference; the episode does not name it. Our "agent" count is a keyword scan of PR descriptions, not evidence of who wrote what.

## 2. A findable description can mislead, and the data already showed it
The Disputed Neighbour was planned as an illustration. Building it from frozen v1 records turned up a concrete case:
- **A term the source never states.** The vite#8073 issue never says "404"; it reports a JavaScript module blocked as `text/html`. The shared controlled term `asset-404`, and an alias about a "blank page", are the index's additions.
- **A query that rewards them.** The probe `vite blank page github pages` ranks that record first through "blank". The probe `vite js file 404 github pages` places it second, matching "404".
- **A false flag of our own.** Our first draft also flagged the record's "Works fine locally" symptom as unsupported. An independent review found "works just fine on local" in the issue; the tokenizer had kept *local* and *locally* apart, and so had our check. The essay made the error it describes, and only rereading the source caught it.
- **Two different problems filed together.** The two records share the controlled term `asset-404` and rank 1 and 2 for a short query. Their causes and fixes differ, and the difference is visible in a single fact: whether the failing URL contains the repository name.

**What changed:** the right move was not a better ranking. It was a question asked before offering a fix, which we built as the URL check. Classification needed an applicability test, not more vocabulary.

## 3. The Problem Desk moved the convergence from indexing to review
The desk shows a correction improving retrieval: rank 7 → 2 for `css missing after deploy`. The inferred half of the correction moves the ranking exactly as much as the half closer to its source. A reviewer rightly pointed out that this is true by construction: the same words go into two similar records, and a ranking cannot see provenance. The added symptom also nearly restates the query. Plain keyword search already had this query at rank 1. The dotfiles record stays first in every case, because generic words still dominate.

**What changed:** not a discovery, but a consequence made hard to ignore. A retrieval number cannot distinguish a supported correction from a plausible guess. The value of a community layer, if it has one, is in the review: who accepted a change, on what evidence, recorded where. This is consistent with the v1 audit finding that writer-supplied vocabulary drove most gains. It is not yet tested anywhere beyond one fixture.

## 4. Connections needed lifecycles, and the switchboard metaphor needed a boundary
The earlier assembler had three on/off layers. Writing contracts with histories forced distinctions the toggles had hidden:
- **Different authority:** an author-declared reply cannot be "accepted" or "disputed" by the view at all.
- **Different lifecycle:** a model's suggestion can be proposed and disputed, but never accepted as the author's word.
- **Some withdrawals belong to the author:** a deleted record is a withdrawal only its author could make.

Keeping a withdrawn editorial mistake visible (contract k8) felt more honest than deleting it.

PR #5 warned that a switchboard routed live speech and kept nothing. Saying so on the page made the experiment clearer: persistent records are our change to the object, not a property of it.

"The operator leaves" became more precise during building. Once every drawn line is gone, the authors' *own* references still sit inside their records. The view loses its reading; the replies still say what they reply to.

## 5. Things that did not work, or are not tested
- **Layout mistakes.** The first layout put movement content in the wrong grid columns. The original visual specimen of the lost-shortcut diagram pointed agents at the old public thread, contradicting the prose (fixed in Phase 2).
- **No comprehension test.** No reader has used the three experiments. PR #5's acceptance questions ("What did the source say? Who assigned this?") remain unanswered by real people. A plain-table comparison, which PR #5 recommends as a baseline, was not built.
- **Untested components.** The URL check is a heuristic for two cases, not a diagnostic tool. The reader-proposal form keeps state only in the tab.
- **Not adopted.** The serif reading typography PR #5 suggests remains an open visual experiment. This slice kept the approved sans.

## 6. What we would test next
1. **Comprehension against a plain baseline.** Give five readers the Disputed Neighbour and the same content as a plain table, and ask PR #5's five questions.
2. **Four Words v2.** Use a second labeller, queries from people who never saw the index, and a passage-level baseline. Count an alias as supported only if its words occur in the source.
3. **A review step on the desk.** Require evidence before a preview can be "accepted", and record the decision as its own attributable record.

## 7. Making the story lighter (editorial pass, 2026-10-28)
The brief: make people actually read it. The essay asked for too much technical patience before anything was enjoyable. This pass moved material between three levels without changing the evidence. The decisions are recorded in [editorial/CONTENT-INVENTORY.md](editorial/CONTENT-INVENTORY.md).

**What the process revealed:**
- **Most of the cut prose was qualification, not argument.** On the indexing page the argument fitted in about ten sentences. The other 1,000 words were method, caveats and tables, all of them necessary, but not on the way in. Moving them made the experiment's surprise (same words, different problems) the opening rather than the twelfth paragraph.
- **The surprise was already in the data.** The Disputed Neighbour had been placed after the method, as an illustration. Leading with it reversed the page's logic: the reader meets the problem before the mechanism that explains it.
- **Margin notes impose discipline on the prose.** On a phone a note opens under its phrase, so a noted phrase has to end a clause. Several sentences became shorter and clearer in consequence. Our first version underlined whole sentences and made every line look like a link. Notes now hang off short clause-final phrases.
- **The router fought the reading position.** Writing the open note into the address made TanStack Router scroll to it, which broke the one promise the notes make. Each note carries its own deep link instead (ADR-0005).
- **Margins collide with wide figures.** A note that would cover an experiment moves up beside its paragraph, or opens inline. Notes just above a figure open inline at every width. This is a layout limit we accept rather than hide.
- **Tables became pictures, where a picture said the same thing.** The two-problem comparison became a pair of questions. The Stack Overflow signals table became a four-step thread of an answer improving. The tables are still in the archive for readers who want the costs as well as the benefits.

**What we did not do:**
- **No reader has tested it.** Whether the lighter surface is actually easier, and whether people open notes, is unmeasured. The comprehension test in §6 still stands.
- **The 40–50% target was overshot.** Visible story prose fell 62%, or 56% without the afterword, whose history moved wholesale to the archive. We checked each turning point by hand rather than by number.

**What the independent review caught.** Shortening made the surface flatter than the evidence in exactly the ways the essay warns about:
- **"Filed under one heading" was the essay's own hypothetical claim.** The index only gave both reports the same controlled term. A short sentence had turned an illustration into a fact.
- **"The guess helped exactly as much" read as a finding.** The long version had said it was true by construction; the short one dropped that. The surface now says "By construction". The note's evidence label moved from *measured* to *our reading*, because the correction is invented.
- **The desk's opening query was the one query the description index lost.** That fact had moved entirely into a note. It is back on the surface.
- **Smaller overstatements:** "owned their own line", "any shared way to endorse", "did not type the notes themselves", and the underscore case's confirmed fix (renaming files; `.nojekyll` the reporter called "not a good solution").

Each correction cost a few words. The lesson: compression strips hedges first, so a lighter surface needs a reviewer who reads it against the archive.
- **Motte was not integrated.** The note registry gives it a single place to read history notes from, with an evidence status. Only notes marked *checked* would pass its `verified` filter, and none of the history notes is checked yet.
