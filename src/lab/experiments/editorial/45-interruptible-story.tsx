import { useState } from 'react'
import { EVIDENCE_LABEL, NOTES, type NoteId } from '../../../content/margin'
import { textOf, words } from './essay'
import { CAVEATS, STORY, ledger, surfaceWords } from './45-ledger'

// 45 · The Story You Can Interrupt. The Switchboard chapter's prose, one beat
// at a time. Where the essay hangs a margin note, the story pauses and offers
// the aside; carrying on passes it. At the end of the chapter a ledger lists
// every aside, opened or passed, and what passing it cost: detail, a caveat
// the story also states, or a caveat stated nowhere else. Nothing here can say
// whether opening asides helps anyone understand; the ledger only shows what
// the text does and does not repeat. Reads BEATS (the essay's text) and NOTES.

type Stop = { beat: number; note?: NoteId }
// The reading path: each beat, then a pause at each of its notes.
const PATH: Stop[] = STORY.flatMap((b, i) => [{ beat: i }, ...b.notes.map((n) => ({ beat: i, note: n.id }))])
const LEDGER = ledger()
const TOTAL_WORDS = surfaceWords()

const noteText = (id: NoteId) => textOf(NOTES[id].body).replace(/\s+/g, ' ').trim()
const ASIDE_WORDS = LEDGER.reduce((n, r) => n + words(noteText(r.id)), 0)

// Our check that the reading in 45-ledger.ts covers exactly the fixture-evidence asides.
const CAVEAT_IDS = Object.keys(CAVEATS) as NoteId[]
const FIXTURE_IDS = LEDGER.filter((r) => NOTES[r.id].evidence === 'fixture').map((r) => r.id)
const READING_HOLDS = CAVEAT_IDS.length === FIXTURE_IDS.length && FIXTURE_IDS.every((id) => CAVEAT_IDS.includes(id))

export default function InterruptibleStory() {
  const [at, setAt] = useState(0)
  const [opened, setOpened] = useState<NoteId[]>([])
  const [skipped, setSkipped] = useState<NoteId[]>([])

  const stop = PATH[at]!
  const done = at === PATH.length - 1 && !(stop.note && !opened.includes(stop.note) && !skipped.includes(stop.note))
  const pausedOn = stop.note && !opened.includes(stop.note) && !skipped.includes(stop.note) ? stop.note : undefined

  const advance = () => {
    if (pausedOn) setSkipped((s) => [...s, pausedOn])
    setAt((n) => Math.min(PATH.length - 1, n + 1))
  }
  const straightThrough = () => {
    const rest = PATH.slice(at).flatMap((p) => (p.note && !opened.includes(p.note) && !skipped.includes(p.note) ? [p.note] : []))
    setSkipped((s) => [...s, ...rest])
    setAt(PATH.length - 1)
  }
  const open = () => {
    if (!pausedOn) return
    setOpened((o) => [...o, pausedOn])
  }
  const restart = () => {
    setAt(0)
    setOpened([])
    setSkipped([])
  }

  const shownBeats = STORY.slice(0, stop.beat + 1)
  const readWords = shownBeats.reduce((n, b) => n + words(b.text), 0)
  const openedWords = opened.reduce((n, id) => n + words(noteText(id)), 0)
  const skippedWords = skipped.reduce((n, id) => n + words(noteText(id)), 0)
  const unsafePassed = LEDGER.filter((r) => r.cost === 'only-here' && skipped.includes(r.id))

  return (
    <div className="x45">
      <p className="x45__caveat">
        This page cannot tell whether the asides help anyone understand. It can only show what each one costs to
        open, and what the story does not say again when you pass it.
      </p>

      <div className="x45__story">
        {shownBeats.map((b, i) => {
          const flagged = done && unsafePassed.some((r) => r.beat === i - 1)
          return (
            <div key={i} className={'x45__beat' + (flagged ? ' is-flagged' : '')} id={i === 1 ? 'x45-thread' : undefined}>
              <p className={b.statement ? 'x45__statement' : undefined}>{b.text}</p>
              {flagged && (
                <p className="x45__flag">
                  <span aria-hidden="true">‖</span> Only the aside you passed says this thread is an illustration, not a quotation.
                </p>
              )}
              {b.notes
                .filter((n) => opened.includes(n.id))
                .map((n) => (
                  <aside key={n.id} className="x45__aside" aria-label={`Aside: ${NOTES[n.id].title}`}>
                    <p className="x45__aside-head">
                      {NOTES[n.id].title} <span>· {EVIDENCE_LABEL[NOTES[n.id].evidence]}</span>
                    </p>
                    <p>{noteText(n.id)}</p>
                  </aside>
                ))}
            </div>
          )
        })}
        {pausedOn && (
          <div className="x45__pause">
            <p>
              <span className="x45__mark" aria-hidden="true">
                ‖
              </span>{' '}
              The essay pauses at “{STORY[stop.beat]!.notes.find((n) => n.id === pausedOn)!.phrase.replace(/[.?]$/, '')}”. There is an aside:{' '}
              <strong>{NOTES[pausedOn].title}</strong> ({words(noteText(pausedOn))} words).
            </p>
            <button type="button" className="lab-btn" onClick={open}>
              Open the aside
            </button>
          </div>
        )}
      </div>

      <div className="x45__hands">
        <button type="button" className="lab-btn x45__go" onClick={advance} disabled={done} data-probe="click">
          {done ? 'The end of the chapter' : pausedOn ? 'Carry on without it' : 'Continue'}
        </button>
        <button type="button" className="lab-btn" onClick={straightThrough} disabled={done}>
          Read straight through, passing every aside
        </button>
        <button type="button" className="lab-btn" onClick={restart} disabled={at === 0}>
          Start again
        </button>
      </div>

      <div className="x45__log" role="status" data-observe>
        <p>
          {done ? 'End of the chapter. ' : `Beat ${stop.beat + 1} of ${STORY.length}${pausedOn ? ', paused at an aside' : ''}. `}
          Read {readWords} of {TOTAL_WORDS} words of story; opened {opened.length} {opened.length === 1 ? 'aside' : 'asides'} ({openedWords} words), passed {skipped.length} ({skippedWords} words).
          {done && (unsafePassed.length ? ' One pass was unsafe: see the ledger.' : ' No pass was unsafe.')}
        </p>
      </div>

      {done && (
        <section className="x45__ledger" aria-labelledby="x45-ledger-head">
          <h3 id="x45-ledger-head">The ledger: what each pass cost</h3>
          <p className="x45__ledger-sum">
            {LEDGER.length} asides, {ASIDE_WORDS} words. Passing {LEDGER.filter((r) => r.cost === 'detail').length} of them loses detail behind a sentence the story already makes.{' '}
            {LEDGER.filter((r) => r.cost === 'restated').length} are caveats the story also states. One is a caveat stated nowhere else.
          </p>
          <ol>
            {LEDGER.map((r) => {
              const was = opened.includes(r.id) ? 'opened' : skipped.includes(r.id) ? 'passed' : 'not reached'
              return (
                <li key={r.id} className={`is-${r.cost} is-${was.replace(' ', '-')}`}>
                  <span className="x45__was">{was}</span>
                  <span className="x45__what">
                    <strong>{NOTES[r.id].title}</strong> <span className="x45__ev">({NOTES[r.id].evidence})</span>
                    <span className="x45__cost">
                      {r.cost === 'detail' && 'Detail.'}
                      {r.cost === 'restated' && <>Caveat, also on the surface: “{r.surface}”</>}
                      {r.cost === 'only-here' && (
                        <>
                          <span className="x45__unsafe">{was === 'passed' ? 'Unsafe skip.' : 'The one unsafe skip.'}</span> The only place the
                          chapter says its four-step thread is an illustration, not a quotation. Nothing on the surface repeats it.{' '}
                          {was === 'passed' && <a href="#x45-thread">See the thread</a>}
                        </>
                      )}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
          <p className="x45__ledger-note">
            Which asides count as caveats is our reading{READING_HOLDS ? ': the three with fixture evidence' : ''}. Whether a
            reader infers the illustration anyway is not something this page can tell.
          </p>
        </section>
      )}
    </div>
  )
}
