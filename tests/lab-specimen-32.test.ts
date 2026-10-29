import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CONTROLLED_TERMS, type ProblemRecord } from '../src/lib/records.ts'
import type { CorpusSource } from '../src/lib/four-words-data.ts'
import { card, cardLines, median } from '../src/lab/experiments/history/32-hands.ts'

// 32 · The Librarian's Hand. The finding: an AI agent wrote 81–92% of every
// card's words (median 89%), and the reviewer's line is blank on all 30.
// Reads the frozen artifact the pilot reads, without writing it.

const artifact = JSON.parse(readFileSync(new URL('../src/data/four-words-index.json', import.meta.url), 'utf8')) as {
  records: ProblemRecord[]
  sources: CorpusSource[]
}
const source = new Map(artifact.sources.map((s) => [s.id, s]))
const cards = artifact.records.map((r) => ({ id: r.sourceId, ...card(r, source.get(r.sourceId), CONTROLLED_TERMS) }))
const shares = cards.map((c) => c.writerShare)

test('there are 30 cards', () => {
  assert.equal(cards.length, 30)
})

test('the record writer wrote 81–92% of every card’s words, median 89%', () => {
  assert.equal(Math.min(...shares), 81)
  assert.equal(Math.max(...shares), 92)
  // The median of the exact shares is 88.5%, which the notebook rounds to 89%.
  const m = median(cards.map((c) => c.writerExact))
  assert.ok(m > 88.5 && m < 88.6)
  assert.equal(Math.round(m), 89)
})

test('the reviewer’s line is blank on all 30 cards', () => {
  assert.equal(cards.filter((c) => c.reviewed).length, 0)
  for (const r of artifact.records) assert.match(r.extraction.method, /not yet reviewed by a human/)
})

test('on the opening card, lifting the agent leaves 36 of 230 words and nothing ticked', () => {
  const c = cards.find((x) => x.id === 'vite-issue-9119-underscore-chunk')!
  assert.equal(c.total, 230)
  assert.equal(c.writerShare, 84)
  assert.equal(c.total - c.counts.writer, 36)
  // What survives is the source's title, repository and licence, the pin, and the empty form.
  const r = artifact.records.find((x) => x.sourceId === c.id)!
  const left = cardLines(r, source.get(c.id)).filter((l) => l.hand !== 'writer').map((l) => l.field)
  assert.deepEqual(left, ['Title', 'Repository', 'Licence', 'Pinned at'])
})

test('median takes the mean of the middle two for an even count', () => {
  assert.equal(median([1, 2, 3, 4]), 2.5)
  assert.equal(median([3, 1, 2]), 2)
})
