# Contributing to Philoo

## Before starting

1. Read `AGENTS.md`.
2. Open `docs/START_HERE.md` and follow the route for your task.
3. Read `docs/project/PROJECT_STATE.md`.
4. Pull the current source-of-truth branch and confirm a clean worktree.

Do not begin by copying an existing screen. First identify whether the task is
content configuration, reuse of a library engine, extraction of a candidate
pattern, or genuinely custom behavior.

## Work in vertical slices

A meaningful change includes the smallest complete set of:

- typed code or content;
- responsive behavior;
- accessibility;
- tests;
- visual verification when presentation changes;
- updated documentation when an API, rule, status, or source location changes.

## Architecture and data

Discuss changes to runtime architecture, database schema, storage, retention,
publishing, authentication, or infrastructure cost before implementation.
Visual changes and localized code reuse do not need an architecture proposal.

## Definition of done

Follow `docs/reference/QUALITY_GATES.md`. At minimum:

```bash
npm test
npm run lint
npm run build
```

Presentation changes also require browser verification at the required
viewports. A drag interaction needs an equivalent touch/keyboard path.

## Documentation protocol

If you add or change a reusable engine:

1. update its typed public API;
2. update the exercise catalog status;
3. update `docs/reference/LESSON_LIBRARY_API.md`;
4. update `/tecnico/biblioteca`;
5. update `docs/START_HERE.md` if the task routing changed.

If you move a file, fix every source map that names it. See
`docs/reference/DOCUMENTATION_SYSTEM.md`.

## End of session

1. Run the relevant quality gates.
2. Update `docs/project/PROJECT_STATE.md`.
3. Update the exact stopping point in `docs/project/DESKTOP_HANDOFF.md`.
4. Commit code and documentation together.
5. Push the active branch.
