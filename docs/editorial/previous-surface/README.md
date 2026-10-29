# The story before the lighter pass

The five story pages as they read before the editorial pass in `feat/irresistible-story`, kept so any cut passage can be brought back. They are a snapshot of `main` at `36263ee`, the deployed draft. They are not part of the site and are not built.

| File | What it is |
|---|---|
| `opening.md`, `indexing.md`, `community.md`, `convergence.md`, `afterword.md` | Visible text of each page, extracted from the built site at 1440 px: headings, paragraphs, list items, captions and tables in reading order. Experiment widgets are included as far as their visible text goes. |
| `source/*.tsx.txt` | The route and experiment components at that commit, verbatim, with links, source references and markup. The `.txt` suffix keeps them out of the type checker and the build. |

[`../CONTENT-INVENTORY.md`](../CONTENT-INVENTORY.md) records where each passage went: the surface, a margin note, the archive, or removed as duplication. Much of the cut text survives, in shorter form, in `src/content/margin.tsx` and the `/archive/` routes. Use this folder for the original wording.

Before restoring a passage, check it against the reviewed wording. The independent review (`docs/REFLECTION.md` §7) changed some claims on the new surface, and the older text is not automatically more accurate. The same files can be regenerated from git:

```bash
git show 36263ee:src/routes/indexing.tsx
```
