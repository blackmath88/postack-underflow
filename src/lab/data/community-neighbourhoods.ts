// Invented fixture for Lab 27, The Trust Neighbourhood. Written by hand for
// this laboratory on 2026-10-29. Every person, handle, DID, district, follower
// count and endorsement count below is made up. None of it is a measurement
// of anyone, of any network or of any real reputation signal.
//
// It may be used to show how a ranking changes when its boundary or its
// measure changes. It may not be used to claim that local expertise beats, or
// differs from, popularity anywhere real: the outcome is whatever these
// numbers were typed to be.

export type District = 'proto' | 'eval' | 'pages' | 'build' | 'routing'

export const DISTRICTS: Record<District, { name: string; x: number; y: number }> = {
  proto: { name: 'Lexicons', x: 70, y: 60 },
  eval: { name: 'Evaluation', x: 190, y: 40 },
  pages: { name: 'Static hosting', x: 300, y: 110 },
  build: { name: 'Bundlers', x: 420, y: 60 },
  routing: { name: 'Routing', x: 430, y: 180 },
}

/** Which districts share a border. Undirected. */
export const BORDERS: Array<[District, District]> = [
  ['proto', 'eval'],
  ['eval', 'pages'],
  ['pages', 'build'],
  ['pages', 'routing'],
  ['build', 'routing'],
]

export interface Resident {
  handle: string
  did: string
  /** Invented follower count across the whole network. */
  followers: number
  /** Invented count of answers that others endorsed, per district. */
  endorsed: Partial<Record<District, number>>
}

export const RESIDENTS: Resident[] = [
  {
    handle: 'aster.example',
    did: 'did:example:aster',
    followers: 41200,
    endorsed: { build: 2, routing: 1 },
  },
  {
    handle: 'bo.example',
    did: 'did:example:bo',
    followers: 320,
    endorsed: { pages: 9 },
  },
  {
    handle: 'cyan.example',
    did: 'did:example:cyan',
    followers: 1800,
    endorsed: { build: 7, pages: 3 },
  },
  {
    handle: 'dita.example',
    did: 'did:example:dita',
    followers: 95,
    endorsed: { routing: 6 },
  },
  {
    handle: 'eun.example',
    did: 'did:example:eun',
    followers: 12500,
    endorsed: { proto: 4, eval: 1 },
  },
  {
    handle: 'fen.example',
    did: 'did:example:fen',
    followers: 210,
    endorsed: { proto: 8 },
  },
  {
    handle: 'gil.example',
    did: 'did:example:gil',
    followers: 640,
    endorsed: { eval: 5, pages: 1 },
  },
  {
    handle: 'hal.example',
    did: 'did:example:hal',
    followers: 27000,
    endorsed: { pages: 1, build: 1, routing: 1, eval: 1 },
  },
]

export const QUESTIONS: Array<{ id: string; district: District; ask: string }> = [
  {
    id: 'q1',
    district: 'pages',
    ask: 'Why does the host refuse to serve a file whose name starts with an underscore?',
  },
  {
    id: 'q2',
    district: 'proto',
    ask: 'Which record field could hold a correction aimed at one version?',
  },
  {
    id: 'q3',
    district: 'eval',
    ask: 'Are thirty records enough to compare two indexes?',
  },
  {
    id: 'q4',
    district: 'routing',
    ask: 'Why does a refresh on a deep link return not found?',
  },
]
