// Data for pilot 12, The Sorting Key. The seven frozen Four Words v1 records
// that carry the controlled term `asset-404`, with our answers to five
// questions a helper might ask before offering a fix.
//
// Written for the laboratory on 2026-10-29 by the classification builder (an
// AI agent), by reading each frozen record. The answers are our reading of
// the record, never of the pinned source, except where `basis` says the essay
// checked the source. "Not stated" means the record does not say; it does not
// mean "no". The fix classes are our grouping of each record's solution.
//
// This may not be used to claim that the questions are a diagnostic tool, that
// the answers are true of the original issues, or that any reader can answer
// them; nobody has tried.

export type Answer = 'yes' | 'no' | 'not stated'

export type FixClass = 'set the base path' | 'stop Jekyll dropping files' | 'fix the entry file or domain'

export interface KeyQuestion {
  id: string
  ask: string
  /** Why we include it. */
  why: string
}

export const QUESTIONS: KeyQuestion[] = [
  {
    id: 'url',
    ask: 'Does the failing URL contain the repository name?',
    why: 'The essay’s own question, from The Disputed Neighbour.',
  },
  { id: 'underscore', ask: 'Does a missing file’s name start with _?', why: 'Jekyll drops such files.' },
  { id: 'branch', ask: 'Is the site published from a branch, so Jekyll runs?', why: 'Jekyll only runs for branch publishing.' },
  { id: 'root', ask: 'Does the site’s own root page fail too?', why: 'Separates a missing site from missing assets.' },
  { id: 'vite', ask: 'Was the site built with Vite?', why: 'A decoy: it names the tool, not the cause.' },
]

export interface KeyCard {
  sourceId: string
  fix: FixClass
  answers: Record<string, Answer>
  /** The record text, or essay check, each answer rests on. */
  basis: Record<string, string>
}

export const CARDS: KeyCard[] = [
  {
    sourceId: 'vite-build-base',
    fix: 'set the base path',
    answers: { url: 'no', underscore: 'not stated', branch: 'not stated', root: 'no', vite: 'yes' },
    basis: {
      url: 'Symptom: “Hand-concatenated asset URLs ignore the configured base”.',
      root: 'Problem: asset URLs must be prefixed; pages themselves are not said to fail.',
      vite: 'Context: “Vite production build”.',
    },
  },
  {
    sourceId: 'next-basepath',
    fix: 'set the base path',
    answers: { url: 'no', underscore: 'not stated', branch: 'not stated', root: 'no', vite: 'no' },
    basis: {
      url: 'Symptom: “next/image sources without the prefix do not load”.',
      root: 'Only image sources are said to fail.',
      vite: 'A Next.js record.',
    },
  },
  {
    sourceId: 'gatsby-path-prefix',
    fix: 'set the base path',
    answers: { url: 'no', underscore: 'not stated', branch: 'not stated', root: 'not stated', vite: 'no' },
    basis: {
      url: 'Symptom: “Links and JS/CSS/images miss the subpath”.',
      vite: 'A Gatsby record.',
    },
  },
  {
    sourceId: 'vite-issue-8073-base-mime',
    fix: 'set the base path',
    answers: { url: 'no', underscore: 'no', branch: 'not stated', root: 'no', vite: 'yes' },
    basis: {
      url: 'Symptom: “Bundle URL is https://user.github.io/assets/... without the repo name”.',
      underscore: 'The failing file is an index bundle under /assets/.',
      root: 'Problem: the page requests its JS bundle, so the page itself loads.',
      vite: 'Context: “Vite 2.9 project”.',
    },
  },
  {
    sourceId: 'vite-issue-9119-underscore-chunk',
    fix: 'stop Jekyll dropping files',
    answers: { url: 'yes', underscore: 'yes', branch: 'yes', root: 'no', vite: 'yes' },
    basis: {
      url: 'Not in the record. The essay reconstructed it from the issue: the site sits under its repository name.',
      underscore: 'Symptom: “_plugin-vue_export-helper js file 404”.',
      branch: 'Context: “branch-published GitHub Pages site processed by Jekyll”.',
      root: 'Only one chunk file is said to fail.',
      vite: 'Context: “@vitejs/plugin-vue 3.0 with Vite”.',
    },
  },
  {
    sourceId: 'next-issue-15588-nojekyll',
    fix: 'stop Jekyll dropping files',
    answers: { url: 'not stated', underscore: 'not stated', branch: 'yes', root: 'no', vite: 'no' },
    basis: {
      url: 'Symptom says paths “match the domain”; the record does not say whether the repository name is in them.',
      underscore: 'Limitation: the underscore folder is “the likely reason but is not stated”.',
      branch: 'Context: “Published from a gh-pages branch (Jekyll processing)”.',
      root: 'Problem: the export “loads its HTML but the assets 404”.',
      vite: 'A Next.js record.',
    },
  },
  {
    sourceId: 'ghdocs-troubleshoot-404',
    fix: 'fix the entry file or domain',
    answers: { url: 'not stated', underscore: 'not stated', branch: 'not stated', root: 'yes', vite: 'no' },
    basis: {
      root: 'Symptom: “404 error on the site’s root”.',
      branch: 'Context covers both branch and Actions publishing.',
      vite: 'GitHub’s documentation; no build tool.',
    },
  },
]
