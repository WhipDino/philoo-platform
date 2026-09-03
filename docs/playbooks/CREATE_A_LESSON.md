# Playbook — Create a Philoo Lesson

Use this playbook for a new journey, chapter, or substantial lesson scene.

## 1. Define the learning contract

Before UI or images, write:

- target age and prerequisite knowledge;
- one learning claim;
- the question the student should leave with;
- the thinking move required: observe, compare, classify, order, infer,
  challenge, construct, revise, or transfer;
- the inspectable artifact produced by the student;
- likely misconception;
- feedback and revision path;
- response visibility: private reflection, teacher-visible task, derived
  rubric, or system telemetry.

If these are unclear, do not choose an exercise yet.

## 2. Place it in the curriculum

Confirm:

`era → journey → chapter → scenes`

Use `docs/product/CURRICULUM_MAP.md`. Depois da Caverna, **um filósofo = um
capítulo completo** (não três aulas para a mesma ideia). A jornada ainda
pode ter vários filósofos, cada um no seu episódio.

## 3. Select an activity by thinking move

Open `docs/reference/EXERCISE_SELECTION.md` and run
`selectExercisesForChapter` (two or three engines per chapter). Do not
reconstruct a Cave screen. Import from `@/domains/lesson-library`.

Do not select an interaction merely to add variety. Variety is a **tie-break**
after the thinking move matches.

### Cave arc

The three chapters of the Allegory of the Cave **are shipped**:

1. `As Sombras`;
2. `A Subida`;
3. `O Retorno`.

They were the library-building arc. New assessable interactions there used
distinct patterns (through EX-11). **After this arc, reuse the catalog.**
Create a new engine only when no existing pattern expresses the learning
goal **and** a human asked for it.

Story continuity: `docs/reference/STORY_THREAD.md`.
Philosopher-shaped chapter: `docs/reference/PHILOSOPHER_LESSON.md`.
Which EX: `docs/reference/EXERCISE_SELECTION.md`.
Layout reuse: `docs/reference/FOLIO_LAYOUT_CONTRACT.md`.
Pipeline: `.cursor/rules/lesson-pipeline.mdc`.

## 4. Create the lesson content boundary

Lesson-owned data includes:

- titles, prompts, explanations, questions;
- briefing **purpose** and start label (the how-to steps belong to the engine);
- cards, choices, correct relations, feedback;
- philosopher/character semantic ID;
- approved media references;
- lesson-specific completion transition.

Library-owned behavior includes:

- layout and responsive composition;
- interaction state and state sanitization;
- checking and revision behavior;
- keyboard/touch alternatives;
- minimum target sizes;
- protected visual treatment;
- character placement rules for that engine.

Never move lesson language into a generic renderer.

## 5. Configure a foundation engine

For EX-05:

```tsx
import {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  GuidedClassificationExercise,
  getGuidedClassificationGuide,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";

type CategoryId = "observed" | "inferred" | "unresolved";

export const ACTIVITY = {
  id: "lesson-slug-activity-v1",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  guide: getGuidedClassificationGuide("plato"),
  // workedExample, prompt, categories, cards, feedback, labels, table
} satisfies GuidedClassificationConfig<CategoryId>;

export function LessonActivity() {
  return <GuidedClassificationExercise config={ACTIVITY} />;
}
```

Copy the full typed shape from
`src/domains/lesson-library/activities/guided-classification/guided-classification-examples.ts`.
Do not copy the Cave screen component.

## 6. Choose a scene template before drawing a new layout

Read `docs/reference/FOLIO_CHAPTER_PATTERNS.md` and
`docs/product/philoo-scene-template-catalog-v1.md`. Narrative screens reuse
`guide-voice` (philosopher + text) or `story-panel` (framed 16:9 image, short
line, philosopher beside the block). A named Greek word uses `named-concept`:
three `guide-voice` moments (the word, this scene, now). Now is a present-day
parallel that shows the structure; never “how to apply this in daily life.”
Text never competes with a scene image. Student copy never uses an em dash.
The folio footer Continuar is hidden until an exercise is correct.
A chapter ends with a short story hook, then a reward screen, then a real
existing route (never a 404).
Import `src/domains/lessons/philoo-soft-story-layout.module.css`; do not rebuild
the frame.

## 7. Plan characters and assets

For every asset specify:

- semantic purpose;
- source/canonical identity reference;
- pose role and gaze direction;
- background treatment;
- crop and safe area;
- expected aspect ratio;
- desktop/tablet/phone behavior;
- alt text;
- license/provenance.

Use `docs/reference/CHARACTERS_AND_ASSETS.md`.

## 8. Build responsive behavior with the lesson

Required verification matrix:

- 390 × 844;
- 768 × 1024;
- 1024 × 768;
- 1366 × 720;
- 1440 × 900.

Mobile is not a scaled desktop. Preserve the thinking sequence, information,
feedback, and meaning while recomposing space.

## 9. Test the complete learning story

Test:

- first render;
- correct path;
- one incorrect path and revision;
- restored/sanitized state;
- completion callback/transition;
- keyboard and touch alternatives;
- reduced motion when animation carries meaning;
- no content or controls below the minimum target size.

## 10. Validate after the lesson exists

Content review happens before code (human mechanic choice, contracts, named
art). **Product validation happens after implementation:** play the routes,
hide Continuar until the exercise is correct, run tests, and follow
`.cursor/rules/responsive-check.md`. Do not ask a validator to certify Folio
UI that has not been built.

## 11. Document and hand off

Update:

- exercise status or API docs if a library changed;
- curriculum map if the learning sequence changed;
- project state;
- desktop handoff;
- technical website when the public contributor workflow changed.

Run `docs/reference/QUALITY_GATES.md`, then commit code, tests, assets, and
documentation together.
