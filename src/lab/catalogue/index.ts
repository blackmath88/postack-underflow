// The laboratory catalogue: lightweight, browsable metadata for every pilot.
// Each research family keeps its entries in its own file so families can be
// written, critiqued and reviewed independently.
import type { LabEntry } from '../types.ts'
import { DISCOVERY } from './discovery.ts'
import { CLASSIFICATION } from './classification.ts'
import { COMMUNITY } from './community.ts'
import { HISTORY } from './history.ts'
import { EDITORIAL } from './editorial.ts'
import { MEMORY } from './memory.ts'

export const CATALOGUE: LabEntry[] = [...DISCOVERY, ...CLASSIFICATION, ...COMMUNITY, ...HISTORY, ...EDITORIAL, ...MEMORY].sort(
  (a, b) => a.n.localeCompare(b.n),
)

const byNumber = new Map(CATALOGUE.map((e) => [e.n, e]))
export const entryFor = (n: string) => byNumber.get(n)

export const neighbours = (n: string) => {
  const i = CATALOGUE.findIndex((e) => e.n === n)
  return { prev: CATALOGUE[i - 1], next: CATALOGUE[i + 1] }
}

export * from './labels.ts'
