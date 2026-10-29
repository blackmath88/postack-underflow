import { useState, type ReactNode } from 'react'
import { HISTORY, type HistoryEntry, type HistoryKind } from '../../../data/research-history'
import { tokenize } from '../../../lib/retrieval'

// 40 · The Museum That Rearranges Itself. The twelve entries of the
// project's own research history are the exhibits. Their labels are rendered
// from the unchanged data and never rewritten. A question rearranges the
// rooms, in one of two ways: by the words on the labels, or by a curator's
// map from a few prepared questions to kinds of event. The map is ours.

const label = (h: HistoryEntry) => [h.date, h.kind, h.title, h.what, h.changed].join(' ')
const LABEL_TOKENS = HISTORY.map((h) => new Set(tokenize(label(h))))

const CURATOR: Array<{ q: string; kinds: HistoryKind[] }> = [
  { q: 'What went wrong?', kinds: ['correction'] },
  { q: 'What was decided?', kinds: ['decision'] },
  { q: 'What is still unproven?', kinds: ['proposal'] },
  { q: 'Where did the ideas come from?', kinds: ['conversation', 'encounter'] },
]

type Mode = 'words' | 'curator'
interface Room {
  name: string
  wall: string
  items: Array<{ ix: number; matched: string[] }>
}

function arrange(question: string, mode: Mode): Room[] {
  const all = HISTORY.map((_, ix) => ix)
  if (mode === 'curator') {
    const entry = CURATOR.find((c) => c.q.toLowerCase().replace(/\?$/, '') === question.trim().toLowerCase().replace(/\?$/, ''))
    if (!entry)
      return [
        { name: 'Answers', wall: 'The curator prepared no room for this question.', items: [] },
        { name: 'The store', wall: 'Everything waits here until somebody maps the question.', items: all.map((ix) => ({ ix, matched: [] })) },
      ]
    const hit = all.filter((ix) => entry.kinds.includes(HISTORY[ix]!.kind))
    return [
      { name: 'Answers', wall: `The curator decided this question is about: ${entry.kinds.join(', ')}.`, items: hit.map((ix) => ({ ix, matched: [] })) },
      { name: 'The store', wall: 'Not chosen for this question.', items: all.filter((ix) => !hit.includes(ix)).map((ix) => ({ ix, matched: [] })) },
    ]
  }
  const q = new Set(tokenize(question))
  const scored = all.map((ix) => ({ ix, matched: [...LABEL_TOKENS[ix]!].filter((t) => q.has(t)) }))
  const ask = q.size ? [...q].join(', ') : 'nothing yet'
  return [
    { name: 'Answers in its own words', wall: `Labels sharing two or more of your words (${ask}).`, items: scored.filter((s) => s.matched.length >= 2) },
    { name: 'Mentions', wall: 'Labels sharing one of your words.', items: scored.filter((s) => s.matched.length === 1) },
    { name: 'The store', wall: 'Labels that share none of your words. In store, only the first lines of each label show.', items: scored.filter((s) => s.matched.length === 0) },
  ]
}

function marked(text: string, words: string[]): ReactNode {
  if (!words.length) return text
  return text.split(/(\s+)/).map((w, i) => (tokenize(w).some((t) => words.includes(t)) ? <mark key={i}>{w}</mark> : w))
}

export default function MuseumRearranges() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState<Mode>('words')
  const rooms = arrange(question, mode)
  const answered = rooms[0]!.items.length + (mode === 'words' ? rooms[1]!.items.length : 0)

  return (
    <div className="x40">
      <div className="x40__desk">
        <label className="x40__ask">
          Your question
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What went wrong?" data-probe="type:what went wrong" />
        </label>
        <div className="x40__presets" role="group" aria-label="Prepared questions">
          {CURATOR.map((c) => (
            <button key={c.q} type="button" className="lab-btn" onClick={() => setQuestion(c.q)} aria-pressed={question === c.q}>
              {c.q}
            </button>
          ))}
        </div>
        <fieldset className="x40__mode">
          <legend>Who arranges the rooms</legend>
          <label>
            <input type="radio" name="x40-mode" checked={mode === 'words'} onChange={() => setMode('words')} /> The labels’ own words
          </label>
          <label>
            <input type="radio" name="x40-mode" checked={mode === 'curator'} onChange={() => setMode('curator')} /> A curator’s map
          </label>
        </fieldset>
      </div>

      <div className="x40__plan" data-observe>
        <p className="x40__summary" role="status">
          {question.trim() ? `“${question.trim()}”: ${answered} of ${HISTORY.length} exhibits brought forward.` : `Ask a question. All ${HISTORY.length} exhibits are in store.`}{' '}
          No label has been rewritten.
        </p>
        <div className={`x40__rooms x40__rooms--${rooms.length}`}>
          {rooms.map((r) => (
            <section key={r.name} className="x40__room" aria-label={`${r.name}, ${r.items.length} exhibits`}>
              <h3>
                {r.name} <span className="x40__count">{r.items.length}</span>
              </h3>
              <p className="x40__wall">{r.wall}</p>
              <ul>
                {r.items.map(({ ix, matched }) => {
                  const h = HISTORY[ix]!
                  return (
                    <li key={ix} className="x40__object">
                      <p className="x40__meta">
                        No. {String(ix + 1).padStart(2, '0')} · {marked(h.date, matched)} · {marked(h.kind, matched)}
                      </p>
                      <p className="x40__title">{marked(h.title, matched)}</p>
                      {r.name !== 'The store' && (
                        <>
                          <p className="x40__what">{marked(h.what, matched)}</p>
                          <p className="x40__changed">{marked(h.changed, matched)}</p>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
