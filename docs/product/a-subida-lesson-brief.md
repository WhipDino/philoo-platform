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

1. **Primeiro olhar:** turning creates confusion, not instant certainty.
2. **O fogo:** the prisoner sees the causal mechanism behind the wall.
3. **Duas explicações / EX-06:** choose a test that separates two models.
4. **A subida dói:** preserve Plato’s compelled, painful ascent.
5. **Até onde posso afirmar? / EX-07:** advance through four evidence horizons.
6. **Periagōgē:** historical-word artifact and narrator explanation.
7. **Aprender a ver:** shadows, reflections, objects, night sky, then Sun.
8. **Revisar o mundo / EX-08:** visibly update the old model.
9. **A decisão:** return through responsibility; bridge to Chapter 3.

## Art contract

The prisoner is the story protagonist. Plato is the narrator. Environmental
story images contain the prisoner and never Plato. Narrator commentary uses a
separate transparent Plato pose registered in
`src/domains/lessons/plato-pose-catalog.ts`.

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

