import { useId, useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { search, tokenize } from '../../../lib/retrieval'
import { shortName } from './logic'

// 06 · The Unfinished Index. One query, four ledgers of what it did not find,
// each a different kind of absence:
//   unindexed       a query word no document in the index contains
//   unmatched       a document that shares no word with the query
//   stale           a matched document pinned only to a date, not a version
//   never collected a tool or host this corpus never gathered a source for
// The first three come from the frozen v1 indexes. The fourth cannot: it is a
// list we wrote by hand, outside the index, and the pilot says so.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string; relevant: string[] }>
const SYSTEMS = ['baseline', 'structured'] as const
const SYSTEM_LABEL = { baseline: 'plain', structured: 'problem-oriented' } as const

/**
 * Written by us, not derived from the index: static-site tools and hosts that
 * a person with this problem might use, for which the corpus holds no source.
 * Some of them still occur in passing inside a collected source.
 */
const NEVER_COLLECTED = [
  'hugo', 'eleventy', 'docusaurus', 'hexo', 'mkdocs', 'zola', 'vuepress', 'vitepress',
  'nuxt', 'remix', 'qwik', 'solid', 'ember', 'preact', 'webpack', 'parcel', 'pelican', 'gitlab', 'cloudflare',
]

const baselineText = artifact.indexes.baseline.fields.text!.postings

const PRESETS = ['hugo base url 404', 'nuxt assets subpath', 'underscore folder not served', 'site shows 404 everywhere']

export default function UnfinishedIndex() {
  const id = useId()
  const [text, setText] = useState(PRESETS[2]!)
  const frozen = QUERIES.find((q) => q.query === text.trim().toLowerCase())
  const results = useMemo(() => Object.fromEntries(SYSTEMS.map((s) => [s, search(artifact.indexes[s], text)])), [text]) as Record<
    (typeof SYSTEMS)[number],
    ReturnType<typeof search>
  >
  const words = [...new Set(tokenize(text))]
  const matchedAny = new Set(SYSTEMS.flatMap((s) => results[s].hits.map((h) => h.id)))
  const stale = [...matchedAny].map((x) => sourceById.get(x)!).filter((s) => !/^[0-9a-f]{40}$/.test(s.revision))
  const absent = words.filter((w) => NEVER_COLLECTED.includes(w))

  return (
    <div className="x06">
      <div className="x06__ask">
        <label htmlFor={`${id}-q`}>Search the frozen corpus</label>
        <input
          id={`${id}-q`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          data-probe="type:hugo base url 404"
        />
        <p className="x06__presets">
          {PRESETS.map((p) => (
            <button key={p} type="button" className="lab-btn" aria-pressed={text === p} onClick={() => setText(p)}>
              {p}
            </button>
          ))}
        </p>
        {frozen && <p className="x06__frozen">This is frozen query {frozen.id}; its labels mark {frozen.relevant.length} sources relevant.</p>}
      </div>

      <div className="x06__ledger" data-observe>
        <section className="x06__col">
          <h3>
            <span className="x06__n">{SYSTEMS.map((s) => results[s].unknownTerms.length).join(' / ')}</span> Unindexed
          </h3>
          <p className="x06__def">Words no document in the index contains. The index can say this about itself.</p>
          <ul>
            {words.length === 0 && <li className="x06__empty">No searchable words.</li>}
            {words.map((w) => {
              const missing = SYSTEMS.filter((s) => results[s].unknownTerms.includes(w))
              return (
                <li key={w} className={missing.length ? 'x06__item x06__item--hit' : 'x06__item'}>
                  <code>{w}</code>{' '}
                  {missing.length === 0
                    ? 'known to both'
                    : missing.length === 2
                      ? 'unknown to both'
                      : `unknown to the ${SYSTEM_LABEL[missing[0]!]} index`}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="x06__col">
          <h3>
            <span className="x06__n">{SYSTEMS.map((s) => results[s].unmatched.length).join(' / ')}</span> Unmatched
          </h3>
          <p className="x06__def">Documents that share no word with the query. The index keeps them; a ranking hides them.</p>
          {frozen ? (
            <ul>
              {SYSTEMS.flatMap((s) =>
                frozen.relevant
                  .filter((r) => results[s].unmatched.includes(r))
                  .map((r) => (
                    <li key={`${s}-${r}`} className="x06__item x06__item--hit">
                      {shortName(sourceById.get(r)!, 40)}: labelled relevant, unmatched by the {SYSTEM_LABEL[s]} index
                    </li>
                  )),
              )}
              {SYSTEMS.every((s) => frozen.relevant.every((r) => !results[s].unmatched.includes(r))) && (
                <li className="x06__empty">Every source labelled relevant shares at least one word with the query.</li>
              )}
            </ul>
          ) : (
            <p className="x06__empty">Type a frozen query to see whether a relevant source is among them.</p>
          )}
        </section>

        <section className="x06__col">
          <h3>
            <span className="x06__n">{stale.length}</span> Stale
          </h3>
          <p className="x06__def">
            Matched sources pinned only to their last update, not to a commit. The live thread may have moved since; the
            snapshot cannot know.
          </p>
          <ul>
            {stale.length === 0 && <li className="x06__empty">Every matched source is pinned to a commit.</li>}
            {stale.map((s) => (
              <li key={s.id} className="x06__item x06__item--hit">
                <a href={s.url}>{shortName(s, 40)}</a> updated {s.revision.slice(0, 10)}
              </li>
            ))}
          </ul>
        </section>

        <section className="x06__col x06__col--outside">
          <h3>
            <span className="x06__n">{absent.length}</span> Never collected
          </h3>
          <p className="x06__def">
            Tools this corpus holds no source for. <strong>The index cannot produce this column</strong>; it comes from a
            list we wrote by hand.
          </p>
          <ul>
            {absent.length === 0 && <li className="x06__empty">No word from our list of uncollected tools.</li>}
            {absent.map((w) => {
              const passing = Object.keys(baselineText[w] ?? {})
              return (
                <li key={w} className="x06__item x06__item--hit">
                  <code>{w}</code>{' '}
                  {passing.length
                    ? `no source about it, yet ${passing.length} collected source${passing.length === 1 ? '' : 's'} mention it in passing (${passing.map((p) => shortName(sourceById.get(p)!, 28)).join(', ')}), so plain search still “finds” something`
                    : 'named nowhere in the corpus; to the index it looks exactly like a typo'}
                </li>
              )
            })}
          </ul>
        </section>
      </div>
      <p className="x06__key lab-out">Counts read plain / problem-oriented where the two indexes differ.</p>
    </div>
  )
}
