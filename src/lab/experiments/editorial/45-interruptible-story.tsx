import { useState } from 'react'
import { EVIDENCE_LABEL, NOTES, type NoteId } from '../../../content/margin'
import { beatsOf, textOf, words } from './essay'

// 45 · The Story You Can Interrupt. The Switchboard chapter's prose, one beat
// at a time. Where the essay hangs a margin note, the story pauses and offers
// the aside; carrying on skips it. A log keeps what was opened and what was
// passed, with each aside's evidence status and length. Nothing here can say
// whether opening asides helps anyone understand; the log only makes the
// trade visible. Reads BEATS (the essay's text) and NOTES.

const STORY = beatsOf('community')

type Stop = { beat: number; note?: NoteId }
// The reading path: each beat, then a pause at each of its notes.
const PATH: Stop[] = STORY.flatMap((b, i) => [{ beat: i }, ...b.notes.map((n) => ({ beat: i, note: n.id }))])

const noteText = (id: NoteId) => textOf(NOTES[id].body).replace(/\s+/g, ' ').trim()

export default function InterruptibleStory() {
  const [at, setAt] = useState(0)
  const [opened, setOpened] = useState<NoteId[]>([])
  const [skipped, setSkipped] = useState<NoteId[]>([])

  const stop = PATH[at]!
  const done = at === PATH.length - 1 && !stop.note
  const pausedOn = stop.note && !opened.includes(stop.note) && !skipped.includes(stop.note) ? stop.note : undefined

  const advance = () => {
    if (pausedOn) setSkipped((s) => [...s, pausedOn])
    setAt((n) => Math.min(PATH.length - 1, n + 1))
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
  const surfaceWords = shownBeats.reduce((n, b) => n + words(b.text), 0)
  const openedWords = opened.reduce((n, id) => n + words(noteText(id)), 0)
  const skippedWords = skipped.reduce((n, id) => n + words(noteText(id)), 0)
  const skippedFixture = skipped.filter((id) => NOTES[id].evidence === 'fixture')

  return (
    <div className="x45">
      <p className="x45__caveat">
        This page cannot tell whether the asides help anyone understand. It can only show what each one costs to
        open, and what passing it leaves out.
      </p>

      <div className="x45__story" aria-live="polite">
        {shownBeats.map((b, i) => (
          <div key={i} className="x45__beat">
            <p className={b.statement ? 'x45__statement' : undefined}>{b.text}</p>
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
        ))}
        {pausedOn && (
          <div className="x45__pause">
            <p>
              <span className="x45__mark" aria-hidden="true">
                ‖
              </span>{' '}
              The essay pauses at “{STORY[stop.beat]!.notes.find((n) => n.id === pausedOn)!.phrase.replace(/[.?]$/, "")}”. There is an aside:{' '}
              <strong>{NOTES[pausedOn].title}</strong> ({words(noteText(pausedOn))} words).
            </p>
            <button type="button" className="lab-btn" onClick={open}>
              Open the aside
            </button>
          </div>
        )}
      </div>

      <div className="x45__hands">
        <button type="button" className="lab-btn" onClick={advance} disabled={done} data-probe="click">
          {done ? 'The end of the chapter' : pausedOn ? 'Carry on without it' : 'Continue'}
        </button>
        <button type="button" className="lab-btn" onClick={restart} disabled={at === 0}>
          Start again
        </button>
      </div>

      <div className="x45__log" role="status" data-observe>
        <p>
          Beat {stop.beat + 1} of {STORY.length}
          {pausedOn ? ', paused at an aside' : ''}. You have read {surfaceWords} words of story, opened {opened.length}{' '}
          {opened.length === 1 ? 'aside' : 'asides'} ({openedWords} words) and passed {skipped.length} ({skippedWords}{' '}
          words).
        </p>
        {skippedFixture.length > 0 && (
          <p className="x45__warn">
            You passed {skippedFixture.length === 1 ? 'an aside' : 'asides'} about invented material:{' '}
            {skippedFixture.map((id) => `“${NOTES[id].summary}”`).join(' ')}
          </p>
        )}
        {(opened.length > 0 || skipped.length > 0) && (
          <ul className="x45__ledger">
            {PATH.filter((p) => p.note && (opened.includes(p.note) || skipped.includes(p.note))).map((p) => (
              <li key={p.note} className={opened.includes(p.note!) ? 'is-opened' : 'is-skipped'}>
                <span>{opened.includes(p.note!) ? 'opened' : 'passed'}</span> {NOTES[p.note!].title}{' '}
                <span className="x45__ev">({NOTES[p.note!].evidence})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
