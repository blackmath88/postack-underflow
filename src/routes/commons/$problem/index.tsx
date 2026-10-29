import { createFileRoute, notFound } from '@tanstack/react-router'
import { pageTitle } from '../../../content/site'
import { NotFound } from '../../../components/NotFound'
import { ProblemView } from '../../../commons/ui/ProblemView'
import { problemById } from '../../../commons/ui/data'
import HEADS from '../../../data/commons-heads.json'
import commonsStylesUrl from '../../../commons/commons.css?url'

const heads = HEADS as Record<string, { title: string; status: string }>

export const Route = createFileRoute('/commons/$problem/')({
  // The loader and head stay in the main bundle; only HEADS may be used here.
  loader: ({ params }) => {
    if (!heads[params.problem]) throw notFound()
    return { id: params.problem }
  },
  head: ({ params }) => {
    const head = heads[params.problem]
    return {
      meta: [
        { title: pageTitle(head ? `${head.title} · Photo Frame Commons` : 'Photo Frame Commons') },
        ...(head ? [{ name: 'description', content: `${head.status}. A problem from wesbos/photo-frame-dashboard, with its sources, connections and corrections.` }] : []),
      ],
      links: [{ rel: 'stylesheet', href: commonsStylesUrl }],
    }
  },
  component: Problem,
})

function Problem() {
  const { id } = Route.useLoaderData()
  const problem = problemById(id)
  if (!problem) return <NotFound />
  return <ProblemView problem={problem} />
}
