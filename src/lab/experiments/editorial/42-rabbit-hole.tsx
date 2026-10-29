import { useState } from 'react'
import { EVIDENCE_LABEL, KIND_LABEL, NOTES, type NoteId } from '../../../content/margin'
import { SOURCES, type SourceId } from '../../../content/sources'
import { BEATS, segments } from './essay'

// 42 · The Footnote Rabbit Hole. The essay's margin notes open one level deep.
// Here a note leads on: to the sources it cites, and from each source to every
// other note that cites it. Each step is pushed onto a stack, and the line you
// were reading stays pinned above the stack however deep you go. The links are
// the ones the registry already has (NOTES[id].sources); nothing is inferred.

type Step = { type: 'note'; id: NoteId } | { type: 'source'; id: SourceId }

const NOTE_IDS = Object.keys(NOTES) as NoteId[]
const citedBy = (s: SourceId) => NOTE_IDS.filter((n) => (NOTES[n].sources ?? []).some((x) => x === s))

// Lines to start from: one per chapter, each with a note that cites something.
const STARTS = (['opening', 'indexing', 'community', 'convergence'] as const).flatMap((ch) => {
  const beat = BEATS.find((x) => x.chapter === ch && x.notes.some((n) => (NOTES[n.id].sources ?? []).length > 0))
  return beat ? [beat] : []
})

const keyOf = (s: Step) => `${s.type}:${s.id}`

export default function RabbitHole() {
  const [startIx, setStartIx] = useState(0)
  const [stack, setStack] = useState<Step[]>([])
  const [deepest, setDeepest] = useState(0)
  const line = STARTS[startIx]!

  const goTo = (next: Step[]) => {
    setStack(next)
    setDeepest((d) => Math.max(d, next.length))
  }
  const push = (s: Step) => goTo([...stack, s])
  const popTo = (n: number) => setStack((st) => st.slice(0, n))
  const restart = (ix: number) => {
    setStartIx(ix)
    setStack([])
    setDeepest(0)
  }

  const top = stack[stack.length - 1]
  const seen = new Set(stack.slice(0, -1).map(keyOf))
  const sourceSteps = stack.filter((s) => s.type === 'source').length

  return (
    <div className="x42">
      <div className="x42__starts" role="group" aria-label="Choose a line to read">
        {STARTS.map((s, i) => (
          <button key={s.chapter} type="button" className="lab-btn" aria-pressed={i === startIx} onClick={() => restart(i)}>
            {s.chapter}
          </button>
        ))}
      </div>

      <blockquote className="x42__line">
        <p className="x42__pin">Your reading position · pinned</p>
        <p>
          {segments(line).map((seg, i) =>
            seg.note ? (
              <button
                key={i}
                type="button"
                className="x42__phrase"
                onClick={() => goTo([{ type: 'note', id: seg.note! }])}
                aria-label={`${seg.text} (open note: ${NOTES[seg.note].title})`}
                data-probe={i === segments(line).findIndex((x) => x.note) ? 'click' : undefined}
              >
                {seg.text}
              </button>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
      </blockquote>

      <div className="x42__depth" role="status" data-observe>
        {stack.length === 0 ? (
          <p>On the line. Choose a marked phrase to go down.</p>
        ) : (
          <p>
            {stack.length} {stack.length === 1 ? 'step' : 'steps'} below the line, {sourceSteps} of them through a source.
            Deepest so far: {deepest}.{' '}
            <button type="button" className="lab-btn" onClick={() => popTo(0)}>
              Back to the line
            </button>
          </p>
        )}
        {stack.length > 0 && (
          <ol className="x42__crumbs" aria-label="The way down">
            {stack.map((s, i) => (
              <li key={i}>
                <button type="button" onClick={() => popTo(i + 1)} aria-current={i === stack.length - 1 ? 'step' : undefined}>
                  {s.type === 'note' ? NOTES[s.id].title : SOURCES[s.id].title}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {top?.type === 'note' && <NoteCard id={top.id} looped={seen.has(keyOf(top))} onSource={(id) => push({ type: 'source', id })} />}
      {top?.type === 'source' && (
        <SourceCard id={top.id} from={stack[stack.length - 2]} looped={seen.has(keyOf(top))} onNote={(id) => push({ type: 'note', id })} />
      )}
    </div>
  )
}

function NoteCard({ id, looped, onSource }: { id: NoteId; looped: boolean; onSource: (s: SourceId) => void }) {
  const note = NOTES[id]
  const cites = note.sources ?? []
  return (
    <article className="x42__card">
      <p className="x42__meta">
        Note · {KIND_LABEL[note.kind]} · {EVIDENCE_LABEL[note.evidence]}
      </p>
      <h3>{note.title}</h3>
      <p>{note.summary}</p>
      {looped && <p className="x42__loop">You have been here before on this way down.</p>}
      {cites.length === 0 ? (
        <p className="x42__end">This note cites no registered source. The chain ends here.</p>
      ) : (
        <>
          <p className="x42__on">It cites:</p>
          <ul className="x42__links">
            {cites.map((s) => (
              <li key={s}>
                <button type="button" className="lab-btn" onClick={() => onSource(s)}>
                  {SOURCES[s].title}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}

function SourceCard({ id, from, looped, onNote }: { id: SourceId; from?: Step; looped: boolean; onNote: (n: NoteId) => void }) {
  const src = SOURCES[id]
  const others = citedBy(id).filter((n) => !(from?.type === 'note' && from.id === n))
  return (
    <article className="x42__card x42__card--source">
      <p className="x42__meta">Source · {src.kind}</p>
      <h3>{src.title}</h3>
      <p>{src.contribution}</p>
      {'private' in src && src.private ? <p className="x42__meta">Private repository: named, not linked.</p> : <p><a href={src.url}>Open the source</a> (leaves the lab)</p>}
      {looped && <p className="x42__loop">You have been here before on this way down.</p>}
      {others.length === 0 ? (
        <p className="x42__end">No other note cites this source. The chain ends here.</p>
      ) : (
        <>
          <p className="x42__on">Also cited by {others.length === 1 ? 'one other note' : `${others.length} other notes`}:</p>
          <ul className="x42__links">
            {others.map((n) => (
              <li key={n}>
                <button type="button" className="lab-btn" onClick={() => onNote(n)}>
                  {NOTES[n].title}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}
