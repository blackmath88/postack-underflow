// Connection contracts: relationship claims between the eight fixture
// contributions in community-fixtures.ts (unchanged). A contract says who
// proposed a relationship, why, on what evidence, and where it stands.
//
// Author-declared relationships come from a reference written inside the
// author's own record; nobody else can create one. Everything else is a
// reading by someone else: this view's editor, a language model, or you.
// All people, DIDs and records are invented (`.example`, `did:example`).

export type ContractStatus = 'proposed' | 'accepted' | 'disputed' | 'withdrawn'
export type Proposer = 'author' | 'editor' | 'model' | 'reader'
export type RelationType = 'replies-to' | 'corrects' | 'endorses' | 'disputes' | 'cites' | 'same-question'

export interface ContractEvent {
  status: ContractStatus
  by: string
  note: string
}

export interface Contract {
  id: string
  from: string
  to: string
  type: RelationType
  proposer: Proposer
  proposedBy: string
  reason: string
  evidence: string[]
  history: ContractEvent[]
}

export const status = (c: Contract): ContractStatus => c.history[c.history.length - 1]!.status

export const PROPOSER_LABEL: Record<Proposer, string> = {
  author: 'Declared by the author',
  editor: 'Proposed by this view’s editor',
  model: 'Proposed by a language model',
  reader: 'Proposed by you',
}

export const CONTRACTS: Contract[] = [
  {
    id: 'k1',
    from: 'c2',
    to: 'c1',
    type: 'replies-to',
    proposer: 'author',
    proposedBy: 'ines.example',
    reason: 'Ines wrote this reply to the essay.',
    evidence: ['The post’s reply.parent strongRef names the article’s URI and CID.'],
    history: [{ status: 'accepted', by: 'ines.example', note: 'Declared in the record when it was published.' }],
  },
  {
    id: 'k2',
    from: 'c4',
    to: 'c1',
    type: 'corrects',
    proposer: 'author',
    proposedBy: 'mara.example',
    reason: 'Mara corrects how the essay describes pinning (hypothesis H4).',
    evidence: ['The correction record’s subject is the article, at the version it read.'],
    history: [{ status: 'accepted', by: 'mara.example', note: 'Declared in the record.' }],
  },
  {
    id: 'k3',
    from: 'c6',
    to: 'c4',
    type: 'endorses',
    proposer: 'author',
    proposedBy: 'ines.example',
    reason: 'Ines endorses Mara’s correction.',
    evidence: ['The endorsement record’s subject is Mara’s correction, by URI and CID.'],
    history: [{ status: 'accepted', by: 'ines.example', note: 'Declared in the record.' }],
  },
  {
    id: 'k4',
    from: 'c5',
    to: 'c1',
    type: 'disputes',
    proposer: 'author',
    proposedBy: 'jun.example',
    reason: 'Jun disputes the essay’s portability argument (hypothesis H2).',
    evidence: ['The dispute record’s subject is the article.'],
    history: [{ status: 'accepted', by: 'jun.example', note: 'Declared in the record.' }],
  },
  {
    id: 'k5',
    from: 'c7',
    to: 'c1',
    type: 'replies-to',
    proposer: 'author',
    proposedBy: 'ola.example',
    reason: 'Ola replied to the essay.',
    evidence: ['Known only from an index’s earlier copy of the reference; Ola’s server is offline now.'],
    history: [{ status: 'accepted', by: 'ola.example', note: 'Declared in the record; source currently unreachable.' }],
  },
  {
    id: 'k6',
    from: 'c3',
    to: 'c2',
    type: 'same-question',
    proposer: 'editor',
    proposedBy: 'this view’s editor',
    reason: 'Both ask whether the Four Words evaluation can be trusted.',
    evidence: ['Both contributions name hypothesis H1.', 'Tomás proposes a rerun; Ines questions who wrote the queries.'],
    history: [
      { status: 'proposed', by: 'this view’s editor', note: 'Grouped for readers following H1.' },
      { status: 'accepted', by: 'this view’s editor', note: 'Kept after rereading both. This is the view’s reading, not the authors’.' },
    ],
  },
  {
    id: 'k7',
    from: 'c5',
    to: 'c4',
    type: 'same-question',
    proposer: 'model',
    proposedBy: 'a language model (unreviewed suggestion)',
    reason: 'The model suggested both concern “trust in the record”.',
    evidence: ['Overlapping vocabulary: “record”, “trust”.'],
    history: [
      { status: 'proposed', by: 'a language model', note: 'Generated suggestion.' },
      {
        status: 'disputed',
        by: 'this view’s editor',
        note: 'Jun’s dispute is about who controls attention; Mara’s correction is about revision pinning. Shared words, different questions.',
      },
    ],
  },
  {
    id: 'k8',
    from: 'c3',
    to: 'c4',
    type: 'corrects',
    proposer: 'editor',
    proposedBy: 'this view’s editor',
    reason: 'At first read, Tomás’s rerun write-up looked like a correction of the pinning claim.',
    evidence: ['Both mention reproducibility.'],
    history: [
      { status: 'proposed', by: 'this view’s editor', note: 'Initial grouping.' },
      { status: 'withdrawn', by: 'this view’s editor', note: 'Tomás never addresses pinning. Withdrawn; kept here so the mistake stays visible.' },
    ],
  },
  {
    id: 'k9',
    from: 'c8',
    to: 'c1',
    type: 'replies-to',
    proposer: 'author',
    proposedBy: 'rui.example',
    reason: 'Rui replied to the essay, then deleted the reply.',
    evidence: ['An index still remembers the reference. ATProto keeps no tombstone, so the record itself is gone.'],
    history: [
      { status: 'accepted', by: 'rui.example', note: 'Declared in the record.' },
      { status: 'withdrawn', by: 'rui.example', note: 'The author deleted the record. Only the author can withdraw this kind of connection.' },
    ],
  },
]

export const RELATION_TYPES: RelationType[] = ['replies-to', 'corrects', 'endorses', 'disputes', 'cites', 'same-question']
