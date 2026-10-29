// Data for Lab 39, The Marginal Printer. Invented for this experiment by the
// lab builder, 2026-10-29.
//
// Revision 0 is the `solution` field of the frozen v1 record
// vite-issue-9119-underscore-chunk, copied verbatim. Revisions 1–3 are edits
// we made up to move the text; no one has proposed them, and they say nothing
// about the record. Each annotation's note is taken from the same record's own
// evidence and related fields, so it adds no new claim.
//
// This file may not be used to claim anything about the record, its source,
// or how real annotations behave in any tool.

export const SOURCE_ID = 'vite-issue-9119-underscore-chunk'

export const REVISIONS: Array<{ text: string; edit: string }> = [
  {
    text: "Either add a .nojekyll file at the site root so Jekyll does not drop underscore files, or override Rollup's output.sanitizeFileName so generated chunk names do not start with an underscore.",
    edit: 'The record as written.',
  },
  {
    text: "For a site that GitHub Pages builds with Jekyll: either add a .nojekyll file at the site root so Jekyll does not drop underscore files, or override Rollup's output.sanitizeFileName so generated chunk names do not start with an underscore.",
    edit: 'A clause added at the start.',
  },
  {
    text: "For a site that GitHub Pages builds with Jekyll: add a .nojekyll file at the site root so Jekyll does not drop underscore files. Alternatively, override Rollup's output.sanitizeFileName so generated chunk names do not start with an underscore.",
    edit: 'The sentence split in two.',
  },
  {
    text: "For a site that GitHub Pages builds with Jekyll: add a .nojekyll file at the site root so Jekyll does not drop underscore files. Alternatively, override Rollup's output.sanitizeFileName to rename the chunk.",
    edit: 'The last clause rewritten.',
  },
]

export const ANNOTATIONS: Array<{ id: string; quote: string; note: string }> = [
  { id: 'a', quote: '.nojekyll file', note: 'The reporter considers this a workaround.' },
  { id: 'b', quote: 'output.sanitizeFileName', note: 'Suggested by a commenter; the reporter said rewriting it solved the problem.' },
  { id: 'c', quote: 'do not start with an underscore', note: 'Jekyll excludes paths starting with an underscore from output.' },
]
