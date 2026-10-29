import { useState } from 'react'
import { CONTRIBUTIONS, ARTICLE_URI, type Contribution } from '../../../data/community-fixtures'
import { CONTRACTS } from '../../../data/connection-contracts'

// 26 · The Forgotten Reply. ATProto keeps no tombstone: when a record is
// deleted, references to it dangle, and only copies elsewhere remember it.
// Here you carve a marker for the two fixture replies that cannot be read,
// Rui's deleted one and Ola's offline one, choosing each line. Every line
// says where the fact still comes from, and whether keeping it goes against
// what the author did. Reads the unchanged Community fixtures.

type Source = 'the record itself' | 'an index’s old copy' | 'this view’s contract' | 'other records'

interface Line {
  id: string
  label: string
  text: string
  source: Source
  /** Keeping this line keeps something the author removed. */
  against: boolean
  /** Nothing anywhere holds it, so it cannot be carved. */
  missing?: boolean
}

const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))
const ESSAY = CONTRIBUTIONS.find((c) => c.uri === ARTICLE_URI)!

function linesFor(c: Contribution): Line[] {
  const deleted = c.availability === 'deleted'
  const k = CONTRACTS.find((x) => x.from === c.id && x.to === ESSAY.id)!
  const pointedAtBy = CONTRIBUTIONS.filter((x) => x.refs.some((r) => r.uri === c.uri))
  return [
    {
      id: 'who',
      label: 'Who wrote it',
      text: c.author.handle,
      source: 'an index’s old copy',
      against: false,
    },
    {
      id: 'what',
      label: 'That it was a reply',
      text: `A reply to “${ESSAY.text.split('.')[0]}.”`,
      source: 'an index’s old copy',
      against: false,
    },
    {
      id: 'uri',
      label: 'Its address',
      text: c.uri,
      source: 'an index’s old copy',
      against: false,
    },
    {
      id: 'cid',
      label: 'Its exact version',
      text: c.cid,
      source: 'an index’s old copy',
      against: false,
    },
    {
      id: 'claim',
      label: 'What it was about',
      text: `Hypothesis ${c.claim}`,
      source: 'an index’s old copy',
      against: deleted,
    },
    {
      id: 'text',
      label: 'What it said',
      text: c.text || '(no copy of the words exists anywhere in the fixtures)',
      source: 'the record itself',
      against: deleted,
      missing: !c.text,
    },
    {
      id: 'fate',
      label: 'What happened to it',
      text: k.history.at(-1)!.note,
      source: 'this view’s contract',
      against: false,
    },
    {
      id: 'kin',
      label: 'Who still points at it',
      text: pointedAtBy.length ? pointedAtBy.map((x) => x.author.handle).join(', ') : 'No other record points at it.',
      source: 'other records',
      against: false,
    },
  ]
}

const GRAVES = ['c8', 'c7'] as const

export default function ForgottenReply() {
  const [grave, setGrave] = useState<(typeof GRAVES)[number]>('c8')
  const [carved, setCarved] = useState<Record<string, string[]>>({
    c8: ['who', 'what'],
    c7: ['who', 'what'],
  })
  const c = byId.get(grave)!
  const lines = linesFor(c)
  const mine = carved[grave] ?? []
  const on = lines.filter((l) => mine.includes(l.id) && !l.missing)
  const deleted = c.availability === 'deleted'

  const toggle = (id: string) =>
    setCarved((s) => {
      const cur = s[grave] ?? []
      return {
        ...s,
        [grave]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
      }
    })

  const fromOthers = on.filter((l) => l.source !== 'the record itself').length
  const against = on.filter((l) => l.against).length

  return (
    <div className="x26">
      <div className="x26__choose" role="group" aria-label="Which reply">
        {GRAVES.map((g) => {
          const x = byId.get(g)!
          return (
            <button key={g} type="button" className="lab-btn" aria-pressed={grave === g} onClick={() => setGrave(g)}>
              {x.author.handle.replace('.example', '')}’s reply · {x.availability.replace('-', ' ')}
            </button>
          )
        })}
      </div>

      <div className="x26__yard">
        <fieldset className="x26__chisel">
          <legend>Carve a line</legend>
          {lines.map((l) => (
            <label key={l.id} className={l.missing ? 'is-missing' : undefined}>
              <input
                type="checkbox"
                checked={mine.includes(l.id) && !l.missing}
                disabled={l.missing}
                onChange={() => toggle(l.id)}
                data-probe={l.id === 'claim' ? 'click' : undefined}
              />
              <span>
                {l.label}
                <span className="x26__src">
                  from {l.source}
                  {l.against && ' · against the deletion'}
                  {l.missing && ' · nothing to carve'}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="x26__marker-wrap" data-observe>
          <figure className={`x26__marker x26__marker--${deleted ? 'stone' : 'sign'}`}>
            <p className="x26__head">{deleted ? 'Here was a reply' : 'Away. Not gone?'}</p>
            {on.length ? (
              on.map((l) => (
                <p key={l.id} className={'x26__line' + (l.against ? ' is-against' : '')}>
                  {l.text}
                </p>
              ))
            ) : (
              <p className="x26__line x26__line--blank">(blank)</p>
            )}
          </figure>
          <p className="lab-out">
            {on.length} {on.length === 1 ? 'line' : 'lines'} · {fromOthers} remembered by someone other than the author
            {deleted ? ` · ${against} kept against the author’s deletion` : ' · the source may come back and contradict any of them'}
          </p>
          <p className="x26__note">
            {deleted
              ? 'The protocol keeps no tombstone. Every line here is someone else’s memory; the author’s own record is gone.'
              : 'An unreachable server is not a deletion. This sign may be wrong the moment the server answers.'}
          </p>
        </div>
      </div>
    </div>
  )
}
