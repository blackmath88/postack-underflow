import { useState } from 'react'
import { CONTRIBUTIONS, ARTICLE_URI } from '../../../data/community-fixtures'
import { CONTRACTS, status } from '../../../data/connection-contracts'

// 22 · The Operator Leaves, one sheet at a time. The Community page removes
// the whole view at once. Here the view is four transparent sheets laid over
// the records the newcomer can still fetch, and you lift them off in any
// order. After each lift, a newcomer holding only what is left tries to
// answer eight fixed questions. Reads the unchanged Community fixtures.

type Layer = 'model' | 'editor' | 'cache' | 'order'

const LAYERS: Record<Layer, { name: string; holds: string }> = {
  model: {
    name: 'A model’s suggestions',
    holds: 'k7: Jun’s dispute and Mara’s correction ask the same question.',
  },
  editor: {
    name: 'The editor’s readings',
    holds: 'k6 accepted, k8 withdrawn, and the editor’s rebuttal of k7.',
  },
  cache: {
    name: 'An index’s old copies',
    holds: 'References from Ola’s offline reply (k5) and Rui’s deleted one (k9).',
  },
  order: {
    name: 'The view’s order',
    holds: 'A sequence, by date and then record id. The records carry one date.',
  },
}
const ORDER: Layer[] = ['model', 'editor', 'cache', 'order']

const fetchable = CONTRIBUTIONS.filter((c) => c.availability === 'available')
const handle = (id: string) => CONTRIBUTIONS.find((c) => c.id === id)!.author.handle.replace('.example', '')
const pointsAtEssay = fetchable.filter((c) => c.refs.some((r) => r.uri === ARTICLE_URI))
const k7 = CONTRACTS.find((k) => k.id === 'k7')!
const sameDay = new Set(CONTRIBUTIONS.map((c) => c.createdAt)).size === 1

type Answer = { text: string; from: Layer | 'records' | null }

// Each question reads only what the remaining layers hold.
const QUESTIONS: Array<{
  q: string
  a: (has: (l: Layer) => boolean) => Answer
}> = [
  {
    q: 'What did the essay claim?',
    a: () => ({
      text: 'Its own record says: “We already solved this.”',
      from: 'records',
    }),
  },
  {
    q: 'Who responded to the essay?',
    a: (has) => {
      const names = pointsAtEssay.map((c) => handle(c.id))
      return has('cache')
        ? {
            text: `${names.join(', ')}, plus ola and rui, whose records cannot be read.`,
            from: 'cache',
          }
        : {
            text: `${names.join(', ')}. Their own records name the essay.`,
            from: 'records',
          }
    },
  },
  {
    q: 'Does anyone disagree with it?',
    a: () => ({
      text: 'Yes: jun’s record is a dispute, mara’s a correction. The record types say so.',
      from: 'records',
    }),
  },
  {
    q: 'Does anyone back mara’s correction?',
    a: () => ({
      text: 'ines does: her endorsement record names it.',
      from: 'records',
    }),
  },
  {
    q: 'Are tomas and ines asking the same thing?',
    a: (has) =>
      has('editor')
        ? { text: 'The editor says yes, and accepted it (k6).', from: 'editor' }
        : {
            text: 'Both records name hypothesis H1. Nothing says more than that.',
            from: 'records',
          },
  },
  {
    q: 'Is jun’s dispute about the same thing as mara’s correction?',
    a: (has) =>
      has('model') && has('editor')
        ? {
            text: `A model said yes; the editor disputed it (${status(k7)}).`,
            from: 'editor',
          }
        : has('model')
          ? {
              text: 'A model says yes, and nothing left on the table contradicts it.',
              from: 'model',
            }
          : { text: 'Nothing left says they are connected.', from: null },
  },
  {
    q: 'Did ola or rui ever reply?',
    a: (has) =>
      has('cache')
        ? {
            text: 'Yes. An index kept their references: ola’s server is offline; rui deleted the reply.',
            from: 'cache',
          }
        : { text: 'There is no trace of either.', from: null },
  },
  {
    q: 'In what order did it happen?',
    a: (has) =>
      has('order')
        ? {
            text: sameDay ? 'The view shows an order, but it invented it: every record has the same date.' : 'By date.',
            from: 'order',
          }
        : {
            text: sameDay ? 'All on one day. No order can be recovered.' : 'By the dates in the records.',
            from: 'records',
          },
  },
]

export default function PeelingLayers() {
  const [peeled, setPeeled] = useState<Layer[]>([])
  const [log, setLog] = useState<string[]>([])
  const has = (l: Layer) => !peeled.includes(l)

  const answers = (p: Layer[]) => QUESTIONS.map((x) => x.a((l) => !p.includes(l)))
  const now = answers(peeled)

  const peel = (l: Layer) => {
    const lifting = has(l)
    const before = answers(peeled)
    const next = lifting ? [...peeled, l] : peeled.filter((x) => x !== l)
    const after = answers(next)
    const changed = after.filter((a, i) => a.text !== before[i]!.text).length
    const lost = after.filter((a, i) => a.from === null && before[i]!.from !== null).length
    setPeeled(next)
    setLog((g) => [
      ...g,
      `${g.length + 1}. ${lifting ? 'Lifted' : 'Laid back'} ${LAYERS[l].name.toLowerCase()}: ${changed} ${changed === 1 ? 'answer' : 'answers'} changed${lost ? `, ${lost} lost` : ''}.`,
    ])
  }
  const reset = () => {
    setPeeled([])
    setLog([])
  }

  const fromRecords = now.filter((a) => a.from === 'records').length

  return (
    <div className="x22">
      <div className="x22__table">
        <p className="x22__hint">Lift the sheets in any order. The records underneath cannot be lifted.</p>
        <ul className="x22__stack">
          {ORDER.map((l, i) => (
            <li key={l} className={'x22__sheet' + (has(l) ? '' : ' is-peeled')} style={{ ['--i' as string]: i }}>
              <div>
                <p className="x22__name">{LAYERS[l].name}</p>
                <p className="x22__holds">{LAYERS[l].holds}</p>
              </div>
              <button
                type="button"
                className="lab-btn"
                onClick={() => peel(l)}
                aria-pressed={!has(l)}
                data-probe={l === 'model' ? 'click' : undefined}
              >
                {has(l) ? 'Lift' : `Lifted ${['1st', '2nd', '3rd', '4th'][peeled.indexOf(l)]} · lay back`}
              </button>
            </li>
          ))}
          <li className="x22__sheet x22__sheet--base">
            <div>
              <p className="x22__name">The records</p>
              <p className="x22__holds">
                {fetchable.length} of {CONTRIBUTIONS.length} can be fetched, each with the references its author wrote.
              </p>
            </div>
          </li>
        </ul>
        <button type="button" className="lab-btn" onClick={reset} disabled={!peeled.length}>
          Lay every sheet back
        </button>
      </div>

      <div className="x22__ledger" data-observe>
        <h3>What a newcomer can reconstruct</h3>
        <p className="lab-out">
          {now.filter((a) => a.from !== null).length} of {QUESTIONS.length} answered · {fromRecords} from the records alone
        </p>
        <ol className="x22__qs">
          {QUESTIONS.map((x, i) => {
            const a = now[i]!
            return (
              <li key={x.q} className={a.from === null ? 'is-lost' : a.from === 'records' ? 'is-records' : undefined}>
                <p className="x22__q">{x.q}</p>
                <p className="x22__a">
                  {a.text}{' '}
                  <span className="x22__src">
                    {a.from === null ? 'lost' : a.from === 'records' ? 'records' : LAYERS[a.from].name.toLowerCase()}
                  </span>
                </p>
              </li>
            )
          })}
        </ol>
        {log.length > 0 && (
          <ol className="x22__log" aria-label="Lifting order">
            {log.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
