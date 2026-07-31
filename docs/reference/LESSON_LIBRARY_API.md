# Reference — Philoo Lesson Library API

## Public entry point

Import stable activity APIs from:

```ts
@/domains/lesson-library
```

Internal files may change. Lesson code should not import an engine's CSS,
private renderer helpers, or image paths.

## Maturity model

- `foundation`: stable public component and typed content contract.
- `candidate`: validated learning behavior, extraction incomplete.
- `experiment`: accepted scene, still coupled to its first lesson.

Only foundation engines should be treated like normal library calls.

## EX-05 — Guided classification

High-level API:

```tsx
<GuidedClassificationExercise config={activity} />
```

Optional runtime integration:

```tsx
<GuidedClassificationExercise
  config={activity}
  initialState={savedState}
  onStateChange={saveState}
  onComplete={completeScene}
/>
```

Controlled API:

```tsx
<GuidedClassificationActivity
  config={activity}
  value={state}
  onChange={setState}
  onComplete={completeScene}
/>
```

Use the high-level API unless the surrounding runtime already owns activity
state.

## Author configuration

`GuidedClassificationConfig<CategoryId>` requires:

- stable `id`;
- `schemaVersion`;
- optional semantic `guide`;
- worked example;
- challenge prompt;
- categories with semantic icon/tone roles;
- cards and correct category IDs;
- feedback and retry copy;
- labels;
- fully externalized table microcopy.

See the complete example:

`src/domains/lesson-library/activities/guided-classification/guided-classification-examples.ts`

## State contract

`GuidedClassificationState` stores only serializable information:

- schema version;
- example/challenge stage;
- selected card ID;
- placements;
- check status;
- last move.

Always restore through `sanitizeGuidedClassificationState`. Never trust saved
IDs from an older content version without sanitization.

## Character API

```ts
const guide = getGuidedClassificationGuide("plato");
```

The preset owns pose and responsive `sizes`. The corresponding generation
brief owns gaze, gesture, crop, safe area, source ratio, and expected rendered
dimensions. A lesson may add `priority`, but must not replace the preset with a
hardcoded image path.

## Protected behavior

Do not customize per lesson:

- worked-example-before-challenge sequence;
- alternative to drag;
- state sanitization;
- feedback/revision mechanics;
- minimum targets;
- protected responsive layout;
- character relationship to the activity.

If a learning goal requires changing protected behavior, propose an engine
version or a new engine. Do not add conditionals for one philosopher.

## Adding a new preset

1. Create/approve the canonical asset.
2. Validate it against the engine's character brief.
3. Register its semantic character and pose.
4. Add a preset test.
5. Verify all five viewports.
6. Update the character reference and technical website.

## Adding a new engine

An engine becomes foundation only after:

- content is fully external;
- state is typed/versioned/sanitized;
- accessibility and responsive behavior are tested;
- at least two unrelated philosophical uses prove neutrality;
- a public export and documentation exist;
- its catalog status is updated.
