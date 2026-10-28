import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CLAIM, EVIDENCE, NEIGHBOURS, CORRECTION } from '../src/data/disputed-neighbour.ts'
import { PARTS, CORRECTION_RECORD, DESK_QUERY_ID } from '../src/data/problem-desk.ts'
import { HISTORY } from '../src/data/research-history.ts'
import { tokenize } from '../src/lib/retrieval.ts'

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const records: Array<{ sourceId: string; aliases: string[]; symptoms: string[]; terms: string[] }> = read('../corpus/records.json')
const sources: Array<{ id: string }> = read('../corpus/sources.json')
const queries: Array<{ id: string }> = read('../corpus/queries.json').queries
const ids = new Set(sources.map((s) => s.id))
const words = (s: string) => s.trim().split(/\s+/).length

test('Disputed Neighbour cites real corpus sources and short quotations', () => {
  for (const n of NEIGHBOURS) {
    assert.ok(ids.has(n.sourceId), n.sourceId)
    for (const e of n.excerpts) if (e.quote) assert.ok(words(e.text) < 15, `quote too long: ${e.text}`)
    const record = records.find((r) => r.sourceId === n.sourceId)!
    // Every flagged phrase must really be in the frozen record it claims to come from.
    for (const u of n.unsupported) assert.ok(record[u.field].includes(u.text), `${u.text} not in the v1 record`)
  }
  for (const e of EVIDENCE) assert.ok(ids.has(e.sourceId), e.sourceId)
  assert.ok(EVIDENCE.some((e) => e.stance === 'supports') && EVIDENCE.some((e) => e.stance === 'challenges'), 'evidence both ways')
  assert.match(CLAIM.proposedBy, /hypothetical/)
  for (const a of CORRECTION.answers) assert.ok(NEIGHBOURS.some((n) => n.sourceId === a.goesTo))
})

test('Problem Desk uses a frozen query and labels its grounding honestly', () => {
  assert.ok(queries.some((q) => q.id === DESK_QUERY_ID))
  assert.match(CORRECTION_RECORD.author, /\.example$/)
  assert.match(CORRECTION_RECORD.nsid, /^example\.postack\./)
  for (const p of PARTS) {
    assert.ok(ids.has(p.target), p.target)
    if (p.grounding === 'mechanism') assert.ok(p.quote && words(p.quote.text) < 15, 'grounded parts quote their source briefly')
    else assert.equal(p.quote, undefined, 'inferred parts must not pretend to quote a source')
  }
})

test('research history entries say what changed', () => {
  for (const h of HISTORY) {
    assert.ok(h.what.length > 20 && h.changed.length > 15, h.title)
    if (h.link) assert.match(h.link.url, /^https:\/\//)
  }
  assert.ok(HISTORY.some((h) => h.kind === 'correction'), 'the history keeps its corrections')
})

test('quotations appear on the cited snapshot lines (when snapshots are present)', (t) => {
  const cache = new URL('../corpus/.cache/', import.meta.url)
  const line = (id: string, n: number) => {
    try {
      return readFileSync(new URL(`${id}.txt`, cache), 'utf8').split('\n')[n - 1] ?? ''
    } catch {
      return null
    }
  }
  const checks: Array<[string, number, string]> = []
  for (const n of NEIGHBOURS) for (const e of n.excerpts) if (e.quote) checks.push([n.sourceId, e.line, e.text])
  for (const p of PARTS) if (p.quote) checks.push([p.target, p.quote.line, p.quote.text])
  if (line(checks[0]![0], 1) === null) return t.skip('snapshots not fetched (npm run corpus:fetch)')
  for (const [id, n, text] of checks) assert.ok(line(id, n)!.includes(text), `${id}:${n} does not contain “${text}”`)
  // Words claimed absent from a source must really be absent from its tokens.
  for (const n of NEIGHBOURS) {
    const tokens = new Set(tokenize(readFileSync(new URL(`${n.sourceId}.txt`, cache), 'utf8')))
    for (const w of n.absentWords) assert.ok(!tokens.has(w), `${n.sourceId}: “${w}” does occur in the source`)
  }
})
