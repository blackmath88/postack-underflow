import type { LabEntry } from '../types.ts'
import { IMPOSSIBLE_INDEX_STUDY, PR5, RECORDS_FILE } from './shared.ts'

export const HISTORY: LabEntry[] = [
  {
    n: '31',
    title: 'Card Friction',
    family: 'history',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'card-catalogue',
    question: 'Does the cost of flipping through a drawer show you things a direct jump never would?',
    proposition:
      'Browsing friction is not only cost: flipping past a card’s neighbours shows you related records that a zero-cost jump skips.',
    manipulate: 'Choose a card to find, then flip one card at a time, riffle five at a time, or jump straight to it.',
    changes: 'Which cards you read on the way, and how many of them share a controlled term with the card you wanted.',
    unchanged: 'The drawer’s order, which is ours: each record is filed under its first controlled term.',
    provenance: {
      idea: 'The card catalogue as an encounter in the Lumpesammlig study “The Impossible Index”, and the essay’s reading of classification as prior labour.',
      mechanism: 'A physical drawer only shows one card face at a time; the edges and guide tabs of the cards behind it are visible but unread.',
      sourceShowed:
        'The study and PR #5 describe catalogue browsing and guide cards. Operational details there are reported, not independently verified.',
      interpretation:
        'We assumed the friction produced serendipity. Building the drawer suggests the friction only exposes the filer’s decisions.',
      sources: [
        { label: 'Lumpesammlig 012, The Impossible Index', url: IMPOSSIBLE_INDEX_STUDY, firmness: 'metaphor' },
        { label: 'PR #5, physical information systems research', url: PR5, firmness: 'reported' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Library shelf browsing and “virtual shelf” browsers', 'Rolodex and card-file interfaces', 'Bates on berrypicking (1989)'],
    },
    built:
      'A drawer of the 30 frozen records behind guide cards, with three levels of friction and a ledger of what each search passed on the way. Arrow keys flip when the drawer has focus.',
    happened:
      'Two of the three searches contradict each other. Flipping to the underscore issue passes 29 cards, 11 of them related, but none behind its own guide: its four closest neighbours are filed under “jekyll”, five cards earlier. Flipping to the custom 404 page passes 11 cards and not one is related; its neighbours are filed later, under “spa-fallback”. What friction reveals depends entirely on where the filer put things.',
    uncertain:
      'Whether a reader notices or uses the passed cards. The ledger counts them; it cannot say they were read with attention.',
    falsifier:
      'If, for most targets, the cards passed on the way shared no term with the target. Here one of three did; the drawer is too small to say more.',
    simpler: 'A “nearby in the index” list beside a search result shows the same neighbours without the cost, and without the wrong ones.',
    data: 'Frozen Four Words v1 records, read-only. The filing order (first controlled term, then source id) is a choice made for this experiment.',
    finding:
      'Friction exposes the filer, not serendipity: one search passes 11 related cards, another passes none, because of where each card was filed.',
    related: ['07', '08', '32', '33', '36'],
  },
]
