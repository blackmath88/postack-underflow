import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFound } from './components/NotFound'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    // GitHub Pages redirects /indexing to /indexing/ because each route is a
    // folder with an index.html. Generate the canonical form directly.
    trailingSlash: 'always',
    defaultNotFoundComponent: NotFound,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
