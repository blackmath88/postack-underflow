// Integration contracts for the two Lumpesammlig studies. The site renders an
// ArtifactSlot from these entries; until `status` becomes 'integrated' the slot
// shows the editorial fallback and links to the study's source.
// Full contract: docs/ARTIFACT-INTEGRATION.md

export type ArtifactStatus = 'in-development' | 'integrated'

export interface ArtifactContract {
  id: string
  title: string
  study: string
  status: ArtifactStatus
  /** Where the study is developed. */
  sourceRepo: string
  /** Branch or PR the study currently lives on. */
  sourceRef: string
  /** Revision last inspected by this site; integration must pin one. */
  inspectedRevision: string
  /** Path of the study's entry inside the source repository. */
  entryPoint: string
  /** One sentence describing what the reader can do once it is integrated. */
  promise: string
  /** Shown instead of the artifact; must make sense on its own. */
  fallback: string
}

export const ARTIFACTS = {
  impossibleIndex: {
    id: 'impossible-index',
    title: 'The Impossible Index',
    study: '012-impossible-index',
    status: 'in-development',
    sourceRepo: 'https://github.com/blackmath88/lumpesammlig',
    sourceRef: 'https://github.com/blackmath88/lumpesammlig/pull/8',
    inspectedRevision: 'f525449b77a00d9ac442eccdbd9bccacf0dcedd5',
    entryPoint: 'src/pages/samples/012-impossible-index.astro',
    promise:
      'Type a short problem and watch an already-indexed cabinet reorganise itself into ranked, source-linked solution cards whose evidence and constraints you can inspect.',
    fallback:
      'The index is a thought experiment for now. Imagine a card catalogue filed by problem rather than by author or repository: each card names a problem, the constraints under which a solution holds, where the solution lives, and what evidence supports it. A four-word query does not send anyone into the archive; it only decides which drawer opens.',
  },
  switchboard: {
    id: 'switchboard',
    title: 'The Switchboard',
    study: '013-switchboard',
    status: 'in-development',
    sourceRepo: 'https://github.com/blackmath88/lumpesammlig',
    sourceRef: 'https://github.com/blackmath88/lumpesammlig/pull/8',
    inspectedRevision: 'f525449b77a00d9ac442eccdbd9bccacf0dcedd5',
    entryPoint: 'src/pages/samples/013-switchboard.astro',
    promise:
      'Patch together contributions that live on different people’s sites, switch between views of the same conversation, and see disagreement stay where its author put it.',
    fallback:
      'Picture an old telephone switchboard. Every line belongs to someone else: a blog, a personal data repository, a forum post. The operator does not own the calls; they only decide which lines are connected in this view. Pull the cords out and every contribution is still where its author left it.',
  },
} as const satisfies Record<string, ArtifactContract>

export type ArtifactId = keyof typeof ARTIFACTS
