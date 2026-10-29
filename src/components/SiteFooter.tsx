import { Link } from '@tanstack/react-router'
import { REPO_URL, SOURCES } from '../content/sources'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          Postack Underflow is an open research prototype. Inspired by a conversation on{' '}
          <a href={SOURCES.syntax1050.url}>Syntax #1050</a>; not affiliated with or endorsed by its
          hosts.
        </p>
        <p>
          <a href={REPO_URL}>Source on GitHub</a> · <Link to="/notes/">Sources and provenance</Link>{' '}
          · <Link to="/about/">About</Link> · <Link to="/commons/">Photo Frame Commons</Link> · <Link to="/lab/">The Laboratory</Link>
        </p>
      </div>
    </footer>
  )
}
