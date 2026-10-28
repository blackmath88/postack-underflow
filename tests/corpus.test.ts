import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CONTROLLED_TERMS } from '../src/lib/records.ts'

const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
interface Source {
  id: string
  revision: string
  revisionKind: string
  url: string
  rawUrl: string
  license: string
  summary: string
}
const sources: Source[] = read('../corpus/sources.json')
const records: Array<Record<string, any>> = read('../corpus/records.json')
const queries: Array<{ id: string; query: string; relevant: string[] }> = read('../corpus/queries.json').queries
const ids = new Set(sources.map((s) => s.id))

test('every source is pinned, attributed and licensed', () => {
  for (const s of sources) {
    assert.match(s.id, /^[a-z0-9-]+$/, s.id)
    if (s.revisionKind === 'commit') {
      assert.match(s.revision, /^[0-9a-f]{40}$/, `${s.id}: pinned commit`)
      assert.ok(s.url.includes(s.revision) && s.rawUrl.includes(s.revision), `${s.id}: URLs use the pinned commit`)
    } else {
      assert.match(s.revision, /^\d{4}-\d\d-\d\dT/, `${s.id}: updated_at timestamp`)
    }
    assert.ok(s.license.length > 0, `${s.id}: licence`)
    assert.ok(s.summary.length > 40, `${s.id}: summary`)
  }
  assert.equal(ids.size, sources.length, 'source ids unique')
})

test('exactly one complete record per source, in source order', () => {
  assert.deepEqual(records.map((r) => r.sourceId), sources.map((s) => s.id))
  const allowedTerms = new Set<string>(CONTROLLED_TERMS)
  for (const r of records) {
    assert.equal(r.id, `rec-${r.sourceId}`)
    assert.ok(r.problem.length > 20, `${r.id}: problem`)
    assert.ok(r.solution.length > 20, `${r.id}: solution`)
    assert.ok(r.aliases.length >= 1, `${r.id}: aliases`)
    assert.ok(r.evidence.length >= 1, `${r.id}: evidence`)
    assert.ok(r.terms.length >= 1 && r.terms.every((t: string) => allowedTerms.has(t)), `${r.id}: controlled terms`)
    for (const rel of r.related) assert.ok(ids.has(rel.sourceId) && rel.sourceId !== r.sourceId, `${r.id}: related ${rel.sourceId}`)
    assert.match(r.extraction.by, /without access to the evaluation queries/, `${r.id}: extraction provenance`)
  }
})

test('queries are short and labelled against real sources', () => {
  for (const q of queries) {
    assert.ok(q.query.trim().split(/\s+/).length <= 4, `${q.id}: at most four words`)
    assert.ok(q.relevant.length >= 1, `${q.id}: has a label`)
    for (const id of q.relevant) assert.ok(ids.has(id), `${q.id}: unknown source ${id}`)
  }
})
