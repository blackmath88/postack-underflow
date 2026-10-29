import { Fragment, useState, type ReactNode } from 'react'
import { NOTES, type NoteId } from '../../../content/margin'
import { beatsOf, textOf, words } from './essay'

// 48 · The Invisible Appendix. The Impossible Index chapter, with one dial for
// depth. At the surface you read the story. One step down, nothing new is
// shown, but every noted phrase gets a sounding: a mark whose length is the
// number of words that lie under it. Further down, the notes' summaries and
// then their full text rise into the page. A readout counts the words in view
// and the hedging words among them, using a crude word list, to test the
// essay's own remark that compression strips hedges first.
// Reads BEATS (the essay's text) and NOTES.

const PAGE = beatsOf('indexing')
const DEPTH = ['the story', 'soundings', 'summaries', 'everything'] as const

// A deliberately crude list of words and phrases that qualify a claim.
const HEDGE = /\b(not|never|only|partly|one run|one narrow|reported|suppose|by construction|invented|guess(?:ed)?|in general|our reading|our inference|our paraphrase)\b/gi

const bodyText = (id: NoteId) => textOf(NOTES[id].body).replace(/\s+/g, ' ').trim()
const beneath = (id: NoteId) => words(NOTES[id].summary) + words(bodyText(id))
const hedges = (t: string) => t.match(HEDGE)?.length ?? 0

function marked(t: string, show: boolean): ReactNode {
  if (!show) return t
  const parts = t.split(HEDGE)
  // split with a capture group puts the matches at odd indices.
  return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : <Fragment key={i}>{p}</Fragment>))
}

export default function InvisibleAppendix() {
  const [depth, setDepth] = useState(0)
  const showHedges = depth >= 1

  let visible = 0
  let hedged = 0
  for (const b of PAGE) {
    visible += words(b.text)
    hedged += hedges(b.text)
    for (const n of b.notes) {
      if (depth >= 2) {
        visible += words(NOTES[n.id].summary)
        hedged += hedges(NOTES[n.id].summary)
      }
      if (depth >= 3) {
        visible += words(bodyText(n.id))
        hedged += hedges(bodyText(n.id))
      }
    }
  }
  const surface = PAGE.reduce((n, b) => n + words(b.text), 0)
  const under = PAGE.flatMap((b) => b.notes).reduce((n, x) => n + beneath(x.id), 0)
  const maxUnder = Math.max(...PAGE.flatMap((b) => b.notes.map((x) => beneath(x.id))))

  return (
    <div className="x48">
      <label className="x48__dial">
        <span>
          Depth: <strong>{DEPTH[depth]}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={3}
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          aria-valuetext={DEPTH[depth]}
          data-probe="key:ArrowRight"
        />
      </label>

      <p className="x48__readout" role="status" data-observe>
        {visible} words in view ({(visible / surface).toFixed(1)}× the surface); {hedged} hedging{' '}
        {hedged === 1 ? 'word' : 'words'} among them, one every {Math.round(visible / Math.max(1, hedged))} words.
        {depth === 1 && <> {under} words lie under the {PAGE.flatMap((b) => b.notes).length} soundings, unread.</>}
      </p>

      <div className={`x48__page is-depth-${depth}`}>
        {PAGE.map((b, i) => (
          <div key={i} className="x48__beat">
            <p className={b.statement ? 'x48__statement' : undefined}>{marked(b.text, showHedges)}</p>
            {depth >= 1 &&
              b.notes.map((n) => (
                <div key={n.id} className="x48__under">
                  <p className="x48__sounding">
                    <span
                      className="x48__line"
                      style={{ ['--len' as string]: beneath(n.id) / maxUnder }}
                      aria-hidden="true"
                    />
                    <span>
                      “{n.phrase}” · {beneath(n.id)} words beneath
                    </span>
                  </p>
                  {depth >= 2 && <p className="x48__summary">{marked(NOTES[n.id].summary, true)}</p>}
                  {depth >= 3 && <p className="x48__body">{marked(bodyText(n.id), true)}</p>}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
