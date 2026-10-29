import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { allEqual, changedFirsts } from '../src/lab/experiments/discovery/04-weights.ts'
import type { Index } from '../src/lib/retrieval.ts'

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const frozen: Index = read('../src/data/four-words-index.json').indexes.structured
const queries: Array<{ id: string; query: string }> = read('../corpus/queries.json').queries
const texts = queries.map((q) => q.query)

test('04: making every field weight equal changes the first result for 1 of 27 queries', () => {
  assert.equal(texts.length, 27)
  const changed = changedFirsts(frozen, allEqual(frozen), texts)
  assert.equal(changed.length, 1)
  assert.deepEqual(changed.map((i) => queries[i]!.id), ['q26'])
})

test('04: the frozen weights change nothing, and doubling any one weight changes at most 1', () => {
  assert.equal(changedFirsts(frozen, { ...frozen.weights }, texts).length, 0)
  for (const f of Object.keys(frozen.weights)) {
    const n = changedFirsts(frozen, { ...frozen.weights, [f]: frozen.weights[f]! * 2 }, texts).length
    assert.ok(n <= 1, `doubling ${f} changed ${n}`)
  }
})

test('04: only extreme settings move much: one field alone changes 7 to 18 first results', () => {
  const alone = Object.keys(frozen.weights).map(
    (f) => changedFirsts(frozen, Object.fromEntries(Object.keys(frozen.weights).map((g) => [g, g === f ? 1 : 0])), texts).length,
  )
  assert.equal(Math.min(...alone), 7)
  assert.equal(Math.max(...alone), 18)
})
