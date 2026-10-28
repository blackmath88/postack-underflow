import { STUDIES, type StudyId } from '../content/artifacts'

/** Credits a Lumpesammlig study and states the principle carried over. */
export function StudyNote({ id }: { id: StudyId }) {
  const study = STUDIES[id]
  return (
    <aside className="study-note" aria-label={`Lineage: ${study.title}`}>
      <p className="kicker">Learned from · Lumpesammlig {study.study}</p>
      <p className="study-note__principle">{study.principle}</p>
      <p className="study-note__applied">{study.appliedIn}</p>
      <p className="study-note__links">
        <a href={study.liveUrl}>Open {study.title}</a> ·{' '}
        <a href={`${study.sourceRepo}/blob/${study.revision}/${study.sourcePath}`}>study notes</a>{' '}
        <span className="study-note__rev">
          at {study.revision.slice(0, 7)}
        </span>
      </p>
    </aside>
  )
}
