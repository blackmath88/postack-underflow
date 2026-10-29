# Photo Frame Commons — the public corpus (slice A)

**Pilot 001 · snapshot 2026-10-29T16:19:22Z · source [wesbos/photo-frame-dashboard](https://github.com/wesbos/photo-frame-dashboard) at `0bff55ef3fb2` (2026-10-23).**

This is the source material for the Photo Frame Commons: one real public repository's problem-solving history, read once, at a recorded revision and time. It is not a crawl. Nothing was written to the source repository.

## What was read

| | Count | Notes |
|---|---:|---|
| Issues | 57 | 49 closed, 8 open |
| Pull requests | 206 | 150 merged, 30 closed unmerged, 26 open; 180 touch `docs/`, 73 touch code |
| Discussions | 2 | Discussions are enabled but almost unused |
| Issue and PR comments | 331 | Two by bots |
| Review summaries | 0 | No PR in the snapshot has a submitted review |
| Markdown documents | 126 | Every `.md` at the revision except `.agents/` |
| Distinct accounts | 221 | Thread and comment authors, including 2 bots; 2 further items are by deleted accounts |

Threads span 2026-10-10 to 2026-10-29. Method: the authenticated `gh` CLI, read-only. GraphQL was used for threads, timelines, files and commits, and REST for the file tree, document blobs and any comment overflow. The whole read took 15 GraphQL calls.

## Coverage

- **Complete except one gap.** The API reported 57 issues, 206 pull requests and 2 discussions, and all were received. One gap remains: PR #80 changes 124 files, of which only the first 100 paths are recorded.
- **Excluded:**
  - inline review comments on diff lines;
  - reactions, assignees, milestones and project boards;
  - non-Markdown files, since code is linked by path and not snapshotted;
  - forks, external sites and attachments, including the board photos many reports embed.
- **Edits.** GitHub keeps no edit history through this API. A thread or comment marked `edited` may have said something else earlier. The snapshot captures its text at snapshot time only.
- **Timeline events.** Each thread's first 100 events are read. No thread exceeded that.

## What is committed, and what is not

[`corpus/commons/manifest.json`](../../corpus/commons/manifest.json) holds the provenance for every thread and comment:

- URL, author and whether the author is a bot;
- created, updated and closed times, and whether the text was edited;
- state and labels;
- the SHA-256 and byte length of the text;
- explicit `#n` and URL references;
- timeline cross-references, closing links and duplicates.

For pull requests it also holds merge state, merge commit, files and commits. For documents it holds the path, blob SHA, SHA-256 and pinned URL.

**The text itself stays in `corpus/commons/.cache/`, which is gitignored.**

- **Repository files** are MIT-licensed.
- **Issue and pull request text** belongs to its 221 authors, and the licence file does not cover it. The site quotes only short excerpts, linked to the original.
- **Credentials.** Some threads contain things that should not be republished: a device test-app password, serial numbers the maintainer asked people to remove, and private device credentials. Excerpts avoid them.

Reproduce or refresh:

```bash
npm run commons:snapshot
```

```bash
npm run commons:check
```

`commons:check` validates the manifest. When the cache exists, it also checks every cached text against its recorded hash (722 texts at the time of writing). A later snapshot will differ: threads are still active. Compare manifests rather than overwriting one, and record a new snapshot as a new file.

## What the corpus already is

The repository is not a raw pile of issues. The maintainer folds each report into curated documents, then closes the issue as "documented". In [`docs/pf1007l-start-here.md`](https://github.com/wesbos/photo-frame-dashboard/blob/0bff55ef3fb2a3bfdab05bc8e3bd0c9d69f63189/docs/pf1007l-start-here.md) that work takes two forms:

- a **firmware table** listing reports, eMMC size, boot hash, stock ADB state and what worked;
- a **symptom → fix → reports** table, "U-Boot settings that fixed ums problems". It marks unsolved rows **Unsolved**.

That is a hand-maintained problem index, written before Postack arrived. Any index we build is a second reading of material that already has a first one. Slice B has to say what, if anything, it adds.
