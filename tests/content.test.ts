import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SOURCES } from '../src/content/sources.ts'
import { ARTIFACTS } from '../src/content/artifacts.ts'

test('every source has an https URL, a title and a stated contribution', () => {
  for (const [key, source] of Object.entries(SOURCES)) {
    assert.equal(source.id, key, `${key}: id must match its key`)
    assert.match(source.url, /^https:\/\//, `${key}: url must be https`)
    assert.ok(source.title.length > 0, `${key}: title`)
    assert.ok(source.contribution.length > 20, `${key}: contribution`)
  }
})

test('the provenance sources named in the brief are all registered', () => {
  const urls: string[] = Object.values(SOURCES).map((s) => s.url)
  for (const required of [
    'https://github.com/blackmath88/github-atlas',
    'https://github.com/blackmath88/br-ai-nstorm',
    'https://github.com/blackmath88/colors',
    'https://github.com/blackmath88/lumpesammlig',
    'https://atproto.com/',
    'https://standard.site/',
    'https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript',
  ]) {
    assert.ok(urls.includes(required), `missing source ${required}`)
  }
})

test('every artifact contract is complete and has a usable fallback', () => {
  for (const [key, artifact] of Object.entries(ARTIFACTS)) {
    assert.match(artifact.sourceRepo, /^https:\/\/github\.com\//, `${key}: sourceRepo`)
    assert.match(artifact.sourceRef, /^https:\/\//, `${key}: sourceRef`)
    assert.match(artifact.inspectedRevision, /^[0-9a-f]{40}$/, `${key}: pin a full commit SHA`)
    assert.ok(artifact.entryPoint.length > 0, `${key}: entryPoint`)
    assert.ok(artifact.fallback.length > 120, `${key}: fallback must stand on its own`)
    assert.ok(['in-development', 'integrated'].includes(artifact.status), `${key}: status`)
  }
})

test('private repositories are flagged so they are not linked publicly', () => {
  for (const id of ['colors', 'developmentPractice'] as const) {
    assert.equal(SOURCES[id].private, true, `${id} is private on GitHub`)
  }
})

test('artifact ids are unique', () => {
  const ids = Object.values(ARTIFACTS).map((a) => a.id)
  assert.equal(new Set(ids).size, ids.length)
})
