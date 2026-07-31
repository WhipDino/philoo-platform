# Philoo Desktop Handoff

## Start here

This document is the operational handoff for continuing Philoo from another
computer or a new Codex session.

Read, in order:

1. `AGENTS.md`
2. `docs/START_HERE.md`
3. `docs/project/PROJECT_STATE.md`
4. This file
5. The task-specific route selected by `docs/START_HERE.md`
6. `docs/architecture/PHILOO_LESSON_SYSTEM_MAP_V1.md` for lesson-system work
7. `docs/product/PHILOO_EXERCISE_CATALOG_V1.md` before changing or reusing an
   activity
8. The specification and implementation plan for the area being changed

The visual contributor manual is at `/tecnico`. The rendered exercise/API
catalog is at `/tecnico/biblioteca`; its typed catalog data lives in
`src/domains/lesson-library/exercise-catalog.ts`. The task router used by the
manual lives in `src/domains/technical-docs/technical-docs-registry.ts`.

Every curated guide is also fully readable at `/tecnico/guias/[slug]`.
`/tecnico/guias/comecar` is the human website entry and `/tecnico/busca`
searches the real Markdown contents. The website displays repository source
paths and GitHub links, while the Markdown remains the single source of truth.
Add important documents to the typed registry; never copy their contents into
page components.

For a new AI with no memory, the minimum orientation is:

1. `AGENTS.md`;
2. `docs/START_HERE.md`;
3. `docs/project/PROJECT_STATE.md`;
4. the task-specific documents selected by Start Here.

Do not paste old chat history as the primary handoff. The repository routes the
agent to current code, types, tests, and decisions.

EX-05 guided classification is the first real library engine. Its contract,
renderer, examples, and protected responsive CSS live in
`src/domains/lesson-library/activities/guided-classification/`. The Cave lesson
uses it through
`src/domains/lessons/as-sombras/cave-evidence-sort-config.ts`; do not move
lesson copy back into the renderer or `PhilooDiscoveryTable`.

For a new EX-05 use, do not study and rebuild the Cave screen. Import the
public library API and provide content:

```tsx
import {
  GuidedClassificationExercise,
  getGuidedClassificationGuide,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";

const activity = {
  id: "unique-activity-id",
  schemaVersion: "1",
  guide: getGuidedClassificationGuide("plato"),
  // workedExample, prompt, categories, cards, feedback, labels, table
} satisfies GuidedClassificationConfig<CategoryId>;

export function LessonActivity() {
  return <GuidedClassificationExercise config={activity} />;
}
```

The component owns the exercise. The author changes only typed content.
Character pose, direction, crop intent, proportions and responsive sizes live
in `guided-classification-character-presets.ts`; do not hardcode an image path
or reproduce those measurements in a lesson. Use the optional `initialState`,
`onStateChange`, and `onComplete` props only when connecting progress storage.

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
/aula/a-subida/primeiro-olhar
/aula/a-subida/o-primeiro-movimento
```

`A Subida` is implemented end to end under
`src/domains/lessons/a-subida/`. Its lesson-local exercises are registered as
EX-06 through EX-08 in the typed catalog and rendered at
`/tecnico/biblioteca`. Treat them as experiments: reuse the learning pattern
only after extracting typed engines, rather than copying scene JSX.

For all future Cave artwork, preserve the role boundary documented in
`docs/reference/CHARACTERS_AND_ASSETS.md`: the prisoner inhabits story scenes;
Plato narrates from a separate transparent UI layer. In `A Subida`, that means
Plato remains visibly present throughout the story screens while never being
composited into the prisoner's environmental image. Exercise screens omit
Plato so the task, response, and feedback remain the only visual focus. Final
Chapter 2 asset prompts and reference decisions live beside the images in
`public/images/story/a-subida/ASSET_PROVENANCE.md`.

The Chapter 2 opening deliberately uses two short screens: a recap of the
prisoner's decision, followed by his first painful movement. Both reuse the
same Plato-left, story-right narrative composition established in Chapter 1.

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

The student portal uses warm white/cream as its dominant canvas, restrained
pale blue for secondary surfaces, and saturated Philoo blue for interactive
emphasis. Its header stays in the same warm-white family, and the lesson shell
inherits this balance. Do not restore the previous full-page baby-blue wash.

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
rendered as part of one integrated Cave scene and gestures toward the lesson
controls; the canonical asset is
`public/images/portal/plato-cave-active-lesson-v1.png`. Do not restore the old
separate background + transparent-character composite. The
curriculum now follows era → journey → chapter; `Filosofia Antiga` begins with
the three-chapter Cave journey and continues through short Ancient Philosophy
journeys. `Meu caminho` presents these as streaming-style shelves: visual
episode cards for chapters, progress/play/lock states, and cinematic covers for
upcoming journeys. The generated hero asset is tracked at
`public/images/portal/plato-learning-journey-hero-v1.png`. It uses static
preview content for now and enters the existing `As Sombras` lesson through
`/aula/as-sombras/primeira-tela`.

The current typography system is Fredoka for expressive headings, Nunito for
body copy/UI/wordmark, and IBM Plex Mono for limited evidence labels. Portal
headings default to Fredoka 600, while the main path hero remains heavier.

The stable public API boundary now exists. The next library task is to connect
EX-05 completion/state to the existing versioned lesson runtime and
response-visibility contract. That is architectural work and must be discussed
before execution. Afterward, the next extraction candidate is EX-03 causal
sequence. The broader target of approximately 40 activity engines is
deliberately deferred for a separate product discussion; do not invent engines
merely to hit a quota.

Before that runtime work, the next content milestone is the second Cave chapter,
`A Subida`. The Cave journey has a deliberate discovery exception: its three
chapters should use distinct patterns for new assessable interactions so the
first complete arc expands the library. Add each new pattern to the catalog with
an honest maturity status and all quality evidence. Reuse becomes the default
after the Cave arc; do not mistake this exception for permission to create
decorative or cognitively redundant interactions.

The contributor documentation application is complete: repository README,
automatic AI routing, Start Here task map, lesson playbook, reference guides,
colocated code orientation, typed documentation registry, `/tecnico` visual
manual, 17 complete responsive guide pages, full-content search, source/GitHub
links, generated tables of contents, and cross-navigation to the live exercise
catalog. When future APIs or workflows change, follow
`docs/reference/DOCUMENTATION_SYSTEM.md` and update the owning reference rather
than adding another disconnected note.

The independent portal product task remains defining the purpose and content
model of `Explorar`: decide how it differs from the suggested historical path
while still helping a student pursue a question freely.

After acceptance:

1. Extend the curriculum map beyond the first Ancient Philosophy era without
   turning each philosopher into a long standalone course.
2. Complete the outstanding whole-lesson visual/accessibility audit.
3. Decide the authentication and role-routing approach before implementing it.
4. Map portal preview fields to future Supabase assignments, announcements,
   class membership, and progress; discuss the data architecture before any
   schema work.
5. Fix the three existing lint warnings and replace the generated README.
