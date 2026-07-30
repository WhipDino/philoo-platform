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
/inicio
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

The student platform is implemented at `/inicio`. It is a responsive,
learning-first preview of the post-login student space with a persistent
platform header, dominant active-lesson workspace, curriculum path,
exploration library, notification preview, and profile preferences. Plato is
centered in the Cave stage and gestures toward the lesson controls. The
curriculum now follows era → journey → chapter; `Filosofia Antiga` begins with
the three-chapter Cave journey and continues through short Ancient Philosophy
journeys. It uses static preview content for now and enters the existing
`As Sombras` lesson through `/aula/as-sombras/primeira-tela`.

The recommended next task is to define the purpose and content model of
`Explorar`: decide how it differs from the suggested historical path while
still helping a student pursue a question freely. Do this as a product/content
decision before connecting the portal to live data.

After acceptance:

1. Extend the curriculum map beyond the first Ancient Philosophy era without
   turning each philosopher into a long standalone course.
2. Complete the outstanding whole-lesson visual/accessibility audit.
3. Decide the authentication and role-routing approach before implementing it.
4. Map portal preview fields to future Supabase assignments, announcements,
   class membership, and progress; discuss the data architecture before any
   schema work.
5. Fix the three existing lint warnings and replace the generated README.
