# Photo Frame Commons: ATProto as a community layer (slice D)

**Live, read-only snapshot fetched 2026-10-29. No account, no authentication, no records published. Builds on [ATPROTO-COMMUNITY.md](ATPROTO-COMMUNITY.md), the protocol and lexicon research of 2026-10-28 at pinned revisions. Its conclusions are not repeated here.**

## What exists on the network about this repository

`npm run commons:atproto` asked three public services:

| Question | Service | Answer |
|---|---|---|
| Which records link any of the 265 thread URLs, or the repository? | Constellation backlink index (`links/all`, every URL with and without a trailing slash: 532 targets) | 9 backlinks from 5 posts, covering issue #229, PR #3, PR #4 and the repository root |
| Which posts mention `photo-frame-dashboard`? | `api.bsky.app` `searchPosts` | 97 hits, 4 of which link the repository. `public.api.bsky.app` refuses search with **403**; that refusal is recorded, not worked around |
| What do those records say, and where do they live? | Each author's PDS through `com.atproto.repo.getRecord`, found via `plc.directory` | 17 records read in the linking threads, 11 kept, 0 unavailable |

**Only Bluesky posts link it.** Every backlink is an `app.bsky.feed.post`. No `site.standard.document` and no other collection links any thread. Checking one long-form author's repository directly found no Standard.site records either.

**What was kept.** The rule keeps records that link the repository, plus replies in the same threads by the authors of those records.
- Six replies by other people were read and not stored.
- Text is kept only where it is context for a link: the linking post and the posts it replies to.
- Other kept replies keep metadata only: URI, CID, DID, PDS, time and text hash. One of them mentions the author's health, which is no reason to republish it.

**Result: 11 records from 3 accounts.**

| Account | What it adds |
|---|---|
| shindakun.net | A PF1007L report and the vendor-root-shell warning. It links PR #3 and PR #4, and later issue #229 ("do it again") |
| wesbos.com | The maintainer's own posts: "A bunch of people had this issue", and a board-variant warning that links the repository |
| xiangul.bsky.social | A German thread pointing someone to the repository |

## How the records attach to problems

`src/commons/atproto/projection.ts` attaches a record to a problem in one of three ways. It never infers an attachment from wording.

- **Declared.** The record links a GitHub thread the problem cites. shindakun.net's post links #229, which attaches it to *The frames still trust certificate roots…*. If the link points at one comment, the record attaches only to the problems citing that comment.
- **Deterministic.** The record links a pull request, and that pull request changed a document the problem cites. The post linking PR #3 attaches to *Root ADB without writing anything…*, because PR #3 added `docs/aimor-remote-root-shell.md`. Nobody stated that relation; it is derived from identifiers.
- **Repository.** The record links only the repository. It is shown on the Commons front page, not under any problem.

## Identity

`src/commons/atproto/identities.ts` records what links each GitHub account to an ATProto identity, and how strongly.

- **wesbos ↔ wesbos.com:** two claims to the same domain. The handle is a domain the DID controls, and the GitHub profile lists www.wesbos.com.
- **shindakun ↔ shindakun.net:** implied in a post only. The GitHub profile lists a different domain, shindakun.dev. The ATProto account calls PR #3 "the security focused PR" while replying in a thread about it. That implies authorship and proves nothing.
- **A shared name is never treated as a link.**

## The fixture

`corpus/commons/atproto-fixtures.json` holds one fixture.

- **What it is:** the real correction on #12, written as the `app.bsky.feed.post` its author could have published. It links the comment and the start-here line it qualifies.
- **Why it cannot pass for a real record:** its identity is `did:example:frame-owner` / `frame-owner.example`, which cannot resolve, and it has no CID. Tests enforce both.
- **Why it is a post:** no existing lexicon expresses "this corrects that" (see ATPROTO-COMMUNITY.md §7), so the fixture uses what people actually publish today. Postack attaches it by its link, not by owning it.

## What happens when a record disappears

`asUnavailable()` is what the interface shows when a record cannot be fetched from its PDS. That can happen through deletion, an account takedown or the PDS being down. Postack keeps the record's address, CID and text hash, and drops its words. The snapshot script records `available: false` for any record whose `getRecord` fails. None did on 2026-10-29.

## What ATProto added here, and what it did not

**Added:**
- Authorship that travels. Each record names a DID and a PDS, and its CID pins the exact version.
- Conversation outside GitHub, in the open. The maintainer's "A bunch of people had this issue" exists only on Bluesky.
- Backlinks: the network can be asked "who links #229?", and the question has an answer.

**Did not add:**
- Any semantic relation. A link says "about", never "corrects", "confirms" or "contradicts".
- Any review, any sign that a fix worked, any notion of a problem.
- Volume. Five linking posts against 331 GitHub comments is the honest scale for this project. Here GitHub is where the commons is, and the network is a small side channel.

**A signed record proves who said it, not that it is true.** The interface shows ATProto records as "elsewhere": attributed, linkable and possibly gone. They are never evidence that a fix works.
