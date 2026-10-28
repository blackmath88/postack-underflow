import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="page-intro">
      <p className="kicker">404</p>
      <h1>Nobody has solved this one yet.</h1>
      <div className="lede">
        <p>
          The page you asked for does not exist here. <Link to="/">Start from the beginning</Link>{' '}
          or browse the <Link to="/notes/">research notes</Link>.
        </p>
      </div>
    </div>
  )
}
