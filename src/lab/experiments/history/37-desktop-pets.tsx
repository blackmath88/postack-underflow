import { useEffect, useRef, useState } from 'react'
import { NOTES } from '../../../content/margin'
// From the module's own files, not its index, which would pull in Motte's stylesheet.
import { MotteSprite } from '../../../features/motte/MotteSprite'
import { historyFlags, publicHistoryFlags } from '../../../features/motte/history'
import { INTERRUPT_EVERY, RETURN_AFTER, askHistory, begin, callBack, dismiss, step, tally, type Cue, type PetState } from './37-pet'

// 37 · Desktop Pets Return. Motte's existing sprite, imported unchanged, lives
// in the margin of four real margin-note summaries. Four autonomy cues can be
// switched on and off; time passes one moment at a time. Every act is logged
// with its reason, so the cost of seeming alive is counted.

const PARAS = [NOTES.cardCatalogue, NOTES.controlledVocab, NOTES.rawVsAuthored, NOTES.whatIndexAdds].map((n) => n.summary)
const VERIFIED = publicHistoryFlags(historyFlags).length
const RUN = 12

const CUES: Array<{ id: Cue; label: string }> = [
  { id: 'idle', label: 'Idle movement: wanders the margin' },
  { id: 'attention', label: 'Attention: follows the paragraph you are on' },
  { id: 'interrupt', label: `Interruption: plants a flag every ${INTERRUPT_EVERY} moments` },
  { id: 'returns', label: `Comes back by itself ${RETURN_AFTER} moments after you send it away` },
]

const WHY = { own: 'on its own', reacting: 'reacting to you, unasked', asked: 'because you asked' } as const

export default function DesktopPets() {
  const [cues, setCues] = useState<Cue[]>(['idle'])
  const [pet, setPet] = useState<PetState>(begin)
  const [focus, setFocus] = useState<number | null>(null)
  const [running, setRunning] = useState(0)
  const focusRef = useRef(focus)
  focusRef.current = focus
  const cuesRef = useRef(cues)
  cuesRef.current = cues

  const toggle = (c: Cue) => setCues((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))
  const tick = () => setPet((p) => step(p, cuesRef.current, focusRef.current))

  // A bounded run: twelve moments, then it stops. Under reduced motion they pass at once.
  useEffect(() => {
    if (running <= 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPet((p) => {
        let q = p
        for (let i = 0; i < running; i++) q = step(q, cuesRef.current, focusRef.current)
        return q
      })
      setRunning(0)
      return
    }
    const id = window.setTimeout(() => {
      tick()
      setRunning((r) => r - 1)
    }, 550)
    return () => window.clearTimeout(id)
  }, [running])

  const t = tally(pet)
  const total = t.own + t.reacting + t.asked

  return (
    <div className="x37">
      <fieldset className="x37__cues">
        <legend>Autonomy cues</legend>
        {CUES.map((c) => (
          <label key={c.id}>
            <input type="checkbox" checked={cues.includes(c.id)} onChange={() => toggle(c.id)} /> {c.label}
          </label>
        ))}
      </fieldset>

      <div className="x37__controls">
        <button type="button" className="lab-btn" onClick={tick} disabled={running > 0} data-probe="click">
          Let a moment pass
        </button>
        <button type="button" className="lab-btn" onClick={() => setRunning(RUN)} disabled={running > 0}>
          Let {RUN} moments pass
        </button>
        {pet.present ? (
          <button type="button" className="lab-btn" onClick={() => setPet(dismiss)}>
            Send Motte away
          </button>
        ) : (
          <button type="button" className="lab-btn" onClick={() => setPet(callBack)}>
            Call Motte back
          </button>
        )}
        <button type="button" className="lab-btn" onClick={() => setPet((p) => askHistory(p, VERIFIED))} disabled={!pet.present}>
          Ask for history
        </button>
        <button type="button" className="lab-btn" onClick={() => setPet(begin())}>
          Start over
        </button>
      </div>

      <div className="x37__page">
        {PARAS.map((text, i) => (
          <div key={i} className="x37__row">
            <p
              tabIndex={0}
              className={'x37__para' + (focus === i ? ' is-focus' : '')}
              onFocus={() => setFocus(i)}
              onPointerEnter={() => setFocus(i)}
            >
              {text}
            </p>
            <div className="x37__margin" aria-hidden="true">
              {pet.present && pet.row === i && (
                <span key={pet.moment} className={`x37__pet x37__pet--${pet.pose}`}>
                  <MotteSprite pose={pet.pose} facing={pet.facing} size={40} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="x37__log" data-observe>
        <p className="x37__tally" role="status">
          Moment {pet.moment}. {pet.present ? `Motte is beside paragraph ${pet.row + 1}.` : 'Motte is away.'} Of {total}{' '}
          {total === 1 ? 'act' : 'acts'}, {t.own} {t.own === 1 ? 'was' : 'were'} {WHY.own}, {t.reacting} {WHY.reacting}, {t.asked} {WHY.asked}.
        </p>
        {pet.log.length > 0 && (
          <ol reversed>
            {[...pet.log]
              .reverse()
              .slice(0, 8)
              .map((e, i) => (
                <li key={i} className={`x37__e x37__e--${e.why}`}>
                  <span className="x37__m">m{e.moment}</span> {e.what} <em>({WHY[e.why]})</em>
                </li>
              ))}
          </ol>
        )}
      </div>
    </div>
  )
}
