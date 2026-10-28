// Labels that keep the epistemic status of a claim visible.
export type StatusKind = 'observation' | 'hypothesis' | 'implemented' | 'not-built' | 'paraphrase'

const LABELS: Record<StatusKind, string> = {
  observation: 'Observation',
  hypothesis: 'Hypothesis',
  implemented: 'Implemented',
  'not-built': 'Not built',
  paraphrase: 'Paraphrase',
}

export function Status({ kind }: { kind: StatusKind }) {
  return <span className={`status status--${kind}`}>{LABELS[kind]}</span>
}
