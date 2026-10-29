// Photo Frame Commons, slice D: projects public ATProto records (and labelled
// fixtures) onto the problem records. Read-only and independently replaceable:
// it takes the snapshot JSON and the index's citation map, and returns plain
// data. Nothing here fetches, signs or writes. Erasable TypeScript.

export interface AtRecord {
  uri: string
  cid: string | null
  did: string
  handle: string | null
  pds: string | null
  collection?: string
  available: boolean
  createdAt?: string
  excerpt?: string | null
  textKept?: boolean
  text?: string
  links?: string[]
  github?: string[]
  reply?: { parent: string; root: string } | null
  fixture?: boolean
  correction?: string
  why?: string
}

/**
 * How a record came to be attached to a problem:
 *  - declared: the record links a GitHub thread the problem cites (the author's own link)
 *  - deterministic: the record links a pull request whose changed files include a
 *    document the problem cites (derived from identifiers, not stated by anyone)
 *  - repository: the record links the repository as a whole, not any problem
 */
export type Attachment = 'declared' | 'deterministic' | 'repository'

export interface Elsewhere {
  record: AtRecord
  attachment: Attachment
  via: string
  /** The records it replies to or is replied by, among those kept. */
  thread: AtRecord[]
}

export interface IdentityNote {
  github: string
  atproto: string
  /** What connects them, and how strongly. A shared name is not a link. */
  basis: 'domain-claimed-both-ways' | 'implied-in-a-post' | 'name-only'
  note: string
}

const REPO = 'https://github.com/wesbos/photo-frame-dashboard'

/** `…/issues/229` or `…/pull/3` (with any suffix) → `issue/229` / `pull/3`, else null. */
export function threadKey(url: string): string | null {
  const m = /github\.com\/wesbos\/photo-frame-dashboard\/(issues|pull)\/(\d+)/.exec(url)
  return m ? `${m[1] === 'issues' ? 'issue' : 'pull'}/${m[2]}` : null
}

/** The parts of a problem record this projection reads. */
export interface CitingProblem {
  id: string
  evidence: Array<{ ref: { thread?: string; comment?: number; doc?: string } }>
}

export function projectElsewhere(input: {
  records: AtRecord[]
  problems: CitingProblem[]
  /** Pull request → files it changed, for the deterministic attachment. */
  pullFiles: Record<string, string[]>
}): { byProblem: Record<string, Elsewhere[]>; repository: Elsewhere[] } {
  const { records, problems, pullFiles } = input
  const citing = (thread: string, comment?: number) =>
    problems
      .filter((p) => p.evidence.some((e) => e.ref.thread === thread && (comment === undefined || e.ref.comment === comment)))
      .map((p) => p.id)
  const problemDocs = Object.fromEntries(problems.map((p) => [p.id, p.evidence.flatMap((e) => (e.ref.doc ? [e.ref.doc] : []))]))
  const threadOf = (r: AtRecord): AtRecord[] => {
    const root = r.reply?.root ?? r.uri
    return records
      .filter((x) => x.uri !== r.uri && (x.reply?.root ?? x.uri) === root)
      .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
  }
  const byProblem: Record<string, Elsewhere[]> = {}
  const repository: Elsewhere[] = []
  const attach = (problem: string, e: Elsewhere) => {
    const list = (byProblem[problem] ??= [])
    if (!list.some((x) => x.record.uri === e.record.uri)) list.push(e)
  }

  for (const r of records) {
    const links = r.links ?? []
    const threads = [...new Set(links.map(threadKey).filter((k): k is string => !!k))]
    for (const t of threads) {
      // A link to one comment attaches to the problems citing that comment;
      // a link to a whole thread attaches to every problem citing the thread.
      const comments = links.filter((l) => threadKey(l) === t).map((l) => Number(/#issuecomment-(\d+)/.exec(l)?.[1])).filter(Boolean)
      const problemsFor = comments.length ? [...new Set(comments.flatMap((c) => citing(t, c)))] : citing(t)
      for (const p of problemsFor) attach(p, { record: r, attachment: 'declared', via: comments.length ? `${t}, comment ${comments.join(', ')}` : t, thread: threadOf(r) })
      for (const file of pullFiles[t] ?? []) {
        for (const [p, docs] of Object.entries(problemDocs)) {
          if (docs.includes(file)) attach(p, { record: r, attachment: 'deterministic', via: `${t} changed ${file}`, thread: threadOf(r) })
        }
      }
    }
    if (!threads.length && links.some((l) => l.replace(/\/$/, '') === REPO)) {
      repository.push({ record: r, attachment: 'repository', via: 'links the repository', thread: threadOf(r) })
    }
  }
  return { byProblem, repository }
}

/** What a reader sees of a record that has since become unavailable at its source. */
export function asUnavailable(r: AtRecord, since: string): AtRecord {
  return { ...r, available: false, excerpt: null, text: undefined, textKept: false, createdAt: r.createdAt, why: `Not available at its PDS since ${since}. Postack keeps its address and hash, not its words.` }
}
