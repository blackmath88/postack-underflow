// Data for pilot 20, The Unverified Stamp: the parts a rubber stamp can be
// made of, and what each part seems to claim. Written for the laboratory on
// 2026-10-29 by the classification builder (an AI agent).
//
// `implies` is our reading of what a mark usually suggests, not a measured
// meaning: nobody was asked. Whether a record backs the implication is
// computed in the pilot from the frozen v1 record, never stored here.
//
// This may not be used to claim how any reader interprets a stamp.

export type Backing = 'extraction-human' | 'extraction-paraphrase' | 'extraction-date' | 'extraction-named' | 'word-check' | 'evidence' | 'none' | 'nothing'

export interface StampPart {
  id: string
  /** Shown on the stamp. Empty for a border. */
  face: string
  implies: string
  /** Which recorded fact could back it. */
  backing: Backing
}

export const WORDS: StampPart[] = [
  { id: 'verified', face: 'VERIFIED', implies: 'Someone confirmed the content against its source.', backing: 'extraction-human' },
  { id: 'reviewed', face: 'REVIEWED', implies: 'A second reader went through it.', backing: 'extraction-human' },
  { id: 'checked', face: 'CHECKED', implies: 'On this site: checked against the linked source.', backing: 'word-check' },
  { id: 'accepted', face: 'ACCEPTED', implies: 'Somebody decided to keep it as it is.', backing: 'none' },
  { id: 'paraphrased', face: 'PARAPHRASED', implies: 'The words are a rewording of the source.', backing: 'extraction-paraphrase' },
  { id: 'unreviewed', face: 'NOT REVIEWED', implies: 'No second reader has been through it.', backing: 'extraction-human' },
]

export const BORDERS: StampPart[] = [
  { id: 'seal', face: '', implies: 'An institution stands behind it.', backing: 'none' },
  { id: 'box', face: '', implies: 'Nothing beyond the words inside it.', backing: 'nothing' },
]

export const EXTRAS: StampPart[] = [
  { id: 'date', face: 'date', implies: 'It held on this date.', backing: 'extraction-date' },
  { id: 'initials', face: 'initials', implies: 'A named person answers for it.', backing: 'extraction-named' },
  { id: 'evidence', face: 'evidence', implies: 'The evidence label applies to what is stamped.', backing: 'evidence' },
]
