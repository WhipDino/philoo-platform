<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Philoo project orientation

For every task, begin with `docs/START_HERE.md`. It is the documentation router
for humans and context-free AI.

Before changing the project, read:

1. `docs/START_HERE.md`
2. `docs/project/PROJECT_STATE.md`
3. `docs/project/DESKTOP_HANDOFF.md`
4. The task-specific documents selected by `docs/START_HERE.md`
5. The specification or implementation plan associated with the area being changed.

When asked to create a lesson, do not improvise from one existing screen. Read
`docs/playbooks/CREATE_A_LESSON.md`, `docs/reference/STORY_THREAD.md`,
`docs/reference/PHILOSOPHER_LESSON.md`, and
`docs/reference/FOLIO_LAYOUT_CONTRACT.md`. Select the interaction using
`docs/reference/EXERCISE_SELECTION.md` (EX-01–EX-11). Reuse a foundation
engine; do not reconstruct it. Do not invent a new engine unless a human asked
and the catalog cannot express the thinking move.

Treat `codex/story-folio` as the current product source of truth until it is
reviewed and merged into `main`. Preserve Philoo's educational principles:
non-punitive feedback, private reflection, visible revision of thought, and a
clear distinction between observation, belief, evidence, representation, and
source.

At the end of a meaningful work session, update `docs/project/PROJECT_STATE.md`
and the "Next work" section of `docs/project/DESKTOP_HANDOFF.md`, then commit and
push the code and documentation together.
