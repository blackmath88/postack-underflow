AN OPEN RESEARCH ESSAY · DRAFT

# We already solved this.

So why are we solving it again?

I

## The encounter

It starts with a cheap photo frame and somebody who wanted it to do something else.

Android photo frames are small locked-down computers: a screen, a board, a vendor app that shows your pictures and, on some models, talks to the vendor’s servers. In Syntax episode #1050, Wes Bos describes getting into his. For months, he says, AI models told him it could not be done; progress came when he suggested connecting to it as an Android device or trying button combinations. The hosts spend a good part of the episode on the same pleasure applied to televisions: debug access, uninstalling bundled apps, replacing the launcher.

What Wes learned did not stay in his session. His public repository, photo-frame-dashboard, is a set of notes and scripts for taking over these frames: how to identify the board, get debug access, back up the firmware, root it, replace the vendor app and run your own dashboard full screen. Its opening summary tells readers to point an agent at it, and a later section headed “For agents: start here” lists rules learned the hard way: ask before every write, take a verified backup first, stop at the first mismatch, keep observations separate from guesses.

Counted on GitHub, 2026-10-28 13:05 UTC. Repository created 2026-10-08; 196 pull requests and 56 issues were opened before the episode aired. In the episode (around 58:29) Wes says his photo-frame repository has over 200 pull requests or issues from other people’s agents. The episode does not name the repository; identifying it as this one is our inference from its owner, subject, date and numbers.

The repository asks for something back. Before you start, check the open issues and pull requests, because someone may already have your board. When you learn something, a new firmware string, a cable that does not work, a failed attempt, open a pull request with it, strip your private data first, and show the frame’s owner the diff, since it goes out under their name. People did. The repository fills with device notes from strangers and their agents, and a maintainer merges most of them.

This is what a commons looks like when it works: a problem, an exploration, an explanation, something reusable, and a route back. It is also not quite the story we expected to tell. Here agents are not reconstructing in private. They are contributing, because one person built a place that asked them to and told them how.

II

## The lost shortcut

PARAPHRASE The same episode contains the worry this essay set out from. Near the end, CJ asks what happens to shared problem-solving knowledge now that developers increasingly ask agents rather than each other. An agent can read the code, reason about it and reach a working fix; then the next person’s agent does the same work again, and the solution never lands anywhere others can find it. He suggests the main party learning from the repetition is whoever trains the models.

The hosts push back. Scott points to projects where reusable building blocks are shared in a community space. Wes notes that Stack Overflow has built agents of its own, though he doubts they are catching on, and points to his repository full of agents’ pull requests. When a listener says the solutions are on GitHub anyway, CJ answers that many developers work on closed-source code.

Our paraphrase of a spoken conversation, not a quotation; CJ’s point starts roughly 55 minutes in. Read the transcript for the exact wording. Not affiliated with or endorsed by the show.

The shortcut CJ misses was never one product. A search engine found pages, by relevance and by how the web linked to them. A Q&A site organised what was on those pages: one question per problem, answers ranked by people who had tried them, corrections attached to the thing they corrected. Together they made other people’s afternoons reusable.

01A short query reaches one public thread that many people shaped.

### Four words and someone else’s afternoon

Say a site deployed to GitHub Pages loads without its stylesheet. For a long stretch of software history the next move was to type a few words, something like css missing after deploy. A search engine found a page; the page was a question someone had asked years earlier, organised by a Q&A site into an accepted answer, a competing one, and a comment noting that the fix changed in a later version. Somebody spent an afternoon so that you could spend five minutes.

01A short query reaches one public thread that many people shaped.

### An agent reconstructs the answer

Today you might ask an agent instead. It reads your build configuration, opens the framework’s documentation and an issue or two, compares the generated asset paths with the URL the site is served from, and proposes a base-path setting. That is good engineering. It works from primary sources rather than a stale answer, and it fits the fix to your project.

02An agent reconstructs a fix by exploring sources directly.

### And then again

The next person with the same problem gets the same careful exploration, from the beginning. Their agent cannot see what yours found. While this site was being built, a sibling project’s GitHub Pages deployment was reported by the project owner to come up largely unstyled despite a green workflow (its repair commit), and this site’s first deployment never happened because its pull requests were stacked and none reached main. Small, well-documented kinds of problem, worked out again.

03The next person’s agent repeats the exploration from the start.

### Little returns

Most of those explorations end in a working diff and a private transcript. Some leave something public, an issue or a pull request, but rarely a question someone else could find by its symptom, an answer others could vote on, or a correction for the next version. The knowledge was produced; most of it did not go anywhere shared.

04Each answer mostly stays in its own session; little returns to a shared place.

An agent that reconstructs a solution and a reader who retrieves one may end up with the same code. They do not end up with the same knowledge. A retrieved answer arrives with a history of other people checking it: who wrote it, under which versions, who disagreed, what was corrected. A reconstructed answer may cite the documentation it read, but nobody else has looked at it yet.

This is not nostalgia. Public answers went stale, duplicates were closed with a curt link, and some questions were never asked for fear of how they would be received. Reconstruction is often the right call: when the context is private, when the old answer is wrong, when nothing was ever written down. The photo-frame repository even shows agents leaving better notes than many of us did. The question is narrower: when a useful investigation ends, where does it go?

III

## Two problems, at least

Look closely at what made either the old shortcut or the photo-frame repository work, and two different things come apart.

| ASPECT | 01 · INDEXING | 02 · COMMUNITY |
| THE QUESTION | The answer exists. Why can’t we find it? | The knowledge exists. Who keeps it alive? |
| WHAT IS MISSING | A route from a symptom to a solution someone already wrote down | A place where checking, correcting and disagreeing accumulate |
| THE SYMPTOM | Rediscovering a known fix from scratch | Fixes nobody else can see, check or improve |

Finding. The photo-frame notes are organised by device and by phase: identify, get access, back up, root. That suits someone who already knows which board they have. Imagine instead someone who only knows that their frame went blank after an update (our example, not a case from the repository): they have to find their own way in. Whether they can depends on descriptions somebody wrote in advance.

Keeping. Those notes stay alive because people keep checking them against their own units and correcting them, and because one person keeps reading and merging what arrives. That work is not an index. It is a community, and it has a cost.

HYPOTHESIS Each problem is easier to see through the other. A fast index of unreviewed answers spreads mistakes efficiently; a thoughtful community nobody can find gets rediscovered from scratch.

They are not the only problems. Whether a fix applies to your version, whether anyone has verified it, whether it was documented at all, what incentive anyone had to write it down, and who maintains it when the platform changes: each can lose an answer on its own. This essay follows two of them because they can be made into experiments you can try.

### Choose a rabbit hole

Both have something to try, and both lead to the same desk at the end.

Or go straight to the Problem Desk, where they meet, and the afterword, where this essay looks at how it was made.
