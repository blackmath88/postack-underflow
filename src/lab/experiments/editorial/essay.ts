import { isValidElement, type ReactNode } from 'react'
import type { Chapter, NoteId } from '../../../content/margin'

// The essay's own prose, as plain text, for the editorial pilots. Every
// paragraph ("beat") that carries a margin note is here, in reading order,
// with the exact phrase the note hangs from. The Impossible Index and the
// Switchboard are complete (every paragraph of their prose, outside the
// experiments); the other three chapters only list their noted beats.
// Copied from src/routes/*.tsx on 2026-10-29; the routes stay the authority.
// Numbers the route computes ({atOne(...)}) are written in as the page shows them.

export interface Beat {
  chapter: Chapter
  text: string
  /** Notes hung from a phrase in this beat, in order. */
  notes: { id: NoteId; phrase: string }[]
  /** A statement line, set large on the page. */
  statement?: boolean
}

const b = (chapter: Chapter, text: string, notes: [NoteId, string][] = [], statement = false): Beat => ({
  chapter,
  text,
  notes: notes.map(([id, phrase]) => ({ id, phrase })),
  statement,
})

export const BEATS: Beat[] = [
  // ---------- The story (noted beats only) ----------
  b('opening', 'Wes Bos wanted his to do something else. For months, he says, the AI models he asked told him it could not be done. He kept trying. The frame turned out to be a small Android computer, and he got in.', [['episode', 'Wes Bos wanted his to do something else.']]),
  b('opening', 'Then he did the thing this essay is about. He wrote it all down, in public.', [['frameRepo', 'He wrote it all down, in public.']]),
  b('opening', 'Strangers with other frames found it. They tried the steps on their own boards and sent back what they learned: a firmware string, a cable that does not work, a failed attempt. Most of it was merged.', [['frameCounts', 'Most of it was merged.']]),
  b('opening', 'Many, Wes says, did not type the notes themselves. They pointed their AI agents at it. The repository asks for exactly that.', [['forAgents', 'The repository asks for exactly that.']]),
  b('opening', 'The same episode ends on a worry. When developers ask agents instead of each other, what is left for the next person?', [['cjWorry', 'what is left for the next person?']]),
  b('opening', 'Someone had already done the work. The trick was finding it.', [['googleSo', 'Someone had already done the work.']], true),
  b('opening', 'An agent and a search can end with the same code. They do not end with the same knowledge.', [['sameCode', 'They do not end with the same knowledge.']]),
  b('opening', 'This is not nostalgia. Rebuilding an answer is often the right call. It is also easy to do without noticing. It happened twice around this site.', [
    ['notNostalgia', 'This is not nostalgia.'],
    ['ownExample', 'It happened twice around this site.'],
  ]),
  b('opening', 'Notes filed by circuit board help someone who already knows which board is in their frame.', [['findingFrame', 'already knows which board is in their frame.']]),
  b('opening', 'The notes stay true because strangers keep checking them, and one person keeps merging.', [['keepingCost', 'one person keeps merging.']]),
  b('opening', 'Each problem makes the other easier to see. They are not the only problems. But they are two you can try for yourself.', [
    ['eachThroughOther', 'Each problem makes the other easier to see.'],
    ['otherProblems', 'not the only problems.'],
  ]),

  // ---------- The Impossible Index (complete prose) ----------
  b('indexing', 'Same words. Different problems.', [], true),
  b('indexing', 'Two people hit what looks like the same bug. A site works on their own machine. Published on GitHub Pages, a free host for websites built from code, one of its script files will not load.'),
  b('indexing', 'One fix is a setting that puts the repository’s name in front of every path. The other is renaming a file, or adding an empty .nojekyll file, so that GitHub Pages stops skipping names that start with an underscore. Neither fix repairs the other case.'),
  b('indexing', 'Our small index gave both the same label. Suppose an editor then files them under one heading. Look at what each report says, and what the index added.', [
    ['frozenIndex', 'Our small index gave both the same label.'],
    ['rawVsAuthored', 'what the index added.'],
  ]),
  b('indexing', 'The resemblance was partly written in. One report never says “404”; the label the index gave it does.', [['controlledVocab', 'the label the index gave it does.']]),
  b('indexing', 'An index never just stores its sources. It adds a description of each one, in the words people search with. That is how four words can find a page that never uses them.', [['whatIndexAdds', 'An index never just stores its sources.']]),
  b('indexing', 'Try it. The search runs in your browser.', [['ranking', 'The search runs in your browser.']]),
  b('indexing', 'In one small test, yes: a right answer came first for 25 of 27 short queries, against 17 for plain search.', [['result', 'against 17 for plain search.']]),
  b('indexing', 'Then we looked at why. Much of the advantage came from words the description writer added, and some of them the sources never said.', [['injected', 'some of them the sources never said.']]),
  b('indexing', 'A description can be very findable and slightly false.', [], true),
  b('indexing', 'This was one run, on 30 documents about one narrow problem, with questions we wrote ourselves. It shows a mechanism, not that this works in general. Results, method and every caveat are in the archive.'),
  b('indexing', 'Classification is a claim. Somebody decides which problems are neighbours, and that decision shapes what you can find.', [['cardCatalogue', 'Classification is a claim.']]),
  b('indexing', 'Code hosts file knowledge by where it lives. Strangers arrive with problems. Somebody has to describe them, and somebody else should be able to say the description is wrong.', [['githubAtlas', 'Code hosts file knowledge by where it lives.']]),
  b('indexing', 'That second somebody is the other rabbit hole.'),

  // ---------- The Switchboard (complete prose) ----------
  b('community', 'Here is how an answer used to get better.', [['illustration', 'Here is how an answer used to get better.']]),
  // The four-step thread, joined from the route's THREAD list.
  b('community', 'Someone posts a fix. Another person tries it, and it works. A third tries it on a newer version. It fails, and they say so underneath. Someone edits the answer to cover both versions.'),
  b('community', 'Now the answer is worth more than anything its author wrote.'),
  b('community', 'That is what community adds: not answers, but judgement about them.', [['soMechanisms', 'judgement about them.']], true),
  b('community', 'The photo-frame repository does the same work, by hand. Strangers send notes; one person reads each one and decides whether to publish it. If they stop, the notes stay readable, but nobody checks the next one.', [['frameMaintainer', 'by hand.']]),
  b('community', 'Today much of that judgement happens in private, one session at a time. And moving everyone back onto one big site is not obviously the answer.', [
    ['whereJudgement', 'in private, one session at a time.'],
    ['onePlatform', 'is not obviously the answer.'],
  ]),
  b('community', 'What if a conversation could be assembled from pieces that each belong to their author?', [['twoLayers', 'that each belong to their author?']]),
  b('community', 'A telephone switchboard did something like it with calls. Every caller had their own line. The operator joined lines for a while, then pulled the cord.', [['switchboardHistory', 'did something like it with calls.']]),
  b('community', 'Below, eight contributions sit on two rails. All of them are invented. Every line between them is a claim with a contract: who proposed it, why, and where it stands. Pick a line, or draw your own.', [['fixtures', 'All of them are invented.']]),
  b('community', 'Look at the dotted line first: a model’s guess. It sits beside the authors’ own references, but it never becomes their statement.', [['connectionNotEndorsement', 'a model’s guess.']]),
  b('community', 'Then let the operator leave. The lines go. The words stay.', [], true),
  b('community', 'The records that remain still say what they reply to. Two of them show what owning your words cannot fix.', [['portabilityLimits', 'what owning your words cannot fix.']]),
  b('community', 'Partly. Open protocols already let people own and publish their own records. What we could not find is any shared record type for endorsing, correcting or disputing one. This page is a demonstration on fixtures; nothing here touches a real network.', [['atproto', 'Partly.']]),
  b('community', 'The protocol inventory, the two-layer model in full and its limits are in the archive.'),

  // ---------- The Problem Desk (noted beats only) ----------
  b('convergence', 'A ranking cannot tell a supported correction from a plausible one. A better number is not proof that a change is right. Only review can say that.', [['byConstruction', 'cannot tell a supported correction from a plausible one.']]),
  b('convergence', 'So the meeting point is not a bigger index or a new platform. It is maintenance.', [['review', 'It is maintenance.']]),
  b('convergence', 'This essay needed exactly that kind of review.', [['selfCorrection', 'needed exactly that kind of review.']]),

  // ---------- Afterword (noted beats only) ----------
  b('afterword', 'The metaphors needed boundaries.', [['metaphorLimits', 'The metaphors needed boundaries.']]),
  b('afterword', 'No reader has tried these experiments yet. Whether they make the argument clearer than a plain table would, whether the index result holds beyond thirty documents, and who would do the reviewing are all still open.', [['nextTests', 'No reader has tried these experiments yet.']]),
]

export const beatsOf = (chapter: Chapter) => BEATS.filter((x) => x.chapter === chapter)

/** The plain text of a note body: strings and numbers inside any element tree. */
export function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children) + ' '
  return ''
}

export const words = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length

/** Split a beat's text around its noted phrases, for marking them. */
export function segments(beat: Beat): { text: string; note?: NoteId }[] {
  const out: { text: string; note?: NoteId }[] = []
  let rest = beat.text
  for (const n of beat.notes) {
    const at = rest.indexOf(n.phrase)
    if (at < 0) continue
    if (at > 0) out.push({ text: rest.slice(0, at) })
    out.push({ text: n.phrase, note: n.id })
    rest = rest.slice(at + n.phrase.length)
  }
  if (rest) out.push({ text: rest })
  return out
}
