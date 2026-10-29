// Data for pilot 15, The Expired Answer. Nine frozen Four Words v1 records
// whose context or limitations name a version, a host or a publishing method,
// and, for each setting of five environment dials, what the record itself
// says about whether its answer applies.
//
// Written for the laboratory on 2026-10-29 by the classification builder (an
// AI agent), by reading the frozen records only. Each condition quotes or
// closely paraphrases the record field it rests on. Where the record says
// nothing about a setting, the condition is absent, and the pilot shows the
// answer as silent on it; we have not filled gaps from outside knowledge.
//
// This may not be used to claim which versions of these tools actually
// behave this way. It shows what the records say, not what is true today.

export type Verdict = 'applies' | 'does not apply' | 'unknown'

export interface Dial {
  id: string
  label: string
  options: Array<{ value: string; label: string }>
}

export const DIALS: Dial[] = [
  {
    id: 'publish',
    label: 'Publishing',
    options: [
      { value: 'branch', label: 'from a branch' },
      { value: 'actions', label: 'with an Actions artifact' },
    ],
  },
  {
    id: 'host',
    label: 'Host',
    options: [
      { value: 'github.com', label: 'github.com' },
      { value: 'ghes', label: 'GitHub Enterprise Server' },
    ],
  },
  {
    id: 'upload',
    label: 'upload-pages-artifact',
    options: [
      { value: 'v3', label: 'v3 or earlier' },
      { value: 'v4', label: 'v4 or later' },
    ],
  },
  {
    id: 'next',
    label: 'Next.js',
    options: [
      { value: '9', label: 'the 9.x era' },
      { value: '14', label: '14 or later' },
    ],
  },
  {
    id: 'vite',
    label: 'Vite',
    options: [
      { value: '2.9', label: '2.9' },
      { value: 'pinned', label: 'as documented at the 2026 pin' },
    ],
  },
]

export interface Condition {
  verdict: Verdict
  /** The record text this rests on. */
  says: string
}

export interface ExpiringAnswer {
  sourceId: string
  answer: string
  /** dial id → option value → what the record says. Missing = the record is silent. */
  when: Record<string, Partial<Record<string, Condition>>>
}

export const ANSWERS: ExpiringAnswer[] = [
  {
    sourceId: 'next-issue-15588-nojekyll',
    answer: 'Add an empty .nojekyll file to the gh-pages branch.',
    when: {
      publish: {
        branch: { verdict: 'applies', says: 'Context: “Published from a gh-pages branch (Jekyll processing)”.' },
        actions: { verdict: 'does not apply', says: 'Limitation: “Applies to branch-published sites”.' },
      },
      next: {
        '9': { verdict: 'applies', says: 'Context: “Next.js 9.3.5 static HTML export”.' },
        '14': { verdict: 'unknown', says: 'Limitation: “the thread is from the Next.js 9 era (exportPathMap, assetPrefix)”.' },
      },
    },
  },
  {
    sourceId: 'vite-issue-9119-underscore-chunk',
    answer: 'Add .nojekyll, or rename chunks so none starts with an underscore.',
    when: {
      publish: {
        branch: { verdict: 'applies', says: 'Context: “branch-published GitHub Pages site processed by Jekyll”.' },
        actions: { verdict: 'unknown', says: 'The record only describes a branch-published site.' },
      },
    },
  },
  {
    sourceId: 'ghdocs-create-site-nojekyll',
    answer: 'Add .nojekyll at the root of the publishing source, or publish with Actions.',
    when: {
      publish: {
        branch: { verdict: 'applies', says: 'Context: “Publishing from a source branch and folder (Jekyll runs by default)”.' },
        actions: { verdict: 'does not apply', says: 'Limitation: “The .nojekyll file applies to branch publishing”.' },
      },
    },
  },
  {
    sourceId: 'upload-pages-artifact-issue-129-hidden-files',
    answer: 'Opt in to hidden files (include-hidden-files) to keep .well-known.',
    when: {
      publish: {
        branch: { verdict: 'does not apply', says: 'Context: “Not relevant to branch-based publishing”.' },
        actions: { verdict: 'applies', says: 'Context: “GitHub Actions publishing with actions/upload-pages-artifact v4”.' },
      },
      upload: {
        v3: { verdict: 'does not apply', says: 'Problem: files went missing “after upgrading to upload-pages-artifact v4”.' },
        v4: { verdict: 'applies', says: 'Problem: the files are “silently missing” from v4 on.' },
      },
    },
  },
  {
    sourceId: 'upload-pages-artifact-readme',
    answer: 'Set include-hidden-files: true if dot-prefixed files must be published.',
    when: {
      publish: {
        branch: { verdict: 'does not apply', says: 'Context: “GitHub Actions build job feeding actions/deploy-pages”.' },
        actions: { verdict: 'applies', says: 'Context: “GitHub Actions build job feeding actions/deploy-pages”.' },
      },
    },
  },
  {
    sourceId: 'deploy-pages-readme',
    answer: 'Deploy with actions/deploy-pages, with pages: write and id-token: write.',
    when: {
      publish: {
        branch: { verdict: 'does not apply', says: 'Context: “GitHub Actions deployment to GitHub Pages”.' },
        actions: { verdict: 'applies', says: 'Context: “GitHub Actions deployment to GitHub Pages”.' },
      },
      host: {
        'github.com': { verdict: 'applies', says: 'No host limitation for github.com.' },
        ghes: { verdict: 'does not apply', says: 'Context: “v4 is not compatible with GHES”.' },
      },
    },
  },
  {
    sourceId: 'ghdocs-custom-workflows',
    answer: 'Use configure-pages, upload-pages-artifact and deploy-pages in a custom workflow.',
    when: {
      publish: {
        branch: { verdict: 'does not apply', says: 'Problem: “instead of branch publishing”.' },
        actions: { verdict: 'applies', says: 'Context: “Pages source set to GitHub Actions”.' },
      },
      host: {
        'github.com': { verdict: 'applies', says: 'The documented action versions.' },
        ghes: { verdict: 'unknown', says: 'Context: “GHES uses older action versions (upload v2, deploy v3)”; the record does not say whether the rest holds.' },
      },
    },
  },
  {
    sourceId: 'next-static-exports',
    answer: "Set output: 'export' and build to an out folder.",
    when: {
      next: {
        '9': { verdict: 'unknown', says: 'Context names only the current form: “next export removed in v14”.' },
        '14': { verdict: 'applies', says: "Context: “Next.js with output: 'export' (next export removed in v14)”." },
      },
    },
  },
  {
    sourceId: 'vite-issue-8073-base-mime',
    answer: "Set base to '/repo/', with both slashes, and rebuild.",
    when: {
      vite: {
        '2.9': { verdict: 'applies', says: 'Context: “Vite 2.9 project”; the reporter confirmed the fix.' },
        pinned: {
          verdict: 'applies',
          says: 'Renewed, not by this record: the vite-static-deploy record, from docs pinned in 2026, gives the same base rule.',
        },
      },
    },
  },
]
