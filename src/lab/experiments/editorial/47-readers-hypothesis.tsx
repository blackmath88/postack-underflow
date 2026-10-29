import { useState } from 'react'
import results from '../../../../results/four-words-v1.json'
import queries from '../../../../corpus/queries.json'

// 47 · The Reader's Hypothesis. Four questions whose answers are in the frozen
// Four Words v1 results. You set a guess, seal it, and only then see the
// outcome beside it on the same scale. A sealed guess cannot be moved. Every
// answer is read from results/four-words-v1.json; nothing is stored or sent.

const per = (system: string, q: string) => results.perQuery.find((p) => p.system === system && p.query === q)!
const text = (q: string) => queries.queries.find((x) => x.id === q)!.query

const s = results.summary
const keptShare = Math.round(
  ((s['structured-without-aliases-symptoms'].mrrAt10 - s.baseline.mrrAt10) / (s.structured.mrrAt10 - s.baseline.mrrAt10)) * 100,
)

interface Round {
  ask: string
  min: number
  max: number
  start: number
  unit: (n: number) => string
  answer: number
  told: string
}

const ROUNDS: Round[] = [
  {
    ask: `Of the ${results.queries} queries, on how many did the description index put a right answer higher than plain search did?`,
    min: 0,
    max: results.queries,
    start: Math.round(results.queries / 2),
    unit: (n) => `${n} of ${results.queries}`,
    answer: results.paired.structuredBetter,
    told: `It was better on ${results.paired.structuredBetter}, worse on ${results.paired.baselineBetter} and tied on ${results.paired.tied}. The headline win is mostly ties.`,
  },
  {
    ask: `For “${text('q03')}”, at what rank did plain search first show a right answer?`,
    min: 1,
    max: 20,
    start: 3,
    unit: (n) => `rank ${n}`,
    answer: per('baseline', 'q03').firstRelevantRank,
    told: `Rank ${per('baseline', 'q03').firstRelevantRank}; the descriptions had one at rank ${per('structured', 'q03').firstRelevantRank}. The word “blank” is in a description, not in the source it describes.`,
  },
  {
    ask: `For the opening’s own four words, “${text('q01')}”, at what rank did the description index first show a right answer?`,
    min: 1,
    max: 20,
    start: 1,
    unit: (n) => `rank ${n}`,
    answer: per('structured', 'q01').firstRelevantRank,
    told: `Rank ${per('structured', 'q01').firstRelevantRank}, while plain search had one at rank ${per('baseline', 'q01').firstRelevantRank}. It is the one query the descriptions lost, and partly a labelling error.`,
  },
  {
    ask: 'Take the alternative phrasings and symptoms out of every description. How much of the advantage over plain search (in MRR@10) survives?',
    min: 0,
    max: 100,
    start: 50,
    unit: (n) => `${n}%`,
    answer: keptShare,
    told: `About ${keptShare}%: MRR@10 falls from ${s.structured.mrrAt10.toFixed(3)} to ${s['structured-without-aliases-symptoms'].mrrAt10.toFixed(3)}, against ${s.baseline.mrrAt10.toFixed(3)} for plain search.`,
  },
]

export default function ReadersHypothesis() {
  const [ix, setIx] = useState(0)
  const [guesses, setGuesses] = useState<number[]>(ROUNDS.map((r) => r.start))
  const [sealed, setSealed] = useState<boolean[]>(ROUNDS.map(() => false))
  const round = ROUNDS[ix]!
  const guess = guesses[ix]!
  const isSealed = sealed[ix]!
  const pos = (n: number) => `${((n - round.min) / (round.max - round.min)) * 100}%`
  const id = `x47-guess-${ix}`

  const set = (n: number) => setGuesses((g) => g.map((x, i) => (i === ix ? n : x)))
  const seal = () => setSealed((s) => s.map((x, i) => (i === ix ? true : x)))

  const doneRounds = ROUNDS.map((r, i) => ({ r, i })).filter(({ i }) => sealed[i])

  return (
    <div className="x47">
      <ol className="x47__rounds" aria-label="Questions">
        {ROUNDS.map((_, i) => (
          <li key={i}>
            <button type="button" aria-current={i === ix ? 'step' : undefined} onClick={() => setIx(i)}>
              {i + 1}
              <span className="visually-hidden">{sealed[i] ? ', sealed' : ', open'}</span>
              {sealed[i] ? <span aria-hidden="true"> ✓</span> : null}
            </button>
          </li>
        ))}
      </ol>

      <div className="x47__card">
        <label htmlFor={id} className="x47__ask">
          {round.ask}
        </label>
        <div className="x47__scale">
          <input
            id={id}
            type="range"
            min={round.min}
            max={round.max}
            value={guess}
            disabled={isSealed}
            onChange={(e) => set(Number(e.target.value))}
            aria-valuetext={round.unit(guess)}
          />
          <div className="x47__line" aria-hidden="true">
            <span className="x47__tick x47__tick--guess" style={{ left: pos(guess) }}>
              you
            </span>
            {isSealed && (
              <span className="x47__tick x47__tick--answer" style={{ left: pos(round.answer) }}>
                v1
              </span>
            )}
          </div>
          <p className="x47__ends" aria-hidden="true">
            <span>{round.unit(round.min)}</span>
            <span>{round.unit(round.max)}</span>
          </p>
        </div>

        <button type="button" className="lab-btn" onClick={seal} aria-disabled={isSealed} data-probe="click">
          {isSealed ? 'Sealed' : `Seal my guess: ${round.unit(guess)}`}
        </button>

        <div className="x47__envelope" role="status" data-observe>
          {isSealed ? (
            <>
              <p className="x47__reveal">
                You guessed <strong>{round.unit(guess)}</strong>. The frozen run says <strong>{round.unit(round.answer)}</strong>
                {guess === round.answer ? ', exactly.' : `, ${Math.abs(guess - round.answer)} away.`}
              </p>
              <p>{round.told}</p>
              {ix < ROUNDS.length - 1 && (
                <button type="button" className="lab-btn" onClick={() => setIx(ix + 1)}>
                  Next question
                </button>
              )}
            </>
          ) : (
            <p className="x47__closed">The answer stays sealed until your guess is.</p>
          )}
        </div>
      </div>

      {doneRounds.length > 1 && (
        <div className="x47__record">
          <p>Your sealed guesses, in this tab only:</p>
          <ul>
            {doneRounds.map(({ r, i }) => (
              <li key={i}>
                {i + 1}. you {r.unit(guesses[i]!)}, v1 {r.unit(r.answer)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
