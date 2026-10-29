// 33 · The Filing Rod: the drawer as a small machine. Pure, so a Node script
// can price the same filings. Our model, not a documented one: a rod enters
// through the drawer's front and runs back through a hole in every accepted
// card. Pulling it out frees the cards at the back first, so filing a card at
// position p means withdrawing the rod until its tip is in front of p.
// Tentative cards stand in place above the rod, held by nothing.

export interface RodState {
  /** Accepted, rodded order, front to back. */
  accepted: string[]
  /** Tentative cards standing above the rod. */
  tentative: string[]
  /** How many cards, from the front, the rod still passes through. */
  tip: number
  /** Card-widths the rod has travelled, out and in. */
  travel: number
  /** Times the rod was drawn from fully home. */
  openings: number
  /** Most cards that stood loose at once. */
  mostLoose: number
  filed: string[]
  rejected: string[]
}

export const start = (accepted: string[], tentative: string[]): RodState => ({
  accepted,
  tentative,
  tip: accepted.length,
  travel: 0,
  openings: 0,
  mostLoose: 0,
  filed: [],
  rejected: [],
})

/** Where a card belongs in the accepted order. */
export const slot = (accepted: string[], id: string) => {
  const i = accepted.findIndex((a) => a.localeCompare(id) > 0)
  return i === -1 ? accepted.length : i
}

export const home = (s: RodState) => s.tip === s.accepted.length
export const loose = (s: RodState) => s.accepted.length - s.tip

export function pull(s: RodState, by: number): RodState {
  if (by <= 0) return s
  const tip = Math.max(0, s.tip - by)
  if (tip === s.tip) return s
  const next = { ...s, tip, travel: s.travel + (s.tip - tip), openings: s.openings + (home(s) ? 1 : 0) }
  return { ...next, mostLoose: Math.max(next.mostLoose, loose(next)) }
}

export function push(s: RodState, by: number): RodState {
  if (by <= 0) return s
  const tip = Math.min(s.accepted.length, s.tip + by)
  return tip === s.tip ? s : { ...s, tip, travel: s.travel + (tip - s.tip) }
}

/** A tentative card can be filed only where the cards are loose. */
export const canFile = (s: RodState, id: string) => s.tentative.includes(id) && slot(s.accepted, id) >= s.tip

export function file(s: RodState, id: string): RodState {
  if (!canFile(s, id)) return s
  const p = slot(s.accepted, id)
  const accepted = [...s.accepted.slice(0, p), id, ...s.accepted.slice(p)]
  const next = { ...s, accepted, tentative: s.tentative.filter((t) => t !== id), filed: [...s.filed, id] }
  return { ...next, mostLoose: Math.max(next.mostLoose, loose(next)) }
}

/** Lifting a tentative card away needs no rod at all. */
export const reject = (s: RodState, id: string): RodState =>
  s.tentative.includes(id) ? { ...s, tentative: s.tentative.filter((t) => t !== id), rejected: [...s.rejected, id] } : s

/** Rod travel to accept every tentative card one at a time, front to back or as listed. */
export function travelOneByOne(accepted: string[], tentative: string[]) {
  let s = start(accepted, tentative)
  for (const id of tentative) {
    s = pull(s, s.tip - slot(s.accepted, id))
    s = file(s, id)
    s = push(s, s.accepted.length)
  }
  return s.travel
}

/** Rod travel to accept them all in one opening. */
export function travelInOnePass(accepted: string[], tentative: string[]) {
  let s = start(accepted, tentative)
  s = pull(s, s.tip - Math.min(...tentative.map((id) => slot(accepted, id))))
  for (const id of tentative) s = file(s, id)
  return push(s, s.accepted.length).travel
}
