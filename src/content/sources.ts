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
