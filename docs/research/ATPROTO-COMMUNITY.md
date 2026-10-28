# ATProto and portable communities — research notes

**Retrieved 2026-10-28.** This was read-only research: no accounts were created and no records were published. Field names come from lexicon files read at the revisions listed under [References](#references); anything that was not read directly is marked as such. The notes were compiled by an AI research agent. Spot checks against the primary sources (`com.atproto.repo.strongRef`, `app.bsky.feed.post#replyRef`, the Atmospheric Groups and Spaces posts) matched.

Status vocabulary: **exists, in use** · **exists, niche or experimental** · **proposal** · **not found**.

## Summary

| Concept | Existing lexicon / NSID | Status |
|---|---|---|
| Versioned pointer to a record | `com.atproto.repo.strongRef` (`uri`, `cid`) | Exists, in use (core protocol) |
| Long-form document, publication | `site.standard.document`, `site.standard.publication` | Exists, in use (Leaflet, pckt, Offprint) |
| Recommend a document | `site.standard.graph.recommend`; `pub.leaflet.interactions.recommend` | Exists; adoption not measured |
| Subscribe to a publication | `site.standard.graph.subscription` | Exists |
| Threaded reply (microblog) | `app.bsky.feed.post#replyRef` (`root`, `parent`) | Exists, in use |
| Quote / embed a record | `app.bsky.embed.record` (`record`: strongRef) | Exists, in use |
| Like, repost | `app.bsky.feed.like`, `app.bsky.feed.repost`; `community.lexicon.interaction.like` | Exists, in use (the community version is niche) |
| Comment on a document | `pub.leaflet.comment`; `fyi.frontpage.feed.comment`; `at.margin.reply` | Exists, app-specific |
| Comments through a Bluesky thread | `site.standard.document.bskyPostRef` plus a post thread | Exists, a common pattern |
| Question to an author, and the author's answer | `pub.leaflet.interactions.question` / `.answer` / `.questionVisibility` | Exists, niche (Leaflet) |
| Vote | `fyi.frontpage.feed.vote` | Exists, niche |
| Labels, moderation | `com.atproto.label.defs#label`, `#selfLabels` | Exists, in use |
| Groups, communities | opensocial.group proposal on Atproto Spaces | Proposal; Spaces is in alpha |
| Endorse a solution, correction, dispute, accepted answer, problem/solution record, typed evidence | none | **Not found** |

## 1. Protocol basics that matter here

- **Repositories and records.** A repo is a signed Merkle Search Tree. Its keys are `<collection>/<rkey>`, where the collection is an NSID, and its values are records.
- **AT URIs and strongRefs.**
  - AT URIs (`at://<did>/<collection>/<rkey>`) are not content-addressed; prefer a DID over a handle in them.
  - `com.atproto.repo.strongRef` adds a `cid`, which pins one exact version of a record.
- **Records are mutable.** `putRecord` replaces a record, with optional compare-and-swap through `swapRecord`.
  - The repo holds only one version per path.
  - After an edit, a strongRef still points at the old CID, so a reader can tell the target changed. The old content is no longer in the repo.
- **Deletion leaves no tombstone.** References dangle afterwards. Downstream indexes and caches may still hold copies.
- **Anyone with a domain can define Lexicons** for NSIDs under that domain.
  - Schemas are published as `com.atproto.lexicon.schema` records and resolved through DNS.
  - Evolution rule: new fields must be optional, and breaking changes need a new NSID.
- **Unknown Lexicons.**
  - **Storage:** a PDS stores records of unknown Lexicons by default. Validation is optimistic, or "fail-open".
  - **Indexing:** an AppView indexes only the collections it chooses to. The Bluesky AppView's indexer skips collections it has no plugin for (read at atproto@6ed6fe3). A `site.standard.document` is therefore stored and relayed, but the Bluesky AppView does not index it.

## 2. Standard.site

The lexicon sources (`src/lexicons/*.ts`) were read at standard.site@549453e (2026-04-22).

- **`site.standard.publication`**
  - Required: `url`, `name`.
  - Optional: `icon`, `description`, `basicTheme`, `preferences.showInDiscover`, `labels`.
- **`site.standard.document`**
  - Required: `site` (an at:// publication or an https URL), `title`, `publishedAt`.
  - Optional: `path`, `description`, `coverImage`, `content` (open union), `textContent`, `bskyPostRef` (strongRef, "useful to keep track of comments off-platform"), `tags`, `labels`, `links`, `contributors[]` (`did`, `role`, `displayName`), `updatedAt`.
- **Graph records.** `site.standard.graph.recommend` (`document`, `createdAt`) and `site.standard.graph.subscription` (`publication`, `createdAt`).
- **No comments.** Standard.site defines no comment or reply record; it offers the `bskyPostRef` hook instead.
- **Verification** works through `/.well-known/site.standard.publication` and `<link rel="site.standard.document">`. This came from search snippets of the docs; the docs page itself was not read.

## 3. Bluesky interaction lexicons

The canonical `app.bsky` lexicons now live in `bluesky-social/bsky` (read at bsky@293d649).

- **`app.bsky.feed.post`**
  - Required: `text`, `createdAt`.
  - Optional: `reply` (`root` and `parent`, both strongRefs), `embed`, `facets`, `langs`, `labels`, `tags`.
- **`app.bsky.embed.record`.** `record: strongRef`; its views include `#viewNotFound`, `#viewBlocked` and `#viewDetached`.
- **`app.bsky.feed.like` and `app.bsky.feed.repost`.** `subject` (strongRef), optional `via`, `createdAt`.
- **`app.bsky.feed.threadgate` and `app.bsky.feed.postgate`.** These control who may reply and who may embed.
- **`app.bsky.graph.list` and `app.bsky.graph.listitem`.** List items hold accounts (DIDs), not records.

**Pointing at non-Bluesky records.** The schemas allow it, because a strongRef accepts any AT URI. In practice:

- **Replies.** The Bluesky AppView treats a post replying to a non-indexed record, such as a `site.standard.document`, as an invalid reply.
- **Likes on such records** may be stored, but they appear nowhere in the app.
- **Quote embeds** of unsupported types presumably fall back to "not found".

These behaviours were inferred from the AppView code, not tested live.

## 4. Blog discussion over ATProto

- **A Bluesky thread as the comment section** (exists, in use).
  - The author posts on Bluesky and stores that post's AT URI. The site then fetches the thread through `app.bsky.feed.getPostThread`.
  - Standard.site's `bskyPostRef` formalises the link.
  - The comments are Bluesky posts, under Bluesky moderation, threadgates and blocks.
- **`pub.leaflet.comment`** (exists, Leaflet).
  - Fields: `subject` (at-uri), `plaintext`, `createdAt`, optional `reply.parent`, `facets`, `onPage`, `attachment`.
  - It uses plain at-uris, not strongRefs.
- **`pub.leaflet.interactions.question`, `.answer` and `.questionVisibility`** (exists, niche).
  - The answer record lives in the document owner's repo.
  - `questionVisibility.accepted[]` means accepted for display, not an accepted answer.
  - This is the closest existing pattern to author-curated interaction.
- **Frontpage.** `fyi.frontpage.feed.comment` (`post` and `parent` as strongRefs) and `fyi.frontpage.feed.vote`.
- **WhiteWind `com.whtwnd.blog.entry`.** No comment record; the repository's last commit was 2025-04-15.
- **Margin `at.margin.reply`** (web annotation). Only the field list was read.
- **Backlink indexes.** Constellation (microcosm) indexes links across all lexicons: a practical way to find everything that references record X. Its maturity was not verified.

## 5. Moderation and availability

- **Labels.**
  - `com.atproto.label.defs#label` requires `src`, `uri`, `val` and `cts`. An optional `cid` ties a label to one version.
  - A label can target any record or account.
  - How a label value is interpreted is up to each application. Labels from one app's labeler have no effect elsewhere unless another interface chooses to honour them.
- **Blocks** (`app.bsky.graph.block`) are public records enforced by the Bluesky AppView. Other apps are not obliged to respect them.
- **Availability.**
  - When a PDS goes offline, content is unavailable from its source, though caches may still serve copies.
  - Deactivated accounts' content "should not be displayed or redistributed"; deleted accounts' content "should be removed from the network".
  - These are norms that propagate hop by hop. The protocol cannot enforce them.

## 6. Atmospheric Groups

**Proposal.**

- The atproto blog introduced Atmospheric Groups on 2026-10-22, defining a group as a DID with permissioned spaces under it. It points to the community **opensocial.group** proposal.
- The underlying Spaces proposal (0016) went into public alpha on 2026-08-20. It provides access control, not encryption.
- Grain has a working example (`social.grain.group` with a `fyi.opensocial.members` space).
- Admin approval and cross-app interoperation are still to come.
- The opensocial.group lexicons were not read.

## 7. Gaps: no existing lexicon found for

- endorsing a *specific solution* (likes and recommends carry no meaning beyond "liked");
- a correction aimed at one version of a record;
- a disagreement or dispute;
- an "accepted answer" chosen by the asker;
- problem/solution records;
- typed evidence links.

An "attestation" record with revocation has been discussed in lexicon-community, as a discussion only. The nearest reusable designs are Leaflet's author-repo visibility records and Frontpage's strongRef-based comments.

## What a Postack fixture can honestly model

- **Real today:**
  - Publishing the essay as a `site.standard.document`, using `title`, `textContent`, `tags`, `site`, `path`, `publishedAt`/`updatedAt`, `contributors` and `bskyPostRef`.
  - Replies as `app.bsky.feed.post` (rendered in Bluesky only if the root is a Bluesky post).
  - Recommend as `site.standard.graph.recommend`; like as `app.bsky.feed.like`.
  - Labels as `com.atproto.label.defs#label`.
  - Versioned pointers as strongRef `uri` + `cid`.
- **Hypothetical, needing a new namespace:**
  - the problem/solution record structure;
  - typed evidence and relations;
  - extraction provenance;
  - endorsement-of-a-solution, correction, dispute and accepted-answer records.
- **How fixtures should present them.** Fixtures must give these an obviously placeholder NSID and label them hypothetical. `site.standard.document#content` is an open union, so a structured payload *can* travel inside a document, but no reader interprets it today.

Postack's fixtures use the placeholder namespace `example.postack.*` for hypothetical types (see `src/data/community-fixtures.ts`).

## References

- bluesky-social/atproto @ `6ed6fe39dded20f1e8995042135fba83b31d7b26` (2026-10-27). Files read:
  - `lexicons/com/atproto/repo/{strongRef,putRecord,createRecord,deleteRecord}.json`
  - `lexicons/com/atproto/label/defs.json`
  - `lexicons/README.md`
  - `packages/bsky/src/data-plane/server/indexing/{index.ts,plugins/post.ts,plugins/like.ts}`
- bluesky-social/bsky @ `293d6494ed9058e28a04b97133d16ab8abe7ef5e` (2026-10-23). Files read:
  - `lexicons/app/bsky/feed/{post,like,repost,threadgate,postgate}.json`
  - `embed/record.json`
  - `graph/{list,listitem,block,defs,referencelistoptout}.json`
- standard.site/lexicons on tangled.org @ `549453e37a4e15e8318f5b7655b230d0925b9e02` (2026-04-22) · https://standard.site
- leaflet.pub/leaflet on tangled.org @ `6b7510074d01d436cc02841600d619ea1e98c511`: `lexicons/pub/leaflet/{comment,interactions/*,graph/recommendations}.json`
- likeandscribe/frontpage @ `d5057012d61845f4202c51838c77c714e754cc15`: `lexicons/fyi/frontpage/feed/*.json`
- whtwnd/whitewind-blog @ `047c8d44b5a13e5b8518823982c486e9e3df50c0`: `lexicons/com/whtwnd/blog/entry.json`
- margin.at/margin on tangled.org @ `62853150e5d14bfe5ba3a0cf94ba2d5cceef1c5a`: `lexicons/at/margin/reply.json`
- lexicon-community/lexicon @ `b4a2b19613105ede6b43e1330d3831842278b073`: `community/lexicon/interaction/like.json`
- Specs: https://atproto.com/specs/repository · https://atproto.com/specs/lexicon · https://atproto.com/specs/at-uri-scheme · https://atproto.com/specs/account · https://atproto.com/specs/label
- https://atproto.com/blog/atmospheric-groups-intro (2026-10-22) · https://atproto.com/blog/atproto-spaces-alpha (2026-08-20)
- https://discourse.atmosphere.community/t/what-is-an-atmospheric-group-community/906
- https://coryzue.com/writing/bluesky-comments (credits Emily Liu, Nov 2024)
- Constellation: https://tangled.org/microcosm.blue/microcosm-rs/blob/main/constellation/readme.md
- Attestation discussion: https://github.com/orgs/lexicon-community/discussions/8

**Not read directly:** the opensocial.group lexicons, the standard.site verification docs, Semble (`network.cosmik.*`). **Not measured:** adoption of Leaflet's interaction records. **Inferred from code, not tested live:** Bluesky AppView handling of likes and embeds whose subject is not a Bluesky record.
