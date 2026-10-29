import { useId, useState } from 'react'
import { tokenize } from '../../../lib/retrieval'
import type { ProblemRecord } from '../../../lib/records'
import { BORDERS, EXTRAS, WORDS, type StampPart } from '../../data/classification-stamps'
import { RECORDS, record, shortName, sourceSays } from './words'

// 20 · The Unverified Stamp. A stamp desk. The visitor composes a rubber
// stamp from a word, a border and optional marks (date, initials, evidence
// label) and presses it onto a frozen v1 record card. The desk then reads the
// stamp back as claims and checks each against what the record itself says
// about how it was made. What each part implies is our reading
// (src/lab/data/classification-stamps.ts); the backing is computed.

type Status = 'backed' | 'partly' | 'not backed'

function judge(part: StampPart, r: ProblemRecord): { status: Status; why: string } {
  const unreviewed = /not yet reviewed by a human/i.test(r.extraction.method)
  switch (part.backing) {
    case 'extraction-human':
      if (part.id === 'unreviewed')
        return unreviewed ? { status: 'backed', why: 'The method says: not yet reviewed by a human.' } : { status: 'not backed', why: 'The method does not say.' }
      return unreviewed
        ? { status: 'not backed', why: 'The method says: not yet reviewed by a human.' }
        : { status: 'partly', why: 'The method does not say who reviewed it.' }
    case 'extraction-paraphrase':
      return /paraphrased/i.test(r.extraction.method)
        ? { status: 'backed', why: 'The method says: fields paraphrased from the source.' }
        : { status: 'not backed', why: 'The method does not say.' }
    case 'extraction-date':
      return { status: 'partly', why: `Written ${r.extraction.at}. Nothing records a later check.` }
    case 'extraction-named':
      return { status: 'partly', why: `Names its writer as “${r.extraction.by.split(',')[0]}”: an agent, not a person.` }
    case 'word-check': {
      const clean = r.aliases.filter((a) => tokenize(a).every((t) => sourceSays(t, r.sourceId))).length
      return { status: 'partly', why: `Only a machine word check exists: ${clean} of ${r.aliases.length} aliases use only words found in the source. Nobody read it against the source.` }
    }
    case 'evidence':
      return {
        status: 'partly',
        why: `The record’s label is ${r.evidence.map((e) => e.kind).join(' and ')}, which vouches for its solution, not for every field.`,
      }
    default:
      return { status: 'not backed', why: 'Nothing in the record records this.' }
  }
}

export default function UnverifiedStamp() {
  const id = useId()
  const [sourceId, setSourceId] = useState('vite-issue-8073-base-mime')
  const [word, setWord] = useState('verified')
  const [border, setBorder] = useState('seal')
  const [extras, setExtras] = useState<Set<string>>(() => new Set(['date']))
  const r = record(sourceId)
  const w = WORDS.find((x) => x.id === word)!
  const b = BORDERS.find((x) => x.id === border)!
  const parts = [w, b, ...EXTRAS.filter((e) => extras.has(e.id))].filter((p) => p.backing !== 'nothing')
  const verdicts = parts.map((p) => ({ part: p, ...judge(p, r) }))
  const backed = verdicts.filter((v) => v.status === 'backed').length
  const partly = verdicts.filter((v) => v.status === 'partly').length

  const toggle = (x: string) =>
    setExtras((s) => {
      const n = new Set(s)
      if (n.has(x)) n.delete(x)
      else n.add(x)
      return n
    })

  return (
    <div className="x20">
      <div className="x20__tools">
        <div className="x20__field">
          <label htmlFor={`${id}-w`}>Stamp word</label>
          <select id={`${id}-w`} value={word} onChange={(e) => setWord(e.target.value)} data-probe="select">
            {WORDS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.face}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="x20__field">
          <legend>Border</legend>
          {BORDERS.map((x) => (
            <label key={x.id}>
              <input type="radio" name={`${id}-b`} checked={border === x.id} onChange={() => setBorder(x.id)} />{' '}
              {x.id === 'seal' ? 'round seal' : 'plain box'}
            </label>
          ))}
        </fieldset>
        <fieldset className="x20__field">
          <legend>Marks</legend>
          {EXTRAS.map((x) => (
            <label key={x.id}>
              <input type="checkbox" checked={extras.has(x.id)} onChange={() => toggle(x.id)} /> {x.face}
            </label>
          ))}
        </fieldset>
        <div className="x20__field">
          <label htmlFor={`${id}-r`}>Card</label>
          <select id={`${id}-r`} value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
            {RECORDS.map((x) => (
              <option key={x.sourceId} value={x.sourceId}>
                {shortName(x.sourceId).slice(0, 50)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="x20__desk">
        <article className="x20__card">
          <p className="x20__src">{shortName(sourceId)}</p>
          <p className="x20__problem">{r.problem}</p>
          <p className="x20__by">{r.extraction.method}</p>
          <div key={`${word}-${border}-${[...extras].join()}`} className={`x20__stamp x20__stamp--${border}`} aria-label={`Stamp: ${w.face}`}>
            <span className="x20__word">{w.face}</span>
            {extras.has('date') && <span className="x20__small">{r.extraction.at}</span>}
            {extras.has('initials') && <span className="x20__small">C.</span>}
            {extras.has('evidence') && <span className="x20__small">{r.evidence[0]!.kind.toUpperCase()}</span>}
          </div>
        </article>

        <div className="x20__slip" data-observe>
          <p className="x20__tally" role="status">
            The stamp makes {parts.length} claims. The record backs {backed}, partly backs {partly}, and does not back{' '}
            {parts.length - backed - partly}.
          </p>
          <ul>
            {verdicts.map((v) => (
              <li key={v.part.id} className={`is-${v.status.replace(' ', '-')}`}>
                <span className="x20__status">{v.status}</span>
                <span className="x20__claim">
                  {v.part.face || (v.part.id === 'seal' ? 'Round seal' : 'Plain box')}: {v.part.implies}
                </span>
                <span className="x20__why">{v.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
