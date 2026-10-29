// Data for pilot 18, The Missing Context. One frozen Four Words v1 solution
// card (next.js#15588, "add .nojekyll") and six situations taken from other
// frozen records, with our reading of which lines of the card would warn a
// reader that the fix does or does not fit.
//
// Written for the laboratory on 2026-10-29 by the classification builder (an
// AI agent), from the frozen records only. `fits` and `guards` are our
// interpretation, not a test: nobody applied the fix in these situations.
//
// This may not be used to claim that the fix works or fails in any real
// project, or that a reader would notice a warning.

/** A line of the card. The solution line can never be peeled off. */
export type StripId = 'problem' | 'context-0' | 'context-1' | 'limit-0' | 'limit-1' | 'solution'

export const CARD_SOURCE = 'next-issue-15588-nojekyll'

export interface Situation {
  sourceId: string
  /** The situation in a few words, from that record. */
  where: string
  fits: 'yes' | 'no' | 'unclear'
  /** Card lines that tell a reader this fix may not fit (or must be checked). */
  guards: StripId[]
  why: string
}

export const SITUATIONS: Situation[] = [
  {
    sourceId: 'vite-issue-9119-underscore-chunk',
    where: 'A branch-published Vite site loses an underscore-named chunk.',
    fits: 'yes',
    guards: [],
    why: 'Same mechanism: Jekyll drops the file. The reporter says .nojekyll also resolves it.',
  },
  {
    sourceId: 'upload-pages-artifact-issue-129-hidden-files',
    where: 'An Actions artifact deploy loses its .well-known folder.',
    fits: 'no',
    guards: ['context-1', 'limit-0', 'solution'],
    why: 'Jekyll does not run for artifact deploys. The branch lines say so, and so does the solution: “to the gh-pages branch”.',
  },
  {
    sourceId: 'sveltekit-adapter-static',
    where: 'A SvelteKit site deployed with an Actions workflow.',
    fits: 'no',
    guards: ['context-1', 'limit-0', 'solution'],
    why: 'That record keeps .nojekyll for pushes without Actions only.',
  },
  {
    sourceId: 'vite-issue-8073-base-mime',
    where: 'A Vite site requests its bundle from the domain root.',
    fits: 'no',
    guards: ['context-0'],
    why: 'The card’s setup already had an asset prefix; a missing prefix is a different cause.',
  },
  {
    sourceId: 'ghdocs-troubleshoot-404',
    where: 'The site’s root page itself returns 404.',
    fits: 'no',
    guards: ['problem'],
    why: 'The card’s problem says the HTML loads; here it does not.',
  },
  {
    sourceId: 'next-static-exports',
    where: "A current Next.js app exported with output: 'export'.",
    fits: 'unclear',
    guards: ['limit-0'],
    why: 'The card is from the Next.js 9 era; whether the files Jekyll drops are the same is not stated.',
  },
]
