// 36 · The Index Drawer That Lies: a cabinet whose drawer labels were lettered
// once and whose cards keep moving. Pure, so a Node script can replay it.
// A full drawer pushes its last card to the front of the next drawer; the
// labels do not move. The capacities and the filing rule are ours.

export const CAPACITY = 5

export interface Label {
  first: string
  last: string
}

export interface Cabinet {
  drawers: string[][]
  labels: Label[]
  relettered: number
}

export function letter(drawer: string[]): Label {
  return { first: drawer[0] ?? '', last: drawer[drawer.length - 1] ?? '' }
}

/** Fill drawers in order, CAPACITY each, and letter every label from what is inside. */
export function build(ids: string[], drawers: number): Cabinet {
  const sorted = [...ids].sort()
  const d = Array.from({ length: drawers }, (_, i) => sorted.slice(i * CAPACITY, (i + 1) * CAPACITY))
  return { drawers: d, labels: d.map(letter), relettered: 0 }
}

/** Where the labels send you: the last drawer whose label begins at or before the id. */
export function byLabel(c: Cabinet, id: string): number {
  let at = 0
  c.labels.forEach((l, i) => {
    if (l.first && l.first.localeCompare(id) <= 0) at = i
  })
  return at
}

export const actual = (c: Cabinet, id: string) => c.drawers.findIndex((d) => d.includes(id))

/** File a card where the labels say, in order; overflow pushes cards back. */
export function fileCard(c: Cabinet, id: string): Cabinet {
  const drawers = c.drawers.map((d) => [...d])
  let i = byLabel(c, id)
  drawers[i] = [...drawers[i]!, id].sort()
  while (drawers[i]!.length > CAPACITY && i + 1 < drawers.length) {
    const spill = drawers[i]!.pop()!
    drawers[i + 1] = [spill, ...drawers[i + 1]!]
    i++
  }
  return { ...c, drawers }
}

export const reletter = (c: Cabinet, i: number): Cabinet => ({
  ...c,
  labels: c.labels.map((l, j) => (j === i ? letter(c.drawers[i]!) : l)),
  relettered: c.relettered + 1,
})

/** Cards the labels would send you to the wrong drawer for. */
export const misdirected = (c: Cabinet) => c.drawers.flatMap((d, i) => d.filter((id) => byLabel(c, id) !== i))

/** Cards filed out of alphabetical order across the whole cabinet: a clerk who trusted a lying label. */
export const outOfOrder = (c: Cabinet) => {
  const seq = c.drawers.flat()
  return seq.filter((id, i) => i > 0 && seq[i - 1]!.localeCompare(id) > 0)
}

/** Drawers whose label no longer matches its first or last card. */
export const lyingLabels = (c: Cabinet) =>
  c.labels.map((l, i) => {
    const now = letter(c.drawers[i]!)
    return now.first !== l.first || now.last !== l.last
  })
