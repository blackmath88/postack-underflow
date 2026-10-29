import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'
import { tokenize } from '../../../lib/retrieval'

// Small read-only helpers shared by the classification pilots. They answer one
// question about the frozen v1 data: does a word the index uses also occur in
// the pinned source? The baseline index holds each source's term counts, so
// the check needs no source text, only its postings.

const POSTINGS = artifact.indexes.baseline.fields.text!.postings

/** Every distinct token of each source's pinned text. */
const SOURCE_TOKENS = (() => {
  const m = new Map<string, Set<string>>()
  for (const [term, row] of Object.entries(POSTINGS))
    for (const id of Object.keys(row)) {
      let s = m.get(id)
      if (!s) m.set(id, (s = new Set()))
      s.add(term)
    }
  return m
})()

/** Strict: the v1 tokenizer's exact token occurs in the source. */
export const sourceSays = (token: string, sourceId: string) => Boolean(POSTINGS[token]?.[sourceId])

const SUFFIXES = ['ly', 'ed', 'ing', 'er', 'd']

/**
 * Lenient: also accept the word with a common suffix removed (locally → local)
 * or a word of four letters or more inside a longer source token (slash
 * inside trailingslash). It
 * is still a word check, not a reading.
 */
export function sourceNearlySays(token: string, sourceId: string) {
  if (sourceSays(token, sourceId)) return true
  const set = SOURCE_TOKENS.get(sourceId)
  if (!set) return false
  const forms = [token, ...SUFFIXES.filter((s) => token.endsWith(s) && token.length - s.length >= 3).map((s) => token.slice(0, -s.length))]
  for (const f of forms) {
    if (set.has(f)) return true
    if (f.length >= 4) for (const t of set) if (t.length > f.length && t.includes(f)) return true
  }
  return false
}

export const termWords = (term: string) => tokenize(term.replace(/-/g, ' '))

/** Does the source contain every word of a controlled term's name? */
export const termAttested = (term: string, sourceId: string) => termWords(term).every((t) => sourceSays(t, sourceId))

export const RECORDS: ProblemRecord[] = artifact.records
export const record = (sourceId: string) => recordBySource.get(sourceId)!
export const source = (sourceId: string) => sourceById.get(sourceId)!

/** A short human name for a source: repo plus a trimmed title. */
export function shortName(sourceId: string) {
  const s = sourceById.get(sourceId)
  if (!s) return sourceId
  const issue = sourceId.match(/issue-(\d+)/)
  const repo = s.repo.split('/')[1] ?? s.repo
  return issue ? `${repo}#${issue[1]}` : `${repo}: ${s.title}`
}
