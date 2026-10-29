import type { Encounter, Family, Firmness, Kind, Status, Transformation } from '../types.ts'

export const FAMILY: Record<Family, { no: string; label: string; question: string }> = {
  discovery: { no: '01', label: 'Discovery & Serendipity', question: 'How does an existing answer get found, or missed?' },
  classification: { no: '02', label: 'Classification & Trust', question: 'Who decided where this belongs, and should we believe them?' },
  community: { no: '03', label: 'Community & Connection', question: 'What holds independent contributions together, and who draws the lines?' },
  history: { no: '04', label: 'History & Materiality', question: 'What did older information machines know that software forgot?' },
  editorial: { no: '05', label: 'Editorial & Play', question: 'How does an interaction change the way an argument is read?' },
  memory: { no: '06', label: 'Collective Memory & Futures', question: 'What happens to a solution after it is published?' },
}

export const FAMILIES = Object.keys(FAMILY) as Family[]

export const KIND_LABEL: Record<Kind, string> = {
  behavioural: 'Behavioural',
  epistemic: 'Epistemic',
  editorial: 'Editorial',
  architectural: 'Architectural',
}

export const KIND_GLOSS: Record<Kind, string> = {
  behavioural: 'a physical or conceptual principle becomes an interaction',
  epistemic: 'shows how knowledge, interpretation or uncertainty is constructed',
  editorial: 'changes how a reader meets an argument',
  architectural: 'an executable model of how independent records relate',
}

export const STATUS_LABEL: Record<Status, string> = {
  kernel: 'Kernel',
  specimen: 'Specimen',
  challenged: 'Challenged',
  combined: 'To combine',
  retired: 'Retired direction',
}

export const STATUS_GLOSS: Record<Status, string> = {
  kernel: 'Level B: the smallest working interaction that tests the idea',
  specimen: 'Level C: developed further, tested in a browser, with a reflection',
  challenged: 'Works, but critique found a problem with its proposition',
  combined: 'Works, but belongs together with a related pilot',
  retired: 'Still runs; a direction we would not develop further',
}

export const TRANSFORMATION_LABEL: Record<Transformation, string> = {
  reorder: 'Reorder',
  reveal: 'Reveal',
  remove: 'Remove',
  translate: 'Translate',
  compare: 'Compare',
  constrain: 'Constrain',
  trace: 'Trace',
  predict: 'Predict',
  perturb: 'Perturb',
}

export const ENCOUNTER_LABEL: Record<Encounter, string> = {
  'four-words': 'Four Words v1 (frozen)',
  'disputed-neighbour': 'The Disputed Neighbour',
  switchboard: 'Switchboard',
  'problem-desk': 'The Problem Desk',
  'photo-frame': 'The photo-frame repository',
  'card-catalogue': 'Card catalogue',
  essay: 'The essay itself',
  atproto: 'ATProto records',
  motte: 'Motte, the Archive Moth',
  print: 'Print and annotation',
  desktop: 'Desktop software',
  museum: 'Museums and exhibitions',
  lab: 'This laboratory',
}

export const FIRMNESS_LABEL: Record<Firmness, string> = {
  fact: 'Checked fact',
  reported: 'Reported, not independently verified',
  metaphor: 'Metaphor',
  speculation: 'Speculation',
}
