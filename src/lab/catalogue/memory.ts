import type { LabEntry } from '../types.ts'
import {
  COMMUNITY_DOC,
  FOUR_WORDS_DOC,
  FOUR_WORDS_RESULTS,
  HISTORY_FILE,
  LAB_CATALOGUE_DIR,
  MEMORY_FIXTURES_FILE,
  PHOTO_FRAME_CASE,
  PHOTO_FRAME_README,
  PROBLEM_DESK_FILE,
  QUERIES_FILE,
  RECORDS_FILE,
  SITE_CONVERGENCE,
} from './shared.ts'

export const MEMORY: LabEntry[] = [
  {
    n: '51',
    title: 'A Correction Travels',
    family: 'memory',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'problem-desk',
    question: 'When one record is corrected, how far does the correction reach?',
    proposition:
      'A correction to one record travels: in a shared index it changes what other searches return, not only the search that prompted it.',
    manipulate: 'Choose one of three attributable corrections and apply it to an in-browser copy of the 30 records, or withdraw it.',
    changes:
      'A map of five places that read the records lights up where the correction arrives: the top three of each of the 27 frozen queries, the controlled-term shelves, the records that link to it, the frozen results and the source.',
    unchanged: 'The frozen v1 records, index, labels and results, and every pinned source. Only a copy in this tab is patched.',
    provenance: {
      idea: 'The Problem Desk previews one correction against one query. We wanted the rest of the map: where else the same change lands, and where it never arrives.',
      mechanism: 'An index is shared: every query reads every record, so a change to one record can in principle move any ranking.',
      sourceShowed:
        'The Four Words post-hoc review names the vite#8073 “blank page” alias as unsupported by its source. The Problem Desk shows one invented correction moving one query.',
      interpretation:
        'We expected corrections to ripple. On this corpus they stay where they were made, which suggests reach is a property of the corpus and its vocabulary, not of correcting.',
      sources: [
        { label: 'Four Words method and results, post-hoc analysis', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'The Problem Desk, on the Convergence page', url: SITE_CONVERGENCE, firmness: 'fact' },
        { label: 'Invented correction by kit.example', url: MEMORY_FIXTURES_FILE, firmness: 'speculation' },
      ],
      priorArt: ['Errata and retraction notices in journals', 'Wikipedia’s “What links here”', 'Cache invalidation and dependency graphs'],
    },
    built:
      'A hub with five routes. The chosen correction patches a copy of the records; the structured index is rebuilt in the browser and every frozen query rerun. A demonstration, not an evaluation.',
    happened:
      'The proposition failed on all three. The review’s correction moves one query’s top three (q03, “blank page github pages”), Lena’s moves one (q01), and kit’s moves none; it only takes the record off the “jekyll” shelf. No correction reaches the records that link to its target, and none can reach the frozen results.',
    uncertain:
      'Thirty records on one narrow topic share little vocabulary between queries. In a larger index, a correction to a heavily used word might travel much further.',
    falsifier: 'If no correction changed more than the query it was written for. On this corpus, none does.',
    simpler: 'A list of the queries whose top three change, per correction, would carry the whole result.',
    data: 'Frozen Four Words v1 records and queries, read-only; one correction from the v1 review, one fixture from the Problem Desk and one invented here (kit.example).',
    finding:
      'Corrections stay local here: each moves at most one of 27 queries, none reaches the records that link to it, and the published results keep describing the uncorrected records.',
    related: ['52', '53', '59', '03'],
  },
  {
    n: '52',
    title: 'The Problem Desk, Reassembled',
    family: 'memory',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'problem-desk',
    question: 'If the same contribution meets different joining rules, what does each rule decide for us?',
    proposition:
      'The choice of joining rule, not the contribution, decides whether an index improves, and every rule that keeps guesses out also keeps the useful vocabulary out.',
    manipulate: 'Throw a switch between five joining rules: open, evidence-gated, strictly evidence-gated, review-gated (with you as reviewer) and author-only.',
    changes:
      'Which of the two parts of Lena’s correction reach the index or wait on a siding, the reason given, who had to act, and the rank of the first relevant source for “css missing after deploy”.',
    unchanged: 'The two parts, their evidence notes and the frozen records. The essay’s Problem Desk is not rebuilt: it accepts parts; this pilot varies the rule that accepts them.',
    provenance: {
      idea: 'The Problem Desk’s self-correction: a guessed change improved ranking as much as a sourced one, which moved the weight of the idea from indexing to review.',
      mechanism: 'Railway switching: the same train reaches a different destination depending on how a lever is thrown, and someone has to throw it.',
      sourceShowed:
        'On the essay’s desk, either part alone moves the first relevant source from rank 7 to rank 2. Its evidence notes say the grounded part has a quotation for the mechanism, not the symptom.',
      interpretation:
        'That the desk’s preview hides a policy question: the interesting decision is who may let words into an index, and what each answer costs.',
      sources: [
        { label: 'The Problem Desk, on the Convergence page', url: SITE_CONVERGENCE, firmness: 'fact' },
        { label: 'Problem Desk data: the correction and its two parts', url: PROBLEM_DESK_FILE, firmness: 'fact' },
        { label: 'Research history: the Problem Desk self-correction', url: HISTORY_FILE, firmness: 'fact' },
      ],
      priorArt: ['Wikipedia pending changes and flagged revisions', 'Stack Overflow suggested-edit review queues', 'Pull-request review on GitHub', 'Library authority control'],
    },
    built:
      'Five rules as rail levers, each a small function over the two parts; the chosen rule’s verdicts rebuild a copy of the index. Under the review rule you accept or reject each part yourself.',
    happened:
      'Only two outcomes exist: rank 7 or rank 2. Open and evidence-gated both reach rank 2, the second by letting through the part whose quotation supports a mechanism, not the added symptom. The strict rule, author-only and an unattended review all leave rank 7. Author-only stalls for an odd reason: the records’ author is the agent that wrote them, which is not watching.',
    uncertain:
      'Two parts and one query make every rule look binary. With many contributions, rules would differ in throughput and error rate, which this cannot show.',
    falsifier: 'If some rule let in the useful part and kept out the guess while also requiring the source to state the symptom. None can: the symptom is the vocabulary the source lacks.',
    simpler: 'A five-row table of rule, parts admitted and resulting rank, which the pilot also prints.',
    data: 'The Problem Desk’s invented correction by lena.example and its two parts, unchanged; frozen v1 records and query q01, read-only.',
    finding:
      'Every rule strict enough to require the symptom in the source also blocks the only useful part. Evidence-gating admits it on a quotation about something else.',
    related: ['51', '57', '58', '13'],
  },
  {
    n: '53',
    title: 'The Answer With a Past',
    family: 'memory',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'essay',
    question: 'Where does the history of an answer live once the answer has been revised?',
    proposition:
      'A revised answer keeps its past only in a prose log; the records it rests on carry no trace of their revision or dispute.',
    manipulate: 'Scrub through the twelve layers of the project’s real research history, oldest first.',
    changes:
      'The strata deposited so far, and the project’s answer to its first question as of that layer: which statements are new, standing or revised, with the revision note beside the struck original.',
    unchanged: 'The history log, the records and the frozen results. Which entries touch the answer is our reading of each entry’s own text.',
    provenance: {
      idea: 'Records have a `supersedes` relation in their schema, and the essay keeps a source-linked history of its own corrections. We wanted to see whether the two meet.',
      mechanism: 'Stratigraphy: later layers lie over earlier ones without erasing them, so depth stands for time.',
      sourceShowed:
        'The research history records that the numbers stayed while the reading changed: much of the gain was supplied vocabulary, and the one loss was partly a labelling error.',
      interpretation:
        'That supersession is something people write down in logs, not something records declare. The schema allows it; nobody used it.',
      sources: [
        { label: 'Research history log', url: HISTORY_FILE, firmness: 'fact' },
        { label: 'Four Words method and results, post-hoc analysis', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Wikipedia page history', 'Retraction Watch and journal correction notices', 'Git blame', 'Archaeological stratigraphy (Harris matrix)'],
    },
    built:
      'A range input over the twelve history entries, a stratigraphic column of the layers deposited so far, and the answer at that depth assembled from our reading of three entries.',
    happened:
      'Three of twelve layers change the answer; nine leave it alone. The statement that stays standing is the one about numbers; both explanations are revised. Meanwhile, of 60 relations in the 30 records, 0 use `supersedes`, and the vite#8073 record still carries the alias the review found unsupported, with nothing in the record to say so.',
    uncertain:
      'Assigning effects to log entries is our reading; another reader could tag differently. The log was written by the same project, after the fact.',
    falsifier: 'If any v1 record carried a revision, a dispute or a supersedes link reflecting the history. None does.',
    simpler: 'A changelog with “superseded” notes beside each statement, which is roughly what the history page already is.',
    data: 'The project’s research history log and the frozen v1 records, both read-only.',
    finding:
      'The answer has a past only in the prose log. Of 60 record relations, none uses “supersedes”, and the alias the review rejected is still in its record, unmarked.',
    related: ['51', '55', '56', '33'],
  },
  {
    n: '54',
    title: 'The Duplicate Investigation',
    family: 'memory',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'Can an index tell that two independent investigations reached the same finding?',
    proposition:
      'Two investigations that reach the same fix, written up independently, share too few words and links for the index to treat them as one finding.',
    manipulate: 'Open two notebooks side by side and align the lines that say the same thing, or show our alignment; switch to a control pair that shares a symptom but not a finding.',
    changes: 'The aligned pairs, the searchable words each pair shares, and how many lines on one side have no counterpart.',
    unchanged: 'The records, and what the index already knows about the pair: links, shared controlled terms and mutual ranks, which are read from the frozen v1 data.',
    provenance: {
      idea: 'vite#9119 and next.js#15588 are separate GitHub issues, in separate projects and framework versions, whose threads both end at adding a .nojekyll file.',
      mechanism: 'Independent rediscovery: the same fix found twice, each time described in the vocabulary of the project where it hurt.',
      sourceShowed:
        'Both pinned issues are in the frozen corpus. Their v1 records, written by an agent, describe the fix in each thread; the next.js record notes its thread never says which files Jekyll dropped.',
      interpretation:
        'That the second notebook explains the first’s gap: aligning them shows vite#9119 naming the underscore prefix that next.js#15588 leaves unstated.',
      sources: [
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'vite#9119, pinned', url: 'https://github.com/vitejs/vite/issues/9119', firmness: 'fact' },
        { label: 'next.js#15588, pinned', url: 'https://github.com/vercel/next.js/issues/15588', firmness: 'fact' },
      ],
      priorArt: ['Duplicate-question closing on Stack Overflow', 'Multiple discovery in the history of science (Merton)', 'Near-duplicate detection', 'Sequence alignment'],
    },
    built:
      'Two ruled notebooks made from the records’ fields; click a line in A, then its counterpart in B. The ledger counts shared tokens with the project tokenizer and reads links, terms and mutual ranks from the frozen index.',
    happened:
      'Our alignment of the duplicate pair finds four matching lines; every pair shares two to four words, and six of A’s ten lines have no counterpart. The index half-knows: the records share three controlled terms and rank each other #3 and #4, but neither links the other. The control pair, which shares only a symptom, shares one word and ranks #13 and #11.',
    uncertain:
      'Both records were written by the same agent, which may make their wording more alike than two human write-ups. One pair is not a rate.',
    falsifier: 'If the records already linked each other, or ranked each other first. They do neither.',
    simpler: 'A “possibly the same finding” link proposed whenever two records share most controlled terms, which on this corpus would have caught the pair.',
    data: 'Frozen v1 records of three pinned GitHub issues, read-only; the alignment is yours, or ours on request, and is never stored.',
    finding:
      'The same fix, found twice: the records share three controlled terms and rank each other #3 and #4, but neither links the other. One explains the other’s gap.',
    related: ['56', '59', '03', '14'],
  },
  {
    n: '55',
    title: 'The Knowledge Fossil',
    family: 'memory',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'reveal',
    encounter: 'four-words',
    question: 'How deep must you dig before a record tells you it might no longer apply?',
    proposition:
      'The signs that a solution’s context may have gone are buried below what a search result shows, or absent altogether.',
    manipulate: 'Choose one of the 30 records and dig down through its fields, one layer at a time, from the problem to the extraction note.',
    changes: 'The layers exposed, any dating marks in them (versions, “era”, “removed”, “older”), and the excavation log.',
    unchanged: 'The records and their ranks. Digging does not change what the index returns; that is the point.',
    provenance: {
      idea: 'The next.js#15588 record’s fix comes from the Next.js 9 era, and another record in the same corpus says the export command it relies on was later removed.',
      mechanism: 'Fossilisation: a form survives after the environment that explains it has gone, and only its depth dates it.',
      sourceShowed:
        'Record contexts carry versions such as Vite 2.9 and Next.js 9.3.5; the next-static-exports record’s context says “next export removed in v14”.',
      interpretation:
        'That linking the 9.3.5 fix to the v14 removal is our inference. The records themselves never connect them.',
      sources: [
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Our link between the two Next.js records', firmness: 'speculation' },
        { label: 'Fossilisation, as a figure for stale answers', firmness: 'metaphor' },
      ],
      priorArt: ['Stack Overflow’s “outdated answers” project', 'Link rot and reference rot studies', 'Version banners in documentation sites'],
    },
    built:
      'A pit of seven layers per record, a pattern that marks dating words, a log of the depth at which the first mark appears, and a survey of all 30 records.',
    happened:
      'Nineteen of 30 records carry no dating mark in any layer: only the extraction date dates them. Of the eleven that do, one shows it on the surface (upload-pages-artifact v4); the rest bury it in aliases, symptoms, context or limitations. For next.js#15588 the first mark is at layer five of seven, and the removal is in a different record.',
    uncertain:
      'The pattern is crude: it misses prose such as “branch-published” that also dates a fix, and it would mark any version number, relevant or not.',
    falsifier: 'If most records showed a dating mark in their problem or solution, the layers a result list displays. One of 30 does.',
    simpler: 'A “valid for” field on each record, shown beside the result, would make the excavation unnecessary.',
    data: 'Frozen Four Words v1 records, read-only. The dating pattern and the one cross-record note are ours.',
    finding:
      'Nineteen of 30 records say nothing about when they stop applying, and all but one of the rest hide it below the surface a search result shows.',
    related: ['53', '51', '59', '31'],
  },
  {
    n: '56',
    title: 'The Forked Interpretation',
    family: 'memory',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'When two readings of the same records disagree, which one does the published number take?',
    proposition:
      'Two incompatible readings of the same source records can both be faithful to the text, and a summary metric silently commits to one of them.',
    manipulate: 'Take the left branch (the v1 labeller’s frozen labels) or the right (the post-hoc review’s reading), walk down the ranking record by record, and cross over at any point.',
    changes: 'Each record’s verdict on your branch, where the branches disagree, the rank of the first answer, and which summary row you stand on.',
    unchanged: 'The query, the 30 sources, the records and the frozen structured ranking: the trunk both readings share. The frozen labels are not edited.',
    provenance: {
      idea: 'The Four Words review found that the structured results at ranks 2 and 4 for “css missing after deploy” both describe missing CSS, yet were not labelled relevant.',
      mechanism: 'A fork in a road, or in a code repository: shared history up to a point, then two lines that can no longer both be true.',
      sourceShowed:
        'FOUR-WORDS.md: adding those two post hoc would move the structured first relevant from rank 7 to 2; the labels stay frozen and the episode lowers confidence in every label.',
      interpretation:
        'We first planned invented communities. The project already contains a real pair of readings, the labeller’s and the reviewer’s, so we used those instead.',
      sources: [
        { label: 'Four Words method and results, post-hoc analysis', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Frozen queries and labels', url: QUERIES_FILE, firmness: 'fact' },
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
      ],
      priorArt: ['Inter-annotator disagreement in relevance judgement (TREC)', 'Software forks', 'Talmudic and legal commentary traditions'],
    },
    built:
      'A trunk, a fork and a dotted path; each step reveals the next ranked record with this branch’s verdict, marking where the other reads it differently. A small table shows MRR@10 under each reading, computed from the frozen rankings.',
    happened:
      'The branches part at rank 2 and again at 4. On the left the first answer is at rank 7; on the right, rank 2; plain keyword search has one at rank 1 either way. Across all 27 queries the structured MRR@10 reads 0.950 on the left and 0.963 on the right; keyword search reads 0.742 on both. The published figure took the left branch, and the right branch would not change who won.',
    uncertain:
      'Both readings come from the same project; a real community dispute would involve people with different stakes, which this cannot model.',
    falsifier: 'If the two readings produced the same summary number. They do not, though the difference is small.',
    simpler: 'One sentence in the method: “two records arguably relevant were not labelled; with them, rank 7 becomes 2”, which FOUR-WORDS.md already says.',
    data: 'Frozen Four Words v1 query q01, its labels, the frozen rankings and the review’s two additions from FOUR-WORDS.md. Nothing is written back.',
    finding:
      'Same records, two faithful readings: rank 7 or rank 2. The published number silently took one branch, and taking the other would not change who won.',
    related: ['54', '53', '12', '03'],
  },
  {
    n: '57',
    title: 'The Agent Leaves a Note',
    family: 'memory',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'photo-frame',
    question: 'What does sanitising remove from a note an agent sends back, besides the private parts?',
    proposition:
      'A pattern sanitiser cannot tell private identifiers from reproducible ones, because both look like codes: it leaks some private data and strips some needed data.',
    manipulate: 'Strike spans of an invented draft note by hand, run a five-rule pattern sanitiser, or restore everything.',
    changes:
      'The reviewable note, sorted into device, tried, observed, guessed and outcome; how many private items still show; how many items a reproducer needs are gone; and the size of the diff the owner would review.',
    unchanged: 'The draft and which of its spans we tagged as private or needed. The tags are ours, set when the note was invented.',
    provenance: {
      idea: 'The photo-frame repository asks agents to send back what they find, strip private data, keep observations apart from guesses and show the owner the diff first.',
      mechanism: 'Redaction: striking text from a document before release, and the reviewer who checks what the redactor missed.',
      sourceShowed:
        'Our case note records the README’s “send back what you find” section and its rules. It does not show what a sanitised note looks like or how well any sanitiser works.',
      interpretation: 'That the hard part is not removing data but deciding which identifiers are evidence. A serial number and a firmware build look alike.',
      sources: [
        { label: 'Case study: the photo-frame repository', url: PHOTO_FRAME_CASE, firmness: 'fact' },
        { label: 'photo-frame-dashboard README, pinned', url: PHOTO_FRAME_README, firmness: 'reported' },
        { label: 'The invented draft note', url: MEMORY_FIXTURES_FILE, firmness: 'speculation' },
      ],
      priorArt: ['Log scrubbers and PII detectors', 'Bug-report templates with “steps to reproduce”', 'Document redaction and FOIA review'],
    },
    built:
      'A desk with the draft on paper and the reviewable note beside it. Each tagged span is a toggle; the sanitiser matches emails, IPv4 addresses, home paths, serial-like codes and hex fingerprints.',
    happened:
      'The sanitiser struck seven spans. Two of seven private items still show, the owner’s first name and the Wi-Fi network name, because neither looks like a code. It also struck both appearances of the firmware build, which the serial-like rule cannot tell from a serial, so two of six items a reproducer needs are gone. By hand, the note can be made clean without loss.',
    uncertain:
      'We wrote both the note and the rules, so the result shows a mechanism, not how real sanitisers perform. A better rule set would do better on this note and fail on another.',
    falsifier: 'If the sanitiser removed every private item and no needed one. On this note it misses two and over-strikes two.',
    simpler: 'A checklist for the human reviewer (“names, networks, addresses, paths, keys”) without any automatic striking.',
    data: 'An invented note about an invented frame (Fictio PF-10), invented owner and invented identifiers, in memory-fixtures.ts. The real repository is linked, not quoted.',
    finding:
      'The pattern sanitiser left the owner’s name and Wi-Fi network in, and took the firmware build out: private and reproducible identifiers look alike.',
    related: ['52', '59', '21'],
  },
  {
    n: '58',
    title: 'The Public Memory Loop',
    family: 'memory',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'problem-desk',
    question: 'In a loop of publishing, reuse and correction, what decides whether known-wrong answers keep being served?',
    proposition:
      'When challenges arrive faster than maintainers can correct them, the loop keeps serving answers already known to be wrong, and nobody reusing them can tell.',
    manipulate: 'Set three knobs (records published per tick, corrections per tick, chance a reuse turns up a problem), then step the simulation one or ten ticks, or start again.',
    changes: 'A field of 64 records, each new, live, challenged or stale, and a ledger of corrections, reuses of live records and reuses of records already challenged.',
    unchanged: 'The six rules, which are printed in full; the seed, so the same knobs always give the same field.',
    provenance: {
      idea: 'The Problem Desk names a loop of six steps, publish to maintain, and highlights the two its desk lets you try. The other four were never modelled.',
      mechanism: 'A queue with arrivals and a fixed service rate. When arrivals exceed service, the queue grows without bound.',
      sourceShowed: 'The essay’s LOOP constant lists the six steps; nothing in the project measures any of them in a real community.',
      interpretation: 'That “maintain” is the step that decides the others, and that its failure is invisible from the reuse side.',
      sources: [
        { label: 'Problem Desk data, including the loop', url: PROBLEM_DESK_FILE, firmness: 'fact' },
        { label: 'The Problem Desk, on the Convergence page', url: SITE_CONVERGENCE, firmness: 'fact' },
        { label: 'The loop as a queue of challenges', firmness: 'speculation' },
      ],
      priorArt: ['Queueing theory (Little’s law)', 'Conway’s Game of Life and other cellular automata', 'Maintainer burnout discussions in open source'],
    },
    built:
      'A seeded toy in loop-sim.ts with six rules, an 8 × 8 field of cells marked by letter and tone, three range inputs and a ledger. It models nothing real.',
    happened:
      'The result is the obvious queueing threshold, which the rules make inevitable. With two records a tick and a 10% drift, after 40 ticks: one correction a tick leaves 23 queued, 10 stale and 125 reuses of challenged records; three a tick leaves 3 queued, none stale and 6 such reuses. The pilot shows the threshold; it does not discover it.',
    uncertain:
      'Every rate is invented. Real reuse is not uniform, challenges are not independent, and some reusers would notice a challenge, which our rules forbid.',
    falsifier: 'If low capacity did not raise the reuse of challenged records. Under these rules it must, so the toy cannot falsify the proposition, only display it.',
    simpler: 'One line of arithmetic: expected challenges per tick (live × reuse × drift) against corrections per tick.',
    data: 'No data. A seeded simulation of rules we wrote; the six step names come from the Problem Desk.',
    finding:
      'A toy, honestly: once challenges outpace corrections, known-wrong records keep being reused. The threshold follows from the rules; the pilot only makes it visible.',
    related: ['52', '51', '53', '30'],
  },
  {
    n: '59',
    title: 'The Portable Problem',
    family: 'memory',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'translate',
    encounter: 'atproto',
    question: 'When a problem record moves between hosts, what arrives, and does it still get found?',
    proposition:
      'A problem record that travels through ordinary hosts loses its provenance before it loses its findability.',
    manipulate: 'Pack one record and send it through a chain of up to four hosts: a typed record, an issue comment, a Q&A page, a feed item or a short social post.',
    changes: 'Each field’s state on arrival (kept, flattened into prose, or lost), and the record’s rank for its frozen labelled queries after re-indexing the arrived copy.',
    unchanged: 'The other 29 records, the queries and the frozen index. A hop can never restore what an earlier hop flattened.',
    provenance: {
      idea: 'The essay’s claim that records should be portable between interfaces, and the ATProto notes on records that live in their authors’ repositories.',
      mechanism: 'Lossy translation between formats: each host has a shape, and whatever does not fit the shape is dropped or flattened.',
      sourceShowed:
        'Our protocol notes describe records with typed fields under a Lexicon. Host shapes here are our simplifications; Bluesky’s post text limit of 300 graphemes is reported, not checked for this pilot.',
      interpretation: 'That “portable” is usually tested by whether the text survives, and rarely by whether its status survives.',
      sources: [
        { label: 'ATProto and portable communities, research notes', url: COMMUNITY_DOC, firmness: 'fact' },
        { label: 'app.bsky.feed.post Lexicon (300-grapheme text)', url: 'https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/post.json', firmness: 'reported' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Schema.org QAPage markup', 'RSS and Atom', 'Data portability exports (Google Takeout)', 'Lossy format conversion, such as Word to plain text'],
    },
    built:
      'A suitcase of eleven fields and five host buttons; each hop applies a keep, flatten or drop map. The arrived copy is re-indexed beside the other 29 records, flattened text counted as context.',
    happened:
      'The note “written by an agent, not reviewed” is lost by every host except the typed record and the issue comment. For vite#8073, a short post keeps one field and still ranks the record #1 for “module blocked mime type”, because that query matches its problem sentence; “blank page github pages” falls from #2 to #22, but that match came from the alias the review found unsupported.',
    uncertain:
      'Our host maps are guesses about typical use, not specifications: a Q&A page or feed item could carry more. Ranks are a demonstration on a copy, not an evaluation.',
    falsifier: 'If, on some route, findability fell before provenance did. On every route we tried, the review status went first or together.',
    simpler: 'A table of fields against hosts with kept, flattened and lost in each cell.',
    data: 'Frozen Four Words v1 records and queries, read-only; the host shapes are ours.',
    finding:
      'Provenance goes first: every ordinary host drops “written by an agent, not reviewed”, while a post that keeps one sentence still ranks #1 for one query.',
    related: ['25', '51', '57', '55'],
  },
  {
    n: '60',
    title: 'Postack Indexes Itself',
    family: 'memory',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'reorder',
    encounter: 'lab',
    question: 'If the laboratory’s own experiments become research records, what can be found in them, and what cannot?',
    proposition:
      'The laboratory’s catalogue already works as a searchable set of source-linked research records, with no extra writing, using the same retrieval code it studies.',
    manipulate: 'Type into a terminal: any words search the catalogue; “sources”, “firmness”, “open NN” and “help” are commands.',
    changes: 'The live answer below the prompt; pressing Enter keeps the last four exchanges on screen.',
    unchanged: 'The catalogue, which is imported read-only, and however many entries this build contains. Nothing about the count is hard-coded.',
    provenance: {
      idea: 'Postack proposes indexing solved problems as records with provenance. The laboratory writes exactly such records about itself, one per pilot.',
      mechanism: 'Reflexive indexing: a library that catalogues its own catalogue, using the BM25F index from Four Words over the pilots’ fields.',
      sourceShowed: 'Each catalogue entry carries a question, a claim, a finding, what happened and firmness-labelled sources.',
      interpretation:
        'That the method’s required fields are already a record format; what is missing is anything a searcher would type that the authors did not.',
      sources: [
        { label: 'The laboratory catalogue', url: LAB_CATALOGUE_DIR, firmness: 'fact' },
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
      ],
      priorArt: ['Library catalogues of library science', 'Self-hosting compilers', 'Research-lab notebooks and preregistration registries'],
    },
    built:
      'A terminal that builds an index over every catalogued pilot at module load (title, question, proposition, finding, happened, built, source labels, prior art) and answers searches and four commands with links to each pilot and its sources.',
    happened:
      'It works for however many entries the build has; on this branch, 13 from four families. “correction” finds 6; “sources” shows which source is cited most; “firmness metaphor” lists the pilots leaning on a figure of speech. The limits are the Four Words limits: before this sentence was written, “privacy” found nothing although 57 is about private data, and “obsolete” missed 55. Naming them here makes them match this entry instead.',
    uncertain:
      'Whether the records stay useful once all sixty exist, and whether anyone besides their authors would search with these words.',
    falsifier: 'If ordinary searches for an idea a pilot tests mostly failed because the catalogue’s fields never name it.',
    simpler: 'The lab index’s own filters, plus the browser’s find-in-page.',
    data: 'The laboratory catalogue, imported read-only at build time; no data of its own.',
    finding:
      'The catalogue already is a set of source-linked research records, and the same index that studies vocabulary loss finds the lab’s own blind spots.',
    related: ['03', '53', '59', '51'],
  },
]
