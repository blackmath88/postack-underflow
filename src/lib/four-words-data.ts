// The frozen Four Words v1 artifact, loaded once and shared by every
// experiment that reads it. Nothing in the site writes to it.
import type { Index } from './retrieval'
import type { ProblemRecord } from './records'
import indexData from '../data/four-words-index.json'

export interface CorpusSource {
  id: string
  kind: string
  repo: string
  title: string
  url: string
  license: string
  revision: string
}

export interface Artifact {
  corpus: { sources: number; records: number; lockDigest: string }
  sources: CorpusSource[]
  records: ProblemRecord[]
  indexes: { baseline: Index; structured: Index }
}

export const artifact = indexData as unknown as Artifact
export const recordBySource = new Map(artifact.records.map((r) => [r.sourceId, r]))
export const sourceById = new Map(artifact.sources.map((s) => [s.id, s]))
