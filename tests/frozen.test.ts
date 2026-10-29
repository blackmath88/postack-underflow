import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// Four Words v1 is frozen. The laboratory reads these files but must never
// change them; new retrieval experiments get their own versioned data. The
// digests were taken from `main` at 6522229 before the laboratory existed.
const FROZEN: Record<string, string> = {
  'corpus/queries.json': '711831859d9feb8bad69c8b5ed91509babedbc8e2cdf1c1cfdba18ef679b10c3',
  'corpus/records.json': 'cba688504f6299c25988a69e5e9d1b70e52e5fa467fce0f4c4f40a2939d16bda',
  'corpus/sources.json': 'a7f8efdc2124197848787b7f8856e720a95f1ff00da8c9a0fa3a2885e457c542',
  'corpus/snapshots.lock.json': 'bd2f887a8a59d8caea0874729f969a10ebcff2bd475b96885d893a0c16c5e915',
  'results/four-words-v1.json': '577e3f9479c9497bd4b473b482c54595e93e4d2e4e2fa0a6e2456b604f8f13fe',
  'src/data/four-words-index.json': 'c1fca1e237ce188200a03e68305c9111efda7ceb9295c4e279f8ec21d55c7e53',
}

test('Four Words v1 data is byte-for-byte unchanged', () => {
  for (const [path, digest] of Object.entries(FROZEN)) {
    const actual = createHash('sha256').update(readFileSync(new URL(`../${path}`, import.meta.url))).digest('hex')
    assert.equal(actual, digest, `${path} changed; v1 is frozen`)
  }
})
