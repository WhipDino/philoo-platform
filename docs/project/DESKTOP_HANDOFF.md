# Philoo Desktop Handoff

## Start here

This document is the operational handoff for continuing Philoo from another
computer or a new Codex session.

Read, in order:

1. `AGENTS.md`
2. `docs/project/PROJECT_STATE.md`
3. This file
4. The specification and implementation plan for the area being changed

## Obtain the correct code

The current source of truth is `codex/story-folio`.

```bash
git fetch --prune
git checkout codex/story-folio
git pull --ff-only
git status
```

If the branch does not exist locally:

```bash
git fetch origin
git checkout -b codex/story-folio --track origin/codex/story-folio
```

Before beginning, confirm the repository is clean and that the newest handoff
commit is present.

## Install and verify

Use the Node version already compatible with the repository, then run:

```bash
npm install
npm test
npm run lint
```

Run the app with:

```bash
npm run dev
```

The primary experience begins at:

```text
/aula/as-sombras/primeira-tela
```

## Assets and local dependencies

All canonical Cave and Plato assets required by the current lesson are tracked
in Git under `public/images/`. There should be no required image that exists
only on the laptop after the 2026-07-30 handoff.

`node_modules` and `.next` are intentionally local and must not be copied
between computers. Recreate them with `npm install` and the normal Next.js
commands.

Do not depend on undocumented files outside this repository. If a new source
asset, prompt, reference image, or product decision is required for future
work, either commit it in an appropriate project directory or document its
external location and licensing explicitly.

## How to work safely across two computers

If only one computer is active, work on `codex/story-folio`, commit, and push
before switching machines. On the other machine, pull before doing any work.

If both computers may work concurrently:

1. Pull `codex/story-folio`.
2. Create a focused branch, such as `codex/desktop-responsive-audit`.
3. Keep the task narrow.
4. Commit and push the branch.
5. Merge through review.

Never let two machines accumulate unrelated unpushed work on
`codex/story-folio`.

## Session close protocol

Before ending a meaningful work session:

1. Run relevant tests and lint.
2. Perform visual verification when presentation changed.
3. Update `docs/project/PROJECT_STATE.md` if architecture or product state
   changed.
4. Replace the "Next work" section below with the exact stopping point.
5. Commit code, tests, assets, and documentation together.
6. Push the branch.

Conversation memory is useful but is not the source of truth. Git history,
project documents, tests, and committed assets are the durable shared memory.

## Next work

The latest broad correction pass is committed and tested. The recommended next
task is a visual acceptance audit of the complete `As Sombras` journey at
desktop, tablet, and phone widths.

Focus on:

- scene-to-scene continuity;
- clipping and overflow;
- Plato scale, gaze, grounding, and transparency;
- readable activity instructions;
- keyboard and Back behavior inside multi-step scenes;
- the Doxa transition;
- the footprint teaching example and evidence-classification activity;
- the first-doubt ending and reward animation;
- reduced-motion behavior.

After visual acceptance:

1. Fix the three lint warnings.
2. Replace the generated README.
3. Decide whether `codex/story-folio` is ready to merge into `main`.
4. Only then begin the next platform layer or Cave session.
