// How this essay was made: a source-linked history, including the parts that
// went wrong. Each entry says what happened, what kind of event it was, and
// what it changed in our thinking. Dates are 2026; most of the work happened
// on 28 October.

export type HistoryKind = 'conversation' | 'decision' | 'experiment' | 'correction' | 'proposal' | 'encounter'

export interface HistoryEntry {
  date: string
  kind: HistoryKind
  title: string
  what: string
  changed: string
  link?: { label: string; url: string }
}

const REPO = 'https://github.com/blackmath88/postack-underflow'

export const HISTORY: HistoryEntry[] = [
  {
    date: '26 Oct',
    kind: 'conversation',
    title: 'A podcast conversation',
    what: 'Syntax #1050 discusses hacking TVs and photo frames. CJ worries about solutions that agents reconstruct in private.',
    changed: 'The starting provocation: “we already solved this”.',
    link: { label: 'Transcript', url: 'https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript' },
  },
  {
    date: '26–28 Oct',
    kind: 'conversation',
    title: 'Human–AI sparring',
    what: 'The project owner developed the idea in conversations with AI assistants, including critical research that named prior art such as doc2query.',
    changed: 'Two problems instead of one, and the warning that added vocabulary might explain any gain. These conversations are private and not linked.',
  },
  {
    date: '28 Oct',
    kind: 'decision',
    title: 'A research repository and a working practice',
    what: 'Problem statement, concept and provenance notes; a development-practice adapter and ADR process.',
    changed: 'Hypotheses, implementations and results would be labelled apart from the start.',
    link: { label: 'PR #1', url: `${REPO}/pull/1` },
  },
  {
    date: '28 Oct',
    kind: 'decision',
    title: 'Two encounters, studied separately',
    what: 'A card catalogue and a manual switchboard became independent Lumpesammlig studies, 012 and 013.',
    changed: 'Classification as prior labour; connections that can be unplugged while voices remain.',
    link: { label: 'Lumpesammlig at 23c9c44', url: 'https://github.com/blackmath88/lumpesammlig/tree/23c9c443686e5e49138ddd336d27b590421bd605' },
  },
  {
    date: '28 Oct',
    kind: 'correction',
    title: 'The site that was not deployed',
    what: 'Three stacked pull requests were merged, but only the first reached main. The public URL returned 404 on every route while the work looked done.',
    changed: 'A green build is not evidence. A check of what the live site serves now runs after every deploy.',
    link: { label: 'PR #4', url: `${REPO}/pull/4` },
  },
  {
    date: '28 Oct',
    kind: 'experiment',
    title: 'Four Words: queries before records',
    what: '27 queries and their labels were committed before any record existed; 30 records were written by an agent that never saw them; one evaluation run.',
    changed: 'On this corpus, structured records beat plain keyword search.',
    link: { label: 'Queries commit 619bd6d', url: `${REPO}/commit/619bd6d` },
  },
  {
    date: '28 Oct',
    kind: 'correction',
    title: 'The review that changed the reading',
    what: 'An independent reviewer found that our first explanation of the results was wrong.',
    changed: 'Much of the gain came from vocabulary the record writer supplied, some of it unsupported; the one loss was partly a labelling error. The numbers stayed; the interpretation changed.',
    link: { label: 'FOUR-WORDS.md', url: `${REPO}/blob/main/docs/research/FOUR-WORDS.md` },
  },
  {
    date: '28 Oct',
    kind: 'proposal',
    title: 'Physical information systems',
    what: 'Research on card catalogues and switchboards proposed classification claims and relationship claims as the unit of accountability.',
    changed: 'The Disputed Neighbour, the Connection Contract and the Problem Desk. Still an open proposal; its historical claims are not independently verified.',
    link: { label: 'PR #5', url: `${REPO}/pull/5` },
  },
  {
    date: '28 Oct',
    kind: 'proposal',
    title: 'An exploratory story',
    what: 'The project was reframed as an investigation rather than an argument, with three kinds of success: research, creative, practical.',
    changed: 'Six movements, an encounter to begin with, and the closing question below. Still an open proposal.',
    link: { label: 'PR #6', url: `${REPO}/pull/6` },
  },
  {
    date: '28 Oct',
    kind: 'encounter',
    title: 'The photo frame, identified',
    what: 'The unverified lead in PR #6 was traced, by inference, to Wes Bos’s photo-frame repository, with its agent instructions and over 200 pull requests. The episode does not name it.',
    changed: 'The opening became a counterexample: agents contributing back, because someone asked them to.',
    link: { label: 'Case note', url: `${REPO}/blob/main/docs/research/CASE-PHOTO-FRAME.md` },
  },
  {
    date: '28 Oct',
    kind: 'experiment',
    title: 'The Problem Desk, and a self-correction',
    what: 'Previewing a correction showed a guessed change improving retrieval as much as a sourced one. A reviewer pointed out this is true by construction, and that our first draft also mislabelled a supported symptom as unsupported.',
    changed: 'The weight of the idea moved from indexing to review, and the essay caught itself making the error it describes.',
  },
  {
    date: '28 Oct',
    kind: 'decision',
    title: 'A lighter surface, the same evidence',
    what: 'An editorial pass cut the default reading path by more than half. Methods, tables, history and qualifications moved into margin notes and an archive; frozen data and results did not change.',
    changed: 'The essay now works at three levels of attention: a story, notes beside it, and an archive underneath.',
    link: { label: 'Content inventory', url: `${REPO}/blob/main/docs/editorial/CONTENT-INVENTORY.md` },
  },
]
