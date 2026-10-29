import { useState } from 'react'
import { artifact, recordBySource } from '../../../lib/four-words-data'
import { CORRECTION_RECORD, DESK_QUERY_ID, PARTS, type CorrectionPart } from '../../../data/problem-desk'
import { QUERIES, firstRelevant, indexCopy } from './copy-index'

// 52 · The Problem Desk, Reassembled. The essay's Problem Desk lets you accept
// the two parts of Lena's invented correction and see the ranking move. Here
// the same two parts run through a set of joining rules, laid out as rail
// switches: each rule decides which parts reach the index and which wait on
// a siding, and says who had to act. Ranks are rebuilt from a copy of the
// frozen records; nothing is written.

type RuleId = 'open' | 'quote' | 'symptom' | 'review' | 'author'
type Verdict = { joins: boolean; why: string }

const query = QUERIES.find((q) => q.id === DESK_QUERY_ID)!
const writer = (id: string) => recordBySource.get(id)?.extraction.by ?? 'unknown'

const RULES: Array<{ id: RuleId; name: string; actor: string; costs: string; judge: (p: CorrectionPart, reviewed: Record<string, boolean>) => Verdict }> = [
  {
    id: 'open',
    name: 'Open',
    actor: 'Nobody but the contributor.',
    costs: 'Any plausible guess joins at once, and ranks exactly like a sourced one.',
    judge: () => ({ joins: true, why: 'No check is made.' }),
  },
  {
    id: 'quote',
    name: 'Evidence-gated',
    actor: 'The contributor, who must quote the target source.',
    costs: 'A quotation can support the mechanism while the added words describe a symptom the source never mentions.',
    judge: (p) =>
      p.quote
        ? { joins: true, why: `Quotes snapshot line ${p.quote.line} of its source.` }
        : { joins: false, why: 'No quotation from the target source.' },
  },
  {
    id: 'symptom',
    name: 'Strictly evidence-gated',
    actor: 'The contributor, who must quote the symptom itself.',
    costs: 'Nothing an index adds for a searcher’s words can pass, because that vocabulary is by definition missing from the source.',
    judge: (p) => ({
      joins: false,
      why: p.grounding === 'mechanism' ? 'The source states the mechanism, not the symptom.' : 'The source says nothing about it.',
    }),
  },
  {
    id: 'review',
    name: 'Review-gated',
    actor: 'A named reviewer: here, you.',
    costs: 'The quality of the index becomes the reviewer’s judgement and time; nothing joins while nobody looks.',
    judge: (p, reviewed) =>
      reviewed[p.id] ? { joins: true, why: 'Accepted by you, as reviewer.' } : { joins: false, why: 'Waiting for a reviewer.' },
  },
  {
    id: 'author',
    name: 'Author-only',
    actor: 'The record’s own writer.',
    costs: 'The person who noticed the gap cannot fix it, and these records were written by an agent that is not watching.',
    judge: (p) => ({ joins: false, why: `The record was written by “${writer(p.target)}”, not by ${CORRECTION_RECORD.author}.` }),
  },
]

function rankWith(joined: CorrectionPart[]) {
  const records = artifact.records.map((r) => {
    const parts = joined.filter((p) => p.target === r.sourceId)
    return parts.length ? { ...r, symptoms: [...r.symptoms, ...parts.map((p) => p.add)] } : r
  })
  return firstRelevant(indexCopy(records), query)
}

const BASE_RANK = rankWith([])
const NOBODY: Record<string, boolean> = {}
const YARD = RULES.map((r) => ({ id: r.id, name: r.name, rank: rankWith(PARTS.filter((p) => r.judge(p, NOBODY).joins)) }))

export default function DeskReassembled() {
  const [ruleId, setRuleId] = useState<RuleId>('open')
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({})
  const rule = RULES.find((r) => r.id === ruleId)!
  const verdicts = PARTS.map((p) => ({ part: p, ...rule.judge(p, reviewed) }))
  const rank = rankWith(verdicts.filter((v) => v.joins).map((v) => v.part))

  return (
    <div className="x52">
      <p className="x52__lede">
        Lena’s correction (<span className="lab-fixture">invented, from the Problem Desk</span>) arrives in two parts. Throw the
        switch to choose how contributions join the index.
      </p>

      <div className="x52__levers" role="radiogroup" aria-label="Joining rule">
        {RULES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={r.id === ruleId}
            className="x52__lever"
            onClick={() => setRuleId(r.id)}
            data-probe={r.id === 'quote' ? 'click' : undefined}
          >
            <span className="x52__handle" aria-hidden="true" />
            {r.name}
          </button>
        ))}
      </div>

      <div className="x52__yard" data-observe>
        {verdicts.map((v) => (
          <div key={v.part.id} className={'x52__track' + (v.joins ? ' is-through' : ' is-held')}>
            <p className="x52__car">
              <span className="x52__kind">{v.part.grounding === 'mechanism' ? 'mechanism in source' : 'inference only'}</span>“
              {v.part.add}” → <code>{v.part.target}</code>
            </p>
            <p className="x52__switch" aria-hidden="true">
              {v.joins ? '═══╗ through' : '═══╝ siding'}
            </p>
            <p className="x52__dest">
              <strong>{v.joins ? 'Joins the index.' : 'Held on the siding.'}</strong> {v.why}
              {rule.id === 'review' && (
                <>
                  {' '}
                  <button
                    type="button"
                    className="lab-btn"
                    aria-pressed={!!reviewed[v.part.id]}
                    onClick={() => setReviewed((r) => ({ ...r, [v.part.id]: !r[v.part.id] }))}
                  >
                    {reviewed[v.part.id] ? 'Withdraw acceptance' : 'Accept as reviewer'}
                  </button>
                </>
              )}
            </p>
          </div>
        ))}
        <p className="x52__result" role="status">
          Query “{query.query}”: first labelled-relevant source at rank <strong>{BASE_RANK}</strong> →{' '}
          <strong>{rank}</strong>. Who had to act: {rule.actor}
        </p>
        <p className="x52__cost">What this rule implies: {rule.costs}</p>
      </div>

      <table className="x52__table">
        <caption>Every rule at once, with no reviewer present</caption>
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Parts that join</th>
            <th scope="col">Rank</th>
          </tr>
        </thead>
        <tbody>
          {YARD.map((y) => {
            const r = RULES.find((x) => x.id === y.id)!
            return (
              <tr key={y.id} aria-current={y.id === ruleId || undefined}>
                <th scope="row">{y.name}</th>
                <td>{PARTS.filter((p) => r.judge(p, NOBODY).joins).length} of {PARTS.length}</td>
                <td>{y.rank}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
