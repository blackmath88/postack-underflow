// Pure helpers for the discovery pilots. Nothing here imports data: callers
// pass the frozen Four Words v1 records, sources and indexes in, so the same
// functions run in the browser and in a plain `node` script that checks the
// numbers quoted in the catalogue. Read-only throughout.
import { search, tokenize, type Index } from '../../../lib/retrieval.ts'
import type { ProblemRecord } from '../../../lib/records.ts'

export interface SourceLike {
  id: string
  kind: string
  repo: string
  title: string
  revision: string
}

// ---------- 01 · Four Words, No Words ----------

/** What a person would need in order to answer a question about a term. */
export type Knowing = 'see' | 'know' | 'fix'

/**
 * One yes/no question per controlled term, in our words. The `knowing` tag is
 * our reading of what answering it takes: something you can see on the broken
 * site, something you know about your own setup, or something you would only
 * know once you had the answer.
 */
export const TERM_QUESTIONS: Record<string, { ask: string; knowing: Knowing }> = {
  'asset-404': { ask: 'Do scripts, styles or images fail to load, even though the page itself arrives?', knowing: 'see' },
  'spa-fallback': { ask: 'Does reloading a page, or opening a deep link, give a 404 while clicking around works?', knowing: 'see' },
  'underscore-paths': { ask: 'Are the missing files ones whose names start with an underscore or a dot?', knowing: 'see' },
  'trailing-slash': { ask: 'Does /page fail where /page/ or /page.html would work?', knowing: 'see' },
  'relative-urls': { ask: 'Do relative links or asset URLs resolve against the wrong folder?', knowing: 'see' },
  'base-path': { ask: 'Is the site served from a sub-folder, such as user.github.io/repo/?', knowing: 'know' },
  'client-routing': { ask: 'Does the app change pages in the browser with a client-side router?', knowing: 'know' },
  prerender: { ask: 'Are the pages prerendered to HTML when the site is built?', knowing: 'know' },
  'static-export': { ask: 'Is a framework that normally runs a server being exported as plain files?', knowing: 'know' },
  jekyll: { ask: 'Does Jekyll build or process the site, whether you chose it or not?', knowing: 'know' },
  'actions-deploy': { ask: 'Do you publish with a GitHub Actions workflow?', knowing: 'know' },
  'pages-artifact': { ask: 'Does that workflow upload a Pages artifact?', knowing: 'know' },
  'custom-domain': { ask: 'Does the site use a custom domain?', knowing: 'know' },
  'router-basename': { ask: 'Is the fix to give your router a basename or basepath?', knowing: 'fix' },
  'hash-routing': { ask: 'Would switching to # URLs be an acceptable fix?', knowing: 'fix' },
  'custom-404': { ask: 'Is a 404.html page part of the fix you are after?', knowing: 'fix' },
}

export type Answer = 'yes' | 'no' | 'unsure'

export function narrow(records: ProblemRecord[], answers: Array<[string, Answer]>) {
  return records.filter((r) =>
    answers.every(([term, a]) => a === 'unsure' || (a === 'yes') === r.terms.includes(term)),
  )
}

/** The unasked term that splits the remaining records most evenly, or null. */
export function nextQuestion(remaining: ProblemRecord[], asked: Set<string>, allowed: Set<Knowing>) {
  let best: string | null = null
  let bestGap = Infinity
  for (const term of Object.keys(TERM_QUESTIONS)) {
    if (asked.has(term) || !allowed.has(TERM_QUESTIONS[term]!.knowing)) continue
    const yes = remaining.filter((r) => r.terms.includes(term)).length
    if (yes === 0 || yes === remaining.length) continue
    const gap = Math.abs(2 * yes - remaining.length)
    if (gap < bestGap) {
      best = term
      bestGap = gap
    }
  }
  return best
}

/** Answer truthfully for one record; return how many questions and who is left. */
export function simulate(records: ProblemRecord[], target: ProblemRecord, allowed: Set<Knowing>) {
  const answers: Array<[string, Answer]> = []
  let remaining = records
  for (;;) {
    if (remaining.length <= 1) break
    const term = nextQuestion(remaining, new Set(answers.map(([t]) => t)), allowed)
    if (!term) break
    answers.push([term, target.terms.includes(term) ? 'yes' : 'no'])
    remaining = narrow(records, answers)
  }
  return { questions: answers.length, left: remaining.map((r) => r.sourceId) }
}

// ---------- 02 · The Neighbour You Didn't Ask For ----------

export type Door = 'related' | 'shelf'

/**
 * Records next to `id` without any search: linked by a `related` field in
 * either direction, or sharing at least two controlled terms.
 */
export function neighbours(records: ProblemRecord[], id: string) {
  const me = records.find((r) => r.sourceId === id)
  if (!me) return []
  const out: Array<{ id: string; door: Door; why: string }> = []
  for (const r of records) {
    if (r.sourceId === id) continue
    const link = me.related.find((x) => x.sourceId === r.sourceId) ?? r.related.find((x) => x.sourceId === id)
    if (link) {
      out.push({ id: r.sourceId, door: 'related', why: link.relation })
      continue
    }
    const shared = r.terms.filter((t) => me.terms.includes(t))
    if (shared.length >= 2) out.push({ id: r.sourceId, door: 'shelf', why: shared.join(' + ') })
  }
  return out
}

// ---------- 05 · The Wrong Door ----------

/** The tool a source is about, read from the repository it lives in. Null if it is general. */
export function toolOf(source: SourceLike): string | null {
  const byRepo: Record<string, string> = {
    'vitejs/vite': 'Vite',
    'vercel/next.js': 'Next.js',
    'facebook/create-react-app': 'Create React App',
    'gatsbyjs/gatsby': 'Gatsby',
    'withastro/docs': 'Astro',
    'sveltejs/kit': 'SvelteKit',
    'angular/angular': 'Angular',
    'jekyll/jekyll': 'Jekyll',
    'vuejs/router': 'Vue Router',
    'remix-run/react-router': 'React Router',
    'TanStack/router': 'TanStack Router',
  }
  return byRepo[source.repo] ?? null
}

// ---------- 08 · Multiple Catalogues ----------

const EVIDENCE_ORDER = ['official-docs', 'maintainer-response', 'merged-fix', 'reporter-confirmed', 'community-report', 'none']

export interface Catalogue {
  id: string
  name: string
  rule: string
  key: (r: ProblemRecord, s: SourceLike, length: number) => string | number
}

export const CATALOGUES: Catalogue[] = [
  { id: 'subject', name: 'Subject', rule: 'first controlled term, A–Z', key: (r) => r.terms[0] ?? '~' },
  { id: 'publisher', name: 'Publisher', rule: 'repository owner, A–Z', key: (_r, s) => s.repo.toLowerCase() },
  {
    id: 'evidence',
    name: 'Evidence',
    rule: 'weakest evidence first, as the record grades it',
    key: (r) => -Math.max(...r.evidence.map((e) => EVIDENCE_ORDER.indexOf(e.kind))),
  },
  { id: 'length', name: 'Length', rule: 'shortest source text first', key: (_r, _s, n) => n },
]

/** Order record ids by a catalogue; ties break on source id. */
export function order(records: ProblemRecord[], sources: Map<string, SourceLike>, lengths: Record<string, number>, c: Catalogue) {
  const k = (r: ProblemRecord) => c.key(r, sources.get(r.sourceId)!, lengths[r.sourceId] ?? 0)
  return [...records]
    .sort((a, b) => {
      const ka = k(a)
      const kb = k(b)
      if (ka < kb) return -1
      if (ka > kb) return 1
      return a.sourceId.localeCompare(b.sourceId)
    })
    .map((r) => r.sourceId)
}

/** Kendall's tau between two orderings of the same ids. */
export function kendall(a: string[], b: string[]) {
  const pos = new Map(b.map((id, i) => [id, i]))
  let agree = 0
  let disagree = 0
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++) {
      if (pos.get(a[i]!)! < pos.get(a[j]!)!) agree++
      else disagree++
    }
  return (agree - disagree) / (agree + disagree)
}

export const adjacentPairs = (ids: string[]) => new Set(ids.slice(1).map((id, i) => [ids[i]!, id].sort().join('|')))

// ---------- 10 · The Four-Word Relay ----------

/** Words a searcher could lift from a result: its record's problem sentence and controlled terms. */
export function harvest(record: ProblemRecord) {
  return [...new Set(tokenize(`${record.problem} ${record.terms.join(' ')}`))]
}

/** Replace slot `i` of a four-word query with `word`. */
export function swap(words: string[], i: number, word: string) {
  const next = [...words]
  next[i] = word
  return next
}

export const firstRelevant = (index: Index, words: string[], relevant: string[]) => {
  const i = search(index, words.join(' ')).hits.findIndex((h) => relevant.includes(h.id))
  return i === -1 ? null : i + 1
}

// ---------- Names ----------

const PUBLISHER: Record<string, string> = {
  'github/docs': 'GitHub Docs',
  'actions/deploy-pages': 'deploy-pages',
  'actions/upload-pages-artifact': 'upload-pages-artifact',
  'rafgraph/spa-github-pages': 'spa-github-pages',
  'mdn/content': 'MDN',
}

/** Who wrote a source, in a word: the tool it documents, or its publisher. */
export const whoOf = (s: SourceLike) => toolOf(s) ?? PUBLISHER[s.repo] ?? s.repo

/** A label short enough for a spine, a node or a chip. Issues become repo#number. */
export function shortName(s: SourceLike, max = 30) {
  const issue = /issue-(\d+)/.exec(s.id)
  if (s.kind === 'issue' && issue) return `${s.repo.split('/')[1]}#${issue[1]}`
  const title = s.title.replace(/[`<>]/g, '').replace(/\s*🚀\s*/u, '')
  const full = `${whoOf(s)}: ${title}`
  return full.length > max ? `${full.slice(0, max - 1).trimEnd()}…` : full
}
