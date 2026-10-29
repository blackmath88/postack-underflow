// The toy model behind 58 · The Public Memory Loop. Deterministic: the same
// knobs and the same number of ticks always give the same state. Every rule
// is written out in RULES and implemented in `tick`, nowhere else. It models
// nothing real; its outputs follow from these rules and nothing more.

export type Cell = 'empty' | 'new' | 'live' | 'challenged' | 'stale'

export interface Knobs {
  /** New records published per tick. */
  publish: number
  /** Challenged records the maintainers can correct per tick. */
  capacity: number
  /** Chance, in percent, that a reuse turns up a problem with a live record. */
  drift: number
}

export interface World {
  t: number
  cells: Cell[]
  /** Tick at which each challenged or stale record was challenged. */
  since: number[]
  seed: number
  corrected: number
  reusedLive: number
  /** Reuses of records already challenged (queued or stale). */
  reusedStale: number
}

export const SIZE = 64
export const FIND = 0.4
export const REUSE = 0.5
export const STALE_AFTER = 5

export const RULES = [
  'Publish: each tick, add the chosen number of new records to empty cells, until all 64 are full.',
  `Discover: each new record is found with a ${FIND * 100}% chance per tick, and becomes live.`,
  `Reuse: each live, challenged or stale record is reused with a ${REUSE * 100}% chance per tick. Nobody reusing it can see that it is challenged.`,
  'Challenge: a reuse of a live record turns up a problem with the chosen drift chance; the record joins the queue.',
  'Correct: the maintainers correct up to their capacity per tick, oldest first; a corrected record is live again.',
  `Stale: a record that waits in the queue for more than ${STALE_AFTER} ticks is marked stale. It stays indexed and reusable.`,
]

// mulberry32: small, seedable, good enough for a toy.
function rand(seed: number) {
  let a = seed >>> 0
  a = (a + 0x6d2b79f5) >>> 0
  let x = a
  x = Math.imul(x ^ (x >>> 15), x | 1)
  x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
  return { seed: a, r: ((x ^ (x >>> 14)) >>> 0) / 4294967296 }
}

export const start = (): World => ({
  t: 0,
  cells: Array<Cell>(SIZE).fill('empty'),
  since: Array<number>(SIZE).fill(0),
  seed: 20261029,
  corrected: 0,
  reusedLive: 0,
  reusedStale: 0,
})

export function tick(w: World, k: Knobs): World {
  let seed = w.seed
  const roll = () => {
    const n = rand(seed)
    seed = n.seed
    return n.r
  }
  const cells = [...w.cells]
  const since = [...w.since]
  const t = w.t + 1
  let { corrected, reusedLive, reusedStale } = w

  // Publish
  let toPublish = k.publish
  for (let i = 0; i < SIZE && toPublish > 0; i++)
    if (cells[i] === 'empty') {
      cells[i] = 'new'
      toPublish--
    }
  // Discover, reuse, challenge
  for (let i = 0; i < SIZE; i++) {
    const c = cells[i]
    if (c === 'new') {
      if (roll() < FIND) cells[i] = 'live'
    } else if (c === 'live' || c === 'challenged' || c === 'stale') {
      if (roll() < REUSE) {
        if (c !== 'live') reusedStale++
        if (c === 'live') {
          reusedLive++
          if (roll() < k.drift / 100) {
            cells[i] = 'challenged'
            since[i] = t
          }
        }
      }
    }
  }
  // Correct, oldest first
  const queue = cells
    .map((c, i) => ({ c, i }))
    .filter((x) => x.c === 'challenged' || x.c === 'stale')
    .sort((a, b) => since[a.i]! - since[b.i]! || a.i - b.i)
    .slice(0, k.capacity)
  for (const { i } of queue) {
    cells[i] = 'live'
    corrected++
  }
  // Stale
  for (let i = 0; i < SIZE; i++) if (cells[i] === 'challenged' && t - since[i]! > STALE_AFTER) cells[i] = 'stale'

  return { t, cells, since, seed, corrected, reusedLive, reusedStale }
}

export const run = (k: Knobs, ticks: number) => {
  let w = start()
  for (let i = 0; i < ticks; i++) w = tick(w, k)
  return w
}

export const count = (w: World, c: Cell) => w.cells.filter((x) => x === c).length
