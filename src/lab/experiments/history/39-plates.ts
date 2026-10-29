import { ANNOTATIONS, REVISIONS } from '../../data/history-printer.ts'

// 39 · The Marginal Printer: where each annotation plate prints on a revised
// text. Pure, so a Node test can run it. An annotation registered by position
// keeps its character offset in revision 0; one registered by quotation looks
// for its words in the text it is printed on.

export type Mode = 'position' | 'quote'

const BASE = REVISIONS[0]!.text
export const ANCHORS = ANNOTATIONS.map((a) => ({ ...a, start: BASE.indexOf(a.quote), length: a.quote.length }))

export interface Placed {
  id: string
  note: string
  quote: string
  /** Where the plate prints, or null when it prints nowhere. */
  start: number | null
  /** How far, in characters, the plate sits from where its words are now. Null when the words are gone. */
  drift: number | null
  /** The words the plate actually prints over, or null when it prints nowhere. */
  printsOver: string | null
}

export function place(text: string, mode: Mode): Placed[] {
  return ANCHORS.map((a) => {
    const now = text.indexOf(a.quote)
    const base = { id: a.id, note: a.note, quote: a.quote }
    if (mode === 'quote')
      return { ...base, start: now === -1 ? null : now, drift: now === -1 ? null : 0, printsOver: now === -1 ? null : a.quote }
    return { ...base, start: a.start, drift: now === -1 ? null : Math.abs(now - a.start), printsOver: text.slice(a.start, a.start + a.length) }
  })
}

/** What one sheet amounts to: plates on their words, plates printing over the wrong words, plates left off. */
export function proof(text: string, mode: Mode) {
  const placed = place(text, mode)
  const right = placed.filter((p) => p.printsOver === p.quote).length
  const wrong = placed.filter((p) => p.printsOver !== null && p.printsOver !== p.quote).length
  const off = placed.filter((p) => p.printsOver === null).length
  return { placed, right, wrong, off }
}
