import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { branchOf, type Query } from '../src/lab/experiments/memory/56-fork.ts'

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const { structured, baseline } = read('../src/data/four-words-index.json').indexes
const queries: Query[] = read('../corpus/queries.json').queries

const left = branchOf(structured, baseline, queries, 'labeller')
const right = branchOf(structured, baseline, queries, 'review')

test('56: the two readings of q01 put the first answer at rank 7 or rank 2', () => {
  assert.equal(left.structuredRank, 7)
  assert.equal(right.structuredRank, 2)
  assert.equal(left.keywordRank, 1)
  assert.equal(right.keywordRank, 1)
})

test('56: structured MRR@10 reads 0.950 or 0.963, keyword stays at 0.742', () => {
  assert.equal(left.structured.toFixed(3), '0.950')
  assert.equal(right.structured.toFixed(3), '0.963')
  assert.equal(left.keyword.toFixed(3), '0.742')
  assert.equal(right.keyword.toFixed(3), '0.742')
})

test('56: the winner does not change between the branches', () => {
  assert.equal(left.winner, 'structured')
  assert.equal(right.winner, 'structured')
})
