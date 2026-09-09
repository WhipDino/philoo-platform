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
/aula/a-subida/depois-da-virada
/aula/o-retorno/na-boca
```

Chapter UX and story thread for later lessons:
`docs/reference/FOLIO_CHAPTER_PATTERNS.md`,
`docs/reference/STORY_THREAD.md`,
`docs/reference/FOLIO_LAYOUT_CONTRACT.md`.

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

`/inicio` is continue-lesson plus sequence and “onde você está” on desktop.
On tablet and phone (`max-width: 1023px`) those side cards become Acesso
rápido icons (sequence and place open a sheet). Search is an icon until
opened. The weekly Agenda is off the home screen; the files stay in
`student-week-agenda*`. Lição de casa now uses a binder board
(`USE_HOMEWORK_OFFER_BOARD`). **Lição de casa** is the card desk (the
old binder stays in `student-homework-view.tsx` but is not in the nav).
`/inicio?view=homework-test` redirects to `homework`. The pane uses the
same pale blue as Caderno (`--home-app`). Page titles share the Caderno
slot: left, “Sua sala · Philoo”, Fredoka h1. **Perfil** uses that slot
(title “Perfil”): identity only, plus reading/motion settings and **Sala à
noite** (sun/moon switch). Night paper is `#141414`; cards `#1E1E1E` with a
`rgba(255,255,255,0.12)` hairline. `--brand-sky` `#7ED2F2` is logo and cyan
slabs; `--brand-blue` `#2E8FC0` plus white `--on-blue` is every primary
button. Day still uses `#5bb8f5` with navy on-blue. Folio quotes keep a left
accent only; chapter masthead uses a solid 15% divider. Cap. 8 challenge
prompt/counter/hint share one cream stage. Trilha banners are flat (no
gradient). Illustrations stay as authored. No
lesson banner or shortcuts to Trilha/Caderno/Lição. Filter is a Faders icon
beside “Ainda em aberto”. Default list is unfinished missions.

Biblioteca is hidden from the student nav for now (`SHOW_STUDENT_LIBRARY`
in `student-portal-content.ts`). Search and Trilha stay visible. Deep link
`/inicio?view=explore` still opens the library.

Student **Trilha** is live at `/inicio?view=trail` (optional `&trail=`).
The page title is “Trilha” (Caderno slot); it scrolls away. Only the unit
banner sticks, a little below the chrome, without a white fade over
companions. The right rail is vertically centered in the visible pane on
desktop (`min-width: 960px`). Scrolling from Cave to Primeiros Pensadores
only updates the banner, side panel, and URL — it must not `scrollIntoView`
or focus `#conteudo`. Cave and Primeiros Pensadores stack on one scroll.
Each trail restarts its own S-wave — do not rejoin them with `waveOffset`.
Cave coins stay `plato-blue-coin.png`; Presocratic playable coins stay gold.
Companions (Tales right, Heráclito left) belong only on Primeiros
Pensadores. Do not restore 3D coins or a white “Continuar lição” banner.

Caderno lists **9** notebooks per page, **3** per row from the notebook
container `36rem` (one column on phone). “Ler os textos” and flip cards use
Fredoka/Nunito, not serif or evidence mono.

The Cave trilogy, **Tales de Mileto**, and **Heráclito de Éfeso** are playable
on `codex/story-folio`. Do not invent a fourth Cave chapter. Do not invent EX-12.

Tales: `/aula/tales/ola` through `/aula/tales/o-um-e-os-muitos`; briefs in
`content/tales/`. Validated `philoo_app` pack (`public/images/reference/tales/`)
and regenerated Folio poses (cream tunic, blue wave trim).

Heráclito: `/aula/heraclitus/ola` through `/aula/heraclitus/fecho`; briefs in
`content/heraclitus/`; validation in `content/heraclitus/09-validation.md`.
Identity anchor: `public/images/reference/heraclitus/heraclitus-identity-approved-v1.png`.
Next philosopher on the shelf is Parmenides (locked).

Character art pipeline uses Cursor **`GenerateImage`** (see
`.cursor/agents/image-generator.md`), not external MCP image servers. Chroma:
`node scripts/chroma-key-green.mjs` (`--tight`, `--despill-only` for edge fixes).

Rules: `docs/reference/CHARACTERS_AND_ASSETS.md` (Validated pack).
Pipeline: `.cursor/rules/lesson-pipeline.mdc`.

The philosophy-specialist now writes a visual ficha (what sources say vs what
we invent). A separate portrait-historian agent is not required.

The student Biblioteca UI is live at `/inicio?view=explore`. It is not
`/tecnico/biblioteca`.

Do not restore the notebook-spread home or the stretched streaming mural.
Do not commit `support.js`.

Parked: folio container/border cutoff (wait for print). Parked images:
`beat-05-sombras-la-fora` and `beat-06-reflexos-na-agua` still look like
cave interiors. EX-10 lens contrast is still subtle. Candidate engines are
re-exported from `@/domains/lesson-library`; full CSS extraction to
`activities/` still happens when a second lesson proves the contract.

The independent “explorar por pergunta” mode is not the Biblioteca shelf.

The student platform still uses static preview content in
`student-portal-content.ts`. Connecting EX-05 to the versioned lesson
runtime remains architectural work: discuss before executing. Do not
invent engines to hit a quota of ~40.

The contributor documentation application is complete: repository README,
automatic AI routing, Start Here task map, lesson playbook, reference guides,
colocated code orientation, typed documentation registry, `/tecnico` visual
manual, registered guide pages (including Folio chapter patterns), full-content search, source/GitHub
links, generated tables of contents, and cross-navigation to the live exercise
catalog. When future APIs or workflows change, follow
`docs/reference/DOCUMENTATION_SYSTEM.md` and update the owning reference rather
than adding another disconnected note.

The student Biblioteca is the chronological acervo. A later “explorar por
pergunta” mode remains a separate product decision.

After acceptance:

1. Extend the curriculum map beyond the first Ancient Philosophy era without
   turning each philosopher into a long standalone course.
2. Complete the outstanding whole-lesson visual/accessibility audit.
3. Decide the authentication and role-routing approach before implementing it.
4. Map portal preview fields to future Supabase assignments, announcements,
   class membership, and progress; discuss the data architecture before any
   schema work.
5. Fix the three existing lint warnings and replace the generated README.
