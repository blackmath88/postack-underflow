import type { ReactNode } from 'react'
import { SOURCES, type SourceId } from '../content/sources'

/** Inline reference to a registered source; private sources are named, not linked. */
export function Src({ id, children }: { id: SourceId; children?: ReactNode }) {
  const source = SOURCES[id]
  const label = children ?? source.title
  if ('private' in source && source.private) {
    return (
      <span className="src-private" title="Private repository">
        {label} <span className="src-private__note">(private repository)</span>
      </span>
    )
  }
  return <a href={source.url}>{label}</a>
}
