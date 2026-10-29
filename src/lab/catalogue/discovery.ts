import type { LabEntry } from '../types.ts'
import {
  CORPUS_MANIFEST,
  ESSAY_INDEXING,
  FOUR_WORDS_DOC,
  FOUR_WORDS_RESULTS,
  IMPOSSIBLE_INDEX_STUDY,
  RECORDS_FILE,
  RETRIEVAL_FILE,
} from './shared.ts'

export const DISCOVERY: LabEntry[] = [
  {
    n: '01',
    title: 'Four Words, No Words',
    family: 'discovery',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'four-words',
    question: 'Can a person find the right record by answering yes or no about what they recognise, without typing a single word?',
    proposition:
      'A few yes/no questions about recognisable symptoms narrow the 30 records to one, so a searcher who cannot name the problem can still reach its fix.',
    manipulate:
      'Answer yes, no or not sure to one question at a time, and choose which kinds of question you can answer: what you see, what you know about your setup, or what you would only know with the fix.',
    changes: 'Records that contradict an answer are crossed off a board of all 30; the next question is the one that splits the rest most evenly.',
    unchanged: 'The records and their controlled terms. The questions are our plain wording of those terms, and their grouping by kind of knowing is our reading.',
    provenance: {
      idea: 'Four Words assumed that a searcher can produce four words. Pilot 03 found that a fifth of the words in relevant pairs meet nowhere; this asks what is left when the searcher has no words at all.',
      mechanism: 'Elimination by binary questions, as in the parlour game twenty questions or a diagnostic key: each answer removes the records that disagree with it.',
      sourceShowed:
        'The v1 records each carry one to four of 16 controlled terms, written before any query ran. Several records carry identical sets.',
      interpretation:
        'We guessed that the controlled vocabulary, being about problems, would mostly describe what a person sees. Tagging each term by what answering it takes tests that.',
      sources: [
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Twenty questions and dichotomous identification keys', firmness: 'metaphor' },
      ],
      priorArt: [
        'Dichotomous keys in botanical identification',
        'Akinator-style guessing games',
        'Faceted search with drill-down counts',
        'Troubleshooting wizards in printer and operating-system help',
      ],
    },
    built:
      'A question card that always asks about the controlled term splitting the remaining records most evenly, a board of all 30 records that crosses them off, and a tally that plays the game truthfully for every record under the chosen kinds of question.',
    happened:
      'With every kind of question, 16 of the 30 records end alone after about four and a half answers, and never more than three remain. With only what you can see, 3 of 30 end alone and on average five remain, nine at worst. Most of the narrowing is done by setup knowledge, not by symptoms, and six groups of records share identical terms, so no question in this vocabulary can ever separate them.',
    uncertain:
      'Our wording of each question and the see/know/fix grouping are judgements; a different reading would move terms between groups. Nobody but us has answered the questions.',
    falsifier: 'If questions about visible symptoms alone isolated most records. They isolate 3 of 30.',
    simpler: 'A faceted list of the 16 controlled terms with counts would narrow the same set, though it asks the searcher to read the vocabulary rather than recognise a description.',
    data: 'Frozen Four Words v1: the 30 records’ controlled terms. The 16 questions and their grouping are written by us, in this pilot’s source.',
    finding: 'Without words you can get close, but mostly by knowing your setup: symptoms alone leave about five records in play, and six groups of records can never be told apart.',
    related: ['03', '06', '10'],
  },
  {
    n: '02',
    title: 'The Neighbour You Didn’t Ask For',
    family: 'discovery',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'reveal',
    encounter: 'disputed-neighbour',
    question: 'When a search misses a relevant source, is it standing next door to the result the search did give?',
    proposition:
      'A relevant source that lexical matching leaves out of the top five is often a direct neighbour of the first result, through the records’ related links or shared controlled terms.',
    manipulate: 'Choose one of the 27 frozen queries and the system that runs it.',
    changes:
      'The floor plan redraws around result 1: linked records on the inner ring, records sharing two or more controlled terms on the outer ring, with labelled-relevant ones filled and missed ones starred.',
    unchanged: 'The queries, labels, records and both indexes. Only result 1 is used as the centre; no second search runs.',
    provenance: {
      idea: 'The essay’s Disputed Neighbour asks whether two records the index files together really belong together. This asks the reverse: what useful record sits beside a result that the ranking did not show.',
      mechanism: 'Browsing by adjacency: from a found item, step along the links and shared subject headings that catalogue writers added, instead of searching again.',
      sourceShowed:
        'The v1 records carry 60 related links and 16 controlled terms. The labelled queries mark which sources would fix each problem.',
      interpretation:
        'We expected the related links to catch what words miss, because the record writer drew them from the problems, not from the queries.',
      sources: [
        { label: 'The Disputed Neighbour, on the essay’s indexing page', url: ESSAY_INDEXING, firmness: 'fact' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
      ],
      priorArt: ['“See also” references in library catalogues', 'Shelf browsing next to a found book', 'Recommendation by item–item similarity'],
    },
    built:
      'An SVG floor plan around the first result of one frozen query, a list of every neighbour with its door, search rank and label, and a tally over all 27 queries for the chosen system.',
    happened:
      'Partly true, at a price. Plain keyword search leaves 26 relevant sources out of its top five across the 27 queries; 9 of them stand next door to result 1, in 6 queries. But opening every door means 138 neighbours, of which only 24 are labelled relevant. For the problem-oriented index the numbers are 15 missed, 7 next door, 127 doors. The neighbour you did not ask for exists; it is outnumbered about five to one by neighbours you do not need.',
    uncertain:
      'The labels come from the same project that wrote the records and their related links, so agreement between them is not independent evidence. Two shared terms is our threshold.',
    falsifier: 'If almost no missed relevant source stood next to result 1. A third of them do, for plain search.',
    simpler: 'A “see also” list under each result, as most catalogues print, carries the same links without the plan.',
    data: 'Frozen Four Words v1: records (related fields and controlled terms), the 27 queries and their labels, both indexes. Read-only.',
    finding: 'A third of what plain search misses stands next door to its first result, but it shares the corridor with about five neighbours you do not need.',
    related: ['03', '05', '09'],
  },
  {
    n: '03',
    title: 'The Lost Synonym',
    family: 'discovery',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'four-words',
    question: 'When a search finds a source, whose words did the meeting happen in?',
    proposition:
      'Most short searches that should find a source meet it through words someone else added to the index, not through the words of the person who had the problem.',
    manipulate: 'Pick a source from the frozen corpus and type, or choose, a description of its problem.',
    changes: 'Each searched word is sorted into: said by the source, said only by the index’s added description, or said by nobody. Both rankings update.',
    unchanged: 'The sources, the records, the labels and both indexes. They are read from the frozen v1 artifact.',
    provenance: {
      idea: 'The Four Words audit found that most of the structured index’s wins used words the record writer supplied, such as “blank” for vite#8073.',
      mechanism: 'Vocabulary mismatch: two people describe one failure in different words, and retrieval only sees shared tokens.',
      sourceShowed:
        'In 7 of 10 queries the structured index won, its first relevant record matched a query word absent from that source’s snapshot (post-hoc, v1 audit).',
      interpretation:
        'Our guess was that this would be the normal case: that index vocabulary carries most meetings. The tally tests that guess against all labelled pairs.',
      sources: [
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
      ],
      priorArt: [
        'Furnas et al., “The vocabulary problem in human-system communication” (1987)',
        'doc2query-style document expansion',
        'Query-log synonym mining',
      ],
    },
    built:
      'A word-by-word meeting table for one source and one description, plus a tally over every query–source pair the v1 labeller marked relevant, computed in the browser with the shared tokenizer.',
    happened:
      'The proposition failed. Across the 64 labelled pairs, about two thirds of query words occur in the source’s own text, and only about one in eight meet solely through the index. The surprise was the third group: more than a fifth of words meet nowhere, yet the labeller still judged the source relevant. Those are synonyms that exist only in a reader’s head.',
    uncertain:
      'The queries were written by the same project that wrote the records and labels, so their vocabulary is not independent. Real searchers might lose far more words.',
    falsifier:
      'If index-only words outnumbered source words across the labelled pairs. They do not, on this corpus.',
    simpler: 'A two-column table of query words and a yes/no column per system would carry the same facts, without the sense of words falling away.',
    data: 'Frozen Four Words v1: 30 pinned sources (term counts only), their records and the 27 labelled queries. Read-only; nothing is re-ranked or re-labelled.',
    finding:
      'False as stated: most words meet in the source’s own text. But a fifth of the words in relevant pairs meet nowhere at all.',
    related: ['01', '02', '10', '14'],
  },
  {
    n: '04',
    title: 'A Search That Explains Itself',
    family: 'discovery',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'four-words',
    question: 'If you can move the weights behind a ranking, does the ranking turn out to rest on them?',
    proposition:
      'The problem-oriented index’s first results depend on its hand-set field weights: moderate changes to them would reorder the top result for many queries.',
    manipulate: 'Six faders, one per record field (problem, aliases, symptoms, terms, context, solution), and the query.',
    changes:
      'The ranking re-sorts live; each score is split back into the fields it came from, arrows show movement against the frozen weights, and a line counts how many of the 27 frozen queries change their first result.',
    unchanged: 'The postings, field lengths, tokenizer and BM25F formula of the frozen index. No score against the labels is shown, by design.',
    provenance: {
      idea: 'Four Words shows why each result matched, word by word. The weights behind those words (problem 3, aliases 2, symptoms 2, terms 2, context 1, solution 1) were fixed before the run and never shown as something you could touch.',
      mechanism: 'BM25F sums weighted, length-normalised term frequencies per field before saturating them, so a field weight changes how much each word counts where it appears.',
      sourceShowed:
        'The v1 write-up reports the weights were fixed before evaluation and that removing aliases and symptoms lowered MRR from 0.950 to 0.892.',
      interpretation:
        'We expected a fragile ranking: that the frozen result order was one point in a landscape that tilts as soon as anything moves.',
      sources: [
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
        { label: 'The shared retrieval code (BM25F)', url: RETRIEVAL_FILE, firmness: 'fact' },
        { label: 'The Four Words search, on the essay’s indexing page', url: ESSAY_INDEXING, firmness: 'fact' },
      ],
      priorArt: [
        'Robertson and Zaragoza, BM25F (2004 onwards)',
        'Relevance-tuning consoles in Elasticsearch and Solr',
        'Explainable ranking work such as score breakdowns in search engines’ debug views',
      ],
    },
    built:
      'A mixing desk of six vertical faders over the frozen problem-oriented index, a ranked list with per-field score bars, and a count of first results that differ from the frozen weights. A banner says it is a demonstration, not an evaluation.',
    happened:
      'The proposition failed. Setting every weight to 1 changes the first result of only 1 of the 27 frozen queries; doubling any single weight changes at most 1; removing a field changes between 0 and 4. Only extreme settings move much: one field alone changes 7 to 18 first results. On this corpus the ranking rests on which words the records contain, far more than on how the fields are weighted.',
    uncertain:
      'The per-field bar split is our proportional attribution, not part of BM25F. A larger or less tidy corpus might be far more sensitive to weights.',
    falsifier: 'If moderate weight changes (all equal, or any one doubled) moved the first result for many queries. They move one at most.',
    simpler: 'A table of the 27 queries’ first results under four preset weightings would carry the finding without faders.',
    data: 'Frozen Four Words v1 problem-oriented index and the 27 queries (text only; labels are not used). Weights change in memory only.',
    finding: 'The weights barely matter here: making every field equal changes the first result for 1 of 27 queries. The ranking rests on vocabulary, not on weighting.',
    related: ['03', '05', '06'],
  },
  {
    n: '05',
    title: 'The Wrong Door',
    family: 'discovery',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'four-words',
    question: 'When a short search names no tool, how often is the first plausible answer a fix for somebody else’s tool?',
    proposition:
      'For queries that name no framework, a ranked list usually puts a framework-specific fix for the wrong tool before any fix that would apply.',
    manipulate: 'Say which tool you build with, choose a query that names no tool, and open doors along a corridor of the first six results.',
    changes:
      'Behind each door is the fix its record states, judged against your tool: yours, general, or wrong door. A counter tracks wrong doors opened and where the first fitting one stands.',
    unchanged: 'The ranking, which is the frozen problem-oriented index’s. Which tool a source is for is read from the repository it lives in.',
    provenance: {
      idea: 'The corpus covers one problem across many frameworks: Vite’s base, Next.js’s basePath, Create React App’s homepage, Gatsby’s pathPrefix, Astro’s base, SvelteKit’s paths.base. Their fixes look alike and are not interchangeable.',
      mechanism: 'A result that matches the symptom but presumes a different toolchain: the fix names a setting in a config file your project does not have.',
      sourceShowed:
        'Of the 30 sources, 20 are tied to one of 11 tools by their repository; 10 are general (GitHub Docs, the Pages actions, MDN, spa-github-pages).',
      interpretation: 'We read applicability as a matter of toolchain only, which is the simplest test and certainly incomplete.',
      sources: [
        { label: 'Source manifest with repositories', url: CORPUS_MANIFEST, firmness: 'fact' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Context-aware search filters (“language:”, “framework:” facets)', 'Stack Overflow tags', 'Version pickers in documentation sites'],
    },
    built:
      'A corridor of six doors per query, a tool selector, a room behind each door with the record’s fix and a verdict, and a tally over every frozen query and every tool for both systems.',
    happened:
      'Mostly true. Across 297 corridors (27 queries × 11 tools), plain keyword search puts a wrong door first in 160 and the problem-oriented index in 170, with about two wrong doors before the first that fits (2.0 and 1.8 on average). The better index is no better at this: it finds the right kind of problem, then hands you another tool’s fix.',
    uncertain:
      'Toolchain is a crude test of applicability: a general page may not apply either, and a Vite fix can still teach a Next.js user something. The tally includes queries that name a tool.',
    falsifier: 'If, for most tools, the first door already fitted. It fits first in fewer than half of the corridors.',
    simpler: 'A tool filter on the result list, as many documentation searches have, would remove the wrong doors without the corridor.',
    data: 'Frozen Four Words v1: both indexes, records’ solutions, source repositories and the 27 queries (text only). The tool mapping lives in the pilot’s helper.',
    finding: 'In more than half of all query–tool pairs the first result is another framework’s fix, and the problem-oriented index does this slightly more often than plain search.',
    related: ['02', '04', '08'],
  },
  {
    n: '06',
    title: 'The Unfinished Index',
    family: 'discovery',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'reveal',
    encounter: 'four-words',
    question: 'Can an index tell apart a word it never saw, a document it did not match, a copy that may be out of date, and a source nobody collected?',
    proposition:
      'From inside the index, “never collected” is indistinguishable from “unindexed”: an absent topic shows up only as an unknown word.',
    manipulate: 'Type a query or pick a preset.',
    changes:
      'Four ledger columns fill: unindexed words per index, relevant sources left unmatched (for frozen queries), matched sources pinned only to a date, and words from our hand-written list of uncollected tools.',
    unchanged: 'Both indexes, the snapshots and their pins. The “never collected” list is fixed and written by us.',
    provenance: {
      idea: 'The search engine in retrieval.ts already reports unknown terms and keeps unmatched documents instead of discarding them. The issues in the corpus are pinned to updated_at, not a commit.',
      mechanism: 'Four different kinds of absence: of a word from the vocabulary, of overlap between query and document, of a fixed version, and of a source from the collection.',
      sourceShowed:
        'Files are pinned to a commit; the four issues only to their last update. The manifest lists 30 sources on one topic, chosen for coverage.',
      interpretation:
        'We expected the fourth column to be invisible to the index, so that a missing tool would always look like a typo.',
      sources: [
        { label: 'The shared retrieval code', url: RETRIEVAL_FILE, firmness: 'fact' },
        { label: 'Source manifest and pins', url: CORPUS_MANIFEST, firmness: 'fact' },
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
      ],
      priorArt: ['“No results” pages that suggest spelling corrections', 'Web archive capture dates', 'Library catalogues’ “not held” and interlibrary loan prompts'],
    },
    built:
      'A four-column ledger under one query box. The first three columns are computed from the frozen indexes; the fourth reads a list of 19 uncollected static-site tools and hosts that the pilot labels as ours.',
    happened:
      'Half true. For 12 of our 19 uncollected tools (Hugo, Eleventy, Docusaurus and others) the index does behave as predicted: the word is simply unknown, exactly like a typo. But 7 (among them Nuxt, Remix, GitLab and webpack) occur in passing in a collected source, so plain search returns results for a tool the corpus never collected. That is worse than silence. Among the frozen queries, only 3 contain a word no document holds.',
    uncertain:
      'The uncollected list is ours and short; a real collection needs a manifest of what it chose not to gather. Whether a pinned issue has actually changed since its snapshot is not checked.',
    falsifier: 'If uncollected tools always surfaced as unknown words. Seven of nineteen do not.',
    simpler: 'A sentence under every search saying what the collection covers and what it does not, as a scope note.',
    data: 'Frozen Four Words v1: both indexes, the source pins and the 27 queries. The uncollected-tools list is written by us, in the pilot’s source.',
    finding: 'A tool the corpus never collected can still “match”: 7 of 19 uncollected tools are mentioned in passing, so search answers instead of admitting the gap.',
    related: ['01', '03', '04'],
  },
  {
    n: '07',
    title: 'The Held Place',
    family: 'discovery',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'reorder',
    encounter: 'card-catalogue',
    question: 'If a record keeps its place on the shelf while the classification around it changes, is the place still worth keeping?',
    proposition:
      'Holding a record’s slot through a change of scheme keeps it findable where it was last seen, and its new neighbours still have something in common with it.',
    manipulate: 'Choose which of its own controlled terms each record is filed under (first, last, rarest, commonest), choose a record to hold, and switch the hold on or off.',
    changes:
      'The other 29 refile around the held record. The readout names its new neighbours, whether they share a term with it, and where the new scheme would have put it.',
    unchanged: 'The records and their terms. The held slot is always the one the first-term shelf gave it, the drawer order of pilot 31.',
    provenance: {
      idea: 'Libraries leave a placeholder where a book is out, so its place is kept. Records that are reclassified lose theirs. This pilot keeps the place and asks what the place is then worth.',
      mechanism: 'Positional addressing: a slot on a shelf means something only as long as the scheme around it holds still.',
      sourceShowed:
        'Each v1 record lists one to four controlled terms in an order chosen by the record writer; which term is first is an editorial accident.',
      interpretation: 'We expected the held place to stay meaningful, because records sharing one term tend to share others.',
      sources: [
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Lumpesammlig 012, The Impossible Index', url: IMPOSSIBLE_INDEX_STUDY, firmness: 'metaphor' },
        { label: 'Shelf placeholders for books on loan', firmness: 'reported' },
      ],
      priorArt: ['Shelf dummies and “book out” markers', 'Persistent identifiers versus call numbers', 'Pinned items in sorted lists'],
    },
    built:
      'A bookcase of 30 spines with guide tabs, four filing schemes, a held record that keeps its slot, and a tally over all 30 records for the current scheme.',
    happened:
      'The proposition failed. Filed where a scheme naturally puts it, a record has a term-sharing neighbour in 24 to 30 of 30 cases. Held at its first-term slot, it has one in only 17 to 23. Holding the place keeps the address and loses the neighbourhood: the record ends up beside whatever the new scheme happens to file there.',
    uncertain: 'Only four schemes, all made from the same terms. A scheme from outside the records, such as date or publisher, might break the held place even more.',
    falsifier: 'If held records kept term-sharing neighbours about as often as naturally filed ones. They keep them markedly less often.',
    simpler: 'A persistent identifier with a “last seen at” note beside the new location would keep findability without bending the shelf.',
    data: 'Frozen Four Words v1: the 30 records’ controlled terms. The four filing schemes are ours.',
    finding: 'A held place keeps the address but not the neighbourhood: held records have a term-sharing neighbour in 17–23 of 30 cases, against 24–30 when filed naturally.',
    related: ['08', '31', '09'],
  },
  {
    n: '08',
    title: 'Multiple Catalogues',
    family: 'discovery',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'card-catalogue',
    question: 'If one set of sources is catalogued four defensible ways at once, does anything stay beside the same thing?',
    proposition:
      'Different orderings disagree on position but mostly agree on neighbourhood: records that sit together in one catalogue tend to sit together in others.',
    manipulate: 'Pick one source to follow through four catalogues shown side by side.',
    changes:
      'Its line across the four columns is drawn, its neighbours in each catalogue are named, and any neighbour that recurs is marked.',
    unchanged: 'The four orderings (subject, publisher, evidence, length), all made from the frozen data, and their agreement statistics.',
    provenance: {
      idea: 'A library can shelve by subject and still keep author and title catalogues. Each catalogue is a different street plan for the same houses.',
      mechanism: 'Linear order forces every item to have exactly two neighbours; each ordering system chooses them differently.',
      sourceShowed:
        'The v1 data supports at least four orders without inventing anything: first controlled term, repository, graded evidence and token length of the pinned source.',
      interpretation: 'We expected neighbourhoods to survive reordering, because subject and publisher are correlated in this corpus.',
      sources: [
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Source manifest with repositories', url: CORPUS_MANIFEST, firmness: 'fact' },
        { label: 'Lumpesammlig 012, The Impossible Index', url: IMPOSSIBLE_INDEX_STUDY, firmness: 'metaphor' },
      ],
      priorArt: ['Author, title and subject card catalogues', 'Faceted classification (Ranganathan)', 'Slopegraphs and parallel coordinates'],
    },
    built:
      'A four-column slopegraph of the 30 sources with lines joining each one’s positions, a selector to follow one, and a table of its neighbours in each catalogue.',
    happened:
      'The proposition failed. Of the 93 side-by-side pairs the four catalogues make, 72 occur in one catalogue only, 19 in two, 2 in three and none in all four. Rank agreement is low everywhere (Kendall’s τ from 0.05 to 0.39, highest for publisher against evidence). Choosing a catalogue is choosing a source’s neighbours.',
    uncertain:
      'Ties break on source id, which shapes neighbours in the evidence and subject catalogues, where many records share a key. Four orders is a small sample of possible catalogues.',
    falsifier: 'If many pairs stayed adjacent in most catalogues. No pair stays adjacent in all four, and only two in three.',
    simpler: 'A table with one column per catalogue listing each source’s two neighbours.',
    data: 'Frozen Four Words v1: records (terms, evidence), source repositories and baseline token lengths. Orders computed in the browser.',
    finding: 'No two sources stay side by side in all four catalogues, and 72 of 93 neighbouring pairs exist in one catalogue only.',
    related: ['07', '31', '05'],
  },
  {
    n: '09',
    title: 'Follow the Footnote',
    family: 'discovery',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'four-words',
    question: 'How much of a collection can you reach by following its references, without ever typing a search?',
    proposition: 'The records’ related links form a connected web: from any record, footnotes alone lead to most of the others.',
    manipulate: 'Choose a starting page, follow footnotes, step back along the trail, and optionally show which records cite the current one.',
    changes: 'The page, the trail and the count of records read and reachable from where you started.',
    unchanged: 'The 60 related links and their notes, as the record writer wrote them.',
    provenance: {
      idea: 'Before keyword search, researchers often found work by following references from a paper they already had, forwards and backwards.',
      mechanism: 'Citation chaining: references point backwards to what a text relies on; a citation index adds the reverse, pointing to what relies on it.',
      sourceShowed:
        'Every v1 record has one to three related entries, each with a relation (complements, alternative, explains) and a short note.',
      interpretation: 'We expected the links to work as a map of the whole topic, since one writer drew them all.',
      sources: [
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Citation indexing as a search method, after Eugene Garfield', firmness: 'reported' },
      ],
      priorArt: ['Garfield’s Science Citation Index (1960s)', 'Backward and forward snowballing in literature reviews', 'Wiki link-following games'],
    },
    built:
      'A printed-page view of each record with superscript footnotes from its related field, a breadcrumb trail, an optional “cited by” section, and reachability counts.',
    happened:
      'Half true. Footnotes alone reach between 5 and 19 of the 30 records, depending on where you start, never all of them. Four records (the GitHub custom 404 and troubleshooting pages, SvelteKit’s static adapter and Gatsby’s path prefix) are cited by no other record: no footnote ever leads to them. Allowing backward steps, to the records that cite the current one, connects every start to all 30.',
    uncertain: 'One AI agent wrote every record and link, and no person has reviewed them; a collection with many authors might link more, or less, evenly.',
    falsifier: 'If footnotes from any start reached most of the collection. From 18 of the 30 starts they reach fewer than ten.',
    simpler: 'A “see also” list and a “cited by” list under each record, without the page or trail.',
    data: 'Frozen Four Words v1: the records’ problems, solutions and related fields.',
    finding: 'Footnotes alone reach 5 to 19 of 30 records and four are never cited. Following citations backwards as well connects all 30.',
    related: ['02', '07', '10'],
  },
  {
    n: '10',
    title: 'The Four-Word Relay',
    family: 'discovery',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'translate',
    encounter: 'four-words',
    question: 'Can a wrong search result hand you the words for a right one?',
    proposition: 'When a short search goes wrong, the wrong result’s own words usually contain one that, swapped in, brings a relevant source to the top.',
    manipulate: 'Choose a starting query whose first plain result is wrong, choose a slot, then place one of the words the current first result offers.',
    changes: 'Each placement is a new leg: the four words, the top three results and the rank of the first relevant source update, and the legs are kept as a chain.',
    unchanged: 'The plain keyword index and the frozen labels. Offered words come only from the current first result’s record.',
    provenance: {
      idea: 'People refine searches with words they meet in results. Pilot 03 found that a fifth of query words meet nowhere; a relay is one way to acquire the missing ones.',
      mechanism: 'Query reformulation from result vocabulary, done by hand: relevance feedback where the searcher picks the term.',
      sourceShowed:
        'In run v1, plain keyword search put a source not labelled relevant first for 10 of the 27 queries.',
      interpretation: 'We expected the wrong result to be wrong in a useful direction, close enough in topic to name the right thing.',
      sources: [
        { label: 'Per-query results of run v1', url: FOUR_WORDS_RESULTS, firmness: 'fact' },
        { label: 'Four Words method and results', url: FOUR_WORDS_DOC, firmness: 'fact' },
      ],
      priorArt: ['Rocchio relevance feedback (1971)', 'Bates on berrypicking (1989)', 'Pseudo-relevance feedback and query expansion'],
    },
    built:
      'Four word slots, a pool of words from the current first result, a chain of legs, and a tally of every single-word replacement for every start.',
    happened:
      'True only with foresight. For 7 of the 10 starts some single replacement brings a relevant source to rank 1. But only 28 of the 558 possible replacements do it, about one in twenty. The wrong result does carry the right word, hidden among many that lead nowhere; picking it is the searcher’s knowledge, not the relay’s.',
    uncertain:
      'Offered words come from our records, not from what a result page would show. Several winning words (gh, page, github) are generic, which suggests luck in the ranking rather than meaning.',
    falsifier: 'If no start could be rescued by one replacement. Seven of ten can.',
    simpler: 'A “searches like this also used” list under the results, as query-log suggestion does.',
    data: 'Frozen Four Words v1: the plain keyword index, the records’ problems and terms, the 27 queries and labels.',
    finding: 'A wrong result usually holds the word that fixes the search (7 of 10 starts), but only 1 in 20 of its words does, so the relay rewards knowing what to pick.',
    related: ['03', '01', '09'],
  },
]
