ARABBIT HOLE · INDEXING

# The Impossible Index

The answer exists. Why can’t we find it? Usually because it was described in words other than the ones you are searching with, and somebody else decided which words those would be.

## Everything is filed by where it lives

Open any code host and the organising units are familiar: a repository, a directory, a file, a commit, an issue. Those units serve the people who maintain the code. They say little about the question a stranger arrives with, which is almost never “show me this repository” and almost always “has someone already dealt with this?”

Take the problem this site’s own deployment had to avoid: a static site published under a GitHub Pages subpath. The knowledge needed is scattered across a build tool’s option reference, a hosting provider’s note about folders that start with an underscore, a router’s API docs, and a years-old issue where someone confirmed what fixed it. None of those documents is about “my CSS is missing after deploy”. Each one solves a piece of it.

GitHub Atlas, an earlier project, maps repositories, topics and ecosystem health. Postack Underflow starts from the itch it left: what changes if the unit on the map is the problem solved rather than the repository it sits in?

## Indexing as work done before the question

An agent asked to fix that deployment does roughly what a careful developer would: reads, searches, opens files, forms a theory and tests it. That works, which is exactly why it repeats. Nothing in the process leaves a cheaper path for the next attempt.

HYPOTHESIS The alternative is old-fashioned on purpose. A library catalogue is labour done before anyone asks. Here the catalogue is a set of problem records, written offline from pinned public sources. Each names the problem in plain words, the phrasings and symptoms people report, the constraints under which a fix holds, the fix itself, the evidence for it, its known limits, and related or competing approaches. At query time nothing clever happens: a transparent ranking over those fields, in your browser, with every match explained.

## What an index adds

An index never just stores its sources. It adds things: a plain statement of the problem, the other ways people phrase it, the symptoms they report, the headings it is filed under. Those additions are what make a four-word query land. They are also interpretations, written by somebody, that the source never said.

This is not a new idea. Information retrieval has long expanded documents with the vocabulary people are likely to search for; one well-known version, doc2query, predicts queries for each document and indexes them alongside it. Four Words does the same thing by hand, or rather by an AI agent writing records. Each result below explains which of those added fields a match came from, and links the source it was written from. Further down, the Disputed Neighbour puts a source and its additions side by side.

EXPERIMENT · INDEX-FIRST RETRIEVAL

## Four Words

Describe a GitHub Pages deployment problem in a few words. The ranking runs in your browser over an index built offline. No request leaves this page and no model is involved.

Try: images missing subfolderrouter links wrong prefixworkflow cannot publish

30 records from 30 public sources, indexed before you arrived.

Deploying a Static Site
(vitejs/vite)
vitejs/vite · docs · commit 8a4c19c · MIT

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

Building for Production
(vitejs/vite)
vitejs/vite · docs · commit b65a4b5 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

- 

Shared Options
(vitejs/vite)
vitejs/vite · docs · commit 8a4c19c · MIT

- 

- 

- 

- 

- 

- 

About GitHub Pages and Jekyll
(github/docs)
github/docs · docs · commit e6ae025 · CC-BY-4.0 (content; code MIT)

- 

- 

- 

- 

- 

- 

- 

Creating a GitHub Pages site
(github/docs)
github/docs · docs · commit db00039 · CC-BY-4.0 (content; code MIT)

- 

- 

- 

- 

- 

- 

- 

- 

Creating a custom 404 page for your GitHub Pages site
(github/docs)
github/docs · docs · commit e6ae025 · CC-BY-4.0 (content; code MIT)

- 

- 

- 

- 

- 

Using custom workflows with GitHub Pages
(github/docs)
github/docs · docs · commit a5290f8 · CC-BY-4.0 (content; code MIT)

- 

- 

- 

- 

- 

- 

- 

- 

Troubleshooting 404 errors for GitHub Pages sites
(github/docs)
github/docs · docs · commit e6ae025 · CC-BY-4.0 (content; code MIT)

- 

- 

- 

- 

- 

- 

- 

deploy-pages 🚀
(actions/deploy-pages)
actions/deploy-pages · readme · commit 7e97763 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

- 

upload-pages-artifact
(actions/upload-pages-artifact)
actions/upload-pages-artifact · readme · commit f7615f5 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

Single Page Apps for GitHub Pages
(rafgraph/spa-github-pages)
rafgraph/spa-github-pages · readme · commit 038c0af · MIT

- 

- 

- 

- 

- 

- 

- 

- 

- 

How to Deploy TanStack Router to Production
(TanStack/router)
TanStack/router · docs · commit e8c5dd0 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

RouterOptions
(TanStack/router)
TanStack/router · docs · commit 634da91 · MIT

- 

- 

- 

- 

- 

- 

- 

createBrowserRouter
(remix-run/react-router)
remix-run/react-router · docs · commit 89b7a8d · MIT

- 

- 

- 

- 

- 

- 

Deploy your Astro Site to GitHub Pages
(withastro/docs)
withastro/docs · docs · commit cf734fd · MIT

- 

- 

- 

- 

- 

- 

- 

- 

- 

basePath
(vercel/next.js)
vercel/next.js · docs · commit 2e2ee08 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

How to create a static export of your Next.js application
(vercel/next.js)
vercel/next.js · docs · commit 2759ad0 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

Static site generation
(sveltejs/kit)
sveltejs/kit · docs · commit 23ac35b · MIT

- 

- 

- 

- 

- 

- 

- 

- 

Deployment
(facebook/create-react-app)
facebook/create-react-app · docs · commit ee7ce83 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

Different History modes
(vuejs/router)
vuejs/router · docs · commit f1f6382 · MIT

- 

- 

- 

- 

- 

- 

- 

- 

- 

Deployment
(angular/angular)
angular/angular · docs · commit 14a2dcc · MIT

- 

- 

- 

- 

- 

- 

- 

- 

Router reference
(angular/angular)
angular/angular · docs · commit 3064f3f · MIT

- 

- 

- 

- 

- 

- 

- 

GitHub Pages
(jekyll/jekyll)
jekyll/jekyll · docs · commit 10a7359 · MIT

- 

- 

- 

- 

- 

- 

- 

Directory Structure
(jekyll/jekyll)
jekyll/jekyll · docs · commit d85c89e · MIT

- 

- 

- 

- 

- 

- 

Adding a Path Prefix
(gatsbyjs/gatsby)
gatsbyjs/gatsby · docs · commit 2a06fff · MIT

- 

- 

- 

- 

- 

- 

`<base>` HTML document base URL element
(mdn/content)
mdn/content · docs · commit 599ae8b · NOASSERTION (content CC-BY-SA-2.5; code samples CC0-1.0)

- 

- 

- 

- 

- 

- 

- 

Loading module from “https://tykavanaugh.github.io/assets/index.0c785174.js” was blocked because of a disallowed MIME type (“text/html”).
(vitejs/vite)
vitejs/vite · issue · updated 2022-05-24, not pinned · GitHub Terms of Service (user content); repository MIT

- 

- 

- 

- 

- 

- 

_plugin-vue_export-helper js file cant not be access with Github Pages(404)
(vitejs/vite)
vitejs/vite · issue · updated 2022-08-04, not pinned · GitHub Terms of Service (user content); repository MIT

- 

- 

- 

- 

- 

- 

- 

- 

Deploy to github pages results in assets not found with Static HTML export
(vercel/next.js)
vercel/next.js · issue · updated 2022-01-29, not pinned · GitHub Terms of Service (user content); repository MIT

- 

- 

- 

- 

- 

- 

- 

Allow publishing of hidden/dot-prefixed files again
(actions/upload-pages-artifact)
actions/upload-pages-artifact · issue · updated 2026-04-10, not pinned · GitHub Terms of Service (user content); repository MIT

- 

- 

- 

- 

- 

- 

- 

- 

LEARNED FROM · LUMPESAMMLIG 012-IMPOSSIBLE-INDEX, AN INDEPENDENT COLLECTION OF INTERACTION STUDIES

Classification exists before the question. A query changes the ordering, never the records, and records that did not match stay recoverable.

Four Words keeps every unmatched record one click away and shows which fields each match came from.

Open The Impossible Index · The Impossible Index study notes at 23c9c44

## Does the prior work help? What we measured

The same 30 sources were indexed twice: once as their raw text, the way plain keyword search sees them, and once as one structured record per source. Both use the same tokenizer and the same BM25 family of ranking, so differences come from what was indexed, not from a cleverer algorithm.

| SYSTEM | RANK 1 CORRECT | RECALL@5 | MRR@10 | MEAN QUERY TIME |
| PLAIN KEYWORD SEARCH (BM25, RAW SOURCE TEXT) | 17 / 27 | 70.5% | 0.742 | 0.039 ms |
| PROBLEM-ORIENTED INDEX (BM25F, RECORDS) | 25 / 27 | 87.2% | 0.950 | 0.062 ms |
| ABLATION: RECORDS WITHOUT ALIASES AND SYMPTOMS | 22 / 27 | 82.3% | 0.892 | 0.041 ms |

Paired by query, the structured index ranked the first relevant source higher on 10, lower on 1 and the same on 16 of 27 queries. Query times were measured in Node on one machine (Node v26.8.1, linux) and say nothing about scale. “Rank 1 correct” counts queries whose top result is labelled relevant; Recall@5 is the average share of each query’s relevant sources in the top five.

### Where the two disagreed

| QUERY | PLAIN KEYWORD SEARCH | PROBLEM-ORIENTED INDEX |
| CSS MISSING AFTER DEPLOY | 1 | 7 |
| REFRESH GIVES 404 | 2 | 1 |
| BLANK PAGE GITHUB PAGES | 15 | 1 |
| UNDERSCORE FOLDER NOT SERVED | 2 | 1 |
| DISABLE JEKYLL | 2 | 1 |
| CUSTOM NOT FOUND PAGE | 9 | 1 |
| REACT ROUTER SUBDIRECTORY | 2 | 1 |
| NEXT IMAGES WRONG PATH | 2 | 1 |
| ARTIFACT TOO LARGE | 4 | 1 |
| SITE SHOWS 404 EVERYWHERE | 6 | 2 |
| TRAILING SLASH INDEX HTML | 13 | 1 |

### How to read this

OBSERVATION In this one run the structured index did better: a relevant source at rank 1 for 25 of 27 queries, against 17 for plain keyword search, and MRR 0.95 against 0.74. Why it did better matters more than the margin.

Much of the gain is vocabulary the record writer added. In 6 of the 10 queries where the structured index won, plus one tokenizer artefact, its first relevant record matched on at least one query word that never appears in that source’s text: blank for blank page github pages, underscore for underscore folder not served, refresh for refresh gives 404, found for custom not found page, large for artifact too large, shows for site shows 404 everywhere, trailing slash for trailing slash index html. That is what editorial work is supposed to add, the words people use rather than the words documentation uses. It is also a risk: one record describes a “blank page” symptom its source never mentions. One win, trailing slash index html, is partly a tokenizer artefact: the source writes trailingSlash, which this tokenizer keeps as one word.

The ablation points the same way. Without the aliases and symptoms fields the structured index still beat raw text (MRR 0.89), so a short, plain statement of problem and fix does real work, but the reader-facing vocabulary adds more.

The one loss was a labelling mistake as much as a ranking one. For the essay’s own example, css missing after deploy, plain search put a labelled source at rank 1 and the structured index only at rank 7. But the structured index’s second and fourth results (Angular’s router reference and TanStack Router’s deploy guide) both describe missing CSS after deployment, and neither was labelled relevant. A post-hoc audit that adds them would put the structured index’s first relevant result at rank 2. The labels were frozen before the run and are not changed here; the miss says as much about the labels as about the index.

Read these numbers with the caveats beside them. One run, 30 documents on one narrow topic, all but one of them labelled relevant to something. The same project wrote the queries and the labels, and the labeller had read summaries of every source. The baseline indexes whole documents, not passages, which handicaps long pages. One AI agent wrote every record, and no person has reviewed them. A fair test needs queries from people who have never seen the index, a passage-level baseline, and reviewed records.

### Method, briefly

- Corpus: 30 public documents on one problem area: build-tool and framework docs, hosting docs, README files and four GitHub issues. Files are pinned to a commit; issues to their last-updated time. Licences are recorded per source.

- Queries: 27 queries of at most four words, with binary relevance labels, written and committed before any record existed and before ranking ran. The same project wrote both queries and labels, which is the experiment’s biggest weakness.

- Records: one per source, written by an AI agent that was instructed not to read the queries, and not yet reviewed by a person. Field weights were fixed in advance: problem 3, aliases 2, symptoms 2, terms 2, context 1, solution 1.

- Ranking: BM25 (k1 1.2, b 0.75) for raw text, the simple BM25F variant for records, plural folding only. Run once; nothing was tuned afterwards.

Everything is reproducible from the repository: npm run corpus:fetch, npm run index, npm run evaluate. Corpus, queries, records and results: corpus/, results/four-words-v1.json, and the write-up in FOUR-WORDS.md.

## Classification is a claim

The library card catalogue made this visible. Somebody had already decided where each book belonged, which headings led to it, and which neighbouring headings to point to. That labour happened before your question, and it shaped which books you could find. The research collected for this project describes catalogues distinguishing provisional placements from accepted ones, and headings that were contested for years.

Historical details here and on the Switchboard page come from research compiled for this project and are reported, not independently verified (PR #5). The behaviour worth keeping does not depend on them: classification is prior work, it creates neighbourhoods, and it can be wrong.

Four Words’ v1 audit found the digital version of a contested heading. Part of the index’s advantage came from vocabulary its writer supplied, and some of that vocabulary has no basis in the source. A description can be very findable and slightly false. The experiment below takes one such neighbourhood apart.

EXPERIMENT · A CLASSIFICATION CLAIM

## The Disputed Neighbour

Two real issues from the Four Words corpus, filed side by side. Inspect what each source says, what the index added, and the claim that they are the same problem. Then decide.

CLASSIFICATION CLAIM
PROPOSED

Vite build: a JavaScript file 404s on GitHub Pages

SUGGESTED FIX Check Vite’s base option.

PROPOSED BY This essay’s editor, as a deliberately plausible example (hypothetical)

BASIS Both v1 records carry the controlled term asset-404, both describe a JavaScript file that fails to load only on GitHub Pages, and both rank near each other for short queries.

A

### The base-path case

SOURCE · WHAT THE ISSUE SAYS

- was blocked because of a disallowed MIME type (“text/html”) — quote, snapshot line 1

- The bundle is requested from the domain root, without the repository name. — paraphrase, snapshot line 1

failing request
https://tykavanaugh.github.io/assets/index.0c785174.js

Loading module from “https://tykavanaugh.github.io/assets/in… · updated 2022-05-24, not pinned

ADDED DURING INDEXING · FROZEN V1 RECORD

PROBLEM, AS THE RECORD WRITER PUT IT

A Vite build on a GitHub Pages project site requests its JS bundle from the domain root, so the module is blocked as text/html.

ALIASES

- Vite GitHub Pages disallowed MIME type text/html

- Loading module was blocked because of a disallowed MIME type

- Vite assets requested from github.io/assets instead of repo path

- Vite blank page on GitHub Pages works locally — not in source · “Works … on local” is in the issue; “blank page” is not.

- base without trailing slash still broken

SYMPTOMS

- Loading module ... was blocked because of a disallowed MIME type ("text/html")

- Bundle URL is https://user.github.io/assets/... without the repo name

- Works fine locally

CONTROLLED TERMS

- base-path

- asset-404 — not in source · The issue never says 404. It reports a module blocked as text/html; a 404 is a reasonable reading, but it is the index’s.

B

### The underscore case

SOURCE · WHAT THE ISSUE SAYS

- Github Pages block the file starting with the underline character — quote, snapshot line 7

- A plugin upgrade renamed a generated file so that it starts with an underscore. — paraphrase, snapshot line 5

failing request
https://cloudhao1999.github.io/cloud-app-admin/…/_plugin-vue_export-helper….js
Reconstructed: the issue gives the site URL and the file name; the full path is in a screenshot.

_plugin-vue_export-helper js file cant not be access with Gi… · updated 2022-08-04, not pinned

ADDED DURING INDEXING · FROZEN V1 RECORD

PROBLEM, AS THE RECORD WRITER PUT IT

A Vite/Vue build emits a chunk named _plugin-vue_export-helper that returns 404 on GitHub Pages because Jekyll drops underscore-prefixed files.

ALIASES

- _plugin-vue_export-helper 404 GitHub Pages

- Vite chunk starting with underscore not found

- GitHub Pages blocks files beginning with underscore

- rollup sanitizeFileName underscore prefix

- Vite build JS file 404 only on GitHub Pages

SYMPTOMS

- _plugin-vue_export-helper js file 404 on GitHub Pages

- Error disappears after adding .nojekyll

CONTROLLED TERMS

- underscore-paths

- jekyll

- asset-404

Search the frozen v1 index:

- B — A Vite/Vue build emits a chunk named _plugin-vue_export-helper that returns 404 on GitHub Pages because Jekyll drops underscore-prefixed files. — matched vite, js, file, 404, github, page

- A — A Vite build on a GitHub Pages project site requests its JS bundle from the domain root, so the module is blocked as text/html. — matched vite, js, 404  — (not in this record’s source) — , github, page · marked words never occur in its source

- · — A TanStack Router SPA on GitHub Pages 404s on refresh and fails to load assets from the repository subpath. — matched vite, js, 404, github, page

- · — A Vite app deployed to a GitHub Pages project site at username.github.io/repo/ needs the right base setting and a build-and-deploy workflow to work. — matched vite, js, github, page

### Evidence about the claim

- + SUPPORTS — Both reports are a Vite build whose JavaScript fails to load only on GitHub Pages. — (vitejs/vite, snapshot line 1)

- + SUPPORTS — Both v1 records were given the same controlled term, asset-404, by the record writer. — (vitejs/vite)

- − CHALLENGES — In the base-path case the failing URL lacks the repository name. In the underscore case the site sits under its repository name and the file is named with a leading _ (the full request path is reconstructed; the issue shows it in a screenshot). — (vitejs/vite, snapshot line 11)

- − CHALLENGES — The confirmed fixes differ: a base setting in one, .nojekyll or chunk renaming in the other. Neither fix repairs the other case. — (vitejs/vite)

- − CHALLENGES — Part of the resemblance was written in: the base-path issue never says 404. The shared term asset-404, and an alias about a “blank page”, are the index’s additions. — (vitejs/vite)

### Your reading

No verdict yet. Nothing changes until you choose, and you can undo.

## What this does not show

Thirty documents on one narrow topic, and 27 queries written by the same project, cannot show that problem-oriented indexing works in general. Extracting problems is itself interpretation, and an index can be confidently wrong at scale. A record says nothing about whether its fix still works, because no one has confirmed or corrected it. That last gap is where this rabbit hole joins the Switchboard.

NEXT

The Switchboard: who keeps it alive?

Or skip to the Problem Desk, where a correction meets this index.
