import { createFileRoute } from '@tanstack/react-router'
import { pageTitle } from '../../content/site'
import { CommonsHome } from '../../commons/ui/CommonsHome'
import commonsStylesUrl from '../../commons/commons.css?url'

export const Route = createFileRoute('/commons/')({
  head: () => ({
    meta: [
      { title: pageTitle('Photo Frame Commons') },
      { name: 'description', content: 'A source-grounded index of one public repository’s problems, with its contributions, connections and corrections.' },
    ],
    links: [{ rel: 'stylesheet', href: commonsStylesUrl }],
  }),
  component: CommonsHome,
})
