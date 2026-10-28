// Fixture contributions for the Community page. Every author, DID, address
// and CID is invented and uses the reserved `.example` / `did:example`
// namespaces; none of this exists on any network. Real NSIDs are used where a
// Lexicon exists (see docs/research/ATPROTO-COMMUNITY.md); hypothetical types
// use the placeholder namespace `example.postack.*`.
//
// These are the contributions only: what each author published, in their own
// repository. Connections between them are relationship claims, kept apart
// in connection-contracts.ts.

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
