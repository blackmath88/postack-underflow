// Constellations: hand-drawn groups of experiments that argue about the same
// thing from different sides. Written after building, during critique.
export interface Constellation {
  title: string
  note: string
  members: string[]
}

export const CONSTELLATIONS: Constellation[] = [
  {
    title: 'Whose words meet',
    note: 'Retrieval as a meeting of vocabularies. The index’s added words matter less than we thought, and some words meet nowhere at all.',
    members: ['03', '10', '14', '44', '50', '60'],
  },
  {
    title: 'There is no neutral shelf',
    note: 'Every order is somebody’s. Change it, and the neighbours, the friction and the lies change with it.',
    members: ['07', '08', '31', '33', '36', '40'],
  },
  {
    title: 'Links that only point one way',
    note: 'Footnotes, related links and replies are written by one side. Read them backwards and the picture changes; take away the index that reads them and the answers disappear.',
    members: ['02', '09', '28', '42', '54'],
  },
  {
    title: 'Authority without evidence',
    note: 'Badges, stamps, scales and costumes. The corpus stores no per-claim authority, so every mark of confidence is borrowed from the record as a whole.',
    members: ['13', '16', '17', '20', '32'],
  },
  {
    title: 'Proposed is not accepted',
    note: 'The gap between a tentative placement and an accepted one: who may cross it, what it costs, and what a cautious rule wrongly refuses.',
    members: ['11', '21', '33', '52'],
  },
  {
    title: 'The view is an editor',
    note: 'Threads, channels, lenses and policies over the same eight records. Each view makes decisions the records do not contain.',
    members: ['22', '23', '25', '30'],
  },
  {
    title: 'What a record forgets',
    note: 'Expiry, missing context, dating marks, provenance in transit. Records rarely say when they stop applying, and moving them loses provenance first.',
    members: ['15', '18', '55', '57', '59'],
  },
  {
    title: 'Corrections that stay local',
    note: 'A correction changes one record. Whether it reaches anything else depends on links nobody wrote and rules strict enough to block it.',
    members: ['19', '51', '52', '53', '56'],
  },
  {
    title: 'Motte has nothing verified to say',
    note: 'Under its own contract the moth stays silent. That is the honest result, and the contract has a gap: it never checks a note’s kind.',
    members: ['37', '38', '49'],
  },
  {
    title: 'Reading the essay against itself',
    note: 'The essay’s sceptic, its hedges, its asides and its claims, measured with its own data.',
    members: ['41', '43', '45', '46', '48'],
  },
]

/** What the corpus kept saying, across families built independently. */
export const RECURRING: Constellation[] = [
  {
    title: 'Authority is never stored per claim',
    note: 'Every badge, stamp or rank on a record belongs to the record as a whole. Nothing says which alias or symptom was checked.',
    members: ['13', '16', '17', '20'],
  },
  {
    title: 'References point one way',
    note: 'Replies, footnotes and related links are written by one side. Nothing reads them back unless someone runs an index.',
    members: ['09', '28', '42', '54'],
  },
  {
    title: 'Records do not say when they expire',
    note: 'Almost no record says which versions or setups it stops applying to, and the few that do hide it below the surface.',
    members: ['15', '18', '55'],
  },
  {
    title: 'Motte has nothing verified to say',
    note: 'Under its own contract, the Archive Moth lets through no history note at all.',
    members: ['38', '49'],
  },
]
