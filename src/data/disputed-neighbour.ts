// The Disputed Neighbour: two real problems from the frozen Four Words v1
// corpus that an index files side by side, and the evidence for and against
// treating them as the same problem.
//
// Layers are kept apart on purpose:
//   source         — what the pinned issue actually says (short quotes, linked)
//   index writer   — what the v1 record added (read live from the frozen artifact)
//   classification — a claim about where the records belong, with a proposer
//
// The shared heading is a hypothetical editorial claim made for this essay;
// the shared controlled term `asset-404` is real and comes from the v1 records.
// Nothing here changes the frozen v1 index, labels or results.

export type ClaimStatus = 'proposed' | 'accepted' | 'disputed' | 'withdrawn'

export interface SourceExcerpt {
  /** Short quotation (under 15 words) or a marked paraphrase. */
  text: string
  quote: boolean
  /** Line in corpus/.cache/<sourceId>.txt where it appears. */
  line: number
}

export interface Neighbour {
  sourceId: string
  label: string
  /** What the failing request looked like, from the source. */
  failingUrl: string
  /** Set when the URL is reconstructed rather than quoted from the source. */
  failingUrlNote?: string
  siteUrl: string
  excerpts: SourceExcerpt[]
  cause: string
  fix: string
  fixEvidence: string
  /** Writer-added vocabulary not found in the source text (checked against the snapshot). */
  unsupported: Array<{ field: 'aliases' | 'symptoms' | 'terms'; text: string; note: string }>
  /** Query-relevant words the index associates with this record that never occur in its source. */
  absentWords: string[]
}

export interface Evidence {
  stance: 'supports' | 'challenges'
  text: string
  sourceId: string
  line?: number
}

export const NEIGHBOURS: [Neighbour, Neighbour] = [
  {
    sourceId: 'vite-issue-8073-base-mime',
    label: 'The base-path case',
    failingUrl: 'https://tykavanaugh.github.io/assets/index.0c785174.js',
    siteUrl: 'https://tykavanaugh.github.io/solardeploy/',
    excerpts: [
      { text: 'was blocked because of a disallowed MIME type (“text/html”)', quote: true, line: 1 },
      {
        text: 'The bundle is requested from the domain root, without the repository name.',
        quote: false,
        line: 1,
      },
    ],
    cause: 'The build assumes the site is served from the domain root, so asset URLs miss the repository subpath.',
    fix: 'Set Vite’s base to the repository name with leading and trailing slashes, then rebuild.',
    fixEvidence: 'The reporter confirms that /solardeploy/ fixed it after /solardeploy did not.',
    unsupported: [
      {
        field: 'terms',
        text: 'asset-404',
        note: 'The issue never says 404. It reports a module blocked as text/html; a 404 is a reasonable reading, but it is the index’s.',
      },
      {
        field: 'aliases',
        text: 'Vite blank page on GitHub Pages works locally',
        note: '“Works … on local” is in the issue; “blank page” is not.',
      },
    ],
    absentWords: ['404', 'blank'],
  },
  {
    sourceId: 'vite-issue-9119-underscore-chunk',
    label: 'The underscore case',
    failingUrl: 'https://cloudhao1999.github.io/cloud-app-admin/…/_plugin-vue_export-helper….js',
    failingUrlNote: 'Reconstructed: the issue gives the site URL and the file name; the full path is in a screenshot.',
    siteUrl: 'https://cloudhao1999.github.io/cloud-app-admin',
    excerpts: [
      { text: 'Github Pages block the file starting with the underline character', quote: true, line: 7 },
      {
        text: 'A plugin upgrade renamed a generated file so that it starts with an underscore.',
        quote: false,
        line: 5,
      },
    ],
    cause:
      'The paths are right; GitHub Pages’ Jekyll processing drops files whose names start with an underscore.',
    fix: 'Add a .nojekyll file at the site root, or change how chunk files are named so none starts with an underscore.',
    fixEvidence:
      'Paraphrase: the reporter says overriding Rollup’s sanitizeFileName solved it; .nojekyll also works, but in their words it is “not a good solution”.',
    unsupported: [],
    absentWords: [],
  },
]

export const CLAIM = {
  heading: 'Vite build: a JavaScript file 404s on GitHub Pages',
  proposedFix: 'Check Vite’s base option.',
  status: 'proposed' as ClaimStatus,
  proposedBy: 'This essay’s editor, as a deliberately plausible example (hypothetical)',
  basis:
    'Both v1 records carry the controlled term asset-404, both describe a JavaScript file that fails to load only on GitHub Pages, and both rank near each other for short queries.',
}

export const EVIDENCE: Evidence[] = [
  {
    stance: 'supports',
    text: 'Both reports are a Vite build whose JavaScript fails to load only on GitHub Pages.',
    sourceId: 'vite-issue-8073-base-mime',
    line: 1,
  },
  {
    stance: 'supports',
    text: 'Both v1 records were given the same controlled term, asset-404, by the record writer.',
    sourceId: 'vite-issue-9119-underscore-chunk',
  },
  {
    stance: 'challenges',
    text: 'In the base-path case the failing URL lacks the repository name. In the underscore case the site sits under its repository name and the file is named with a leading _ (the full request path is reconstructed; the issue shows it in a screenshot).',
    sourceId: 'vite-issue-9119-underscore-chunk',
    line: 11,
  },
  {
    stance: 'challenges',
    text: 'The confirmed fixes differ: a base setting in one, .nojekyll or chunk renaming in the other. Neither fix repairs the other case.',
    sourceId: 'vite-issue-8073-base-mime',
  },
  {
    stance: 'challenges',
    text: 'Part of the resemblance was written in: the base-path issue never says 404. The shared term asset-404, and an alias about a “blank page”, are the index’s additions.',
    sourceId: 'vite-issue-8073-base-mime',
  },
]

export const CORRECTION = {
  summary: 'Split the heading in two, and ask one question before offering a fix.',
  question: 'Does the failing URL contain your repository name?',
  answers: [
    { answer: 'No', goesTo: 'vite-issue-8073-base-mime' },
    { answer: 'Yes, and the file name starts with _', goesTo: 'vite-issue-9119-underscore-chunk' },
  ],
}

/** Probe queries, shown against the frozen v1 index. Not evaluation queries. */
export const PROBES = ['vite js file 404 github pages', 'vite blank page github pages']
