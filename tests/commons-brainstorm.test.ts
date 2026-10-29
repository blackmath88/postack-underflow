import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { BRAINSTORM_REVISION, RECORD_WRITER } from '../src/commons/brainstorm/adapter.ts'

const snap = JSON.parse(readFileSync(new URL('../src/data/commons-brainstorm.json', import.meta.url), 'utf8'))
const index = JSON.parse(readFileSync(new URL('../src/data/commons-index.json', import.meta.url), 'utf8'))

test('the snapshot is a br-ai-nstorm v0.4 log from the pinned revision', () => {
  assert.equal(snap.$type, 'ai.bridgework.brainstorm.snapshot')
  assert.equal(snap.schemaVersion, '0.4')
  assert.equal(snap.brainstorm.revision, BRAINSTORM_REVISION)
  assert.equal(snap.states.length, index.problems.length)
})

test('no contribution is authored by an AI, and imports are never endorsed', () => {
  for (const s of snap.states) for (const c of s.contributions) {
    assert.match(c.provenance.authoredBy, /^(github:|repo:)/, c.id)
    assert.equal(c.provenance.endorsement, 'participant_review_required')
    assert.notEqual(c.provenance.authoredBy, RECORD_WRITER)
  }
})

test('nothing is accepted: every relation and conflict is a pending proposal', () => {
  for (const s of snap.states) {
    assert.equal(s.relations.length, 0)
    assert.equal(s.conflicts.length, 0)
    for (const p of s.proposals) assert.equal(p.status, 'pending')
  }
  assert.equal(snap.events.filter((e: { eventType: string }) => /Accepted$/.test(e.eventType)).length, 0)
})

test('author-declared links are carried on the author’s behalf, never as the importer’s own claim', () => {
  const links = snap.states.flatMap((s: { proposals: Array<{ proposedBy: string; onBehalfOf?: string }> }) => s.proposals).filter((p: { proposedBy: string }) => p.proposedBy === 'importer:github-links')
  assert.ok(links.length > 0)
  for (const l of links) assert.match(l.onBehalfOf ?? '', /^github:/)
})

test('every contribution traces back to a source the index can show', () => {
  for (const [id, meta] of Object.entries<{ refKey: string }>(snap.contributionMeta)) {
    assert.ok(index.sources[meta.refKey], `${id}: ${meta.refKey}`)
  }
  for (const s of snap.states) for (const c of s.contributions) assert.ok(snap.contributionMeta[c.id], c.id)
})

test('what could not be represented is reported, not dropped', () => {
  assert.ok(snap.adapter.unrepresented.every((u: { count: number }) => u.count > 0))
  assert.ok(snap.adapter.mismatches.length >= 7)
})

test('the interface data is rebuilt exactly from the committed artifacts', async () => {
  const { execFileSync } = await import('node:child_process')
  execFileSync('node', ['scripts/commons/build-view.mjs', '--check'], { encoding: 'utf8' })
})
