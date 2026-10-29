// Links shared by several catalogue entries. Repository files are linked at
// `main`; the Four Words files under them are frozen.
import { REPO_URL, repoFile } from '../../content/sources.ts'

export const FOUR_WORDS_DOC = repoFile('docs/research/FOUR-WORDS.md')
export const FOUR_WORDS_RESULTS = repoFile('results/four-words-v1.json')
export const RECORDS_FILE = repoFile('corpus/records.json')
export const COMMUNITY_DOC = repoFile('docs/research/ATPROTO-COMMUNITY.md')
export const REFLECTION_DOC = repoFile('docs/REFLECTION.md')
export const ART_DIRECTION_DOC = repoFile('docs/design/ART-DIRECTION.md')
export const MOTTE_DOC = repoFile('docs/design/ARCHIVE-MOTH.md')
export const MOTTE_CONTRACT = repoFile('docs/plans/MOTTE-INTEGRATION-CONTRACT.md')
export const FIXTURES_FILE = repoFile('src/data/community-fixtures.ts')
export const CONTRACTS_FILE = repoFile('src/data/connection-contracts.ts')
export const MARGIN_FILE = repoFile('src/content/margin.tsx')
export const PHOTO_FRAME_CASE = repoFile('docs/research/CASE-PHOTO-FRAME.md')
export const PR5 = `${REPO_URL}/pull/5`

/** Lumpesammlig, pinned to the commit read for this laboratory. */
export const LUMPESAMMLIG_REV = 'c69ccc2e68a164d9969aa7fdc4e246c897bc864e'
export const LUMPESAMMLIG = `https://github.com/blackmath88/lumpesammlig/tree/${LUMPESAMMLIG_REV}`
export const LUMPESAMMLIG_CONCEPT = `https://github.com/blackmath88/lumpesammlig/blob/${LUMPESAMMLIG_REV}/docs/CONCEPT.md`
export const IMPOSSIBLE_INDEX_STUDY = `https://github.com/blackmath88/lumpesammlig/tree/${LUMPESAMMLIG_REV}/src/samples/012-impossible-index`
export const SWITCHBOARD_STUDY = `https://github.com/blackmath88/lumpesammlig/tree/${LUMPESAMMLIG_REV}/src/samples/013-switchboard`

// ---------- Editorial family (41–50) ----------
export const LIVE_SITE = 'https://blackmath88.github.io/postack-underflow/'
export const ADR_0005 = repoFile('docs/adr/0005-three-levels-and-margin-notes.md')
export const CONTENT_INVENTORY = repoFile('docs/editorial/CONTENT-INVENTORY.md')
export const RESEARCH_HISTORY_FILE = repoFile('src/data/research-history.ts')
