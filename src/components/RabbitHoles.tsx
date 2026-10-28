import { Link } from '@tanstack/react-router'

/** The fork in the narrative: two problems, two ways in. */
export function RabbitHoles() {
  return (
    <div className="fork">
      <Link to="/indexing/" className="fork__path fork__path--index">
        <span className="fork__number">01</span>
        <span className="fork__title">Indexing</span>
        <span className="fork__text">
          Finding what is already solved, without sending an agent to rediscover it.
        </span>
      </Link>
      <Link to="/community/" className="fork__path fork__path--community">
        <span className="fork__number">02</span>
        <span className="fork__title">Community</span>
        <span className="fork__text">
          Keeping collective judgement alive outside any single platform or private chat.
        </span>
      </Link>
    </div>
  )
}
