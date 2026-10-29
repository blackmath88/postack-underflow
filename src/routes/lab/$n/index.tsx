import { createFileRoute, notFound } from '@tanstack/react-router'
import { pageTitle } from '../../../content/site'
import { LabShell } from '../../../lab/LabShell'
import { NotFound } from '../../../components/NotFound'
import { entryFor } from '../../../lab/catalogue'
import { HEADS } from '../../../lab/catalogue/heads'
import { EXPERIMENTS } from '../../../lab/experiments'
import labStylesUrl from '../../../lab/styles/lab.css?url'

export const Route = createFileRoute('/lab/$n/')({
  // The loader and head stay in the main bundle; only HEADS may be used here.
  // The catalogue and the pilots load with the code-split component.
  loader: ({ params }) => {
    if (!HEADS[params.n]) throw notFound()
    return { n: params.n }
  },
  head: ({ params }) => {
    const head = HEADS[params.n]
    return {
      meta: [
        { title: pageTitle(head ? `Lab ${params.n} · ${head.title}` : 'Laboratory') },
        ...(head ? [{ name: 'description', content: head.question }] : []),
      ],
      links: [{ rel: 'stylesheet', href: labStylesUrl }],
    }
  },
  component: Experiment,
})

function Experiment() {
  const { n } = Route.useLoaderData()
  const entry = entryFor(n)
  const Pilot = EXPERIMENTS[n]
  if (!entry || !Pilot) return <NotFound />
  return (
    <LabShell entry={entry}>
      <Pilot />
    </LabShell>
  )
}
