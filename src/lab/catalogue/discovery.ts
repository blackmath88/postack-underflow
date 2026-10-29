import type { LabEntry } from '../types.ts'
import { FOUR_WORDS_DOC, FOUR_WORDS_RESULTS } from './shared.ts'

export const DISCOVERY: LabEntry[] = [
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
]
