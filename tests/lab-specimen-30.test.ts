import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CONTRIBUTIONS } from '../src/data/community-fixtures.ts'
import { STOPS, account, fate, hiddenByLabel, rewrite, sentence } from '../src/lab/experiments/community/30-lens.ts'

// 30 · The Moderation Lens. The finding: hide three of eight records by
// invented labels and the generated account can say "Nobody disagreed with it."

const last = STOPS.length - 1

test('through clear glass the account names the correction and the dispute', () => {
  assert.equal(
    sentence(account(0)),
    'The essay drew 5 responses. mara corrected H4 and jun disputed H2. ines endorsed mara’s correction. tomas wrote up how to rerun the evaluation. 2 more replies could not be read.',
  )
})

test('at the strictest stop, three of eight records are hidden by label and nobody disagreed', () => {
  assert.equal(CONTRIBUTIONS.length, 8)
  assert.deepEqual(
    hiddenByLabel(last).map((c) => c.id),
    ['c3', 'c4', 'c5'],
  )
  assert.equal(sentence(account(last)), 'The essay drew 2 responses. Nobody disagreed with it. ines endorsed something this view does not show.')
})

test('the lens rewrites the account rather than only shortening it', () => {
  const edits = rewrite(last)
  const against = edits.find((e) => e.key === 'against')!
  assert.equal(against.kind, 'rewritten')
  assert.equal(against.was, 'mara corrected H4 and jun disputed H2.')
  assert.equal(against.now, 'Nobody disagreed with it.')
  assert.deepEqual(
    edits.filter((e) => e.kind === 'cut').map((e) => e.key),
    ['rerun', 'unread'],
  )
  // Clear glass is the baseline, so it rewrites nothing.
  assert.ok(rewrite(0).every((e) => e.kind === 'kept'))
})

test('only the strictest stop says nobody disagreed; one stop earlier the dispute vanishes without a trace', () => {
  const says = STOPS.map((_, i) => account(i).some((c) => c.text === 'Nobody disagreed with it.'))
  assert.deepEqual(says, [false, false, false, false, true])
  // At "Calm, hide" jun's dispute is gone and the sentence still reads as whole.
  assert.equal(STOPS[3]!.name, 'Calm, hide')
  assert.equal(account(3).find((c) => c.key === 'against')!.text, 'mara corrected H4.')
})

test('a label never edits a record: hidden records keep their text', () => {
  for (const c of hiddenByLabel(last)) {
    assert.equal(fate(c, last).fate, 'hidden')
    assert.ok(c.text.length > 0)
  }
})
