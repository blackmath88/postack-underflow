// The two Lumpesammlig studies this site learned from. They are independent
// specimens with their own visual development; Postack does not embed or copy
// them (ADR-0003). The site links to each and states the principle it carries.

export interface StudyReference {
  id: string
  title: string
  study: string
  sourceRepo: string
  /** Merge commit the principles were read at. */
  revision: string
  sourcePath: string
  /** Public page of the specimen. */
  liveUrl: string
  /** The finding Postack carries over, in our words. */
  principle: string
  /** Where on this site the principle is applied. */
  appliedIn: string
}

const LUMPESAMMLIG = 'https://github.com/blackmath88/lumpesammlig'
const MERGE = '23c9c443686e5e49138ddd336d27b590421bd605'

export const STUDIES = {
  impossibleIndex: {
    id: 'impossible-index',
    title: 'The Impossible Index',
    study: '012-impossible-index',
    sourceRepo: LUMPESAMMLIG,
    revision: MERGE,
    sourcePath: 'src/samples/012-impossible-index/sample.md',
    liveUrl: 'https://blackmath88.github.io/lumpesammlig/samples/012-impossible-index/',
    principle:
      'Classification exists before the question. A query changes the ordering, never the records, and records that did not match stay recoverable.',
    appliedIn: 'Four Words keeps every unmatched record one click away and shows which fields each match came from.',
  },
  switchboard: {
    id: 'switchboard',
    title: 'The Switchboard',
    study: '013-switchboard',
    sourceRepo: LUMPESAMMLIG,
    revision: MERGE,
    sourcePath: 'src/samples/013-switchboard/sample.md',
    liveUrl: 'https://blackmath88.github.io/lumpesammlig/samples/013-switchboard/',
    principle:
      'Contributions exist independently of the connections between them. Unplug every cable and the relationships leave the view while every voice stays intact.',
    appliedIn: 'The community demonstration separates records from relations; removing every relation changes nothing in the source ledger.',
  },
} as const satisfies Record<string, StudyReference>

export type StudyId = keyof typeof STUDIES
