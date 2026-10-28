import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildIndex, recallAt, reciprocalRank, search, stem, tokenize } from '../src/lib/retrieval.ts'

test('tokenize lowercases, drops stopwords and folds plurals', () => {
  assert.deepEqual(tokenize('How do I fix the broken Assets on GitHub Pages?'), [
    'fix',
    'broken',
    'asset',
    'github',
    'page',
  ])
  assert.equal(stem('libraries'), 'library')
  assert.equal(stem('caches'), 'cache')
  assert.equal(stem('class'), 'class')
  assert.equal(stem('status'), 'status')
})

const docs = [
  { id: 'a', fields: { problem: 'css missing after deploy', solution: 'set the base path' } },
  { id: 'b', fields: { problem: 'refresh returns 404', solution: 'add a 404 fallback page' } },
  { id: 'c', fields: { problem: 'unrelated topic', solution: 'nothing here' } },
]

test('single-field BM25 ranks the matching document first and keeps unmatched ones', () => {
  const index = buildIndex('baseline', 'test', docs.map((d) => ({ id: d.id, fields: { text: `${d.fields.problem} ${d.fields.solution}` } })), { text: 1 })
  const result = search(index, 'refresh 404')
  assert.equal(result.hits[0]?.id, 'b')
  assert.deepEqual(result.unmatched, ['a', 'c'])
  assert.deepEqual(result.unknownTerms, [])
})

test('unknown terms are reported instead of silently ignored', () => {
  const index = buildIndex('baseline', 'test', docs.map((d) => ({ id: d.id, fields: { text: d.fields.problem } })), { text: 1 })
  const result = search(index, 'kubernetes css')
  assert.deepEqual(result.unknownTerms, ['kubernete'])
  assert.equal(result.hits.length, 1)
})

test('field weights change ranking and explanations name the matched fields', () => {
  const two = [
    { id: 'p', fields: { problem: 'base path', solution: 'other' } },
    { id: 's', fields: { problem: 'other', solution: 'base path' } },
  ]
  const favourProblem = buildIndex('structured', 'test', two, { problem: 3, solution: 1 })
  const result = search(favourProblem, 'base')
  assert.equal(result.hits[0]?.id, 'p')
  assert.deepEqual(result.hits[0]?.matches[0]?.fields, { problem: 1 })
})

test('search is deterministic, including ties', () => {
  const tied = buildIndex('baseline', 'test', [
    { id: 'y', fields: { text: 'same words' } },
    { id: 'x', fields: { text: 'same words' } },
  ], { text: 1 })
  const first = search(tied, 'same').hits.map((h) => h.id)
  assert.deepEqual(first, ['x', 'y'])
  assert.deepEqual(search(tied, 'same').hits.map((h) => h.id), first)
})

test('metrics', () => {
  assert.equal(recallAt(['a', 'b', 'c'], ['b', 'z'], 2), 0.5)
  assert.equal(reciprocalRank(['a', 'b', 'c'], ['c'], 10), 1 / 3)
  assert.equal(reciprocalRank(['a', 'b', 'c'], ['c'], 2), 0)
})
