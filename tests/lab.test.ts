import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CATALOGUE } from '../src/lab/catalogue/index.ts'
import { CONSTELLATIONS } from '../src/lab/catalogue/map.ts'

const FAMILY_RANGE: Record<string, [number, number]> = {
  discovery: [1, 10],
  classification: [11, 20],
  community: [21, 30],
  history: [31, 40],
  editorial: [41, 50],
  memory: [51, 60],
}

test('catalogue numbers are unique, two-digit and inside their family’s range', () => {
  const seen = new Set<string>()
  for (const e of CATALOGUE) {
    assert.match(e.n, /^\d\d$/)
    assert.ok(!seen.has(e.n), `duplicate ${e.n}`)
    seen.add(e.n)
    const [lo, hi] = FAMILY_RANGE[e.family]!
    assert.ok(Number(e.n) >= lo && Number(e.n) <= hi, `${e.n} outside ${e.family}`)
  }
})

test('every entry answers the method’s questions', () => {
  for (const e of CATALOGUE) {
    const text = [e.question, e.proposition, e.manipulate, e.changes, e.unchanged, e.built, e.happened, e.uncertain, e.falsifier, e.simpler, e.data, e.finding]
    for (const t of text) assert.ok(t.trim().length > 10, `${e.n}: a required field is empty`)
    for (const t of Object.values(e.provenance).filter((v) => typeof v === 'string')) assert.ok(t.trim().length > 10, `${e.n}: provenance incomplete`)
    assert.ok(e.question.trim().endsWith('?'), `${e.n}: the research question should be a question`)
    assert.ok(e.provenance.sources.length > 0, `${e.n}: needs at least one source`)
    for (const s of e.provenance.sources) if (s.url) assert.match(s.url, /^https:\/\//, `${e.n}: ${s.label}`)
    assert.ok(e.finding.length <= 220, `${e.n}: the finding should be short enough to browse`)
    for (const r of e.related) assert.ok(/^\d\d$/.test(r) && r !== e.n && Number(r) <= 60, `${e.n}: related ${r}`)
    if (e.status === 'specimen') assert.ok(e.assessment, `${e.n}: a specimen needs an assessment`)
  }
})

test('no entry claims a study, users or measurements that do not exist', () => {
  const invented = /\b(users?|participants?|visitors?|readers?|testers?)\s+(found|preferred|reported|said|told us|understood|rated)\b|\b(user study|a\/b test|significantly)\b/i
  for (const e of CATALOGUE) {
    const all = JSON.stringify(e)
    assert.doesNotMatch(all, invented, `${e.n}: reads like a claim about people we did not test with`)
  }
})

test('every catalogued experiment has a registered component', () => {
  for (const e of CATALOGUE) {
    const index = readFileSync(new URL(`../src/lab/experiments/${e.family}/index.ts`, import.meta.url), 'utf8')
    assert.match(index, new RegExp(`'${e.n}':`), `${e.n} has no component in ${e.family}/index.ts`)
  }
})

test('constellations only name catalogued experiments', () => {
  const ns = new Set(CATALOGUE.map((e) => e.n))
  for (const c of CONSTELLATIONS) for (const m of c.members) assert.ok(ns.has(m), `${c.title}: ${m}`)
})

test('route heads match the catalogue', async () => {
  const { HEADS } = await import('../src/lab/catalogue/heads.ts')
  assert.deepEqual(Object.keys(HEADS).sort(), CATALOGUE.map((e) => e.n))
  for (const e of CATALOGUE) {
    assert.equal(HEADS[e.n]!.title, e.title, `${e.n} title`)
    assert.equal(HEADS[e.n]!.question, e.question, `${e.n} question`)
  }
})

test('the critique assesses every pilot and only catalogued ones', async () => {
  const { CRITIQUE } = await import('../src/lab/catalogue/critique.ts')
  assert.deepEqual(Object.keys(CRITIQUE).sort(), CATALOGUE.map((e) => e.n))
  for (const e of CATALOGUE) assert.ok(e.assessment, `${e.n} has no assessment`)
})
