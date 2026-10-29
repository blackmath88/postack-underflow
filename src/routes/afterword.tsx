import { Link, createFileRoute } from '@tanstack/react-router'
import { Ref } from '../components/Margin'
import { PageIntro } from '../components/PageIntro'
import { pageTitle } from '../content/site'
import { repoFile } from '../content/sources'

export const Route = createFileRoute('/afterword')({
  head: () => ({ meta: [{ title: pageTitle('Afterword') }] }),
  component: Afterword,
})

function Afterword() {
  return (
    <>
      <PageIntro index="∴" kicker="Afterword" title="This essay is one of its own examples">
        <p>
          It began as somebody else’s conversation, grew through conversations with machines, and was challenged
          by its own experiments.
        </p>
      </PageIntro>

      <p className="beat">
        Everything it asks of shared knowledge applies to it. Can you find where an idea came from? Can you see
        what was measured and what was only argued? Can you tell where it was wrong, and who said so?
      </p>

      <h2>What making it changed</h2>
      <ul className="beat">
        <li>
          <strong>The opening flipped.</strong> We set out to show knowledge vanishing into private agent
          sessions. The best example we found was agents contributing in public, because someone asked them to.
        </li>
        <li>
          <strong>The index result became a warning.</strong> The descriptions won, partly with words we wrote
          in.
        </li>
        <li>
          <strong>The meeting point moved.</strong> We expected it to be a better index. Building the desk
          pointed at review.
        </li>
        <li>
          <Ref id="metaphorLimits">
            <strong>The metaphors needed boundaries.</strong>
          </Ref>
        </li>
      </ul>

      <h2>What remains open</h2>
      <p className="beat">
        <Ref id="nextTests">No reader has tried these experiments yet.</Ref> Whether they make the argument
        clearer than a plain table would, whether the index result holds beyond thirty documents, and who would
        do the reviewing are all still open.
      </p>

      <div className="closing">
        <p className="closing__eyebrow">We already solved this.</p>
        <p className="closing__question">
          But can we find it, understand it, challenge it, and leave it better for the next person?
        </p>
      </div>
      <p>
        How this essay was made, including its mistakes, and the essay as a structured record are in{' '}
        <Link to="/archive/history/">the archive</Link>. If you can answer any part of that question better, or
        show that it is the wrong question, the <a href={repoFile('CONTRIBUTING.md')}>contribution guide</a> says
        how.
      </p>
    </>
  )
}
