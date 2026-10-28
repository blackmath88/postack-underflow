import { Link } from '@tanstack/react-router'

/** The fork in the narrative: two problems, two ways in. */
export function RabbitHoles() {
  return (
    <div className="fork">
      <Link to="/indexing/" className="fork__path fork__path--index">
        <span className="fork__number">01</span>
        <span className="fork__title">The Impossible Index</span>
        <span className="fork__text">
          Inspect what an index adds to its sources, and watch one helpful description mislead.
        </span>
      </Link>
      <Link to="/community/" className="fork__path fork__path--community">
        <span className="fork__number">02</span>
        <span className="fork__title">The Switchboard</span>
        <span className="fork__text">
          Connect independent contributions, read who claimed each connection, then let the operator
          leave.
        </span>
      </Link>
    </div>
  )
}
