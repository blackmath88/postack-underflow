import type { NoteId } from '../../../content/margin'
import { beatsOf, words, type Beat } from './essay.ts'

// 45 · The Story You Can Interrupt: what passing each aside costs. Pure, with
// type-only imports beyond essay.ts, so a Node test can run it.
//
// Our reading, not a measurement: three of the chapter's asides are caveats,
// telling the reader that something on the page is not what it might seem
// (they are the three NOTES with evidence "fixture"). For each, CAVEATS gives
// the words in the chapter's own text that say the same thing, or null when
// the text never says it. Every other aside adds evidence or reasoning behind a
// sentence the story already makes; passing it loses detail. Whether a reader
// would infer a caveat anyway is a comprehension question this cannot answer.

export const STORY: Beat[] = beatsOf('community')

export const CAVEATS: Partial<Record<NoteId, string | null>> = {
  illustration: null,
  fixtures: 'All of them are invented.',
  connectionNotEndorsement: 'it never becomes their statement.',
}

export type Cost = 'detail' | 'restated' | 'only-here'

export interface Row {
  id: NoteId
  beat: number
  cost: Cost
  /** For a restated caveat, the chapter's own words that say it. */
  surface?: string
}

/** The story's own text, every beat, without any aside. */
export const surfaceText = (beats: Beat[] = STORY) => beats.map((b) => b.text).join(' ')
export const surfaceWords = (beats: Beat[] = STORY) => beats.reduce((n, b) => n + words(b.text), 0)

/** One row per aside, in reading order. A restated caveat must be found verbatim in the story's text. */
export function ledger(beats: Beat[] = STORY): Row[] {
  const text = surfaceText(beats)
  return beats.flatMap((b, i) =>
    b.notes.map((n): Row => {
      if (!(n.id in CAVEATS)) return { id: n.id, beat: i, cost: 'detail' }
      const said = CAVEATS[n.id]
      return said && text.includes(said) ? { id: n.id, beat: i, cost: 'restated', surface: said } : { id: n.id, beat: i, cost: 'only-here' }
    }),
  )
}

/** Asides whose passing leaves the story without something it says nowhere else. */
export const unsafe = (beats: Beat[] = STORY) => ledger(beats).filter((r) => r.cost === 'only-here')
