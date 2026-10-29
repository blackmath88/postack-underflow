import { test } from 'node:test'
import assert from 'node:assert/strict'
import { STORY, ledger, surfaceText, surfaceWords, unsafe } from '../src/lab/experiments/editorial/45-ledger.ts'

// 45 · The Story You Can Interrupt. The finding: skipping every aside is safe
// except once. The only statement that the four-step thread is an
// illustration lives inside an aside.

test('the Switchboard chapter is 14 beats and 314 words straight through, with 11 asides', () => {
  assert.equal(STORY.length, 14)
  assert.equal(surfaceWords(), 314)
  assert.equal(ledger().length, 11)
})

test('three asides are caveats; two are restated on the surface in the chapter’s own words', () => {
  const rows = ledger()
  const restated = rows.filter((r) => r.cost === 'restated')
  assert.deepEqual(
    restated.map((r) => r.id),
    ['fixtures', 'connectionNotEndorsement'],
  )
  for (const r of restated) assert.ok(surfaceText().includes(r.surface!))
  assert.equal(rows.filter((r) => r.cost === 'detail').length, 8)
})

test('exactly one skip is unsafe: “Is this a real thread?”, on the first beat, just before the thread', () => {
  const u = unsafe()
  assert.equal(u.length, 1)
  assert.equal(u[0]!.id, 'illustration')
  assert.equal(u[0]!.beat, 0)
  assert.equal(ledger()[0]!.id, 'illustration', 'it is the first aside on the reading path')
  assert.match(STORY[1]!.text, /^Someone posts a fix\./, 'the next beat is the four-step thread')
})

test('the story itself never calls the thread an illustration', () => {
  assert.doesNotMatch(surfaceText(), /illustrat|not a (real|quoted)|made up|invented example/i)
})
