import { Link } from '@tanstack/react-router'

const NAV = [
  { to: '/indexing/', label: 'Indexing' },
  { to: '/community/', label: 'Community' },
  { to: '/convergence/', label: 'Convergence' },
  { to: '/notes/', label: 'Notes' },
  { to: '/about/', label: 'About' },
] as const

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link to="/" className="wordmark" activeOptions={{ exact: true }}>
          Postack Underflow
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-list">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
