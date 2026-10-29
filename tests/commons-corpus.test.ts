import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../corpus/commons/manifest.json', import.meta.url), 'utf8'))

test('the commons snapshot passes its own corpus check', () => {
  const out = execFileSync('node', ['scripts/commons/check-corpus.mjs'], { encoding: 'utf8' })
  assert.match(out, /265 threads and 126 docs/)
})

test('the snapshot is pinned and commits no third-party text beyond titles', () => {
  assert.equal(manifest.repository, 'wesbos/photo-frame-dashboard')
  assert.match(manifest.revision, /^[0-9a-f]{40}$/)
  for (const t of manifest.threads) {
    assert.equal(t.body, undefined, `${t.type} ${t.number}: body must stay in the local cache`)
    for (const c of t.comments) assert.equal(c.body, undefined, `comment ${c.id}: body must stay in the local cache`)
  }
})

test('coverage gaps are recorded rather than hidden', () => {
  assert.ok(manifest.coverage.length > 0)
  assert.ok(manifest.exclusions.some((e: string) => /review comments/.test(e)))
})
