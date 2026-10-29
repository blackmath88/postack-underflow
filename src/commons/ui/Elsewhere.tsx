import { useState } from 'react'
import { asUnavailable } from '../atproto/projection'
import { ATTACHMENT_LABEL, META, VIEW, day, type Elsewhere } from './data'

const bskyUrl = (uri: string) => {
  const [, , did, , rkey] = uri.split('/')
  return `https://bsky.app/profile/${did}/post/${rkey}`
}

export function AtCard({ e, gone = false }: { e: Elsewhere; gone?: boolean }) {
  const r = gone ? asUnavailable(e.record, 'your simulation') : e.record
  const identity = VIEW.identities.find((i) => r.handle && i.atproto.startsWith(r.handle))
  return (
    <article className={`pfc-at${r.fixture ? ' pfc-at--fixture' : ''}${r.available ? '' : ' pfc-at--gone'}`}>
      {r.fixture && <p className="pfc-at__fixture">Fixture · written by Postack · nobody posted this</p>}
      <p className="pfc-row__meta">
        <span className="pfc-row__who">{r.handle}</span> · {r.collection ?? 'app.bsky.feed.post'}
        {r.createdAt ? <> · <time dateTime={r.createdAt}>{day(r.createdAt)}</time></> : null}
      </p>
      {r.available ? (
        <p>{r.excerpt ?? r.text ?? <em>Text not kept: this reply is shown by its address only.</em>}</p>
      ) : (
        <p className="pfc-at__gone">{r.why}</p>
      )}
      <dl className="pfc-dl pfc-dl--compact">
        <dt>Lives at</dt>
        <dd><code>{r.pds ?? 'unknown'}</code></dd>
        <dt>Address</dt>
        <dd><code className="pfc-break">{r.uri}</code>{r.cid ? <> · CID <code>{r.cid.slice(0, 12)}…</code></> : ' · no CID (fixture)'}</dd>
        <dt>Attached because</dt>
        <dd>{ATTACHMENT_LABEL[e.attachment]} ({e.via})</dd>
        {identity && (
          <>
            <dt>Same person as on GitHub?</dt>
            <dd>{identity.note}</dd>
          </>
        )}
      </dl>
      {!r.fixture && r.available && (
        <p><a href={bskyUrl(r.uri)}>Open where it lives</a></p>
      )}
    </article>
  )
}

export function ElsewhereSection({ problemId }: { problemId: string }) {
  const entries = (VIEW.elsewhere.byProblem[problemId] ?? []).filter((e) => !e.record.fixture)
  const [gone, setGone] = useState<string[]>([])
  return (
    <section className="pfc-elsewhere" aria-labelledby="elsewhere-title" id="elsewhere">
      <h2 id="elsewhere-title">Elsewhere</h2>
      <p className="pfc-lede">
        Public ATProto records about this problem, read from their authors’ own servers on {day(META.atproto.fetchedAt)}. They
        stay theirs: Postack keeps an address, a hash and a short excerpt, and shows them here only because they link a
        source this record cites.
      </p>
      {entries.length === 0 ? (
        <p className="pfc-empty">
          No public record on the network links this problem’s threads. Across all 265 threads, five posts link anything at
          all; the conversation about this repository happens on GitHub.
        </p>
      ) : (
        entries.map((e) => (
          <div key={e.record.uri} className="pfc-elsewhere__item">
            <AtCard e={e} gone={gone.includes(e.record.uri)} />
            <button
              type="button"
              className="pfc-linkish"
              aria-pressed={gone.includes(e.record.uri)}
              onClick={() => setGone(gone.includes(e.record.uri) ? gone.filter((u) => u !== e.record.uri) : [...gone, e.record.uri])}
            >
              {gone.includes(e.record.uri) ? 'Bring it back' : 'Simulate: its author deletes it'}
            </button>
            {e.thread.length > 0 && (
              <p className="pfc-hint">
                Part of a thread with {e.thread.length} other kept record{e.thread.length === 1 ? '' : 's'} by the same people.
              </p>
            )}
          </div>
        ))
      )}
      <p className="pfc-hint">
        A signed record proves who said something, not that it is true. Nothing here is evidence that a fix works.
      </p>
    </section>
  )
}
