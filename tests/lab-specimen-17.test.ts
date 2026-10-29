import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { EXHIBITS, REPORT_KINDS, weigh } from '../src/lab/experiments/classification/17-scale.ts'

const records: Array<{ sourceId: string; evidence: Array<{ kind: string }> }> = JSON.parse(
  readFileSync(new URL('../corpus/records.json', import.meta.url), 'utf8'),
)

test('17: all six .nojekyll exhibits are reports in their records', () => {
  assert.equal(EXHIBITS.length, 6)
  for (const e of EXHIBITS) {
    const ev = records.find((r) => r.sourceId === e.sourceId)?.evidence[e.evidence]
    assert.ok(ev, `${e.id} points at a real evidence note`)
    assert.ok((REPORT_KINDS as readonly string[]).includes(ev.kind), `${e.id} is ${ev.kind}`)
  }
})

test('17: admitting only stronger proof empties the scale, and it reads exactly like the balanced one', () => {
  const every = weigh('every', 'any')
  const stronger = weigh('stronger', 'any')
  assert.equal(every.pro.length, 3)
  assert.equal(every.con.length, 3)
  assert.equal(stronger.pro.length + stronger.con.length, 0)
  assert.equal(stronger.aside.length, 6)
  assert.ok(stronger.empty)
  assert.equal(every.reads, 'level')
  assert.equal(stronger.reads, every.reads)
  assert.equal(stronger.tilt, every.tilt)
})

test('17: the scope decides more than the proof: 3 to 0 for branch sites, 3 to 0 against for Actions', () => {
  const branch = weigh('every', 'branch')
  const actions = weigh('every', 'actions')
  assert.deepEqual([branch.pro.length, branch.con.length, branch.reads], [3, 0, 'tips for'])
  assert.deepEqual([actions.pro.length, actions.con.length, actions.reads], [0, 3, 'tips against'])
})
