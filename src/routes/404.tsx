import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'
import { pageTitle } from '../content/site'

// Prerendered to 404.html, which GitHub Pages serves for unknown paths.
// Unknown paths inside the app render the same component via notFound.
export const Route = createFileRoute('/404')({
  head: () => ({ meta: [{ title: pageTitle('Not found') }, { name: 'robots', content: 'noindex' }] }),
  component: NotFound,
})
