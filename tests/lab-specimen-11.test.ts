import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { drawersOf, missingWords, placementsOf, wordCheckTally, type Postings } from '../src/lab/experiments/classification/11-rod.ts'
import { CONTROLLED_TERMS } from '../src/lib/records.ts'

const art = JSON.parse(readFileSync(new URL('../src/data/four-words-index.json', import.meta.url), 'utf8'))
const postings: Postings = art.indexes.baseline.fields.text.postings
const placements = placementsOf(art.records)
const drawers = drawersOf(CONTROLLED_TERMS, placements, postings)

test('11: the word check holds 30 of the 80 placements above the rod', () => {
  const t = wordCheckTally(drawers)
  assert.equal(t.total, 80)
  assert.equal(t.passed, 50)
  assert.equal(t.held, 30)
})

test('11: it leaves the underscore-paths and trailing-slash drawers empty to a patron', () => {
  assert.deepEqual(wordCheckTally(drawers).emptied, ['underscore-paths', 'trailing-slash'])
  const underscore = drawers.find((d) => d.term === 'underscore-paths')!
  assert.equal(underscore.cards.length, 5)
  assert.equal(underscore.passing.length, 0)
})

test('11: it holds vite#8073 under asset-404 because the source never writes 404', () => {
  assert.deepEqual(missingWords(postings, { sourceId: 'vite-issue-8073-base-mime', term: 'asset-404' }), ['404'])
})
