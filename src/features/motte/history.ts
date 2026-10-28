export type HistoryChapter = 'opening' | 'indexing' | 'community' | 'convergence'
export type HistoryFlag = {
  id: string
  chapter: HistoryChapter
  heading: string
  observation: string
  sourceLabel: string
  sourceUrl: string
  evidenceStatus: 'verified' | 'needs-review'
  counterpoint?: string
}

// Deliberately empty until historical claims have been checked against their primary sources.
// The character never invents a history fact or presents a draft as verified.
export const historyFlags: readonly HistoryFlag[] = []

export function publicHistoryFlags(flags: readonly HistoryFlag[]): HistoryFlag[] {
  return flags.filter((flag) => flag.evidenceStatus === 'verified' && /^https:\/\//.test(flag.sourceUrl))
}
