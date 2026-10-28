import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { SOURCES } from '../src/content/sources.ts'
import { CONTRIBUTIONS } from '../src/data/community-fixtures.ts'
import { CONTRACTS, status } from '../src/data/connection-contracts.ts'

const record = JSON.parse(readFileSync(new URL('../knowledge/we-already-solved-this.json', import.meta.url), 'utf8'))
const repo = (path: string) => new URL(`../${path}`, import.meta.url)

test('the essay record references real sources, evidence and files', () => {
  for (const id of record.sources) assert.ok(id in SOURCES, `unknown source ${id}`)
  const evidence = new Set(record.evidence.map((e: { id: string }) => e.id))
  for (const h of record.hypotheses) {
    assert.ok(['tested', 'demonstrated-on-fixtures', 'partially-demonstrated', 'untested'].includes(h.status), h.id)
    for (const e of h.evidence) assert.ok(evidence.has(e), `${h.id}: unknown evidence ${e}`)
    if (h.status === 'untested') assert.equal(h.evidence.length, 0, `${h.id}: untested claims cite no evidence`)
  }
  for (const e of record.evidence) {
    assert.ok(existsSync(repo(e.artifact)), `${e.id}: missing artifact ${e.artifact}`)
    if (e.report) assert.ok(existsSync(repo(e.report)), `${e.id}: missing report ${e.report}`)
  }
  for (const p of record.provenance.derivedFrom) assert.ok(existsSync(repo(p)), `missing ${p}`)
  assert.equal(record.publication.status, 'not-published')
})

test('community fixtures are visibly fictional and internally consistent', () => {
  const hypotheses = new Set(record.hypotheses.map((h: { id: string }) => h.id))
  const ids = new Set(CONTRIBUTIONS.map((c) => c.id))
  for (const c of CONTRIBUTIONS) {
    assert.match(c.author.handle, /\.example$/, `${c.id}: reserved handle`)
    assert.match(c.author.did, /^did:example:/, `${c.id}: reserved DID`)
    if (c.claim) assert.ok(hypotheses.has(c.claim), `${c.id}: unknown claim ${c.claim}`)
    if (c.nsidStatus === 'hypothetical') assert.match(c.nsid, /^example\.postack\./, `${c.id}: placeholder NSID`)
    if (c.availability !== 'available') assert.equal(c.text, '', `${c.id}: unavailable records show no text`)
  }
  for (const k of CONTRACTS) {
    assert.ok(ids.has(k.from) && ids.has(k.to) && k.from !== k.to, `${k.id}: endpoints exist and differ`)
    assert.ok(k.reason.length > 10 && k.evidence.length > 0, `${k.id}: has a reason and evidence`)
    assert.ok(k.history.length > 0, `${k.id}: has a history`)
  }
})

test('no connection masquerades as an author statement', () => {
  const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))
  for (const k of CONTRACTS) {
    const from = byId.get(k.from)!
    if (k.proposer === 'author') {
      assert.equal(k.proposedBy, from.author.handle, `${k.id}: only the source's author can declare it`)
      // An author-declared connection must be backed by a reference in the record, unless the record is gone.
      const to = byId.get(k.to)!
      if (from.availability === 'available') {
        assert.ok(from.refs.some((r) => r.uri === to.uri), `${k.id}: declared but not referenced in the record`)
      }
    } else {
      assert.notEqual(k.proposedBy, from.author.handle, `${k.id}: a reading attributed to the author`)
      assert.ok(k.history.every((h) => !h.by.endsWith('.example') || h.by !== from.author.handle), `${k.id}`)
    }
    if (k.proposer === 'model') assert.notEqual(status(k), 'accepted', `${k.id}: model proposals are never shown as accepted`)
    if (k.proposer !== 'author') assert.ok(k.history.every((h) => h.status !== 'declared'), `${k.id}: only authors declare`)
    if (k.proposer === 'author') assert.equal(k.history[0]!.status, 'declared', `${k.id}: author connections start as declared`)
  }
})
