# The Laboratory: critique

**Status:** slice 3, 2026-10-29. Branch `feat/lab-critique`. Written by the lead after using every pilot in a browser and reading its notebook side by side with related pilots. These are qualitative judgements, not measurements, and no pilot has been used by anyone outside the project.

Every pilot's assessment appears in its own notebook. The source of truth is `src/lab/catalogue/critique.ts`. The table at the end of this document is generated from it.

## The five questions
1. **Specificity.** Could this have been built from ten unrelated prompts by changing labels?
2. **Interaction.** Does an action produce a meaningful consequence?
3. **Insight.** Does the experiment teach something beyond its own explanation?
4. **Integrity.** Are the sources, fixtures and limitations clear?
5. **Experience.** Would a curious visitor want to explore it?

There are deliberately no scores. Every pilot gets one sentence per question and a verdict:
- **keep**: works as it is;
- **develop**: becomes a specimen;
- **combine**: merge with a related pilot;
- **challenge**: the proposition or method is in doubt;
- **retire**: a direction we would not take further;
- **transfer**: a candidate for the essay, after editorial review.

## What the sixty did, taken together

**Most propositions failed, and that was the most useful outcome.** Twelve notebooks say in so many words that their own proposition failed or only half held (02, 03, 04, 07, 08, 13, 16, 18, 23, 43, 48, 51), and several more contradict theirs without using the word (17, 32, 34). The pattern is consistent: the interesting result was rarely the mechanism we set out to show. It was something the data refused.
- **03** expected index vocabulary to carry most meetings; most words meet in the source's own text.
- **04** expected weighting to matter; the vocabulary decides.
- **07** expected a held place to keep its neighbourhood; it keeps only its address.
- **13** expected a classification's provenance to be inspectable. The records know who wrote them, never why a term was chosen.
- **17** expected three kinds of proof. The corpus has only one: reports.
- **32** expected classification to be prior *human* labour. On these cards an AI agent wrote 81–92% of the words, and the reviewer's line is blank on all 30.
- **34** expected scarcity to support attention. It produces eviction, not attention.
- **48** expected the editorial pass to have pushed hedges below the surface. It did not.

**The corpus keeps answering the same way.** The pilots were written independently by six builders, yet four results recur across families:
- **Authority is never stored per claim.** Pilots 13, 16, 17 and 20 each find, from a different side, that every mark of confidence on a record is borrowed from the record as a whole.
- **Links point one way.** In 09, 28, 42 and 54, references are written by one party, and nothing in the records reads them back.
- **Records do not say when they expire.** 15, 18 and 55 find almost no dating or applicability marks.
- **Motte cannot speak.** 38 and 49, built in different families, both find that the moth's contract lets through zero history notes.

These convergences are the closest thing the lab has to findings about the project rather than about one pilot.

**The fixtures are too small for some questions.** The eight community contributions answered questions about authority and structure well (21, 22, 24, 26, 28, 29, 30). They could not answer questions about policies or scale: 23 collapsed to two front pages, and 27's result is whatever we typed. Questions about popularity, trust and moderation at scale need either real records, which require approval, or a deliberately larger synthetic set that is labelled as such.

## Duplications and superficial variants

| Pair or group | Judgement | Decision |
|---|---|---|
| 07 The Held Place / 08 Multiple Catalogues / 31 Card Friction | 07 and 08 make the same point (neighbours depend on the order) from the same material; 08 makes it at full scale. 31 is about cost, not order. | **07 combined into 08**: keep 07's held spine as a mode of the slopegraph. |
| 02 The Neighbour You Didn't Ask For / 09 Follow the Footnote | Both rest on the records' `related` links. 02 measures what they rescue; 09 walks them. 02's diagram is mostly empty rings. | **02 combined into 09**: its tally belongs under 09's reachability counts. |
| 16 The Confidence Costume / 20 The Unverified Stamp | Both find, by construction, that no per-claim authority is stored. 16's corpus tally is the result; 20's stamp is the stronger image. | **Combined**: one pilot that dresses a claim and stamps it, leading with the tally. |
| 38 Motte's Historical Flags / 49 The Historical Intruder | Same filter, same notes, same zero. 38 found the contract gap (kind is never checked); 49 has the better form for an essay (a margin rail). | **49 combined with 38**: the margin rail as the form, the sieve as its explanation. |
| 34 Occupied Circuits / 35 The Switchboard Operator | Both are switchboard boards. 35 asks about acts and vocabulary; 34's result is close to obvious. | **34 retired**: it keeps running and keeps its notebook. |
| 44 The One-Sentence Experiment / 50 The Twenty-Second Explanation | Both explain the supplied-vocabulary finding. 44 does it in one honest line; 50's diagram is faster but mislabels the tokenizer artefact. | **50 challenged**: its own flaw is the finding, and the clock measures nothing. |

The six builders were asked to vary form, and they did: the contact sheets show faders, a slopegraph, a bookcase, a balance, a stamp desk, a patch panel, a cabinet front, print plates, a stratigraphic column, a redaction desk and a terminal. **No family collapsed into one template.** The superficial variants above are variants of *proposition*, not of layout.

## Where a plain control would do better

- **58 The Public Memory Loop.** Its threshold follows from its six rules, so a small loop diagram with the rules printed beside it would teach the same thing. **Retired.**
- **27 The Trust Neighbourhood.** A sentence would carry it: "on invented numbers, widening the boundary replaces the specialist". The map makes invented data look like evidence. **Retired.**
- **02**, **13** and **15** could each be a table. They are kept (13 and 15) or combined (02) because the form helps: the dials in 15 make "unknown" something you run into, rather than read.
- **04** could be a sentence ("equal weights change 1 of 27 first results"). It is kept as a specimen because discovering the inertia by hand is the point; the desk makes a null result feel like one.

## Misleading metaphors

- **The switchboard.** It snaps on persistence (46), which is the point of the whole model. The community pilots that use it (21, 22, 24, 35) work because they treat it as a vocabulary for acts, not as a picture of how records behave. Keep it as vocabulary; do not let it stand for storage.
- **The card catalogue.** It holds better, until institutional authority. Our cards have no institution behind them, only an agent and an empty reviewer's line (32).
- **The museum** (40) promises reorganisation around a question, but without rewriting labels it can only answer in their words. That limit is the finding, so the metaphor stays, with the limit on its label.

## Challenged

- **23 Several Operators**: the fixture is too small for policies to differ.
- **47 The Reader's Hypothesis**: the questions were chosen to surprise, which is the selection bias the pilot should be exposing. It should either draw its questions at random from the frozen results or show the selection openly as part of the interaction.
- **50 The Twenty-Second Explanation**: see above.

## Developed specimens

Eight pilots are developed further in slice 4. They were chosen for conceptual insight, visitor experience and technical evidence, not for visual spectacle. At least one comes from each family.

| | Pilot | Why |
|---|---|---|
| 04 | A Search That Explains Itself | Disproves a natural belief by hand; computed live. |
| 11 | Above the Rod | A cautious rule wrongly refuses correct placements; the patron's empty drawer. |
| 17 | Three Kinds of Proof | An empty scale looks balanced. |
| 30 | The Moderation Lens | The generated account says "nobody disagreed". |
| 32 | The Librarian's Hand | The prior labour is not human. |
| 39 | The Marginal Printer | Position anchoring fails silently; quotation anchoring fails visibly. |
| 45 | The Story You Can Interrupt | One skippable aside carries the only caveat. |
| 56 | The Forked Interpretation | One labelling choice, two published numbers, the same winner. |

## What might enter the essay

All of these are candidates for editorial review, not decisions. None changes a research conclusion.

1. **32's result in the Indexing chapter.** "Classification is prior labour" is the chapter's argument; here, that labour was an agent's, with no reviewer. That is a sharper version of the claim, and it is true of this project.
2. **44 in the Indexing chapter**, as a one-line replacement for an explanatory paragraph about supplied vocabulary.
3. **30's generated sentence in the Community chapter**, beside the Switchboard: moderation edits the account, not just the list.
4. **25 in the Community archive**, as the concrete form of "views are projections".
5. **56 in the Four Words archive**, next to the audit: it shows what the labelling dispute does and does not change.
6. **06 and 12 in the archive**, as companions to the essay's experiments.
7. **The recurring findings above**, as one short paragraph in the afterword: authority is not stored per claim, links point one way, records do not say when they expire.

## Open research questions

1. **Can records carry per-claim authority** (attestation per alias, per symptom) without becoming unwritable? 13, 14, 16 and 20 all point here.
2. **Should a relationship be readable from both ends** in a portable system, and who would pay for the index that makes it so? (09, 28, 54)
3. **What would an expiry or applicability field look like** that a writer would actually fill in? (15, 18, 55)
4. **Does Motte have a role** if almost nothing is verified? Or is "the moth with nothing to say" itself the editorial position? (37, 38, 49)
5. **How large must a synthetic conversation be** before assembly policies diverge, and can such a set be honest? (23, 27)
6. **Would people who never saw the corpus** lose more words than 03 found? This needs queries from outside the project, as Four Words v2 proposes.
7. **Is a strict automatic rule ever safe** for accepting a correction or a classification, or does every rule that is strict enough also block the useful part? (11, 52)

## What developing the specimens changed (slice 4)

Each specimen's full reflection is in its notebook. In short:
- **04:** putting the count first, as 27 lamps, turns a null result into something you do. The one query that moves is q26, the trailing-slash case, which the v1 audit had already traced to a tokenizer artefact.
- **11:** showing the whole cabinet makes the cost countable. Two of 16 drawers are left empty, and it is the patron, not the reviser, who pays for a cautious rule.
- **17:** drawn beside the full scale, the empty one is the same picture. The verdict only has to read the dials.
- **30:** comparing the account with itself made "Nobody disagreed" unmissable, and exposed a quieter false sentence one stop earlier.
- **32:** keeping the blank slots did more than any count. The 30 near-identical bars are the result.
- **39:** styling misprints exactly like correct prints was the decision. A warning style would have contradicted "silent".
- **45:** naming the three caveats separately finds the one unsafe skip, instead of leaving it to inference. The finding's wording changed, because nothing measured which asides readers pass.
- **56:** asking the labelling question turns the fork into a decision. Both branches are drawn, so the 0.013 gap and the unchanged winner are visible at once.

Every specimen has a behaviour check that reproduces its finding through the interface (`scripts/specimens/`), and a unit test of the number its notebook quotes.

## Generated: every pilot's assessment

<!-- The table below is generated from src/lab/catalogue/critique.ts by scripts/lab-evaluation.mjs. Do not edit it by hand. -->

| # | Pilot | Status | Verdict | Insight | Experience |
|---|---|---|---|---|---|
| 01 | Four Words, No Words | Kernel | keep | Six groups of records can never be told apart: the vocabulary, not the visitor, is the limit. | Playable and quick; the restriction to symptoms is the moment that teaches. |
| 02 | The Neighbour You Didn’t Ask For | To combine | combine | The tally (a third of misses sit next door, among many unneeded neighbours) is the finding; the diagram adds little. | Sparse. A visitor would learn more from the tally line inside 09. |
| 03 | The Lost Synonym | Kernel | keep | It disproved its own proposition and exposed a third bin: words that meet nowhere yet were labelled relevant. | Strong typography; the strike-through words carry the argument. |
| 04 | A Search That Explains Itself | Specimen | develop | A natural belief, that weighting is where ranking lives, fails visibly: 1 of 27 first results moves. | The mixing desk makes nothing happening feel like a result. |
| 05 | The Wrong Door | Kernel | keep | The better index is no better at keeping you out of the wrong framework. | Immediate; opening a wrong door is the lesson. |
| 06 | The Unfinished Index | Kernel | transfer | Passing mentions make a tool the corpus never collected look found: absence is disguised as a match. | A plain ledger, which is right for it; a candidate for the essay’s archive. |
| 07 | The Held Place | To combine | combine | A held place keeps the address, not the neighbourhood, which 08 also shows at larger scale. | The shelf is legible, but the point arrives faster in 08. |
| 08 | Multiple Catalogues | Kernel | keep | No pair of sources is neighbours in all four: there is no neutral shelf. | The slopegraph is dense at 390 px but rewarding at desktop width. |
| 09 | Follow the Footnote | Kernel | keep | Citations alone strand four records; reading backwards connects all 30. | The printed-page voice suits it; it should absorb 02’s tally. |
| 10 | The Four-Word Relay | Kernel | keep | Rescue is common but needs foresight: 1 in 20 swaps works. | A small game; it could be shorter. |
| 11 | Above the Rod | Specimen | develop | The cautious automatic rule refuses correct placements because sources write “_” and camelCase. | The patron’s empty drawer is a memorable consequence. |
| 12 | The Sorting Key | Kernel | transfer | The essay’s question fails on missing facts, not wrong ones. | Clear, if dry. A good archive companion to the essay. |
| 13 | Who Put This Here? | Kernel | keep | Mostly a negative: the record knows who wrote it, never why a term was chosen. | A ledger of “same” is honest but flat. |
| 14 | The False Alias | Kernel | keep | The checker that clears our false flag still cannot tell a missing word from a false claim. | The dictionary form is apt and readable. |
| 15 | The Expired Answer | Kernel | keep | Publishing method, not version, decides most expiries; only 7 of 30 records name a version. | Works, but the dials mostly say “unknown”. |
| 16 | The Confidence Costume | To combine | combine | The corpus tally (59 of 144 aliases unattested, all wearing the same badge) is the real result. | The undressing is fun; the result should lead. |
| 17 | Three Kinds of Proof | Specimen | develop | An empty scale looks exactly like a balanced one: absence of strong proof reads as a tie. | Physical and immediate. |
| 18 | The Missing Context | Kernel | keep | The constraint survives; the cause is what goes missing. | Clear, and short. |
| 19 | The Classification Trial | Kernel | keep | The disagreement is about timing and knowledge, not content. | The courtroom voice risks pastiche, but adjourning is the right ending. |
| 20 | The Unverified Stamp | To combine | combine | The only fully backed stamp says PARAPHRASED · NOT REVIEWED. | The stamp is the more memorable half of the 16/20 pair. |
| 21 | The Connection Contract, Authored | Kernel | keep | Declaring is rare (28 of 448 combinations); proposing is almost everyone’s only right. | Form-like by necessity; clear. |
| 22 | The Operator Leaves, One Sheet at a Time | Kernel | keep | Order matters once: lift the editor first and a model’s guess stands uncontradicted. | Good tactile logic. |
| 23 | Several Operators | Challenged | challenge | Six policies collapse to two front pages; the fixture, not the policies, decides. | Fine; the point needs a bigger conversation. |
| 24 | The Disagreement Cable | Kernel | keep | With existing Lexicons, every author’s disagreement would be prose. | The patch panel is the most physical community pilot. |
| 25 | One Conversation, Three Interfaces | Kernel | transfer | The thread hides half; the channel invents an order. | Clear; a candidate for the Community chapter. |
| 26 | The Forgotten Reply | Kernel | keep | Everything that remains of a deleted reply belongs to someone else. | Quiet and affecting. |
| 27 | The Trust Neighbourhood | Retired direction | retire | None beyond the construction; the mechanism is honest, the result is not a finding. | The map is pleasant, which is the risk: it looks like evidence. |
| 28 | The Unplugged Community | Kernel | keep | Without the backlink index the essay no longer knows who answered it. | Strong and simple. |
| 29 | The Unfinished Conversation | Kernel | keep | Nothing was closed by being answered; only withdrawals close. | Procedural humour that lands. |
| 30 | The Moderation Lens | Specimen | develop | Hide three records and the view can say “nobody disagreed”. | The generated sentence is the strongest single moment in the family. |
| 31 | Card Friction | Kernel | keep | Friction exposes the filer, not serendipity. | Tactile; the guide tabs could be more visible. |
| 32 | The Librarian’s Hand | Specimen | develop | The “prior labour” of this index is an agent’s; the reviewer’s line is blank on all 30. | Ink colours make authorship visible at a glance. |
| 33 | The Filing Rod | Kernel | keep | The rod taxes position and rewards batched review. | Satisfying but slow; it needs its batch button. |
| 34 | Occupied Circuits | Retired direction | retire | Close to obvious: scarcity forces eviction, not attention. | Works, but repeats 35’s board with less to say. |
| 35 | The Switchboard Operator | Kernel | keep | Three of five operator acts have no word in our contract vocabulary. | Engaging, with a learning curve. |
| 36 | The Index Drawer That Lies | Kernel | keep | Trusting a stale label misfiles cards that re-lettering cannot fix. | Clear cabinet; the misfile moment is visible. |
| 37 | Desktop Pets Return | Kernel | keep | Each cue is a countable interruption; idle movement alone acts every time. | Charming, and it stops by itself. |
| 38 | Motte’s Historical Flags | Kernel | keep | No history note passes, and the filter never checks a note’s kind. | Clear sieve; the empty end is the point. |
| 39 | The Marginal Printer | Specimen | develop | Position anchoring fails silently; quotation anchoring fails visibly. | The print-registration language is distinctive and earned. |
| 40 | The Museum That Rearranges Itself | Kernel | keep | Without rewriting labels, a museum can only answer in their words. | The floor plan is small; the idea is larger than the specimen. |
| 41 | The Essay With Two Voices | Kernel | keep | The sceptic says 2.7 times as much as the claims it answers. | Repeats text for beats with two notes. |
| 42 | The Footnote Rabbit Hole | Kernel | keep | 22 of 38 notes cite no registered source, so the hole is shallow. | The shallowness is the finding; the interaction mostly stops. |
| 43 | The Page That Disagrees | Kernel | keep | Every counterexample is the same query. | Good pacing. |
| 44 | The One-Sentence Experiment | Kernel | transfer | One word moves the report, and the sentence can say why. | The clearest mechanism in the lab, in one line. |
| 45 | The Story You Can Interrupt | Specimen | develop | Skipping is safe except once: the only “illustration” caveat sits in an aside. | Slow by design. |
| 46 | The Broken Analogy | Kernel | keep | The switchboard breaks on persistence, which is the point of the model. | Satisfying snap; slightly toy-like. |
| 47 | The Reader’s Hypothesis | Challenged | challenge | The mechanism is generic, and the selection is the bias it should expose. | Engaging, which makes the bias more dangerous. |
| 48 | The Invisible Appendix | Kernel | keep | The hedges did not sink below the surface. | Readable; the soundings are a nice form. |
| 49 | The Historical Intruder | To combine | combine | Zero interruptions under the contract: the same finding as 38. | The reading-column form is better than 38’s sieve for an essay; the two belong together. |
| 50 | The Twenty-Second Explanation | Challenged | challenge | The diagram is faster and wrong in one place: it marks a tokenizer artefact as an addition. | The clock adds nothing measurable. |
| 51 | A Correction Travels | Kernel | keep | A correction stays local and the published results keep describing the old records. | Mostly “not reached”, which is the honest picture. |
| 52 | The Problem Desk, Reassembled | Kernel | keep | Every strict rule blocks the only useful part. | Good levers. |
| 53 | The Answer With a Past | Kernel | keep | No relation uses supersedes; the rejected alias is still unmarked. | Clear. |
| 54 | The Duplicate Investigation | Kernel | keep | The same fix, found twice, and the records never link each other. | Aligning is satisfying. |
| 55 | The Knowledge Fossil | Kernel | keep | 19 of 30 records never say when they stop applying. | Good excavation form. |
| 56 | The Forked Interpretation | Specimen | develop | The published number took one branch, and the other would not change who won. | The fork makes a labelling choice tangible. |
| 57 | The Agent Leaves a Note | Kernel | keep | Private and reproducible identifiers look alike to patterns. | Redaction desk is strong. |
| 58 | The Public Memory Loop | Retired direction | retire | Nothing beyond the rules; it says so. | A diagram of the loop would teach the same. |
| 59 | The Portable Problem | Kernel | keep | Provenance is the first thing to go. | Memorable. |
| 60 | Postack Indexes Itself | Kernel | keep | The lab inherits Four Words’ vocabulary blind spots. | A useful way into the lab. |
