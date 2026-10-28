// The Problem Desk: one fixture contribution proposes a change to the index's
// interpretation of a record, and the visitor previews what it would do to
// retrieval. The query, labels, records and index are the frozen Four Words
// v1 data; the correction and its author are invented (`.example`).
// Accepting a part only patches a copy of the records in the browser.

export const DESK_QUERY_ID = 'q01'

export const CORRECTION_RECORD = {
  author: 'lena.example',
  nsid: 'example.postack.correction',
  nsidStatus: 'hypothetical' as const,
  uri: 'at://did:example:lena/example.postack.correction/3k-example-h',
  text:
    'Searching “css missing after deploy” on Four Words, the Vite base-path records do not come up. People describe this failure as missing CSS; the records only say assets or JavaScript.',
}

export interface CorrectionPart {
  id: 'grounded' | 'inferred'
  target: string
  field: 'symptoms'
  add: string
  grounding: 'source' | 'inference'
  evidence: string
  /** Short quotation from the target's own source, when grounded. */
  quote?: { text: string; line: number }
}

export const PARTS: CorrectionPart[] = [
  {
    id: 'grounded',
    target: 'vite-build-base',
    field: 'symptoms',
    add: 'Page loads without its CSS after deploying to a subpath',
    grounding: 'source',
    evidence: 'Vite’s build guide says base rewrites asset references, including CSS.',
    quote: { text: 'CSS `url()` references, and asset references in your `.html` files', line: 37 },
  },
  {
    id: 'inferred',
    target: 'vite-static-deploy',
    field: 'symptoms',
    add: 'Page loads without its CSS after deploying to a subpath',
    grounding: 'inference',
    evidence: 'The deploy guide never mentions CSS. Plausible, because the same base setting is involved, but not in this source.',
  },
]

export const LOOP = ['Publish', 'Discover', 'Reuse', 'Challenge', 'Correct', 'Maintain'] as const
