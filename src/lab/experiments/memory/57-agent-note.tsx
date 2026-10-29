import { useState } from 'react'
import { PHOTO_FRAME } from '../../../data/photo-frame'
import { AGENT_NOTE, NOTE_SECTION_LABEL, type NoteLine, type NoteSpan } from '../../data/memory-fixtures'

// 57 · The Agent Leaves a Note. The photo-frame repository asks agents to send
// back what they find, with private data stripped. This is a redaction desk
// for an invented draft note (memory-fixtures.ts). Each marked span can be
// struck by hand, or a pattern sanitiser can strike what its rules match.
// The ledger counts what still leaks and what a reproducer has lost.

const RULES: Array<{ name: string; re: RegExp }> = [
  { name: 'email address', re: /[\w.+-]+@[\w-]+\.[\w.]+/ },
  { name: 'IPv4 address', re: /\b\d{1,3}(?:\.\d{1,3}){3}\b/ },
  { name: 'home path', re: /\/home\/[^\s]+/ },
  { name: 'serial-like code', re: /\b[A-Z]{2,}[A-Z0-9]*-[A-Z0-9.-]{4,}\b/ },
  { name: 'hex fingerprint', re: /\b(?:[0-9A-F]{2}:){3,}[0-9A-F]{2}\b/ },
]

const SPANS = AGENT_NOTE.flatMap((l, li) => l.spans.map((s, si) => ({ key: `${li}.${si}`, s })))
const MARKED = SPANS.filter(({ s }) => s.kind === 'private' || s.kind === 'needed')
const ruleFor = (s: NoteSpan) => RULES.find((r) => r.re.test(s.text))
const SECTIONS = [...new Set(AGENT_NOTE.map((l) => l.section))]

export default function AgentNote() {
  const [struck, setStruck] = useState<Set<string>>(new Set())
  const [by, setBy] = useState<'hand' | 'sanitiser' | null>(null)

  const toggle = (key: string) => {
    setStruck((s) => {
      const n = new Set(s)
      if (n.has(key)) n.delete(key)
      else n.add(key)
      return n
    })
    setBy('hand')
  }
  const sanitise = () => {
    setStruck(new Set(SPANS.filter(({ s }) => s.kind !== 'plain' && s.kind !== 'guess' && ruleFor(s)).map(({ key }) => key)))
    setBy('sanitiser')
  }

  const leaks = MARKED.filter(({ key, s }) => s.kind === 'private' && !struck.has(key))
  const lost = MARKED.filter(({ key, s }) => s.kind === 'needed' && struck.has(key))
  const privateTotal = MARKED.filter(({ s }) => s.kind === 'private').length
  const neededTotal = MARKED.filter(({ s }) => s.kind === 'needed').length

  const renderLine = (l: NoteLine, li: number, editable: boolean) =>
    l.spans.map((s, si) => {
      const key = `${li}.${si}`
      if (s.kind === 'plain' || s.kind === 'guess') return <span key={key}>{s.text}</span>
      const isStruck = struck.has(key)
      if (!editable)
        return isStruck ? (
          <span key={key} className="x57__bar">
            [{s.what} removed]
          </span>
        ) : (
          <span key={key}>{s.text}</span>
        )
      return (
        <button
          key={key}
          type="button"
          className={'x57__span' + (isStruck ? ' is-struck' : '')}
          aria-pressed={isStruck}
          aria-label={`${isStruck ? 'Restore' : 'Strike'} ${s.what}: ${s.text}`}
          onClick={() => toggle(key)}
        >
          {s.text}
        </button>
      )
    })

  return (
    <div className="x57">
      <p className="lab-fixture">Invented note, invented frame, invented owner. Nothing here happened.</p>

      <div className="x57__desk">
        <section className="x57__draft" aria-label="The draft, as the session left it">
          <h3>Draft note</h3>
          <p className="x57__hint">Press a highlighted span to strike it.</p>
          {AGENT_NOTE.map((l, li) => (
            <p key={li} className={`x57__line x57__line--${l.section}`}>
              {renderLine(l, li, true)}
            </p>
          ))}
          <div className="x57__tools">
            <button type="button" className="lab-btn" onClick={sanitise} data-probe="click">
              Run the pattern sanitiser
            </button>
            <button
              type="button"
              className="lab-btn"
              onClick={() => {
                setStruck(new Set())
                setBy(null)
              }}
              disabled={struck.size === 0}
            >
              Restore everything
            </button>
          </div>
          <details className="x57__rules">
            <summary>The sanitiser’s {RULES.length} rules</summary>
            <ul>
              {RULES.map((r) => (
                <li key={r.name}>
                  {r.name}: <code>{r.re.source}</code>
                </li>
              ))}
            </ul>
          </details>
        </section>

        <section className="x57__out" aria-label="The reviewable note" data-observe>
          <h3>Reviewable note{by ? `, struck by ${by === 'hand' ? 'hand' : 'the sanitiser'}` : ''}</h3>
          {SECTIONS.map((sec) => (
            <div key={sec} className="x57__sec">
              <h4>{NOTE_SECTION_LABEL[sec]}</h4>
              {AGENT_NOTE.map((l, li) =>
                l.section === sec ? (
                  <p key={li} className={sec === 'guessed' ? 'x57__guess' : undefined}>
                    {renderLine(l, li, false)}
                  </p>
                ) : null,
              )}
            </div>
          ))}
          <div className="x57__ledger" role="status">
            <p>
              <strong>Still private, still showing:</strong> {leaks.length} of {privateTotal}
              {leaks.length > 0 && ` (${leaks.map(({ s }) => s.what).join(', ')})`}.
            </p>
            <p>
              <strong>Needed to reproduce, now removed:</strong> {lost.length} of {neededTotal}
              {lost.length > 0 && ` (${lost.map(({ s }) => s.what).join(', ')})`}.
            </p>
            <p>The owner sees a diff of {struck.size} struck {struck.size === 1 ? 'span' : 'spans'} before anything is sent.</p>
          </div>
        </section>
      </div>

      <p className="x57__real">
        Real context: the README of <a href={PHOTO_FRAME.readmeUrl}>{PHOTO_FRAME.repo}</a>, pinned at{' '}
        <code>{PHOTO_FRAME.pinnedCommit.slice(0, 7)}</code>, asks contributors to strip private data, keep observations
        apart from guesses, and show the owner the diff. Its wording is not reproduced here.
      </p>
    </div>
  )
}
