import type { LabEntry } from '../types.ts'
import {
  DISPUTED_NEIGHBOUR_DATA,
  FOUR_WORDS_DOC,
  FOUR_WORDS_RESULTS,
  MARGIN_FILE,
  PR5,
  QUERIES_FILE,
  RECORDS_FILE,
  RECORDS_SCHEMA,
  REFLECTION_DOC,
} from './shared.ts'

export const CLASSIFICATION: LabEntry[] = [
  {
    n: '11',
    title: 'Above the Rod',
    family: 'classification',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'card-catalogue',
    question: 'What changes when a classification has to wait above the rod before it counts?',
    proposition:
      'If a placement only counts once a reviser drops it below the rod, a simple rule (the source must use the term’s words) would let most of the frozen index’s placements through and hold back the doubtful ones.',
    manipulate: 'Choose a guide card, choose the reviser’s rule, and drop cards below the rod or lift them back.',
    changes: 'Which cards are held by the rod, and so what a patron opening that guide would find. Under the strict rule, refused cards say which word the source never uses.',
    unchanged: 'The 80 term placements on the 30 frozen records, and the frozen index, which serves all of them as if they were accepted.',
    provenance: {
      idea: 'The project’s research describes card catalogues that kept provisional placements apart from accepted ones. Every v1 record says it has not been reviewed by a person.',
      mechanism: 'A card filed above the rod is loose: it can be read but not relied on until a reviser drops it and the rod holds it.',
      sourceShowed:
        'PR #5 reports provisional versus accepted placement in catalogues; we have not checked this against a primary source. The v1 records carry 80 term placements, all unreviewed.',
      interpretation:
        'Our reading is that the v1 index treats every unreviewed placement as accepted. The pilot asks whether a mechanical reviser could stand in for a person.',
      sources: [
        { label: 'PR #5, card catalogue research (provisional placements)', url: PR5, firmness: 'reported' },
        { label: 'Margin note “Has anyone faced this before?”', url: MARGIN_FILE, firmness: 'reported' },
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'The rod as a gate for review', firmness: 'metaphor' },
      ],
      priorArt: ['Library filing with revision “above the rod”, as reported', 'Pending-changes review on Wikipedia', 'Pull-request review before merge'],
    },
    built:
      'A drawer per controlled term, with the cards that carry it hanging above a brass rod. Cards drop on the reviser’s judgement, or only if the source uses every word of the term.',
    happened:
      'The word rule passes 50 of the 80 placements and holds 30. It holds the right card for asset-404, the vite#8073 issue that never says 404, but it also holds all five underscore-paths cards and both trailing-slash cards, because the sources write “_” and “trailingSlash”, not the words; for the same reason it holds Next.js’s basePath under base-path. On judgement alone, nothing stops any card dropping. Neither rule is a reviser.',
    uncertain:
      'Whether the provisional-placement practice existed as reported is unchecked. A reviser reading the source would decide differently from either rule, and we did not do that reading.',
    falsifier: 'If the word rule held back only placements that a reading of the source also rejects. It holds correct ones too.',
    simpler: 'A column “reviewed: no” on every record already says what the rod says, without the drawer.',
    data: 'Frozen Four Words v1: the 30 records’ controlled terms and the baseline index’s per-source term counts. Read-only.',
    finding: 'A word check would hold 30 of 80 placements above the rod: rightly asset-404 on vite#8073, but also every underscore-paths card, because the sources write “_”.',
    related: ['13', '14', '20', '31'],
  },
  {
    n: '12',
    title: 'The Sorting Key',
    family: 'classification',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'reorder',
    encounter: 'disputed-neighbour',
    question: 'Does the essay’s one question about the failing URL still separate look-alike problems once there are seven of them?',
    proposition:
      'The essay’s question, “does the failing URL contain your repository name?”, generalises: on its own it sorts every record filed under asset-404 by the fix it needs.',
    manipulate: 'Ask any of five questions, in any order, to build a dichotomous key over seven records.',
    changes: 'The key splits into groups; a group stops splitting once one fix covers it. Groups that still need two fixes are marked, and so are records that cannot answer a question.',
    unchanged: 'The seven records, our answers for them, and their fix classes. The frozen data is not touched.',
    provenance: {
      idea: 'The Disputed Neighbour on the indexing page separates two Vite issues with one URL question. It was built for two records.',
      mechanism: 'A dichotomous key: a sequence of couplets, each splitting a group by one observable feature, until each group names one thing.',
      sourceShowed:
        'Seven v1 records share the controlled term asset-404, and their solutions fall into three kinds: set a base path, stop Jekyll dropping files, or fix the entry file or domain.',
      interpretation:
        'Unlike the essay’s pilot, which compares two records in depth, this one asks whether its question scales. The answers are our reading of each record, and “not stated” is kept as its own branch.',
      sources: [
        { label: 'The Disputed Neighbour, its data (indexing page)', url: DISPUTED_NEIGHBOUR_DATA, firmness: 'fact' },
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'What building the essay changed, §2', url: REFLECTION_DOC, firmness: 'fact' },
      ],
      priorArt: ['Dichotomous keys in botany and zoology', 'Diagnostic decision trees', 'Twenty Questions'],
    },
    built:
      'Five question buttons and a key that grows as they are pressed. The smallest question sets that sort all seven are computed by trying every subset.',
    happened:
      'The URL question sorts five of the seven: the four base-path records answer no, the underscore issue yes. It cannot place next.js#15588 or GitHub’s 404 page, because neither record says what the failing URL was, so they fall into “not stated” together and need different fixes. Adding the question about the root page sorts everything. So does branch plus root, without the URL question at all: three pairs work, and no single question does. The Vite question splits records cleanly and sorts nothing.',
    uncertain:
      'The answer for vite#9119 comes from the essay’s reading of the issue, not from its record. With the sources at hand, “not stated” might become an answer, and the URL question might suffice.',
    falsifier: 'If the URL question alone sorted all seven by fix. It sorts five; the other two are not answerable from their records.',
    simpler: 'A table of the seven records against the five questions, which the pilot also shows, holds the same answers.',
    data: 'Seven frozen v1 records with the controlled term asset-404, and our answers to five questions (src/lab/data/classification-key.ts).',
    finding: 'The essay’s URL question sorts five of seven look-alikes. The other two records never say what the failing URL was.',
    related: ['11', '14', '19', '03'],
  },
  {
    n: '13',
    title: 'Who Put This Here?',
    family: 'classification',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'four-words',
    question: 'Can the provenance a record carries explain one particular classification decision inside it?',
    proposition:
      'The v1 records carry enough provenance to say, for any single controlled term, who placed it, when, and on what grounds.',
    manipulate: 'Choose a term placement as exhibit A and another as exhibit B, or step through the others.',
    changes: 'The ledger for both, row by row, with the rows that differ marked. Rows nothing records are shown as such.',
    unchanged: 'The records, their extraction lines and the commits. The ledger only reads.',
    provenance: {
      idea: 'Every v1 record has an extraction field, and the controlled vocabulary was defined before any record was written.',
      mechanism: 'A chain of custody: each step that touched an exhibit is logged, so a decision can be traced to a hand and a time.',
      sourceShowed:
        'The 30 records share one identical extraction line: written by an AI agent on 2026-10-28, paraphrased, not yet reviewed. The vocabulary arrived in 7bb828f; the records in one commit, 9ad53a3.',
      interpretation:
        'Our reading is that provenance here is per batch, not per decision. The pilot makes that measurable by diffing ledgers.',
      sources: [
        { label: 'Record schema and controlled vocabulary', url: RECORDS_SCHEMA, firmness: 'fact' },
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Four Words method, “Records”', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Chain of custody', firmness: 'metaphor' },
      ],
      priorArt: ['W3C PROV', 'Museum object files and accession registers', 'git blame'],
    },
    built:
      'An eleven-row ledger per placement, from the vocabulary commit to a word check of the term against the source, with a second placement beside it for comparison.',
    happened:
      'The proposition is false. Eight of the eleven rows are identical for all 80 placements, and two of those always read “Not recorded”: why this term, and from which passage. What differs is only the source, the word check and how common the term is. The ledger also exposed a split the record hides: git credits the repository owner with Claude as co-author, while the record names only the agent.',
    uncertain:
      'A per-decision log might be costly, and might not help a reader. We have not tried writing one.',
    falsifier: 'If two placements on different records produced ledgers that differed in who decided, or why.',
    simpler: 'Reading the extraction field of two records side by side shows the same sameness in a sentence.',
    data: 'Frozen v1 records and sources; three commit identifiers and times read with git log on 2026-10-29.',
    finding: 'Eight of eleven ledger rows are identical for all 80 term placements. The records know who wrote them, not who decided each term, or why.',
    related: ['11', '20', '16', '03'],
  },
  {
    n: '14',
    title: 'The False Alias',
    family: 'classification',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'reveal',
    encounter: 'four-words',
    question: 'When an alias helps people find a source, how do we tell a helpful paraphrase from a word the source never used?',
    proposition:
      'A word-by-word attestation check, as the v1 audit used, can separate unsupported vocabulary from supported vocabulary in the records’ aliases and symptoms.',
    manipulate: 'Choose an entry, and read it with the strict checker or the lenient one.',
    changes: 'Which words carry the lexicographer’s star for “not attested”, the count on the entry, and what leniency cleared.',
    unchanged: 'The records and the pinned source vocabularies; both checkers read the same data.',
    provenance: {
      idea: 'The v1 audit flagged the vite#8073 alias “blank page … works locally” as unsupported. Our own first check also flagged “works fine locally”, which the issue does say, as “local”.',
      mechanism: 'Attestation: a dictionary marks a form with an asterisk when no citation supports it.',
      sourceShowed:
        'The audit lists the “blank page” alias as a known defect. The reflection records the false flag: the tokenizer kept “local” and “locally” apart, and so did the check.',
      interpretation:
        'Our reading is that the checker is itself a classifier with errors. The pilot shows both its misses and its false alarms on the same entry.',
      sources: [
        { label: 'Four Words post-hoc analysis', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'What building the essay changed, §2 (the false flag)', url: REFLECTION_DOC, firmness: 'fact' },
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'The dictionary entry and its asterisk', firmness: 'metaphor' },
      ],
      priorArt: ['The asterisk for unattested forms in historical linguistics', 'OED citation slips', 'Spell-checker dictionaries'],
    },
    built:
      'Each record printed as a dictionary entry, its aliases and symptoms as senses, with unattested words starred by a strict or a lenient checker. A corpus tally sits under it.',
    happened:
      'Across 199 aliases and symptoms the strict checker stars 196 words and passes 87 senses whole; the lenient one stars 163 and passes 101. On vite#8073 leniency clears “locally” and “requested”, the audit’s false flag, and keeps “blank”, its real one. But it also keeps stars on “user” and “name” in a symptom that paraphrases a URL, and on “trailing slash”, which the issue shows only as the difference between /solardeploy and /solardeploy/. A star marks a missing word, not a false claim.',
    uncertain:
      'Leniency can also hide a real addition, when a short word sits inside a longer token. Neither checker reads meaning, and no person has rated the starred words.',
    falsifier: 'If the starred words were, on reading, the unsupported ones and no others. On the one entry we read closely, they were not.',
    simpler: 'The essay’s Disputed Neighbour already marks “not in source” by hand for two records; a hand-marked list is more accurate, and slower.',
    data: 'Frozen v1 records (aliases, symptoms) and the baseline index’s per-source term counts. Read-only.',
    finding: 'Leniency clears the audit’s false flag (“locally”) and keeps its real one (“blank”), but a star still marks a missing word, not a false claim.',
    related: ['03', '16', '11', '12'],
  },
  {
    n: '15',
    title: 'The Expired Answer',
    family: 'classification',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'four-words',
    question: 'If a reader states their setup, can an index say which of its answers have expired for them?',
    proposition:
      'The v1 records state their environmental conditions clearly enough that a short setup form could mark answers as applying, expired or unknown for a reader.',
    manipulate: 'Set five dials: publishing method, host, upload-pages-artifact version, Next.js era and Vite version.',
    changes: 'Each cell of the matrix shows what the record says about that setting; the last column gives a verdict for the setup; expired answers are struck through.',
    unchanged: 'The nine records in the matrix and what they say. The dials cannot make a record say more.',
    provenance: {
      idea: 'Several v1 records carry version or host conditions in their context and limitations, such as “v4 is not compatible with GHES”, or Next.js 9 era.',
      mechanism: 'A compatibility matrix, as package registries and browser tables publish, read against one reader’s environment.',
      sourceShowed:
        'Seven of 30 records name a version number in their context or limitations. Most conditions in the corpus are about publishing method, not version.',
      interpretation:
        'Our reading of each record’s conditions is stored as data; a condition the record does not state stays silent rather than being filled in.',
      sources: [
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Four Words method, corpus pinning', url: FOUR_WORDS_DOC, firmness: 'fact' },
      ],
      priorArt: ['caniuse.com support tables', 'npm peerDependencies and engines fields', 'Stack Overflow’s “outdated answers” flag'],
    },
    built: 'Five dials over a matrix of nine records, with our reading of what each record says per setting, and a verdict per answer.',
    happened:
      'The publishing dial does nearly all the work: switching from branch to Actions changes the verdict on six of the nine answers. The version dials touch one or two rows each, and mostly yield “unknown”, because a record that names its version says nothing about the others. One answer, vite#8073 from 2022, stays valid only because a newer record repeats it. Seven records left out of the matrix also mention a branch or Actions; we did not encode them.',
    uncertain:
      'The matrix is our reading. Whether the records’ conditions are true of the tools today was not checked, and the selection of nine is ours.',
    falsifier: 'If most records stated their conditions, so that most verdicts were “applies” or “does not apply” rather than unknown or silent.',
    simpler: 'A “last checked with” line on each answer would carry most of this without a form.',
    data: 'Nine frozen v1 records and our reading of their stated conditions (src/lab/data/classification-expiry.ts).',
    finding: 'Publishing method, not version, decides most expiries; version dials mostly answer “unknown”, because each record names only its own version.',
    related: ['18', '17', '12'],
  },
  {
    n: '16',
    title: 'The Confidence Costume',
    family: 'classification',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'four-words',
    question: 'Which of the marks of authority around a claim are actually about the claim?',
    proposition:
      'Some of the authority marks a record’s presentation can wear (badges, citations, ranks, charts, pins) would distinguish an attested alias from an unattested one.',
    manipulate: 'Take garments off one claim, or put them back, and swap between two aliases of the same record.',
    changes: 'How the claim looks, and the count of garments it wears. Under them, the one check about the claim itself: whether the source uses its words.',
    unchanged: 'The claim’s words and the data behind every garment, all real and all from the frozen corpus.',
    provenance: {
      idea: 'The vite#8073 record has an unsupported alias and a reporter-confirmed badge. The badge is true, and it is about the fix.',
      mechanism: 'Borrowed authority: a mark attached to a container is read as applying to everything in it.',
      sourceShowed:
        'In the v1 schema, evidence, terms, pins and ranks attach to a record or a run, never to a single alias. The audit flagged the “blank page” alias.',
      interpretation: 'Our reading is that the schema cannot dress a claim in anything about the claim. The wardrobe is a metaphor for that.',
      sources: [
        { label: 'Record schema', url: RECORDS_SCHEMA, firmness: 'fact' },
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
        { label: 'Four Words post-hoc analysis', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'The wardrobe', firmness: 'metaphor' },
      ],
      priorArt: ['Tufte on chartjunk and decoration', 'Verified badges on social platforms', 'Wikipedia’s “citation needed”'],
    },
    built:
      'One claim in a frame with seven toggleable garments (display type, an evidence badge, a neighbour’s citation, a search rank, controlled terms, a performance chart, a pinned revision) and the bare word check underneath.',
    happened:
      'The proposition is false by construction: none of the seven garments changes between the attested alias and the unattested one, because none is stored per claim. Both rank first for their own words. Underneath, the lenient check finds “blank” missing from one and nothing missing from the other. Across the corpus, 59 of 144 aliases contain a word their source never uses and still sit on records whose only badge is official documentation.',
    uncertain:
      'We have not tested whether anyone reads the garments as being about the claim; that is the part of the proposition a study would need.',
    falsifier: 'If any garment differed between the two aliases. None does.',
    simpler: 'One sentence under each alias, “not checked on its own”, would state the same fact.',
    data: 'The vite#8073 record and its neighbour, the structured index and the v1 summary scores, all frozen. Read-only.',
    finding: 'Seven true marks of authority, and not one differs between an attested alias and an unattested one: none is stored per claim.',
    related: ['14', '20', '17', '13'],
  },
  {
    n: '17',
    title: 'Three Kinds of Proof',
    family: 'classification',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'What is left on the scale when only reproduced or tested evidence is allowed?',
    proposition:
      'For the corpus’s best-documented fix, .nojekyll, the evidence includes at least some reproduction or test, so tightening the rules of evidence changes the balance rather than emptying it.',
    manipulate: 'Choose which sites the claim is about, which kinds of proof the scale admits, and reclassify any exhibit.',
    changes: 'Which exhibits sit on which pan, how the beam tilts, and the verdict under it.',
    unchanged: 'The six evidence notes, read live from the frozen records, and the side each takes.',
    provenance: {
      idea: 'Records carry evidence kinds: official-docs, reporter-confirmed, community-report and merged-fix. None is a reproduction.',
      mechanism: 'A balance: what counts as weight is decided before anything is weighed.',
      sourceShowed:
        'The 30 records carry 32 evidence notes: 25 official-docs, 3 reporter-confirmed, 3 community-report, 1 merged-fix. The merged-fix note says the PR contents are not in the snapshot.',
      interpretation: 'Our reading is that every evidence kind in the corpus is a kind of report. Which side each exhibit takes is also our reading.',
      sources: [
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Record schema, evidence kinds', url: RECORDS_SCHEMA, firmness: 'fact' },
        { label: 'The balance', firmness: 'metaphor' },
      ],
      priorArt: ['Levels of evidence in evidence-based medicine', 'Reproducible bug reports and minimal repro templates', 'Regression tests attached to bug fixes'],
    },
    built: 'An SVG balance over six exhibits about .nojekyll, with a scope selector, three admission switches and a reclassify control per exhibit.',
    happened:
      'The proposition fails. All six exhibits are reports, so admitting only reproduced or tested proof empties both pans, and the empty scale is drawn exactly like the 3-to-3 balance for “any GitHub Pages site”. The scope decides more than the proof: about branch sites it tips 3 to 0 for, about Actions sites 3 to 0 against. Reclassifying an exhibit as reproduced moves the beam, and the record still shows nothing was reproduced.',
    uncertain:
      'The #129 commenters say they tested; we class that as a report because we did not see it. Running .nojekyll ourselves would add the first reproduction, and we did not.',
    falsifier: 'If any exhibit, read from its record, showed a reproduction or a test. None does.',
    simpler: 'A count of evidence kinds per record (the one in the data line) gives the emptiness without the scale.',
    data: 'Six evidence notes from five frozen v1 records. Read-only.',
    finding: 'All six exhibits for .nojekyll are reports. With only reproduction admitted the scale is empty, and an empty scale looks exactly like a balanced one.',
    related: ['19', '20', '15', '16'],
  },
  {
    n: '18',
    title: 'The Missing Context',
    family: 'classification',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'four-words',
    question: 'When a fix is copied without its context, which situations does it start being applied to?',
    proposition: 'Peeling away a solution card’s context and limitations steadily increases the situations it would be misapplied to.',
    manipulate: 'Peel the card’s problem, context and limitation strips one at a time, or restore them.',
    changes: 'The card, and for six situations from other records, whether a remaining line would still warn a reader off.',
    unchanged: 'The solution sentence, which cannot be peeled, and the six situations.',
    provenance: {
      idea: 'Records separate a solution from its context and limitations. Advice tends to travel as the solution alone.',
      mechanism: 'Decontextualisation: a rule that was safe inside its conditions is applied outside them.',
      sourceShowed:
        'Across the corpus, 135 context and limitation lines sit beside the solutions; 7 are carried word for word by their own solution sentence.',
      interpretation: 'Which line guards which situation is our reading of six records, not a test of the fix.',
      sources: [
        { label: 'Frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Record schema', url: RECORDS_SCHEMA, firmness: 'fact' },
      ],
      priorArt: ['Copy-pasted Stack Overflow answers and their comments', 'Package README “requirements” sections', 'Medication leaflets’ contraindications'],
    },
    built: 'The next.js#15588 card as five peelable strips over a fixed solution line, beside six situations taken from other records.',
    happened:
      'Only partly true. The two Actions situations stay warned off however much is peeled, because the solution names “the gh-pages branch” itself. What peeling removes is the lines about cause: without the problem strip and the first context line, the card would be misapplied to a root-page 404 and to a missing base path. The Next.js-era limitation is the only line that says a current export may differ.',
    uncertain:
      'This is one card. On the corpus count most constraints do not travel with the solution, but whether their loss matters is a per-card reading we did once.',
    falsifier: 'If peeling every strip left every unfitting situation still warned off by the solution line alone.',
    simpler: 'Printing the context lines in bold above the solution would keep them from being skipped, without any peeling.',
    data: 'The next.js#15588 record and six situations from other frozen records, with our reading of which line guards which (src/lab/data/classification-context.ts).',
    finding: 'The constraint that matters most survived peeling: the fix names its own branch. What got lost was the cause, which is what separates it from look-alikes.',
    related: ['15', '12', '17'],
  },
  {
    n: '19',
    title: 'The Classification Trial',
    family: 'classification',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'When two proposals disagree about where a record belongs, what does examining them actually settle?',
    proposition:
      'Cross-examining the frozen labels and the audit’s proposal on the same questions would make one of them clearly better supported.',
    manipulate: 'Put any of seven questions to the court, in any order, then enter a ruling or adjourn.',
    changes: 'The hearing transcript, with each answer computed from the frozen data or taken from the method write-up, and a minute of the ruling.',
    unchanged: 'The labels, which are frozen whatever is ruled.',
    provenance: {
      idea: 'The v1 audit found that two records it judged relevant to “css missing after deploy” were never labelled relevant.',
      mechanism: 'An adversarial hearing: two parties answer the same questions in front of a record that cannot be altered.',
      sourceShowed:
        'Adding the two records would move the problem-oriented index’s first relevant result from rank 7 to rank 2; plain search stays at rank 1. The labels were frozen before the run.',
      interpretation: 'The courtroom is a metaphor. Our reading is that the questions separate timing and knowledge, not correctness.',
      sources: [
        { label: 'Four Words post-hoc analysis, the loss', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Frozen queries and labels', url: QUERIES_FILE, firmness: 'fact' },
        { label: 'The court', firmness: 'metaphor' },
      ],
      priorArt: ['Inter-annotator agreement and adjudication', 'TREC relevance assessment', 'Wikipedia’s articles for deletion'],
    },
    built: 'A docket, seven question buttons, a transcript whose answers are computed live, and three ways to rule that only write a minute.',
    happened:
      'On content the parties agree: both disputed sources and both records say “css”, and both fixes name a base setting. They differ on when and with what knowledge: the labels came before any ranking, the audit after it, and the audit’s proposal helps the system it watched lose. The hearing exposes that and settles nothing; the honest ruling is to adjourn for a second labeller.',
    uncertain: 'The questions are ours, and a different set might favour one side. No second labeller has been heard.',
    falsifier: 'If, after all seven questions, the answers favoured one proposal on content, not only on timing.',
    simpler: 'The two paragraphs of the method write-up that describe the loss say the same, in order.',
    data: 'Frozen query q01 and its labels, the two disputed records and the frozen indexes; the method write-up for timing. Read-only.',
    finding: 'On content the labels and the audit agree; they differ on when, and with what knowledge. The hearing can only adjourn.',
    related: ['17', '12', '13'],
  },
  {
    n: '20',
    title: 'The Unverified Stamp',
    family: 'classification',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'print',
    question: 'What does a stamp say about a record beyond what was actually done to it?',
    proposition: 'A stamp can be composed for a v1 record whose every mark the record itself backs.',
    manipulate: 'Compose a stamp from a word, a border and optional date, initials and evidence marks, and press it onto any of the 30 record cards.',
    changes: 'The stamp on the card, and the slip that reads each part back as a claim: backed, partly backed or not backed by the record.',
    unchanged: 'The records and their extraction lines. A stamp changes nothing it is pressed on.',
    provenance: {
      idea: 'The site uses its own marks of verification: “checked” on margin notes, kernel and specimen on pilots. Motte only accepts notes marked checked.',
      mechanism: 'A rubber stamp: a fixed design that any hand can press, so its authority does not depend on the act.',
      sourceShowed:
        'Every v1 record says it was paraphrased by an AI agent and not yet reviewed by a human. On margin notes, “checked” means checked against the linked source.',
      interpretation: 'What each part of a stamp implies is our reading; nobody was asked. Whether the record backs it is computed.',
      sources: [
        { label: 'Margin notes and their evidence labels', url: MARGIN_FILE, firmness: 'fact' },
        { label: 'Frozen v1 records, extraction', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'The stamp desk', firmness: 'metaphor' },
      ],
      priorArt: ['Notary and customs stamps', 'The “approved” stamp in document workflows', 'Code-signing and “verified” commit badges'],
    },
    built: 'A stamp composer with live preview on a record card, and a slip that judges each part against the record’s extraction, evidence and a word check.',
    happened:
      'It can be done, but only by saying less. PARAPHRASED and NOT REVIEWED are backed outright on all 30 cards; VERIFIED, REVIEWED, ACCEPTED and the round seal are backed on none. A date, initials and the evidence label are each only partly backed: the date is when it was written, the initials name an agent, the label covers the fix. CHECKED is only backed by a machine word check, so on this site’s own definition it would mislead.',
    uncertain: 'What a stamp implies to anyone else is untested. The site’s own “checked” label has the same structure, and we have not audited its uses here.',
    falsifier: 'If no combination of parts were fully backed by any record.',
    simpler: 'Printing the extraction line itself, as the shell already does for sources, says exactly what was done.',
    data: 'All 30 frozen v1 records (extraction, evidence, aliases) and our reading of stamp parts (src/lab/data/classification-stamps.ts).',
    finding: 'The only fully honest stamp reads PARAPHRASED · NOT REVIEWED. VERIFIED and the round seal are backed by no record in the corpus.',
    related: ['11', '13', '16', '17'],
  },
]
