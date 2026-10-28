import { ARTIFACTS, type ArtifactId } from '../content/artifacts'

/**
 * Reserved location for a Lumpesammlig study. While the study is in
 * development it renders the editorial fallback; the integrated island will be
 * mounted inside `.artifact-slot__stage` (see docs/ARTIFACT-INTEGRATION.md).
 */
export function ArtifactSlot({ id }: { id: ArtifactId }) {
  const artifact = ARTIFACTS[id]
  const headingId = `artifact-${artifact.id}`
  return (
    <section
      className="artifact-slot"
      aria-labelledby={headingId}
      data-artifact={artifact.id}
      data-artifact-status={artifact.status}
    >
      <header className="artifact-slot__header">
        <p className="kicker">Interactive study · {artifact.study}</p>
        <h2 id={headingId}>{artifact.title}</h2>
        <p className="artifact-slot__promise">{artifact.promise}</p>
      </header>
      <div className="artifact-slot__stage">
        <p className="artifact-slot__notice" role="note">
          <strong>Not available yet.</strong> This study is being developed separately in
          Lumpesammlig. Until it is integrated, here is the idea in words.
        </p>
        <p className="artifact-slot__fallback">{artifact.fallback}</p>
      </div>
      <footer className="artifact-slot__meta">
        <a href={artifact.sourceRef}>Development pull request</a>
        <span>
          Inspected revision <code>{artifact.inspectedRevision.slice(0, 7)}</code>
        </span>
      </footer>
    </section>
  )
}
