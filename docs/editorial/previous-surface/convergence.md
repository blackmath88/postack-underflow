CCONVERGENCE

# Where the two problems meet

The two rabbit holes meet at one small desk: a problem found through an index, challenged by somebody else, and corrected in a preview, while every source stays as it was.

The Impossible Index showed that an index is made of descriptions somebody wrote, and that a description can be findable and wrong. The Switchboard showed that a contribution can respond to something without the interface owning either of them. Put those together and you get the smallest version of the loop this essay is about: someone finds a record, someone else challenges how it was described, and the next search is better for it.

The desk uses the case Four Words got most wrong: css missing after deploy, the example the essay opened with.

EXPERIMENT · A CORRECTION, PREVIEWED

## The Problem Desk

One query, one challenge, one preview. Everything ranked here is the frozen Four Words v1 data; only the challenge is invented.

### 1
Find

Someone searches css missing after deploy, the example the essay opened with. In v1 the structured index put the first source labelled relevant at rank 7. Plain keyword search had it at rank 1.

The ranking below is the frozen v1 structured index.

- 1 — After upgrading to upload-pages-artifact v4, dot-prefixed files such as .well-known are silently missing from the published site. — matched after, missing, deploy

- 2 — An Angular app using pushState routing cannot load its CSS, scripts and images on deep links without a correct base href. — matched css, after

- 3 — A GitHub Pages site returns 404 because of a missing or misplaced entry file, repository settings, or a custom domain change. — matched after, missing

- 4 — A TanStack Router SPA on GitHub Pages 404s on refresh and fails to load assets from the repository subpath. — matched css, after

- 5 — A site's build output has to be packaged as a valid Pages artifact, including dot-prefixed files when they are needed. — matched missing, deploy

- 6 — A SvelteKit site built with adapter-static for a GitHub Pages project site needs paths.base set and a 404.html fallback. — matched missing, deploy

### 2
Challenge

CONTRIBUTION · LENA.EXAMPLE ·
EXAMPLE.POSTACK.CORRECTION
· NO LEXICON EXISTS

Searching “css missing after deploy” on Four Words, the Vite base-path records do not come up. People describe this failure as missing CSS; the records only say assets or JavaScript.

at://did:example:lena/example.postack.correction/3k-example-h · invented fixture

It proposes two changes to the index’s description. Not to any source.

Closer to the source, not in it: Vite’s build guide describes the mechanism (base rewrites asset references, including CSS) but never the symptom. The source: CSS `url()` references, and asset references in your `.html` files (snapshot line 37).

The deploy guide never mentions CSS. Plausible, because the same base setting is involved, but not in this source.

### 3
Preview

Accept one or both parts to rebuild the index in your browser and rerun the query.

### 4
What did not change

- The sources — 30 pinned snapshots · lock digest e5ff45738ad2

- The frozen v1 index, labels and results — read-only; the preview patches a copy in this tab

- Lena’s contribution — a separate record; accepting it in a preview does not edit it

PUBLISH
DISCOVER
REUSE
CHALLENGE
CORRECT
MAINTAIN

Highlighted: the two steps this desk lets you try. The others happen elsewhere, or not yet.

## What the desk illustrates

Not a discovery: it is true by construction that a guessed correction moves the ranking as much as a supported one, because the ranking cannot see where a word came from. But building the desk made the consequence hard to ignore. A better retrieval number is not evidence that a change is right, so the weight of the whole idea moves from the index to the review: who accepts a change, on what evidence, and where that decision is recorded.

The essay supplies its own example. An early draft of the Disputed Neighbour flagged a symptom as missing from its source; an independent review found it there, worded differently. The flag looked authoritative and was wrong, and only checking the source caught it.

HYPOTHESIS So the convergence is not a master graph or a new platform. It is maintenance: corrections that are themselves attributable records, pointing at an exact version of an index’s claim, kept apart from the sources they never touch. Whether that works anywhere beyond this page depends on people doing the reviewing, which no interface can supply.

Maintenance is also where the photo-frame repository from the opening lives. Its strangers’ pull requests are corrections and additions; one person reads and merges them. The desk is a tiny model of that labour, with the review made visible.

## What is real today

- TESTED Four Words v1 and its evaluation — Frozen: 30 pinned sources, 27 labelled queries, one run with its audit.

- DEMONSTRATED The Disputed Neighbour — Real sources and frozen records; the shared heading is a hypothetical claim.

- DEMONSTRATED The Connection Contract — Fixture contributions and contracts; invented people under reserved names.

- DEMONSTRATED The Problem Desk — Frozen query and records; an invented correction; a local, in-browser preview.

- NOT BUILT Corrections that change a published index — No index reads contributions; nothing is accepted outside your tab.

- NOT BUILT Reading or publishing ATProto records — Needs explicit approval. No records exist on any network.

- HYPOTHESIS Community signals improving retrieval (H3) — Untested. The desk shows one mechanism, not an effect.

LAST

Afterword: how this essay was made, and what it got wrong

Or go back to the Impossible Index · the Switchboard
