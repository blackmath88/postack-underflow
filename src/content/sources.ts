// Every external claim on the site points at an entry here, so provenance can
// be audited in one place and tested for basic integrity.

export type SourceKind = 'conversation' | 'prior-work' | 'protocol' | 'practice'

export interface Source {
  id: string
  title: string
  url: string
  kind: SourceKind
  /** What the project takes from this source, in our words. */
  contribution: string
  /** Version, date or revision the description was checked against. */
  checked?: string
  /** Private repositories are credited by name but not linked publicly. */
  private?: boolean
}

export const SOURCES = {
  syntax1050: {
    id: 'syntax1050',
    title: 'Syntax #1050 — “Everyone Is Hacking Their TV” (transcript)',
    url: 'https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript',
    kind: 'conversation',
    contribution:
      'CJ’s concern that agent-driven problem solving no longer returns to a shared, findable commons, and the co-hosts’ responses. Paraphrased here, never quoted.',
    checked: 'Episode dated 2026-10-26; segment around 55:18–1:04:06, read 2026-10-28',
  },
  githubAtlas: {
    id: 'githubAtlas',
    title: 'GitHub Atlas',
    url: 'https://github.com/blackmath88/github-atlas',
    kind: 'prior-work',
    contribution:
      'Maps repositories, topics and ecosystem signals. Postack Underflow asks what changes when the unit is a solved problem rather than a repository.',
  },
  brainstorm: {
    id: 'brainstorm',
    title: 'br-ai-nstorm',
    url: 'https://github.com/blackmath88/br-ai-nstorm',
    kind: 'prior-work',
    contribution:
      'Multi-participant problem memory with provenance, visible conflicts and human-reviewed curation; source of the “one record, several projections” idea.',
  },
  colors: {
    id: 'colors',
    title: 'Colors',
    url: 'https://github.com/blackmath88/colors',
    kind: 'prior-work',
    contribution:
      'Palette studies the preliminary paper / ink / blue / violet / rose palette is derived from.',
    private: true,
  },
  lumpesammlig: {
    id: 'lumpesammlig',
    title: 'Lumpesammlig',
    url: 'https://github.com/blackmath88/lumpesammlig',
    kind: 'prior-work',
    contribution:
      'Collection of interaction specimens; home of studies 012 (The Impossible Index) and 013 (The Switchboard).',
  },
  atproto: {
    id: 'atproto',
    title: 'AT Protocol',
    url: 'https://atproto.com/',
    kind: 'protocol',
    contribution:
      'Portable identity, user-owned record repositories, Lexicons and independent app views.',
  },
  standardSite: {
    id: 'standardSite',
    title: 'Standard.site',
    url: 'https://standard.site/',
    kind: 'protocol',
    contribution:
      'Blog-oriented publication records on ATProto, so an article need not invent its own schema.',
  },
  developmentPractice: {
    id: 'developmentPractice',
    title: 'development-practice (prototype profile)',
    url: 'https://github.com/blackmath88/development-practice',
    kind: 'practice',
    contribution: 'Working practice this repository adopts; referenced rather than copied.',
    checked: 'main @ f83d29c, read 2026-10-28',
    private: true,
  },
  photoFrame: {
    id: 'photoFrame',
    title: 'wesbos/photo-frame-dashboard',
    url: 'https://github.com/wesbos/photo-frame-dashboard/blob/0bff55ef3fb2a3bfdab05bc8e3bd0c9d69f63189/README.md',
    kind: 'prior-work',
    contribution:
      'Wes Bos’s notes and scripts for taking over Android photo frames, written for people and their agents, with an explicit way to send findings back. The opening encounter; identified by us, not named in the episode.',
    checked: 'commit 0bff55e, counts observed 2026-10-28 13:05 UTC',
  },
  doc2query: {
    id: 'doc2query',
    title: 'Nogueira et al., “Document Expansion by Query Prediction” (doc2query, 2019)',
    url: 'https://arxiv.org/abs/1904.08375',
    kind: 'prior-work',
    contribution:
      'Prior art for adding predicted query vocabulary to documents before indexing, the effect behind much of Four Words’ gain.',
  },
  bm25f: {
    id: 'bm25f',
    title: 'Robertson & Zaragoza, “The Probabilistic Relevance Framework: BM25 and Beyond” (2009)',
    url: 'https://doi.org/10.1561/1500000019',
    kind: 'prior-work',
    contribution: 'The BM25 and BM25F ranking functions Four Words uses for both systems.',
  },
  pr5: {
    id: 'pr5',
    title: 'PR #5 — Research: physical information systems and Postack interface implications',
    url: 'https://github.com/blackmath88/postack-underflow/pull/5',
    kind: 'prior-work',
    contribution:
      'Proposed research (not merged): classification claims and relationship claims as the unit of accountability; experiment briefs for the Disputed Neighbour, Connection Contract, Operator Leaves and Problem Desk. Historical claims in it are reported, not independently verified.',
    checked: 'head 66287f0, read 2026-10-28',
  },
  pr6: {
    id: 'pr6',
    title: 'PR #6 — Reframe Postack as an exploratory story about collective knowledge',
    url: 'https://github.com/blackmath88/postack-underflow/pull/6',
    kind: 'prior-work',
    contribution:
      'Proposed concept (not merged): the six-movement story, three kinds of success, and the north-star question this site closes with.',
    checked: 'head 92fc25a, read 2026-10-28',
  },
  repo: {
    id: 'repo',
    title: 'postack-underflow repository',
    url: 'https://github.com/blackmath88/postack-underflow',
    kind: 'prior-work',
    contribution: 'Research notes, ADRs and the source of this site.',
  },
} as const satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES

export const REPO_URL = SOURCES.repo.url
export const repoFile = (path: string) =>
  `${REPO_URL}/${path.endsWith('/') ? 'tree' : 'blob'}/main/${path}`
