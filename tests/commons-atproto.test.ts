import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { asUnavailable, projectElsewhere, threadKey, type AtRecord } from '../src/commons/atproto/projection.ts'

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const live = read('../corpus/commons/atproto.json')
const fixtures = read('../corpus/commons/atproto-fixtures.json')
const index = read('../src/data/commons-index.json')
const manifest = read('../corpus/commons/manifest.json')
const pullFiles = Object.fromEntries(manifest.threads.filter((t: { type: string }) => t.type === 'pull').map((t: { number: number; files: string[] }) => [`pull/${t.number}`, t.files]))
const records: AtRecord[] = [...live.records, ...fixtures.records]
const view = projectElsewhere({ records, problems: index.problems, pullFiles })

test('the live snapshot is read-only, unauthenticated and records what was refused', () => {
  assert.match(live.method, /read-only/)
  assert.equal(live.coverage.publicSearchRefused, 403)
  for (const r of live.records) {
    assert.match(r.uri, /^at:\/\/did:plc:/)
    assert.ok(r.cid && r.pds && r.textSha256)
    assert.notEqual(r.fixture, true)
    if (r.excerpt) assert.ok(r.excerpt.split(' ').length <= 21)
  }
})

test('fixtures cannot be mistaken for live records', () => {
  for (const r of fixtures.records) {
    assert.equal(r.fixture, true)
    assert.match(r.did, /^did:example:/)
    assert.match(r.handle, /\.example$/)
    assert.equal(r.cid, null)
  }
})

test('a live post that links #229 attaches to the certificate problem by its own link', () => {
  const e = view.byProblem['compromised-ca-roots']?.find((x) => x.record.handle === 'shindakun.net')
  assert.equal(e?.attachment, 'declared')
  assert.equal(e?.via, 'issue/229')
})

test('a post linking PR #3 attaches only deterministically, through a file the PR changed', () => {
  const e = view.byProblem['aimor-temporary-adb']?.find((x) => x.via.startsWith('pull/3'))
  assert.equal(e?.attachment, 'deterministic')
  assert.match(e!.via, /aimor-remote-root-shell\.md/)
})

test('a link to one comment attaches to the problem citing that comment, not the whole thread', () => {
  const fixture = fixtures.records[0]
  const attached = Object.entries(view.byProblem).filter(([, es]) => es.some((e) => e.record.uri === fixture.uri)).map(([p]) => p)
  assert.deepEqual(attached, ['gadget-error-71'])
})

test('an unavailable record keeps its address and hash but not its words', () => {
  const r = live.records.find((x: AtRecord) => x.excerpt)!
  const gone = asUnavailable(r, '2026-11-01')
  assert.equal(gone.available, false)
  assert.equal(gone.excerpt, null)
  assert.equal(gone.uri, r.uri)
  assert.equal(r.available, true)
})

test('thread keys parse issue and pull URLs only', () => {
  assert.equal(threadKey('https://github.com/wesbos/photo-frame-dashboard/pull/4/'), 'pull/4')
  assert.equal(threadKey('https://github.com/wesbos/photo-frame-dashboard'), null)
})
