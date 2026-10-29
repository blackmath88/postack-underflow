import { Link } from '@tanstack/react-router'
import { repoFile } from '../../content/sources'
import { STATUS_LABEL, type Status } from '../model'
import { META, PROBLEMS, VIEW } from './data'
import { AtCard } from './Elsewhere'
import { Find } from './Find'
import { CommonsBand, Journey } from './Shell'

const DRAWERS: Array<{ label: string; statuses: Status[] }> = [
  { label: 'Unsolved, or no reviewed route', statuses: ['unsolved', 'no-reviewed-route', 'partly-solved'] },
  { label: 'Documented', statuses: ['documented', 'in-review'] },
  { label: 'Fixed in code, or declined', statuses: ['fixed-in-code', 'declined'] },
]

export function CommonsHome() {
  const base = import.meta.env.BASE_URL
  return (
    <div className="pfc">
      <CommonsBand />
      <header className="pfc-home-head">
        <h1>
          One repository’s problems, <em>made findable without moving them</em>.
        </h1>
        <p className="pfc-lede">
          People taking over cheap photo frames have left 263 conversations in one GitHub repository, plus a maintainer’s
          careful tables. This instrument indexes the problems in them, shows the evidence in the authors’ own words,
          connects contributions with the reason for each connection, and lets you preview how a correction would change the
          record. Nothing here replaces the source. Everything links back to it.
        </p>
      </header>
      <Journey active="find" />
      <Find />

      <section className="pfc-drawers" aria-labelledby="drawers-title">
        <h2 id="drawers-title">Or open a drawer</h2>
        <p className="pfc-hint">
          {PROBLEMS.length} problems, chosen by the record writer from 57 issues and 206 pull requests. Not every thread
          is here, and the PF1007L ones are already indexed by hand in the repository’s own{' '}
          <a href={`https://github.com/${META.repository}/blob/${META.revision}/docs/pf1007l-start-here.md#u-boot-settings-that-fixed-ums-problems`}>
            symptom table
          </a>
          , which nine of these records draw on.
        </p>
        <div className="pfc-drawer-row">
          {DRAWERS.map((d) => (
            <div key={d.label} className="pfc-drawer">
              <h3>{d.label}</h3>
              <ul>
                {PROBLEMS.filter((p) => d.statuses.includes(p.status)).map((p) => (
                  <li key={p.id}>
                    <Link to="/commons/$problem/" params={{ problem: p.id }}>{p.title}</Link>
                    <span className="pfc-drawer__meta">
                      <span className={`pfc-stamp pfc-stamp--${p.status}`}>{STATUS_LABEL[p.status]}</span> {p.evidence.length} sources
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="pfc-elsewhere" aria-labelledby="home-elsewhere">
        <h2 id="home-elsewhere">About the whole repository, elsewhere</h2>
        <p className="pfc-hint">
          Public ATProto posts that link the repository but no particular problem. Five posts link anything here at all.
        </p>
        <div className="pfc-elsewhere__grid">
          {VIEW.elsewhere.repository.map((e) => <AtCard key={e.record.uri} e={e} />)}
        </div>
      </section>

      <section className="pfc-how" aria-labelledby="how-title">
        <h2 id="how-title">How this was built, and what it shows</h2>
        <ul>
          <li><a href={repoFile('docs/research/COMMONS-CORPUS.md')}>The corpus</a>: a pinned, read-only snapshot, with what it left out.</li>
          <li><a href={repoFile('docs/research/COMMONS-INDEX.md')}>The index</a>: records, quotes checked word for word, and why there is no benchmark.</li>
          <li><a href={repoFile('docs/research/COMMONS-BRAINSTORM.md')}>The br-ai-nstorm adaptation</a>, and <a href={`${base}commons/brainstorm.html`}>br-ai-nstorm’s own Level-1 view</a> of the same events.</li>
          <li><a href={repoFile('docs/research/COMMONS-ATPROTO.md')}>The ATProto layer</a>: what exists on the network, and what does not.</li>
          <li><a href={repoFile('docs/research/COMMONS-REFLECTION.md')}>What the real repository taught us</a>.</li>
        </ul>
      </section>
    </div>
  )
}
