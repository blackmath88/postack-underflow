import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Src } from '../components/Src'
import { repoFile, type SourceId } from './sources'
import { PHOTO_FRAME } from '../data/photo-frame'

// Margin notes: the second level of the essay. Each note answers one question
// a reader might have at one passage, says how far its claims are checked, and
// can lead on into the archive. Notes are written once, here, and referenced by
// id from the page (<Ref id>) and from the archive index, so a historical
// observation is never restated in two places. A later companion (Motte) can
// read the same notes through `summary` and `evidence`.
//
// Bodies render inside a paragraph, so they may contain phrasing content only:
// text, links, code, emphasis and <P> for a paragraph break.

export type NoteKind = 'history' | 'source' | 'mechanism' | 'counterpoint' | 'research' | 'connection'
export type NoteEvidence = 'checked' | 'reported' | 'reading' | 'measured' | 'fixture'
export type Chapter = 'opening' | 'indexing' | 'community' | 'convergence' | 'afterword'
export type ArchiveRoute = '/archive/' | '/archive/four-words/' | '/archive/community/' | '/archive/history/'

export interface MarginNote {
  /** The question the note answers. */
  title: string
  kind: NoteKind
  chapter: Chapter
  evidence: NoteEvidence
  /** One plain sentence, reused by the archive index. */
  summary: string
  body: ReactNode
  sources?: SourceId[]
  archive?: { label: string; to: ArchiveRoute; hash?: string } | { label: string; href: string }
}

export const KIND_LABEL: Record<NoteKind, string> = {
  history: 'History',
  source: 'From the source',
  mechanism: 'How it works',
  counterpoint: 'Counterpoint',
  research: 'From the research',
  connection: 'Connection',
}

export const EVIDENCE_LABEL: Record<NoteEvidence, string> = {
  checked: 'Checked against the linked source',
  reported: 'Reported in research compiled for this project; not independently verified',
  reading: 'Our reading, not a measured finding',
  measured: 'From the frozen Four Words v1 run',
  fixture: 'About invented fixtures, not real people',
}

export const CHAPTER_ROUTE: Record<Chapter, string> = {
  opening: '/',
  indexing: '/indexing/',
  community: '/community/',
  convergence: '/convergence/',
  afterword: '/afterword/',
}

export const CHAPTER_LABEL: Record<Chapter, string> = {
  opening: 'The story',
  indexing: 'The Impossible Index',
  community: 'The Switchboard',
  convergence: 'The Problem Desk',
  afterword: 'Afterword',
}

/** A paragraph break inside a note. */
export function P({ children }: { children: ReactNode }) {
  return <span className="mnote__p">{children}</span>
}

const c = PHOTO_FRAME.counts

const notes = {
  // ---------- The story ----------
  episode: {
    title: 'Where does this story come from?',
    kind: 'source',
    chapter: 'opening',
    evidence: 'checked',
    summary: 'Wes Bos describes getting into his photo frame on Syntax episode #1050; this is our paraphrase.',
    body: (
      <>
        <P>
          From <Src id="syntax1050">Syntax episode #1050</Src>. Wes Bos says that for months the AI models he
          asked told him it could not be done, and that progress came when he suggested treating the frame as
          an Android device and trying button combinations.
        </P>
        <P>Our paraphrase of a spoken conversation; read the transcript for his words.</P>
      </>
    ),
    sources: ['syntax1050'],
  },
  frameRepo: {
    title: 'What is in the repository?',
    kind: 'source',
    chapter: 'opening',
    evidence: 'checked',
    summary: 'Notes and scripts for identifying a frame’s board, getting debug access, backing up, rooting and replacing the vendor app.',
    body: (
      <>
        <P>
          <Src id="photoFrame">photo-frame-dashboard</Src> holds notes and scripts: how to identify the board,
          get debug access, back up the firmware, root it, replace the vendor app and run your own dashboard
          full screen.
        </P>
        <P>
          The episode does not name the repository. Identifying it is our inference from its owner, subject,
          date and numbers.
        </P>
      </>
    ),
    sources: ['photoFrame'],
    archive: { label: 'The case file', href: repoFile('docs/research/CASE-PHOTO-FRAME.md') },
  },
  frameCounts: {
    title: 'How many people joined in?',
    kind: 'research',
    chapter: 'opening',
    evidence: 'checked',
    summary: `On ${PHOTO_FRAME.observedAt.slice(0, 10)} the repository had ${c.pullRequests} pull requests, ${c.merged} of them merged.`,
    body: (
      <>
        <P>
          Counted on GitHub on {PHOTO_FRAME.observedAt.slice(0, 10)}: {c.pullRequests} pull requests ({c.merged}{' '}
          merged, {c.open} open, {c.closedUnmerged} closed unmerged) and {c.issues} issues, {c.issuesClosed}{' '}
          closed. {PHOTO_FRAME.beforeEpisode.pullRequests} of those pull requests were opened before the episode
          aired.
        </P>
        <P>
          In the episode Wes puts it at over 200 pull requests or issues from other people’s agents.
        </P>
      </>
    ),
    sources: ['photoFrame', 'syntax1050'],
    archive: { label: 'The full count', to: '/archive/', hash: 'photo-frame' },
  },
  forAgents: {
    title: 'What does it ask of the agents?',
    kind: 'source',
    chapter: 'opening',
    evidence: 'checked',
    summary: 'The repository addresses agents directly, with rules learned the hard way and a route for sending findings back.',
    body: (
      <>
        <P>
          Its opening tells readers to point an agent at it. A section headed “For agents: start here” lists
          rules: ask before every write, take a verified backup first, stop at the first mismatch, keep
          observations apart from guesses.
        </P>
        <P>
          It asks contributors to check what is already open, strip private data, and show the frame’s owner
          the diff. Of the {PHOTO_FRAME.agentMentionSample.of} most recent pull requests,{' '}
          {PHOTO_FRAME.agentMentionSample.mentioning} name an AI tool in their description: a crude keyword
          scan, not proof of who wrote what.
        </P>
      </>
    ),
    sources: ['photoFrame'],
  },
  cjWorry: {
    title: 'What exactly was the worry?',
    kind: 'source',
    chapter: 'opening',
    evidence: 'checked',
    summary: 'CJ asks what happens to shared problem-solving knowledge when developers ask agents instead of each other; the hosts push back.',
    body: (
      <>
        <P>
          Near the end of the episode, roughly 55 minutes in, CJ asks what happens to shared problem-solving
          knowledge when developers ask agents rather than each other. Each agent reaches a fix; the next one
          does the same work again. He suggests the main party learning from the repetition is whoever trains
          the models.
        </P>
        <P>
          The hosts push back: shared building blocks in community spaces, Stack Overflow’s own agents, Wes’s
          repository of agents’ pull requests. CJ answers that much code is closed source.
        </P>
        <P>Our paraphrase. Not affiliated with or endorsed by the show.</P>
      </>
    ),
    sources: ['syntax1050'],
  },
  googleSo: {
    title: 'Why could a search engine find Stack Overflow answers so well?',
    kind: 'mechanism',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'Question titles in the asker’s words, pasted error messages, links between pages and visible votes made solved problems findable.',
    body: (
      <>
        <P>
          Several things lined up. Questions were titled in the words of someone who had the problem, often
          with the exact error message pasted in, which is what the next person types. Other pages linked to
          good answers, and <Src id="googleRanking">Google says</Src> links from prominent sites count as a
          quality signal.
        </P>
        <P>
          On the page itself, <Src id="soTour">votes, an accepted answer and edits</Src> sorted the replies, and
          duplicates were closed into one thread, so the search result and the best answer tended to be the
          same page.
        </P>
      </>
    ),
    sources: ['googleRanking', 'soTour'],
    archive: { label: 'Signals and their costs', to: '/archive/community/', hash: 'signals' },
  },
  ownExample: {
    title: 'Did this happen while building the site?',
    kind: 'research',
    chapter: 'opening',
    evidence: 'checked',
    summary: 'A sibling project’s deploy came up unstyled, and this site’s first deploy never happened because its pull requests were stacked.',
    body: (
      <>
        <P>
          Twice. A sibling project’s GitHub Pages deployment was reported by its owner to come up largely
          unstyled despite a green workflow (
          <a href="https://github.com/blackmath88/lumpesammlig/commit/a146191a2396ca728e2eca189472c3f9bb0ceacf">
            its repair commit
          </a>
          ). This site’s first deployment never happened because its{' '}
          <a href="https://github.com/blackmath88/postack-underflow/pull/3">pull requests were stacked</a> and
          none reached the main branch.
        </P>
        <P>Small, well-documented kinds of problem, worked out again.</P>
      </>
    ),
  },
  sameCode: {
    title: 'What does a found answer carry that a reconstructed one does not?',
    kind: 'mechanism',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'A retrieved answer arrives with other people’s checking attached; a reconstructed one has not been looked at by anyone else.',
    body: (
      <>
        <P>
          A history of other people checking it: who wrote it, under which versions, who disagreed, what was
          corrected. A reconstructed answer may cite the documentation it read, but nobody else has looked at
          it yet.
        </P>
      </>
    ),
  },
  notNostalgia: {
    title: 'Was the old way really better?',
    kind: 'counterpoint',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'Public answers went stale and some questions were never asked; reconstruction is often the right call.',
    body: (
      <>
        <P>
          Not simply. Public answers went stale, duplicates were closed with a curt link, and some questions
          were never asked for fear of how they would be received.
        </P>
        <P>
          Reconstruction is often right: when the context is private, when the old answer is wrong, when
          nothing was ever written down. The photo-frame repository shows agents leaving better notes than many
          of us did.
        </P>
      </>
    ),
  },
  findingFrame: {
    title: 'Why would finding be hard in a repository this good?',
    kind: 'mechanism',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'The photo-frame notes are organised by device and by phase, which suits someone who already knows their board.',
    body: (
      <>
        <P>
          The notes are organised by device and by phase: identify, get access, back up, root. That suits
          someone who already knows which board they have.
        </P>
        <P>
          Someone who only knows that their frame went blank after an update (our example, not a case from the
          repository) has to find their own way in. Whether they can depends on descriptions somebody wrote in
          advance.
        </P>
      </>
    ),
    sources: ['photoFrame'],
  },
  keepingCost: {
    title: 'What does keeping cost?',
    kind: 'research',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'Notes stay alive because people keep checking them and one person keeps reading and merging what arrives.',
    body: (
      <>
        <P>
          Each merge is somebody reading a stranger’s notes about a board they may not own, deciding whether to
          trust them, and taking responsibility for publishing them. In the photo-frame repository one person
          does that. If they stop, the notes stay readable, but nobody checks the next contribution.
        </P>
      </>
    ),
    sources: ['photoFrame'],
  },
  eachThroughOther: {
    title: 'Why treat them together?',
    kind: 'counterpoint',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'A fast index of unreviewed answers spreads mistakes; a thoughtful community nobody can find gets rediscovered from scratch.',
    body: (
      <>
        <P>
          A hypothesis, not a finding. A fast index of unreviewed answers spreads mistakes efficiently. A
          thoughtful community nobody can find gets rediscovered from scratch. Each problem shows up the
          weakness of solving the other alone.
        </P>
      </>
    ),
    archive: { label: 'The essay’s hypotheses', to: '/archive/history/', hash: 'record' },
  },
  otherProblems: {
    title: 'What other problems are there?',
    kind: 'counterpoint',
    chapter: 'opening',
    evidence: 'reading',
    summary: 'Whether a fix applies, is verified, was documented, was worth writing down, and is maintained can each lose an answer.',
    body: (
      <>
        <P>
          Whether a fix <em>applies</em> to your version, whether anyone has <em>verified</em> it, whether it was{' '}
          <em>documented</em> at all, what <em>incentive</em> anyone had to write it down, and who{' '}
          <em>maintains</em> it when the platform changes: each can lose an answer on its own.
        </P>
        <P>This essay follows two of them because they can be made into experiments you can try.</P>
      </>
    ),
  },

  // ---------- The Impossible Index ----------
  frozenIndex: {
    title: 'What is this small index?',
    kind: 'research',
    chapter: 'indexing',
    evidence: 'measured',
    summary: 'Thirty public documents about one deployment problem, each described once by an AI agent and then frozen.',
    body: (
      <>
        <P>
          Thirty public documents about one problem area, publishing a site to a GitHub Pages subpath: build
          tool and framework docs, hosting docs, READMEs and four bug reports, each pinned to a version.
        </P>
        <P>
          An AI agent wrote one description per document. Then everything was frozen, so nothing here can be
          tuned after the fact.
        </P>
      </>
    ),
    archive: { label: 'Corpus and method', to: '/archive/four-words/', hash: 'method' },
  },
  whatIndexAdds: {
    title: 'What does an index add to its sources?',
    kind: 'mechanism',
    chapter: 'indexing',
    evidence: 'reading',
    summary: 'A plain statement of the problem, other phrasings, reported symptoms and headings: interpretations the source never said.',
    body: (
      <>
        <P>
          A plain statement of the problem, the other ways people phrase it, the symptoms they report, the
          headings it is filed under. Those additions make a four-word query land. They are also
          interpretations that the source never said.
        </P>
        <P>
          Information retrieval has long done this. One well-known version, <Src id="doc2query">doc2query</Src>,
          predicts the queries a document might answer and indexes them alongside it.
        </P>
      </>
    ),
    sources: ['doc2query'],
  },
  rawVsAuthored: {
    title: 'Which part did somebody write?',
    kind: 'mechanism',
    chapter: 'indexing',
    evidence: 'reading',
    summary: 'The source layer is what a document says; everything in the index layer was written by someone who read it.',
    body: (
      <>
        <P>
          Each panel shows two layers. <em>Source</em> is what the bug report says, with line numbers.{' '}
          <em>Index</em> is the description written for it: its problem statement, phrasings, symptoms and
          headings. Flagged entries are words the record writer added that the report never uses.
        </P>
      </>
    ),
  },
  controlledVocab: {
    title: 'Why would a shared heading cause trouble?',
    kind: 'history',
    chapter: 'indexing',
    evidence: 'measured',
    summary: 'Both records were given the controlled term asset-404, although one of the reports never mentions a 404.',
    body: (
      <>
        <P>
          Libraries call it controlled vocabulary: an agreed heading, so that everything about one subject sits
          together. Our record writer gave both reports the same heading, <code>asset-404</code>.
        </P>
        <P>
          One report never says 404. It describes a JavaScript file blocked because the server returned a web
          page. The heading made them neighbours.
        </P>
      </>
    ),
  },
  cardCatalogue: {
    title: 'Has anyone faced this before?',
    kind: 'history',
    chapter: 'indexing',
    evidence: 'reported',
    summary: 'Library catalogues were classification done before anyone asked, including provisional placements and long-contested headings.',
    body: (
      <>
        <P>
          The library card catalogue. Somebody had already decided where each book belonged, which headings led
          to it, and which neighbouring headings to point to. That labour shaped which books you could find.
        </P>
        <P>
          The research behind this project describes catalogues that distinguished provisional placements from
          accepted ones, and headings contested for years. Reported in <Src id="pr5">PR #5</Src>, not
          independently verified. The point does not depend on the details: classification is prior work, and
          it can be wrong.
        </P>
      </>
    ),
    sources: ['pr5'],
  },
  githubAtlas: {
    title: 'Where did this idea start?',
    kind: 'connection',
    chapter: 'indexing',
    evidence: 'checked',
    summary: 'GitHub Atlas maps repositories; Postack asks what changes if the unit on the map is the problem solved.',
    body: (
      <>
        <P>
          <Src id="githubAtlas">GitHub Atlas</Src>, an earlier project, maps repositories, topics and ecosystem
          health. Code hosts file everything by where it lives: repository, folder, file, issue. A stranger
          rarely asks for a repository. They ask whether someone has already dealt with this.
        </P>
      </>
    ),
    sources: ['githubAtlas'],
  },
  ranking: {
    title: 'How does the ranking work?',
    kind: 'mechanism',
    chapter: 'indexing',
    evidence: 'measured',
    summary: 'A transparent keyword ranking (BM25F) over the description fields, computed in your browser, with every match explained.',
    body: (
      <>
        <P>
          Nothing clever: a standard keyword ranking, <Src id="bm25f">BM25F</Src>, over the fields of each
          description, with the problem statement weighted most. It runs in your browser. No model is involved
          and no request leaves the page.
        </P>
      </>
    ),
    sources: ['bm25f'],
    archive: { label: 'Weights and method', to: '/archive/four-words/', hash: 'method' },
  },
  result: {
    title: 'What exactly was measured?',
    kind: 'research',
    chapter: 'indexing',
    evidence: 'measured',
    summary: 'One run, 27 short queries labelled in advance: a right answer first 25 times with descriptions, 17 with plain search.',
    body: (
      <>
        <P>
          The same 30 documents were searched two ways: as raw text, and through the written descriptions. We
          wrote 27 short queries and decided the right answers before any description existed.
        </P>
        <P>
          It is one run, on one narrow topic, with queries and labels written by the same project. It does not
          show that this works in general.
        </P>
      </>
    ),
    archive: { label: 'Full results and caveats', to: '/archive/four-words/', hash: 'results' },
  },
  injected: {
    title: 'Which words did the writer add?',
    kind: 'research',
    chapter: 'indexing',
    evidence: 'measured',
    summary: 'In six of the ten queries the descriptions won, the winning record matched a word its source never uses, such as “blank”.',
    body: (
      <>
        <P>
          The descriptions ranked a right answer higher on 10 queries and lower on 1. In six of those ten wins,
          plus one tokenizer artefact, the winning record matched a query word that never appears in its
          source: <code>blank</code>, <code>underscore</code>,{' '}
          <code>refresh</code>, <code>found</code>, <code>large</code>, <code>shows</code>.
        </P>
        <P>
          That is what editorial work should add: the words people use. One record also describes a “blank
          page” its source never mentions.
        </P>
      </>
    ),
    archive: { label: 'The post-hoc audit', to: '/archive/four-words/', hash: 'reading' },
  },

  // ---------- The Switchboard ----------
  soMechanisms: {
    title: 'How did a Q&A site turn answers into judgement?',
    kind: 'history',
    chapter: 'community',
    evidence: 'reading',
    summary: 'Votes, accepted answers, comments, edits, reputation and duplicate-closing each did one thing imperfectly.',
    body: (
      <>
        <P>
          Stack Overflow, <Src id="soTour">by its own description</Src>, gave each problem one question, let
          people vote answers up and down, let the asker accept one, and let anyone with enough reputation edit.
          Comments caught edge cases; duplicates were closed into one thread.
        </P>
        <P>
          Each had a cost. Votes rewarded early answers, an accepted answer froze one person’s context, edits
          blurred authorship, moderation could feel unwelcoming. None proves an answer true. Together they made
          disagreement visible, attached to the answer.
        </P>
      </>
    ),
    sources: ['soTour'],
    archive: { label: 'Signals and their costs', to: '/archive/community/', hash: 'signals' },
  },
  illustration: {
    title: 'Is this a real thread?',
    kind: 'source',
    chapter: 'community',
    evidence: 'fixture',
    summary: 'The four-step answer is an illustration of a common pattern, not a quoted thread.',
    body: (
      <>
        <P>
          No. It is an illustration of a pattern anyone who has used a Q&amp;A site will recognise, not a
          quotation. The versions and wording are ours.
        </P>
      </>
    ),
  },
  frameMaintainer: {
    title: 'Who does that work in the photo-frame repository?',
    kind: 'research',
    chapter: 'community',
    evidence: 'checked',
    summary: `One maintainer reads and merges strangers’ notes: ${c.merged} of ${c.pullRequests} pull requests merged when counted.`,
    body: (
      <>
        <P>
          When we counted, strangers and their agents had opened {c.pullRequests} pull requests: {c.merged}{' '}
          merged, {c.open} waiting, {c.closedUnmerged} closed without merging.
        </P>
        <P>
          The repository’s instructions are a community’s rulebook: check what is open first, keep
          observations apart from guesses, strip private data. One person enforces it.
        </P>
      </>
    ),
    sources: ['photoFrame'],
  },
  whereJudgement: {
    title: 'Where does that judgement happen now?',
    kind: 'counterpoint',
    chapter: 'community',
    evidence: 'reading',
    summary: 'Much problem solving now happens in private chats or agent runs; a pull request is a fix, not a findable question.',
    body: (
      <>
        <P>
          Our reading, not a measurement: much problem solving now happens in a private chat with a model, or
          an agent run that leaves a diff. Some of it surfaces as issues and pull requests.
        </P>
        <P>
          But a pull request is a fix, not a question others can find by its symptom, and nobody votes on it
          or adds the comment saying it breaks on Windows.
        </P>
      </>
    ),
  },
  onePlatform: {
    title: 'Why not just rebuild one big site?',
    kind: 'counterpoint',
    chapter: 'community',
    evidence: 'reading',
    summary: 'Platforms change hands, change rules and shut down, and a community’s memory goes with them.',
    body: (
      <>
        <P>
          It might work; one site gave a whole profession a shared place to look. But platforms change hands,
          change rules and shut down, and a community’s memory goes with them. The question here is whether a
          community can exist without living in one place.
        </P>
      </>
    ),
  },
  twoLayers: {
    title: 'What would that look like?',
    kind: 'mechanism',
    chapter: 'community',
    evidence: 'reading',
    summary: 'Contributions belong to their authors; the lines an interface draws between them are separate, attributed claims.',
    body: (
      <>
        <P>
          Two layers. <em>Contributions</em>, such as an article, a reply or a correction, are published by
          their authors, where the authors control them, and can name what they respond to.
        </P>
        <P>
          <em>Connections</em> are the lines an interface draws between them to show a thread or a map. Some
          come from the authors’ own references; others are an editor’s grouping or a model’s guess. Each says
          who drew it and why.
        </P>
      </>
    ),
    archive: { label: 'The two-layer model', to: '/archive/community/', hash: 'model' },
  },
  switchboardHistory: {
    title: 'What did a telephone switchboard actually do?',
    kind: 'history',
    chapter: 'community',
    evidence: 'reported',
    summary: 'An operator made temporary connections between lines each caller owned, and pulled the cord when the call ended.',
    body: (
      <>
        <P>
          A manual switchboard joined separate lines. Each caller owned their endpoint; the operator answered a
          request, made a temporary connection, and pulled the cord when the call ended. Every connection was a
          choice, and the operator had real power over who could reach whom.
        </P>
        <P>
          It also kept nothing: when the cord came out, the conversation was gone. Here the records stay, and
          only the connections are temporary. That is our change to the metaphor. Operational details reported
          in <Src id="pr5">PR #5</Src>, not independently verified.
        </P>
      </>
    ),
    sources: ['pr5'],
  },
  connectionNotEndorsement: {
    title: 'Does a line mean the replies agree?',
    kind: 'mechanism',
    chapter: 'community',
    evidence: 'fixture',
    summary: 'A connection says two contributions relate and who says so; it never says either one is right.',
    body: (
      <>
        <P>
          No. A line says that two contributions relate, how, and who says so. Its style tells you who drew it:
          solid for an author, dashed for an editor, dotted for a model, dash-dot for you.
        </P>
        <P>
          A model’s suggestion can be proposed and disputed, but never accepted as an author’s statement.
          Neither can yours.
        </P>
      </>
    ),
  },
  portabilityLimits: {
    title: 'What can portability not fix?',
    kind: 'counterpoint',
    chapter: 'community',
    evidence: 'reading',
    summary: 'Owned records can be offline or deleted without trace, and whoever runs the popular view still decides what most people see.',
    body: (
      <>
        <P>
          Two of the eight records show it. One author’s server is offline, so there is nothing to show. One
          author deleted their reply, and the protocol keeps no tombstone.
        </P>
        <P>
          Owning your records does not mean anyone sees them, that they stay online, or that they are right.
          Whoever runs the popular view still decides what most people see. This project has no answer to that
          yet.
        </P>
      </>
    ),
    archive: { label: 'What portability does not buy', to: '/archive/community/', hash: 'limits' },
  },
  atproto: {
    title: 'Does something like this exist?',
    kind: 'research',
    chapter: 'community',
    evidence: 'checked',
    summary: 'The AT Protocol provides authored, portable records; we found no shared schema for endorsing, correcting or disputing.',
    body: (
      <>
        <P>
          Partly. On the <Src id="atproto">AT Protocol</Src>, accounts own repositories of signed records,
          anyone can define a record type, and a reference can pin one exact version of another record.{' '}
          <Src id="standardSite">Standard.site</Src> defines records for publications and documents.
        </P>
        <P>
          What we could not find, checked on 2026-10-28, is a shared record type for the judgement layer:
          endorsing a solution, correcting a version, recording a disagreement.
        </P>
      </>
    ),
    sources: ['atproto', 'standardSite'],
    archive: { label: 'The protocol inventory', to: '/archive/community/', hash: 'protocol' },
  },
  fixtures: {
    title: 'Are these real people?',
    kind: 'source',
    chapter: 'community',
    evidence: 'fixture',
    summary: 'The eight contributions are invented, under reserved .example names; nothing is read from or published to any network.',
    body: (
      <>
        <P>
          No. The eight contributions and their authors are invented, under reserved <code>.example</code>{' '}
          names and <code>did:example</code> identities. Record types that do not exist yet use a placeholder{' '}
          <code>example.postack.*</code> namespace. Nothing is read from or published to any network.
        </P>
      </>
    ),
  },

  // ---------- The Problem Desk ----------
  byConstruction: {
    title: 'Why does the guess help just as much?',
    kind: 'counterpoint',
    chapter: 'convergence',
    evidence: 'measured',
    summary: 'The same words go into two similar records, and a ranking cannot see where a word came from; this is guaranteed, not discovered.',
    body: (
      <>
        <P>
          Because it is guaranteed, not discovered. The same words go into two similar records, and a ranking
          cannot see where a word came from. It is also close to circular: the added symptom nearly restates
          the query.
        </P>
        <P>
          Two more things keep it modest. Plain keyword search already had this query at rank 1. And the top
          result is still an unrelated issue, matched on generic words; a correction to a description cannot
          fix the weighting.
        </P>
      </>
    ),
  },
  review: {
    title: 'Who would do the reviewing?',
    kind: 'connection',
    chapter: 'convergence',
    evidence: 'reading',
    summary: 'The photo-frame maintainer already does this labour by hand; the desk is a tiny model of it with the review made visible.',
    body: (
      <>
        <P>
          The question no interface can answer. The photo-frame repository from the opening already does this
          labour: strangers’ pull requests are corrections and additions, and one person reads and merges them.
          The desk is a tiny model of that work, with the review made visible.
        </P>
      </>
    ),
  },
  selfCorrection: {
    title: 'Has this essay made that mistake?',
    kind: 'research',
    chapter: 'convergence',
    evidence: 'checked',
    summary: 'An early draft flagged a symptom as missing from its source; an independent review found it there, worded differently.',
    body: (
      <>
        <P>
          Yes. An early draft of the Disputed Neighbour flagged the symptom “works fine locally” as missing from
          its source. A review found “works just fine on local” in the issue. Our check, like the tokenizer,
          had kept <em>local</em> and <em>locally</em> apart.
        </P>
        <P>The flag looked authoritative and was wrong. Only rereading the source caught it.</P>
      </>
    ),
    archive: { label: 'Research history', to: '/archive/history/' },
  },

  // ---------- Afterword ----------
  metaphorLimits: {
    title: 'Where do the metaphors stop?',
    kind: 'counterpoint',
    chapter: 'afterword',
    evidence: 'reading',
    summary: 'A switchboard never stored a conversation; a card catalogue’s authority came from institutions we do not have.',
    body: (
      <>
        <P>
          A switchboard never stored a conversation. A card catalogue’s authority came from institutions,
          trained staff and shared rules that a loose network of contributors does not have. Both helped, and
          both had to be told where they stop.
        </P>
      </>
    ),
  },
  nextTests: {
    title: 'What would we test next?',
    kind: 'research',
    chapter: 'afterword',
    evidence: 'reading',
    summary: 'A comprehension test against plain tables, a second Four Words run with outside queries, and a real review step on the desk.',
    body: (
      <>
        <P>
          Give five readers the Disputed Neighbour and the same content as a plain table, and ask what each
          source said and who assigned each label. Run Four Words again with queries from people who never saw
          the index. Require evidence before the desk accepts anything.
        </P>
      </>
    ),
    archive: { label: 'The reflection', href: repoFile('docs/REFLECTION.md') },
  },
} satisfies Record<string, MarginNote>

export type NoteId = keyof typeof notes
export const NOTES: Record<NoteId, MarginNote> = notes

export function noteArchiveLink(note: MarginNote) {
  const a = note.archive
  if (!a) return null
  return 'href' in a ? (
    <a href={a.href}>{a.label}</a>
  ) : (
    <Link to={a.to} hash={a.hash}>
      {a.label}
    </Link>
  )
}
