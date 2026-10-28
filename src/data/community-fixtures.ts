// Fixture contributions for the Community page. Every author, DID, address
// and CID is invented and uses the reserved `.example` / `did:example`
// namespaces; none of this exists on any network. Real NSIDs are used where a
// Lexicon exists (see docs/research/ATPROTO-COMMUNITY.md); hypothetical types
// use the placeholder namespace `example.postack.*`.
//
// Two layers are kept apart on purpose:
//   contributions — what each author published, in their own repository
//   relations     — connections an interface draws between contributions
// Only relations whose origin is 'author-declared' come from the records
// themselves; the others belong to the view and can be removed.

export const ARTICLE_URI = 'at://did:example:postack/site.standard.document/we-already-solved-this'

export type NsidStatus = 'existing' | 'hypothetical'
export type Availability = 'available' | 'source-offline' | 'deleted'

export interface Contribution {
  id: string
  author: { handle: string; did: string }
  /** Where the author keeps it. */
  home: string
  nsid: string
  nsidStatus: NsidStatus
  kind: 'article' | 'reply' | 'endorsement' | 'correction' | 'dispute' | 'evidence' | 'recommend'
  /** Fixture AT URI and CID; displayed as text, never linked. */
  uri: string
  cid: string
  createdAt: string
  /** Which hypothesis of the article record this addresses, if any. */
  claim?: string
  availability: Availability
  text: string
  /** References written inside the record by its author (strongRef-style). */
  refs: Array<{ uri: string; cid: string; role: 'parent' | 'subject' }>
}

export type RelationOrigin = 'author-declared' | 'view-curated' | 'model-proposed'

export interface Relation {
  id: string
  from: string
  to: string
  kind: 'replies-to' | 'endorses' | 'corrects' | 'disputes' | 'cites' | 'same-question'
  origin: RelationOrigin
  reason: string
}

const did = (name: string) => `did:example:${name}`

export const CONTRIBUTIONS: Contribution[] = [
  {
    id: 'c1',
    author: { handle: 'postack.example', did: did('postack') },
    home: 'Author’s own site, mirrored as a document record',
    nsid: 'site.standard.document',
    nsidStatus: 'existing',
    kind: 'article',
    uri: ARTICLE_URI,
    cid: 'bafy-example-article-v020',
    createdAt: '2026-10-28',
    availability: 'available',
    text: 'We already solved this. So why are we solving it again? (This essay, carrying its structured problem record as payload.)',
    refs: [],
  },
  {
    id: 'c2',
    author: { handle: 'ines.example', did: did('ines') },
    home: 'Ines’s personal data repository',
    nsid: 'app.bsky.feed.post',
    nsidStatus: 'existing',
    kind: 'reply',
    uri: `at://${did('ines')}/app.bsky.feed.post/3k-example-a`,
    cid: 'bafy-example-c2',
    createdAt: '2026-10-28',
    claim: 'H1',
    availability: 'available',
    text: 'Thirty records on one narrow topic is a fair start, but the queries and the records were written by the same project. I would like to see queries collected from people who never saw the index.',
    refs: [{ uri: ARTICLE_URI, cid: 'bafy-example-article-v020', role: 'parent' }],
  },
  {
    id: 'c3',
    author: { handle: 'tomas.example', did: did('tomas') },
    home: 'Tomás’s blog, published as a document record',
    nsid: 'site.standard.document',
    nsidStatus: 'existing',
    kind: 'evidence',
    uri: `at://${did('tomas')}/site.standard.document/3k-example-b`,
    cid: 'bafy-example-c3',
    createdAt: '2026-10-28',
    claim: 'H1',
    availability: 'available',
    text: 'A write-up on my own blog: how I would rerun the Four Words evaluation from a pinned commit, and which three queries I would add first.',
    refs: [{ uri: ARTICLE_URI, cid: 'bafy-example-article-v020', role: 'subject' }],
  },
  {
    id: 'c4',
    author: { handle: 'mara.example', did: did('mara') },
    home: 'Mara’s personal data repository',
    nsid: 'example.postack.correction',
    nsidStatus: 'hypothetical',
    kind: 'correction',
    uri: `at://${did('mara')}/example.postack.correction/3k-example-c`,
    cid: 'bafy-example-c4',
    createdAt: '2026-10-28',
    claim: 'H4',
    availability: 'available',
    text: 'Issue snapshots are not pinned the way files are: an issue can be edited after the retrieval date. The record should say “retrieved at”, not imply a revision.',
    refs: [{ uri: ARTICLE_URI, cid: 'bafy-example-article-v020', role: 'subject' }],
  },
  {
    id: 'c5',
    author: { handle: 'jun.example', did: did('jun') },
    home: 'Jun’s personal data repository',
    nsid: 'example.postack.dispute',
    nsidStatus: 'hypothetical',
    kind: 'dispute',
    uri: `at://${did('jun')}/example.postack.dispute/3k-example-d`,
    cid: 'bafy-example-c5',
    createdAt: '2026-10-28',
    claim: 'H2',
    availability: 'available',
    text: 'Owning the records is not the hard part. Whoever runs the popular view still decides what people see. Portability moves the power; it does not remove it.',
    refs: [{ uri: ARTICLE_URI, cid: 'bafy-example-article-v020', role: 'subject' }],
  },
  {
    id: 'c6',
    author: { handle: 'ines.example', did: did('ines') },
    home: 'Ines’s personal data repository',
    nsid: 'example.postack.endorsement',
    nsidStatus: 'hypothetical',
    kind: 'endorsement',
    uri: `at://${did('ines')}/example.postack.endorsement/3k-example-e`,
    cid: 'bafy-example-c6',
    createdAt: '2026-10-28',
    claim: 'H4',
    availability: 'available',
    text: 'Endorsing Mara’s correction: I hit the same thing with an edited issue.',
    refs: [{ uri: `at://${did('mara')}/example.postack.correction/3k-example-c`, cid: 'bafy-example-c4', role: 'subject' }],
  },
  {
    id: 'c7',
    author: { handle: 'ola.example', did: did('ola') },
    home: 'Ola’s self-hosted repository, currently unreachable',
    nsid: 'app.bsky.feed.post',
    nsidStatus: 'existing',
    kind: 'reply',
    uri: `at://${did('ola')}/app.bsky.feed.post/3k-example-f`,
    cid: 'bafy-example-c7',
    createdAt: '2026-10-28',
    claim: 'H2',
    availability: 'source-offline',
    text: '',
    refs: [{ uri: ARTICLE_URI, cid: 'bafy-example-article-v020', role: 'parent' }],
  },
  {
    id: 'c8',
    author: { handle: 'rui.example', did: did('rui') },
    home: 'Rui’s personal data repository',
    nsid: 'app.bsky.feed.post',
    nsidStatus: 'existing',
    kind: 'reply',
    uri: `at://${did('rui')}/app.bsky.feed.post/3k-example-g`,
    cid: 'bafy-example-c8',
    createdAt: '2026-10-28',
    claim: 'H1',
    availability: 'deleted',
    text: '',
    refs: [],
  },
]

export const RELATIONS: Relation[] = [
  { id: 'r1', from: 'c2', to: 'c1', kind: 'replies-to', origin: 'author-declared', reason: 'The post’s reply.parent references the article.' },
  { id: 'r2', from: 'c3', to: 'c1', kind: 'cites', origin: 'author-declared', reason: 'The document references the article as its subject.' },
  { id: 'r3', from: 'c4', to: 'c1', kind: 'corrects', origin: 'author-declared', reason: 'The correction’s subject is the article, hypothesis H4.' },
  { id: 'r4', from: 'c5', to: 'c1', kind: 'disputes', origin: 'author-declared', reason: 'The dispute’s subject is the article, hypothesis H2.' },
  { id: 'r5', from: 'c6', to: 'c4', kind: 'endorses', origin: 'author-declared', reason: 'The endorsement’s subject is Mara’s correction.' },
  { id: 'r6', from: 'c7', to: 'c1', kind: 'replies-to', origin: 'author-declared', reason: 'Known from an index’s earlier copy of the reference; the source is offline now.' },
  { id: 'r9', from: 'c8', to: 'c1', kind: 'replies-to', origin: 'author-declared', reason: 'An index still remembers this reference, but the author deleted the record; ATProto leaves no tombstone, so no content is shown.' },
  { id: 'r7', from: 'c3', to: 'c2', kind: 'same-question', origin: 'view-curated', reason: 'This view’s editor grouped them: both are about whether the H1 evaluation can be trusted.' },
  { id: 'r8', from: 'c5', to: 'c4', kind: 'same-question', origin: 'model-proposed', reason: 'A language model suggested both concern “trust in the record”. Nobody has reviewed this.' },
]
