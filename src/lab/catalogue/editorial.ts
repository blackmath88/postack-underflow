import type { LabEntry } from '../types.ts'
import {
  ADR_0005,
  CONTENT_INVENTORY,
  FOUR_WORDS_DOC,
  FOUR_WORDS_RESULTS,
  LIVE_SITE,
  MARGIN_FILE,
  MOTTE_CONTRACT,
  MOTTE_DOC,
  PR5,
  RECORDS_FILE,
  REFLECTION_DOC,
} from './shared.ts'

const INDEXING_PAGE = `${LIVE_SITE}indexing/`
const COMMUNITY_PAGE = `${LIVE_SITE}community/`

export const EDITORIAL: LabEntry[] = [
  {
    n: '41',
    title: 'The Essay With Two Voices',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'essay',
    question: 'What happens to an argument when its countervoice can be turned up until it takes most of the page?',
    proposition:
      'Set beside the claims it answers, the essay’s own countervoice is not a footnote: at full volume it outweighs the claims it qualifies.',
    manipulate: 'Choose the sceptic (the counterpoint notes) or the historian (the history notes), and turn its volume from silent to its whole note.',
    changes: 'How much the countervoice says beside each passage, and how much of each row it takes: the two columns are sized by their word counts.',
    unchanged: 'The essay’s sentences and the notes’ wording, quoted as they stand.',
    provenance: {
      idea: 'The essay already argues with itself: eight of its margin notes are labelled “Counterpoint” and four “History”. Here they get a column of their own.',
      mechanism: 'Parallel texts and glossed editions, where commentary sits beside the text instead of below it.',
      sourceShowed: 'The margin registry gives each note a kind, an evidence status and a summary, and the routes hang each note from one phrase.',
      interpretation: 'Our reading: a countervoice the author also wrote is a different thing from an outside sceptic, and a page that sets them side by side should say so.',
      sources: [
        { label: 'Margin-note registry, src/content/margin.tsx', url: MARGIN_FILE, firmness: 'fact' },
        { label: 'ADR-0005, three levels and margin notes', url: ADR_0005, firmness: 'fact' },
        { label: 'The essay', url: LIVE_SITE, firmness: 'fact' },
      ],
      priorArt: ['Facing-page and parallel-text editions', 'Glossed manuscripts, commentary around the text', 'Point and counterpoint opinion columns'],
    },
    built:
      'Every essay beat carrying a counterpoint or history note, in two columns whose widths follow their word counts, with a four-step volume dial and a running word balance.',
    happened:
      'The proposition holds. The eight sceptic passages total 175 words of essay; at full volume the sceptic answers with 468 (2.7×). The four historian passages total 73 words; the historian answers with 286 (3.9×). At summary volume the two are about level (151 against 175). Every sceptic note is marked “our reading”: the countervoice is the author arguing with themself, and the dial makes that visible.',
    uncertain:
      'Whether a louder countervoice makes the argument read as less firm, or only longer. Word count is a proxy for weight, not a measure of it.',
    falsifier: 'If at full volume the countervoice stayed shorter than the claims, or if most notes merely restated their claim.',
    simpler: 'A “Counterpoint” label on the existing margin notes, which the essay already has.',
    data: 'The essay’s own sentences, copied from src/routes, and the counterpoint and history notes from NOTES. Nothing invented.',
    finding:
      'At full volume the essay’s own sceptic says 2.7 times as much as the claims it answers, and every word of it is marked “our reading”.',
    related: ['42', '45', '46', '48'],
  },
  {
    n: '42',
    title: 'The Footnote Rabbit Hole',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'print',
    question: 'How far can a reader follow a chain of notes and sources before it ends, and does the line they left stay in reach?',
    proposition:
      'The margin notes and their sources form a network deep enough to wander in, and a pinned reading line makes the wandering safe.',
    manipulate: 'Pick a line, open a noted phrase, then follow a note to a source it cites and the source to another note that cites it; jump back to any step.',
    changes: 'The stack of steps below the line, the depth counter, and which notes and sources are offered next; a revisited step is marked as a loop.',
    unchanged: 'The registry’s links. A chain only follows sources a note registers; nothing is inferred.',
    provenance: {
      idea: 'ADR-0005 makes margin notes one level deep on purpose. We asked what a second and third level would look like, using only the links the registry already holds.',
      mechanism: 'Footnotes that cite footnotes, and the breadcrumb trail of hypertext, with the reading position kept on screen.',
      sourceShowed: 'Each note may list registered source ids; a source has no back-links, so “also cited by” is computed here by inverting the lists.',
      interpretation: 'We expected a web. The registry is mostly a set of single steps.',
      sources: [
        { label: 'Margin-note registry, src/content/margin.tsx', url: MARGIN_FILE, firmness: 'fact' },
        { label: 'ADR-0005, three levels and margin notes', url: ADR_0005, firmness: 'fact' },
      ],
      priorArt: ['Footnoted scholarly editions', 'Hypertext breadcrumb trails', 'Wikipedia link-following', 'Vannevar Bush’s associative trails (As We May Think, 1945)'],
    },
    built:
      'A pinned line from one of four chapters above a stack of note and source cards. Each card offers the next links; the trail is indented one level per step, and any step can be returned to.',
    happened:
      'The proposition fails for depth. Of 38 notes, 22 cite no registered source, so their chain ends at once; 12 lead on to another note. The ten cited sources split the notes into 7 islands. The largest has 8 notes, held together by the photo-frame repository and the Syntax episode; the indexing line reaches one source, doc2query, and stops after two steps. Inline links inside note bodies are invisible to the chain. The pinned line worked as intended.',
    uncertain:
      'Whether a deeper network would be better reading, or just a longer way to lose the thread. Only registered links were followed; a richer registry would change every number.',
    falsifier: 'If most chains ran past three steps without looping. They do not: most end at the first note.',
    simpler: 'A list of “notes that share this source” on the archive index.',
    data: 'NOTES and SOURCES, read-only, and the essay beats copied from src/routes.',
    finding:
      '22 of 38 margin notes cite no registered source, so the rabbit hole is mostly one step deep: the notes form 7 islands, the largest held together by one repository.',
    related: ['41', '48', '33', '57'],
  },
  {
    n: '43',
    title: 'The Page That Disagrees',
    family: 'editorial',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'If a page searched its own data for a counterexample every time a claim appeared, what would it find?',
    proposition:
      'The project’s claims about Four Words overstate the frozen results often enough that a self-checking page would contradict them on arrival.',
    manipulate: 'Bring claims onto the page one at a time, and for two of them choose how broadly to read them: on average, on most queries, or on every query.',
    changes: 'A slip pasted over each claim: the data disagrees, holds, or cannot say, with the worst counterexample in the per-query results.',
    unchanged: 'The claims, quoted from the essay, the research history and FOUR-WORDS.md, and the frozen results they are tested against.',
    provenance: {
      idea: 'REFLECTION §7: compression strips hedges first, so a lighter surface needs a reviewer who reads it against the archive. Here the page is that reviewer.',
      mechanism: 'Executable claims: each sentence is paired with a test over the data it rests on.',
      sourceShowed: 'results/four-words-v1.json holds a first-relevant rank for every query and system, enough to test any per-query comparison.',
      interpretation: 'We expected to catch the essay overclaiming. Reviewed sentences survived; only broader readings of them failed.',
      sources: [
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'What building the essay changed, §7', url: REFLECTION_DOC, firmness: 'fact' },
        { label: 'The Impossible Index, the claims’ page', url: INDEXING_PAGE, firmness: 'fact' },
      ],
      priorArt: ['Literate and executable papers', 'Fact-checking annotations', 'Assertion tests in data journalism'],
    },
    built:
      'Six claims arriving one by one, each tested against the frozen results as it appears. A contradicted claim is struck through under a rose slip; a holding one still shows its biggest exception.',
    happened:
      'The proposition is false as written: of six claims, five hold and one (“Classification is a claim”) is beyond the data. The page only disagrees when a claim is read more broadly than its words. “Structured records beat plain search” holds on average (MRR 0.950 against 0.742) but fails on most queries: better on 10, worse on 1, tied on 16. Every counterexample the page finds is the same query, “css missing after deploy”.',
    uncertain:
      'The claims were chosen by us, after an independent review had already corrected the surface. Unreviewed drafts might have fared worse; we did not test them.',
    falsifier: 'If every claim, read at every scope offered, held against the data. Four of the six readings offered fail.',
    simpler: 'A footnote under each number giving its scope: one run, 27 queries, averaged.',
    data: 'results/four-words-v1.json and corpus/queries.json, read-only. The claims are quoted from the project’s own pages.',
    finding:
      'Every reviewed claim survives its own data; the page disagrees only when a claim is read more broadly, and every counterexample is the same query.',
    related: ['44', '47', '05', '15'],
  },
  {
    n: '44',
    title: 'The One-Sentence Experiment',
    family: 'editorial',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'disputed-neighbour',
    question: 'Can the whole mechanism of the Disputed Neighbour fit into one sentence whose words are its controls?',
    proposition:
      'A single sentence that rewrites its own ending when you toggle its query words explains why an index finds a report better than a result list does.',
    manipulate: 'Turn each of eight query words on or off, and switch between the description index and the raw text of the sources.',
    changes: 'The end of the sentence: where the vite#8073 report ranks, what beats it, and which of your words reach it only through fields the record writer wrote.',
    unchanged: 'The frozen indexes and the report. Ranks come from the shared retrieval code; this demonstrates a mechanism and is not an evaluation.',
    provenance: {
      idea: 'REFLECTION §2: the query “vite blank page github pages” ranks the vite#8073 record first through “blank”, a word the report never uses.',
      mechanism: 'Explorable explanations, where the nouns of a sentence are adjustable.',
      sourceShowed: 'The Disputed Neighbour sets the report beside its record in two layers. This pilot drops the layers and keeps one sentence and one ranking.',
      interpretation: 'Our reading: “because” is the important word. A rank alone hides which words were written in.',
      sources: [
        { label: 'The Disputed Neighbour, on the Impossible Index', url: INDEXING_PAGE, firmness: 'fact' },
        { label: 'What building the essay changed, §2', url: REFLECTION_DOC, firmness: 'fact' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Bret Victor, Explorable Explanations (2011)', 'Tangle reactive documents', 'Search engines’ “why this result” panels'],
    },
    built:
      'One sentence with a toggle for the index and a toggle for each word; its ending is generated from the ranking and from whether each matching word occurs in the report. A collapsed table shows the working.',
    happened:
      'It works, and the sentence says more than a rank would. With “vite blank page github pages” the report comes first of 30, and “blank” reaches it only through the alternative phrasings. Drop “blank” and it falls to second. “vite js file 404 github pages” puts it second, with “404” coming only from a controlled term. The raw-text index puts the same report 4th and 7th.',
    uncertain:
      'Whether a sentence this long is easier to follow than a two-column view. Grammar breaks down with more than two supplied words.',
    falsifier: 'If the generated ending were no clearer than the rank number on its own, or misattributed which words were supplied.',
    simpler: 'The Four Words search with its existing per-result explanation, which already lists matched fields.',
    data: 'The frozen v1 description and raw-text indexes, read-only, ranked live in the browser.',
    finding:
      'One toggled word moves the report from first to second: “blank” reaches it only through phrasings the record writer added, and the sentence can say so.',
    related: ['43', '50', '03', '12'],
  },
  {
    n: '45',
    title: 'The Story You Can Interrupt',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'essay',
    question: 'What does a reader give up by not stopping for an optional aside?',
    proposition:
      'A story can offer every aside without forcing any, and still be read safely straight through: skipping loses detail, not anything the surface depends on.',
    manipulate: 'Read the Switchboard chapter one beat at a time; at each noted phrase, open the aside or carry on without it, or read straight through, passing every aside.',
    changes: 'Which asides appear in the story, a running log of what was opened and passed, and at the end a ledger of what each pass cost.',
    unchanged: 'The chapter’s text and order. The pilot cannot tell whether opening asides helps anyone understand; it says so on the page.',
    provenance: {
      idea: 'ADR-0005 promises that a reader never needs the notes to follow the story. This pilot checks what each skip actually costs on one chapter.',
      mechanism: 'Pause points in an audio guide or a choose-your-depth museum label, with a record of the path taken.',
      sourceShowed: 'The Switchboard page carries eleven notes, each with an evidence status; three are marked as being about fixtures.',
      interpretation: 'We expected every skip to be safe. One is not.',
      sources: [
        { label: 'The Switchboard chapter', url: COMMUNITY_PAGE, firmness: 'fact' },
        { label: 'ADR-0005, three levels and margin notes', url: ADR_0005, firmness: 'fact' },
        { label: 'Content inventory of the editorial pass', url: CONTENT_INVENTORY, firmness: 'fact' },
      ],
      priorArt: ['Museum audio guides with optional stops', 'Interactive fiction with skippable branches', 'Reading-time estimates on articles'],
    },
    built:
      'A linear reader of the chapter’s 14 beats with a pause at each of its 11 notes, a running log, and a way to read straight through. At the end, a ledger lists every aside, opened or passed, and what passing it cost: detail, a caveat the story also states (quoted from the story), or a caveat stated nowhere else. When that one was passed, the thread it belongs to is flagged in the story.',
    happened:
      'The proposition fails once. Straight through, the chapter is 314 words; its 11 asides hold another 623. The surface itself says the eight contributions are invented, so passing “Are these real people?” costs only detail. The first aside is different: “Is this a real thread?” is the only place the chapter’s text says its four-step thread is an illustration, not a quotation. Skip it and nothing else tells you.',
    uncertain:
      'Whether readers infer the illustration anyway from its generic wording. That is a comprehension question this pilot cannot answer, and no reader has used it.',
    falsifier: 'If every passed aside were restated on the surface. One is not.',
    simpler: 'Reading the chapter with every note closed, and listing the notes whose content the surface does not repeat.',
    data: 'The Switchboard chapter’s prose, copied from src/routes/community.tsx, and its eleven NOTES.',
    finding:
      'Skipping every aside is safe but once: the only statement that the chapter’s four-step thread is an illustration lives in an aside, the chapter’s first.',
    related: ['41', '48', '49', '25'],
    reflection:
      'The kernel’s warning lumped the three asides about invented material together, which hid the result: two of them are said again on the surface, and only one is not. The ledger separates them, quoting the story’s own words where it repeats a caveat, so the one unsafe skip is named rather than inferred. Reading straight through takes one press, which helped more than speeding up the beats would have. The earlier finding said this aside is the one “you are most likely to pass”, which nothing here measures; it is only the first. A plainer control, the chapter read with every note closed beside a list of unrepeated notes, would find the same aside, without showing the thread it leaves unexplained.',
  },
  {
    n: '46',
    title: 'The Broken Analogy',
    family: 'editorial',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'translate',
    encounter: 'switchboard',
    question: 'How far can the essay’s two metaphors be stretched over what they describe before they snap?',
    proposition: 'The switchboard breaks sooner than the card catalogue, and at the point the essay needs it most.',
    manipulate: 'Choose a metaphor, then stretch it over one more feature of the system at a time, or let go.',
    changes: 'The list of correspondences, each marked holds, strains or breaks, and a band between two posts that thins with strain and snaps at two.',
    unchanged: 'The historical side, which is only what the margin notes say and is reported, not checked. The order and the verdicts are our reading.',
    provenance: {
      idea: 'The margin note “Where do the metaphors stop?” and REFLECTION §4: persistent records are our change to the switchboard, not a property of it.',
      mechanism: 'A physical band under tension: each correspondence adds load until it gives way.',
      sourceShowed: 'PR #5 describes switchboards and catalogues; the margin notes carry those descriptions, marked as reported.',
      interpretation: 'Where the band snaps depends on the order we chose. We put features in the order the essay leans on them.',
      sources: [
        { label: 'PR #5, physical information systems research', url: PR5, firmness: 'reported' },
        { label: 'What building the essay changed, §4', url: REFLECTION_DOC, firmness: 'fact' },
        { label: 'Margin notes on the switchboard and the catalogue', url: MARGIN_FILE, firmness: 'metaphor' },
        { label: 'The Switchboard experiment', url: COMMUNITY_PAGE, firmness: 'fact' },
      ],
      priorArt: ['Lakoff and Johnson, Metaphors We Live By (1980)', 'Structure-mapping theory of analogy (Gentner, 1983)', 'Design-pattern “forces” and their limits'],
    },
    built:
      'Two metaphors with six correspondences each, drawn from existing notes and the reflection. A stretch control, an SVG band between “then” and “now”, and a marked list of what holds and what breaks.',
    happened:
      'The proposition holds, with a caveat we built in. The switchboard holds three features, strains on the fourth (the authors’ own references survive the cord) and snaps on the fifth: it kept nothing, and keeping is the model’s point. The card catalogue holds four, strains on review status, and snaps only on the sixth, institutional authority. Change the order and the break moves; the verdicts do not.',
    uncertain:
      'Every verdict is our judgement. Someone else would mark different strains, and the historical details are not independently verified.',
    falsifier: 'If the switchboard carried as many features as the catalogue before breaking, whatever order they were put in.',
    simpler: 'The margin note “Where do the metaphors stop?”, which says the same in two sentences.',
    data: 'Correspondences written for this pilot from existing NOTES and docs/REFLECTION.md; no new historical claim.',
    finding:
      'The switchboard snaps on the fifth feature, persistence, which is the point of the model; the card catalogue holds until institutional authority.',
    related: ['41', '45', '25', '31', '38'],
  },
  {
    n: '47',
    title: 'The Reader’s Hypothesis',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'predict',
    encounter: 'four-words',
    question: 'Does committing to a guess about a real result change what the result says to you?',
    proposition:
      'Asked to guess first, a reader commits to the headline reading of Four Words, and the reveal shows the structure the headline hides: ties, one loss and supplied words.',
    manipulate: 'Set a guess on a scale for each of four questions, seal it, and only then see the frozen answer beside it.',
    changes: 'The sealed envelope opens to the v1 figure on the same scale as your guess, the distance between them, and what the figure means.',
    unchanged: 'The answers, read from the frozen results. A sealed guess cannot be moved, and nothing is stored or sent.',
    provenance: {
      idea: 'The frozen Four Words v1 results are real outcomes nobody outside the project has predicted.',
      mechanism: 'Prediction before reveal, as in “you draw it” charts and pre-registration.',
      sourceShowed: 'v1: descriptions better on 10 queries, worse on 1, tied on 16; “blank page github pages” at rank 15 for plain search; the opening query at rank 7 for descriptions.',
      interpretation: 'Our reading: a sealed guess turns a statistic into a surprise or a confirmation, which a table cannot do. We did not test whether it changes recall.',
      sources: [
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Four Words, on the Impossible Index', url: INDEXING_PAGE, firmness: 'fact' },
      ],
      priorArt: ['The New York Times, “You Draw It” (2015)', 'Pre-registration of hypotheses', 'Prediction prompts in teaching (predict, observe, explain)'],
    },
    built:
      'Four questions with a range each, a seal button, and a reveal that places the v1 answer on the same line as the guess. Sealed guesses are listed for the tab only.',
    happened:
      'The mechanism works; whether it does anything for a reader is untested. The answers are 10 of 27, rank 15, rank 7 and about 72% (MRR falls from 0.950 to 0.892 without aliases and symptoms, against 0.742 for plain search). The questions were chosen because the answers diverge from the headline, so the pilot is built to surprise; a neutral set might not.',
    uncertain: 'Whether a sealed guess changes what anyone remembers. That needs readers, and none has used it.',
    falsifier: 'If, with the questions set, the frozen answers sat where the headline “25 against 17” would lead a guesser. They do not, but only because we chose them.',
    simpler: 'A sentence before the results table: “Most queries were ties.”',
    data: 'results/four-words-v1.json and corpus/queries.json, read-only.',
    finding:
      'The pilot works as a mechanism but is built to surprise: we chose the four questions whose v1 answers sit furthest from the headline.',
    related: ['43', '50', '04'],
  },
  {
    n: '48',
    title: 'The Invisible Appendix',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'reveal',
    encounter: 'essay',
    question: 'Can deep material be felt from the surface without being read, and is that where the hedges went?',
    proposition: 'The editorial pass moved the essay’s qualifications below the surface: the deeper you dial, the denser the hedging.',
    manipulate: 'Turn one depth dial through four positions: the story, soundings, summaries, everything.',
    changes: 'Soundings under each noted phrase sized by the words beneath it, then summaries, then full notes; a readout of words in view and hedging words among them.',
    unchanged: 'The Impossible Index text and its nine notes. The hedge list is a crude word list, written for this pilot.',
    provenance: {
      idea: 'REFLECTION §7: “compression strips hedges first”. The content inventory records the surface of this chapter falling by 66%.',
      mechanism: 'A depth sounder: you learn how deep the water is without diving.',
      sourceShowed: 'The editorial pass moved method, caveats and tables into notes and the archive; the independent review then put several hedges back on the surface.',
      interpretation: 'We expected the hedges to have sunk. The review seems to have kept them up.',
      sources: [
        { label: 'What building the essay changed, §7', url: REFLECTION_DOC, firmness: 'fact' },
        { label: 'Content inventory of the editorial pass', url: CONTENT_INVENTORY, firmness: 'fact' },
        { label: 'The Impossible Index', url: INDEXING_PAGE, firmness: 'fact' },
      ],
      priorArt: ['Progressive disclosure', 'Stretchtext (Ted Nelson)', 'Layered “inverted pyramid” news writing'],
    },
    built:
      'The chapter’s 14 beats with a four-step depth dial. Soundings are dotted lines whose length is proportional to the hidden words; hedging words are marked once the dial leaves the surface.',
    happened:
      'The proposition is false on this measure. The surface has 316 words and 11 hedging words, one every 29. With summaries it is 479 words and 16 hedges, one every 30; with everything, 954 words and 28 hedges, one every 34. The notes are slightly less hedged than the story. The soundings do show where depth lies (638 words under 9 phrases) without asking anyone to read it.',
    uncertain: 'Whether the word list captures hedging at all; a hedge is often a clause, not a word. One chapter is a small sample.',
    falsifier: 'If hedge density at the surface matched or exceeded that of the notes. It does.',
    simpler: 'A word count beside each margin-note marker.',
    data: 'The Impossible Index prose, copied from src/routes/indexing.tsx, and its NOTES. The hedge list is ours and crude.',
    finding:
      'The hedges did not sink: the surface carries one hedging word every 29 words, the full notes one every 34. The review kept them on top.',
    related: ['41', '42', '45'],
  },
  {
    n: '49',
    title: 'The Historical Intruder',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'motte',
    question: 'If a desktop-pet character may only interrupt with an existing note and its evidence status, when does it get to speak?',
    proposition:
      'Confined to the margin and to existing notes, Motte can interrupt as editorial marginalia without inventing anything; under its own contract it would interrupt often enough to matter.',
    manipulate: 'Choose the rule Motte follows, read the essay passage by passage, and answer or wave off an interruption.',
    changes: 'Whether Motte sleeps or lands in the margin beside a passage with a note, its kind and its evidence status, and a count of chances so far.',
    unchanged: 'Motte itself, imported unmodified; publicHistoryFlags, applied as written; the notes, which are only shown, never written.',
    provenance: {
      idea: 'Desktop pets that walk along the edge of a window, and the Motte contract, which forbids invented history.',
      mechanism: 'Marginalia with a voice: an annotator who interrupts, but only from the edge.',
      sourceShowed: 'historyFlags is empty, and only notes marked checked could pass publicHistoryFlags. None of the four history notes is checked.',
      interpretation: 'Our reading: the contract is doing its job. An honest historical companion has, for now, nothing to say.',
      sources: [
        { label: 'Motte, the Archive Moth', url: MOTTE_DOC, firmness: 'fact' },
        { label: 'Motte integration contract', url: MOTTE_CONTRACT, firmness: 'fact' },
        { label: 'Margin-note registry, src/content/margin.tsx', url: MARGIN_FILE, firmness: 'fact' },
      ],
      priorArt: ['Microsoft Office Assistant (Clippy, 1997)', 'Desktop pets such as eSheep and Shimeji', 'Medieval marginalia'],
    },
    built:
      'A reading column of the essay’s 34 noted passages beside a margin rail. Each note is mapped to a HistoryFlag and filtered by publicHistoryFlags; three rules decide what Motte may bring.',
    happened:
      'The proposition fails, as the contract intends. Under Motte’s own rule there are 0 interruptions in the whole essay, because no history note is checked. Allowing checked notes of any kind gives 8; two other checked notes are dropped because they cite no registered source. Allowing every history note gives 4, every one unverified: measured, reported, our reading, reported. To speak about history at all, Motte has to bring material it should flag as needing review.',
    uncertain: 'Whether interruptions in the margin read as marginalia or as distraction. No reader has seen it.',
    falsifier: 'If any history note passed the contract filter. None does.',
    simpler: 'A badge on each history note saying “not yet checked”.',
    data: 'NOTES, SOURCES and the essay beats; MotteSprite and publicHistoryFlags from src/features/motte, imported only.',
    finding:
      'Under its own contract, Motte interrupts the whole essay 0 times: none of the four history notes is checked. To speak about history it must bring unverified notes.',
    related: ['37', '38', '45', '42'],
  },
  {
    n: '50',
    title: 'The Twenty-Second Explanation',
    family: 'editorial',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'Can a diagram carry one research finding faster than the paragraph that states it, and what does it lose?',
    proposition: 'A diagram computed from the data states the supplied-vocabulary finding as completely as the essay’s paragraph, in less time.',
    manipulate: 'Start the clock on the paragraph or the diagram, stop it when you have it, answer one question, then try the other form.',
    changes: 'A running clock against a 20-second mark, the explanation shown, and a log of each attempt, marked unfresh after the first.',
    unchanged: 'The finding and the paragraph’s wording. The clock times one person in one tab and claims nothing about anyone else.',
    provenance: {
      idea: 'The margin note “Which words did the writer add?” and the FOUR-WORDS.md audit: most wins matched a query word absent from the source.',
      mechanism: 'Small multiples: one row per query, every word checked against its source.',
      sourceShowed: 'FOUR-WORDS.md: in 7 of the 10 wins the first relevant record matched a word not in its source; one of those, trailing slash, is a tokenizer artefact.',
      interpretation: 'We expected the diagram to win outright. It counts faster but cannot say that one of its seven is an artefact.',
      sources: [
        { label: 'Four Words method and results, post-hoc analysis', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
        { label: 'The Impossible Index', url: INDEXING_PAGE, firmness: 'fact' },
      ],
      priorArt: ['Tufte, small multiples', 'Timed reading tasks in usability testing', 'Explainer videos with a fixed running time'],
    },
    built:
      'A clock, the essay’s paragraph and a diagram of the 10 winning queries whose words are marked as in the source, only in the description, or in neither, computed from the frozen indexes. One multiple-choice question and a log for the tab.',
    happened:
      'The diagram reproduces the audit: 7 of the 10 wins carry a word only in the description. But it marks “trailing” and “slash” exactly like “blank”, while the paragraph says six plus one tokenizer artefact. Answering from the paragraph means adding six and one; from the diagram, counting rows. Speed aside, the faster form drops the qualification, which is the essay’s own warning about compression. We timed only ourselves, with prior knowledge, so the clock proves nothing.',
    uncertain: 'Which form is faster for someone new to the finding. That needs readers who have seen neither, and none has.',
    falsifier: 'If the diagram carried every qualification the paragraph does. It loses the tokenizer artefact.',
    simpler: 'Bold the six words in the paragraph.',
    data: 'results/four-words-v1.json, corpus/queries.json and the frozen v1 indexes, read-only; the paragraph is the essay’s own.',
    finding:
      'The diagram counts the seven supplied-word wins at a glance but marks the tokenizer artefact like a real addition; the paragraph keeps the distinction.',
    related: ['44', '47', '48', '01'],
  },
]
