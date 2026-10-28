# Case study: the photo-frame repository

**Status:** identified by inference, 2026-10-28; the episode does not name the repository. This resolves the "unverified lead 001" recorded in PR #6 (`docs/research/CASE-STUDY-LEADS.md` on `docs/exploratory-story-and-shared-knowledge` @ `92fc25a`).

## What the episode says
[Syntax #1050](https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript), "Everyone Is Hacking Their TV" (2026-10-26). These are our paraphrases of an AI-assisted reading of the transcript; check the timestamps there before quoting.

- **The topic.** The episode is about hacking smart TVs and photo frames over ADB. Wes says the TV hacks are essentially the same work as the photo-frame hacks (about 21:21).
- **Wes's own frame (about 31:03).** He says that for months AI models told him it couldn't be done. Progress came when he suggested connecting to it as an Android device or trying button combinations.
- **The repository (in the segment starting about 58:29).** Wes says his photo-frame project's GitHub repository has over 200 pull requests or issues from other people's agents.
- **Other frame owners.** CJ bought a round frame at a thrift store to hack. Scott mentions a different community repository, "reframe", by name only.

## Identification
**The episode does not name the repository.** We identify it as **[wesbos/photo-frame-dashboard](https://github.com/wesbos/photo-frame-dashboard)**, on this evidence:
- it is on Wes Bos's GitHub account;
- its subject matches: "Getting ADB, root, backups and custom apps onto locked-down Android photo frames";
- it was created on 2026-10-08, before the episode;
- on 2026-10-28 it had 201 pull requests and 56 issues, consistent with "over 200". 196 PRs and 56 issues had been opened before the episode aired on 2026-10-26.

This is an inference, not a quotation of the episode. The site says so.

## What the repository shows
Pinned at commit `0bff55ef3fb2a3bfdab05bc8e3bd0c9d69f63189` (MIT); counts observed 2026-10-28 13:05 UTC.

- **Agents as readers.** The README's opening TLDR invites the reader to point an agent at the repository. A section titled "For agents: start here" sets rules: ask the owner before every write, take a verified backup first, stop at the first mismatch, and keep observations separate from guesses.
- **Agents as contributors.** A section asks contributors to "send back what you find": check open issues and PRs first, record new hardware or failed attempts in a per-device doc, strip private data, and show the owner the diff before opening a PR.
- **Contributions.** 201 PRs: 150 merged, 21 open, 30 closed unmerged. 56 issues: 49 closed.
- **Crude agent signal.** In a keyword scan of the 40 most recent PR descriptions, 33 mention an AI tool or agent. This says little about how much of each PR an agent wrote.
- **Accumulated documentation.** A device index with about 72 table rows, and a community-builds page that the README says holds more than 70 shared builds.

## Why it is the encounter
It is a human-scale example of the pleasure of tinkering in public, and it complicates the essay's own provocation: here agents *are* contributing back, because the repository asks them to and tells them how. Two of the essay's problems are visible in it:
- **Indexing:** the knowledge is organised by device and phase, not by symptom.
- **Community:** maintaining it falls on the person who reviews and merges the contributions.

## Licensing and images
The repository is MIT-licensed. The site quotes no code and uses no images from it; it links to the pinned README.
