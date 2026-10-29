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

// Discovery family (01–10).
export const ESSAY_SITE = 'https://blackmath88.github.io/postack-underflow/'
/** The essay page that holds The Disputed Neighbour and the Four Words search. */
export const ESSAY_INDEXING = `${ESSAY_SITE}indexing/`
export const CORPUS_MANIFEST = repoFile('corpus/sources.json')
export const RETRIEVAL_FILE = repoFile('src/lib/retrieval.ts')

// Classification family (Lab 02).
export const DISPUTED_NEIGHBOUR_DATA = repoFile('src/data/disputed-neighbour.ts')
export const RECORDS_SCHEMA = repoFile('src/lib/records.ts')
export const QUERIES_FILE = repoFile('corpus/queries.json')

// Community family (Lab 03).
export const COMMUNITY_PAGE = 'https://blackmath88.github.io/postack-underflow/community/'
export const SWITCHBOARD_FILE = repoFile('src/components/Switchboard.tsx')

// Lab 06, Collective Memory & Futures (memory).
export const SITE_CONVERGENCE = 'https://blackmath88.github.io/postack-underflow/convergence/'
export const PROBLEM_DESK_FILE = repoFile('src/data/problem-desk.ts')
export const HISTORY_FILE = repoFile('src/data/research-history.ts')
export const MEMORY_FIXTURES_FILE = repoFile('src/lab/data/memory-fixtures.ts')
export const LAB_CATALOGUE_DIR = repoFile('src/lab/catalogue/')
export const PHOTO_FRAME_README =
  'https://github.com/wesbos/photo-frame-dashboard/blob/0bff55ef3fb2a3bfdab05bc8e3bd0c9d69f63189/README.md'

// ---------- Editorial family (41–50) ----------
export const LIVE_SITE = 'https://blackmath88.github.io/postack-underflow/'
export const ADR_0005 = repoFile('docs/adr/0005-three-levels-and-margin-notes.md')
export const CONTENT_INVENTORY = repoFile('docs/editorial/CONTENT-INVENTORY.md')
export const RESEARCH_HISTORY_FILE = repoFile('src/data/research-history.ts')

// History family (31–40).
/** PR #5's structured research synthesis, pinned to the PR's head commit. */
export const PR5_RESEARCH = `${REPO_URL}/blob/66287f0b0f1054c9ea5b88914a1ff13bb576ce77/docs/research/PHYSICAL-INFORMATION-SYSTEMS.json`
export const MOTTE_FLAGS_FILE = repoFile('src/features/motte/history.ts')
