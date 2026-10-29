import { createFileRoute, notFound } from '@tanstack/react-router'
import { pageTitle } from '../../../content/site'
import { LabShell } from '../../../lab/LabShell'
import { entryFor } from '../../../lab/catalogue'
import { EXPERIMENTS } from '../../../lab/experiments'
import labStylesUrl from '../../../lab/styles/lab.css?url'

export const Route = createFileRoute('/lab/$n/')({
  loader: ({ params }) => {
    const entry = entryFor(params.n)
    if (!entry || !EXPERIMENTS[params.n]) throw notFound()
    return { n: entry.n }
  },
  head: ({ params }) => {
    const entry = entryFor(params.n)
    return {
      meta: [
        { title: pageTitle(entry ? `Lab ${entry.n} · ${entry.title}` : 'Laboratory') },
        ...(entry ? [{ name: 'description', content: entry.question }] : []),
      ],
      links: [{ rel: 'stylesheet', href: labStylesUrl }],
    }
  },
  component: Experiment,
})

function Experiment() {
  const { n } = Route.useLoaderData()
  const entry = entryFor(n)!
  const Pilot = EXPERIMENTS[n]!
  return (
    <LabShell entry={entry}>
      <Pilot />
    </LabShell>
  )
}
