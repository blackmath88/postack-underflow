import { useState } from 'react'
import { CONTRIBUTIONS, type Contribution } from '../../../data/community-fixtures'
import { LABELERS, LABELS } from '../../data/community-labels'

// 30 · The Moderation Lens. One conversation, the eight Community fixtures,
// seen through a lens whose strength you slide. Each stop is a visibility
// policy: hide unreadable records, then honour one invented labeler's labels
// as warnings, then as hiding, then honour a second labeler too. Below the
// records, the view writes its own one-paragraph account of what it shows.
// The labels are invented (src/lab/data/community-labels.ts).

type Fate = 'shown' | 'warned' | 'hidden' | 'placeholder'

const STOPS = [
  {
    name: 'Clear glass',
    rule: 'Show everything, with placeholders for records that cannot be read.',
  },
  { name: 'Tidy', rule: 'Leave out records that cannot be read.' },
  {
    name: 'Calm, warn',
    rule: `Also put a warning over anything ${LABELERS.calm.handle} labels.`,
  },
  { name: 'Calm, hide', rule: `Hide anything ${LABELERS.calm.handle} labels.` },
  {
    name: 'Both, hide',
    rule: `Hide anything ${LABELERS.calm.handle} or ${LABELERS.strict.handle} labels.`,
  },
] as const

const labelsOn = (c: Contribution, src: string) => LABELS.filter((l) => l.uri === c.uri && l.src === src)

function fate(c: Contribution, stop: number): { fate: Fate; why?: string } {
  if (c.availability !== 'available')
    return stop === 0 ? { fate: 'placeholder' } : { fate: 'hidden', why: c.availability.replace('-', ' ') }
  const calm = labelsOn(c, LABELERS.calm.did)
  const strict = labelsOn(c, LABELERS.strict.did)
  if (stop >= 4 && (calm.length || strict.length))
    return {
      fate: 'hidden',
      why: [...calm, ...strict].map((l) => l.val).join(', '),
    }
  if (stop >= 3 && calm.length) return { fate: 'hidden', why: calm.map((l) => l.val).join(', ') }
  if (stop >= 2 && calm.length) return { fate: 'warned', why: calm.map((l) => l.val).join(', ') }
  return { fate: 'shown' }
}

const who = (c: Contribution) => c.author.handle.replace('.example', '')
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`)

// The account the view would print, from what it shows and nothing else.
function account(stop: number): string {
  const seen = CONTRIBUTIONS.filter((c) => c.kind !== 'article' && ['shown', 'warned'].includes(fate(c, stop).fate))
  const has = (id: string) => seen.some((c) => c.id === id)
  const parts: string[] = []
  parts.push(`The essay drew ${seen.length} ${seen.length === 1 ? 'response' : 'responses'}.`)
  const against = seen.filter((c) => c.kind === 'dispute' || c.kind === 'correction')
  parts.push(
    against.length
      ? `${list(against.map((c) => `${who(c)} ${c.kind === 'dispute' ? 'disputed' : 'corrected'} ${c.claim}`))}.`
      : 'Nobody disagreed with it.',
  )
  if (has('c6')) parts.push(has('c4') ? 'ines endorsed mara’s correction.' : 'ines endorsed something this view does not show.')
  if (has('c3')) parts.push('tomas wrote up how to rerun the evaluation.')
  const warned = seen.filter((c) => fate(c, stop).fate === 'warned')
  if (warned.length) parts.push(`${warned.length} sits behind a warning.`)
  if (stop === 0) parts.push(`${CONTRIBUTIONS.filter((c) => c.availability !== 'available').length} more replies could not be read.`)
  return parts.join(' ')
}

export default function ModerationLens() {
  const [stop, setStop] = useState(0)
  const s = STOPS[stop]!

  return (
    <div className="x30">
      <p className="lab-fixture">Invented labelers and labels; the records are the Community page fixtures</p>
      <label className="x30__lens">
        <span className="x30__power">
          Lens: <strong>{s.name}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={STOPS.length - 1}
          step={1}
          value={stop}
          onChange={(e) => setStop(Number(e.target.value))}
          aria-valuetext={`${s.name}: ${s.rule}`}
          data-probe="key:ArrowRight"
        />
        <span className="x30__rule">{s.rule}</span>
      </label>

      <ul className={`x30__strip x30__strip--${stop}`} aria-label="The conversation through the lens">
        {CONTRIBUTIONS.map((c) => {
          const f = fate(c, stop)
          return (
            <li key={c.id} className={`x30__rec is-${f.fate}`}>
              <p className="x30__who">
                {who(c)} · {c.kind}
              </p>
              {f.fate === 'shown' && <p className="x30__text">{c.text}</p>}
              {f.fate === 'warned' && <p className="x30__warn">Warning: {f.why}. Content collapsed.</p>}
              {f.fate === 'placeholder' && (
                <p className="x30__warn">{c.availability === 'deleted' ? 'Deleted by its author.' : 'Source offline.'}</p>
              )}
              {f.fate === 'hidden' && <p className="x30__gone">Not in this view ({f.why})</p>}
            </li>
          )
        })}
      </ul>

      <div className="x30__account" data-observe>
        <p className="x30__kicker">The view’s own account</p>
        <p className="x30__said">{account(stop)}</p>
      </div>
    </div>
  )
}
