import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { buildIndex, search } from '../src/lib/retrieval.ts'
import { COMMONS_WEIGHTS, applyCorrection, problemFields, type Correction, type Problem } from '../src/commons/model.ts'

const artifact = JSON.parse(readFileSync(new URL('../src/data/commons-index.json', import.meta.url), 'utf8'))
const problems: Problem[] = artifact.problems
const corrections: Correction[] = artifact.corrections
const haveCache = existsSync(new URL('../corpus/commons/.cache/threads.json', import.meta.url))

test('records and corrections resolve to the snapshot (quotes verbatim when the cache is present)', () => {
  const out = execFileSync('node', ['scripts/commons/check-records.mjs'], { encoding: 'utf8' })
  assert.match(out, /18 problems/)
})

test('the index artifact reproduces from its inputs', { skip: !haveCache && 'no local snapshot cache' }, () => {
  execFileSync('node', ['scripts/commons/build-index.mjs', '--check'], { encoding: 'utf8' })
})

test('the artifact was built from the committed records', () => {
  const sha = (f: string) => execFileSync('sha256sum', [f], { encoding: 'utf8' }).split(' ')[0]
  assert.equal(artifact.inputs.problems, sha('corpus/commons/problems.json'))
  assert.equal(artifact.inputs.corrections, sha('corpus/commons/corrections.json'))
})

test('every source-declared relation cites evidence; machine proposals are labelled as such', () => {
  for (const p of problems) for (const r of p.related) {
    if (r.basis === 'source-declared') assert.ok(r.evidence, `${p.id} → ${r.to}`)
  }
  assert.ok(problems.some((p) => p.related.some((r) => r.basis === 'machine-proposal')))
})

test('ordinary-language queries reach the expected record first', () => {
  const top = (q: string) => search(artifact.indexes.structured, q).hits[0]?.id
  assert.equal(top('only the sd card shows up'), 'emmc-not-exposed')
  assert.equal(top('stuck on boot animation'), 'launcher-lockout')
  assert.equal(top('computer does not see the frame'), 'usb-c-no-data')
})

test('applying a correction is a pure preview: the record and the source are unchanged', () => {
  const c = corrections.find((x) => x.id === 'c-71-january')!
  const before = problems.find((p) => p.id === c.problem)!
  const snapshot = JSON.stringify(before)
  const after = applyCorrection(before, c)
  assert.equal(JSON.stringify(before), snapshot)
  assert.notEqual(after.statusNote, before.statusNote)
  assert.ok(after.environment.some((e) => e.includes('20260113')))
  const idx = buildIndex('structured', 'preview', problems.map((p) => ({ id: p.id, fields: problemFields(p.id === c.problem ? after : p) })), COMMONS_WEIGHTS)
  assert.equal(search(idx, 'error -71 january').hits[0]?.id, 'gadget-error-71')
})

test('the test-app password published in the source is not republished', () => {
  const text = readFileSync(new URL('../src/data/commons-index.json', import.meta.url), 'utf8')
  const records = readFileSync(new URL('../corpus/commons/problems.json', import.meta.url), 'utf8')
  // Neither the records nor the raw-thread postings (which hold tokens) may carry it.
  for (const t of [records, text]) assert.doesNotMatch(t, /yhk8{4}/i)
  assert.ok(artifact.redactions.length > 0)
})
