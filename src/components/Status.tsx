// Labels that keep the epistemic status of a claim visible.
export type StatusKind =
  | 'observation'
  | 'hypothesis'
  | 'implemented'
  | 'not-built'
  | 'paraphrase'
  | 'tested'
  | 'demonstrated'

const LABELS: Record<StatusKind, string> = {
  observation: 'Observation',
  hypothesis: 'Hypothesis',
  implemented: 'Implemented',
  'not-built': 'Not built',
  paraphrase: 'Paraphrase',
  tested: 'Tested',
  demonstrated: 'Demonstrated',
}

export function Status({ kind }: { kind: StatusKind }) {
  return (
    <>
      <span className={`status status--${kind}`}>{LABELS[kind]}</span>{' '}
    </>
  )
}
