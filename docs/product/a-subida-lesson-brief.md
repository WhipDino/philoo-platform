# Lesson brief — A Subida

**Journey:** A Caverna de Platão  
**Chapter:** 2 of 3  
**Audience:** ages 13–17  
**Status:** implemented vertical slice

## Promise

The learner follows the freed prisoner from the first turn through the painful
ascent, gradual adjustment to the world outside, and decision to return. The
chapter does not reduce the story to “darkness bad, light good.” It makes
revision, uncertainty, evidence, and intellectual responsibility playable.

## Learning outcomes

By the end, the learner should be able to:

- explain that a shadow can be real as an effect without being the complete
  object it represents;
- choose an observation that distinguishes two competing explanations;
- keep a claim within the limits of currently available evidence;
- revise a model without pretending the earlier observation was worthless;
- understand `περιαγωγή` (`periagōgē`) as a turning or reorientation;
- connect better understanding with responsibility toward others.

## Narrative and activity sequence

1. **Primeiro olhar:** briefly recall the inconsistency and the prisoner's
   decision to turn from Chapter 1.
2. **O primeiro movimento:** the chains are released; turning hurts and the
   old certainty does not disappear at once.
3. **O fogo:** the prisoner sees the causal mechanism behind the wall.
4. **Duas explicações / EX-06:** choose a test that separates two models.
5. **A subida dói:** preserve Plato’s compelled, painful ascent.
6. **Até onde posso afirmar? / EX-07:** advance through four evidence horizons.
7. **Periagōgē:** historical-word artifact and narrator explanation.
8. **Aprender a ver:** shadows, reflections, objects, night sky, then Sun.
9. **Revisar o mundo / EX-08:** visibly update the old model.
10. **A decisão:** return through responsibility; bridge to Chapter 3.

## Storytelling contract

Every moment follows the same narrative rhythm: the prisoner experiences an
event, Plato helps the learner name what is happening, the interface reveals
its philosophical meaning, and the learner responds. Plato must therefore be
visibly present in all ten moments, including the activity screens, without
entering the prisoner's environmental artwork.

The opening reuses `PhilooNarrativeComposition` and `PhilooFolioVoice`: Plato
stands on the left and directs attention toward a short story beat on the
right. His figure remains independent, with no caption card attached beneath
him. A recap and a new event are separate screens so neither becomes a wall of
text.

That visual hierarchy continues throughout the chapter. Narrative scenes,
concept cards, and exercises use a shared guided layout: standalone Plato on
the left, one brief intervention beside him, and the story or interaction in a
single focus region. Plato's narration introduces the task instead of
repeating all of its content. On phones, his pose and intervention become a
compact opening row and the focused content follows underneath.

On wide screens, the story image, Plato's transparent narrator pose, and the
meaning can share the stage. On phones, the story image comes first, followed
by a compact horizontal Plato narration card and then the meaning or activity.
The reading order and message must survive every breakpoint; Plato is never a
decorative overlay that hides the story.

## Art contract

The prisoner is the story protagonist. Plato is the narrator. Environmental
story images contain the prisoner and never Plato. Narrator commentary uses a
separate transparent Plato pose registered in
`src/domains/lessons/plato-pose-catalog.ts`.

## Typography contract

`A Subida` uses `var(--font-reading)` (Nunito) for every visible text role:
shell navigation, journey rail, titles, narration, Greek-word artifact,
activity prompts, model labels, controls, captions, and supporting copy. The
lesson applies this as a scoped shell override so shared components can keep
their normal typography in other lessons. CSS must reference the `next/font`
variable because the optimized webfont is exposed through that variable.

The weight hierarchy keeps the family recognizable without fusing the text:
900 for the main moment title, 700 for story and activity headings, 600–700 for
labels and Plato's narration, and 500 for longer reading copy.

All final asset prompts and dimensions are in
`public/images/story/a-subida/ASSET_PROVENANCE.md`.

## Implementation

- scene engine: `src/domains/lessons/a-subida/a-subida-scene.tsx`;
- route and progression data: `a-subida-journey.ts`;
- copy metadata: `a-subida-content.ts`;
- media registry: `a-subida-assets.ts`;
- responsive styles: `a-subida-scene.module.css`;
- behavioral tests: `a-subida-scene.test.tsx`;
- catalog entries: `src/domains/lesson-library/exercise-catalog.ts`.

EX-06, EX-07, and EX-08 remain catalogued experiments. Extract typed engines
after a second content use proves which configuration fields are stable.
