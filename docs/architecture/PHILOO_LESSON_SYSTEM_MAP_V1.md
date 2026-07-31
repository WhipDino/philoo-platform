# Philoo Lesson System Map v1

**Status:** Proposed company foundation for review  
**Date:** 2026-07-30  
**Scope:** Lesson production, reusable experience patterns, brand consistency,
content architecture, contributor onboarding, and future authoring tools  
**Implementation status:** Mapping only. This document does not authorize a
runtime, routing, storage, or database migration by itself.

The concrete screen-by-screen activity inventory and proposed parameter
contracts live in `docs/product/PHILOO_EXERCISE_CATALOG_V1.md`. Read that
catalog with this map before extracting or reusing a lesson interaction.

## 1. Executive decision

Philoo should build a **typed, content-driven lesson system with a controlled
custom-scene escape hatch**.

The system must make the normal path easy:

1. choose the learning move;
2. choose a narrative or activity pattern;
3. provide typed content and semantic assets;
4. preview the result;
5. validate learning, brand, accessibility, responsiveness, and graph
   integrity;
6. publish a versioned lesson.

Philoo should not build new lessons by copying an old lesson folder. It should
also not turn every possible experience into one giant configurable component.
The target is a modular monolith with stable contracts, small reusable engines,
content stored separately from rendering, and explicitly reviewed exceptions.

This foundation serves two purposes:

- accelerate production of journeys, chapters, scenes, and activities;
- provide the paved road future Philoo employees follow when designing,
  engineering, reviewing, and maintaining the platform.

## 2. What “flat” means

“Flat” does not mean placing every file in a single directory. It means keeping
the system cognitively flat:

- few concepts to learn;
- one predictable location for each kind of work;
- one canonical route from content to rendered lesson;
- one-way dependencies;
- no hidden lesson-specific assumptions inside reusable components;
- no duplicate brand implementation;
- documented exceptions instead of accidental irregularity;
- enough abstraction to reuse behavior, but not enough to hide the product.

The intended dependency direction is:

```text
lesson and journey content
          ↓
typed scene configurations
          ↓
scene registry and lesson runtime
          ↓
narrative patterns and activity engines
          ↓
Philoo experience primitives
          ↓
brand tokens, accessibility rules, and platform utilities
```

Dependencies must not point upward. An activity engine may use a Philoo button;
a Philoo button must never know which lesson or philosopher uses it.

## 3. Product grammar

Philoo’s curriculum hierarchy remains:

```text
Era → Journey → Chapter → Scene or activity
```

- **Era** organizes a broad historical and intellectual world.
- **Journey** is one coherent investigation motivated by a strong question.
- **Chapter** is a short playable unit, normally one of three or four in a
  journey.
- **Scene or activity** is the smallest authored lesson experience.

The learning experience contract remains:

```text
stimulus
  → thinking move
  → inspectable reasoning artifact
  → formative feedback
  → revision or transfer
```

The visual and narrative experience adds:

```text
orientation
  → story tension or question
  → learner action
  → consequence or evidence
  → guide response
  → next meaningful step
```

Activities are selected by the thinking move, not by visual novelty. Narrative
patterns are selected by their role in the investigation, not simply because a
character image is available.

## 4. Current system inventory

### 4.1 Current production experience

The accepted route-based `As Sombras` experience currently uses:

- `PhilooStoryShell`;
- `PhilooFolioStage`;
- `PhilooLessonJourneyRail`;
- `PhilooNarrativeComposition`;
- `PhilooDialogueCard`;
- `PhilooSoftFrame`;
- `PhilooOuterRibbons`;
- route-specific scene components;
- local route transitions;
- session-storage journey expansion and furthest-visited state;
- semantic Plato poses for part of the experience;
- direct image paths for other scene assets;
- scene-specific CSS Modules;
- reusable interaction components in selected scenes.

The current route journey contains nine visible stages and ten route scenes:

| Order | Route scene | Learning or narrative role | Current composition | Reuse classification |
|---:|---|---|---|---|
| 1 | `primeira-tela` | Invite the learner into the Cave | Story shell + Folio + narrative composition | Stable narrative candidate |
| 2 | `a-descida` | Establish descent and limited viewpoint | Story shell + Folio + narrative composition | Stable narrative candidate |
| 3 | `so-a-parede` | Build empathy and position the learner with the prisoners | Custom layered environmental stage | Custom composition with reusable stage ideas |
| 4a | `eles-dao-nomes` | Show repeated interpretation becoming accepted | Multi-beat dialogue and image sequence | Dialogue-sequence candidate |
| 4b | `jogo-da-parede` | Practice recognition under the prisoners’ constraints | Image-choice activity + briefing | Activity candidate; needs extraction |
| 5 | `o-que-existe-atras` | Reveal the mechanism behind the appearances | Layered reveal + briefing | Progressive-reveal candidate |
| 6 | `caminho-da-sombra` | Construct the source-to-name causal chain | Causal-path activity + demonstration | Activity engine exists but is Cave-coupled |
| 7 | `doxa` | Form the concept of accepted belief from appearances | Guided conceptual reveal | Concept-reveal candidate |
| 8 | `o-que-chegou-ate-eles` | Distinguish observation, belief, and unknown | Discovery table / classification board | Strong activity candidate |
| 9 | `a-primeira-duvida` | Introduce anomaly, doubt, and the next chapter | Anomaly reveal + cinematic cliffhanger | Stable narrative candidate |

These scenes are the source material for the first stable Philoo pattern set.
They are not automatically all templates. Each must earn reusable status after
its content, layout, state, feedback, and accessibility assumptions are
separated.

### 4.2 Existing general lesson foundation

The repository also contains a general lesson foundation:

- `LessonManifest`;
- versioned lesson identity and `contentHash`;
- arcs and scenes;
- named graph transitions;
- composable and custom scene modes;
- manifest graph validation;
- initial attempt snapshots;
- scene state and response envelopes;
- response visibility classes;
- attempt sequence and completion state;
- an `AttemptStore` contract;
- local attempt restoration;
- a renderer/player for the older Cave manifest.

The response visibility classes are:

- `private_reflection`;
- `teacher_visible_task`;
- `derived_rubric`;
- `system_telemetry`.

This foundation solves durable problems that the route-authored Story Folio
currently does not solve canonically. It must not be discarded.

### 4.3 Existing activity engines

The current interaction directory includes:

| Engine | Primary thinking move | Current readiness |
|---|---|---|
| `ConfidenceControl` | Commit and calibrate confidence | Reusable |
| `PredictionConsequence` | Predict before observing a result | Reusable with content review |
| `EvidenceInspector` | Inspect and interpret evidence | Reusable with configuration review |
| `CerResponse` | Build claim–evidence–reason reasoning | Reusable |
| `RevisionMap` | Compare and revise a prior belief | Reusable |
| `TransferClassification` | Apply distinctions to a novel case | Reusable with domain review |
| `PhilooDiscoveryTable` | Classify evidence into authored categories | Strong candidate; contains Cave copy |
| `PhilooCausalPath` | Construct an ordered causal explanation | Strong candidate; contains Cave logic and copy |
| `PhilooActivityBriefing` | Explain activity purpose and demonstrate the move | Strong composition; hardcodes Plato |
| `PhilooCausalPathDemonstration` | Worked example for causal ordering | Cave-specific content |

An engine is not stable merely because its props accept different text.
Stability requires:

- domain-neutral behavior;
- no hidden Cave, Plato, shadow, wall, or prisoner assumptions;
- typed content;
- externalized feedback;
- serializable learner state;
- accessible keyboard and touch paths;
- responsive behavior;
- documented use and non-use cases;
- tests using at least two unrelated content domains.

### 4.4 Existing narrative and visual primitives

Promising reusable foundations include:

- `PhilooStoryShell`;
- `PhilooFolioStage`;
- `PhilooNarrativeComposition`;
- `PhilooDialogueCard`;
- `PhilooLessonJourneyRail`;
- `PhilooSoftFrame`;
- scene transition utilities;
- semantic character-pose lookup;
- standard page paper, ribbons, frames, and action treatment.

Current coupling to resolve:

- `PhilooStoryShell` imports `CaveStoryProgress`;
- the fallback lesson name is `As Sombras`;
- the journey state lives in shell-local session storage rather than the
  canonical attempt runtime;
- route scene IDs and manifest scene IDs are separate systems;
- some scene components reference image paths directly;
- global and module-level brand values still coexist;
- many scene-specific CSS files reproduce similar composition behavior.

### 4.5 Existing product documentation

The repository already contains:

- `docs/product/philoo-learning-activity-library.md`, with 44 evidence-informed
  activity families;
- `docs/product/PHILOO_EXERCISE_CATALOG_V1.md`, with the accepted Cave
  interaction inventory, exact screen contracts, typed configuration targets,
  character pose roles, and reuse recipes;
- `docs/product/activity-patterns/guided-classification-board.md`, the first
  extracted activity pattern;
- `docs/product/plato-character-generation-standard.md`;
- `docs/product/CURRICULUM_MAP.md`;
- Story Folio, dialogue, journey rail, responsive activity, and scene-specific
  specifications and plans.

These are valuable source documents. The Lesson System must connect them to
rendered, tested production components so they do not become parallel
documentation that silently drifts.

## 5. Current architectural diagnosis

The project is in a healthy experimental stage, not yet in its final production
shape.

### What is strong

- The first lesson has a clear educational progression.
- Brand, narrative, and learning interactions are already being treated as
  systems rather than isolated screens.
- The general runtime contains versioning, graph, persistence, and visibility
  concepts that anticipate real production needs.
- Route-authored scenes discovered a much stronger visual and narrative grammar
  than the first generic player.
- Reusable interaction logic already exists.
- Accessibility and responsive behavior are part of the implementation, not
  postponed requirements.
- The semantic Plato pose catalog is an early example of the correct asset
  abstraction.

### What prevents fast lesson production

- The accepted route experience bypasses the general manifest/player.
- The general manifest describes an earlier lesson structure rather than the
  accepted route journey.
- Several “generic” components still contain Cave language or rules.
- Content, layout, feedback, and behavior are often authored together in TSX.
- The same lesson identity appears in routes, journey arrays, story beat files,
  manifests, tests, and portal preview data.
- Assets are partly semantic and partly direct paths.
- A new lesson would still require manually creating routes, components, CSS,
  journey stages, transitions, and tests.
- `/tecnico/biblioteca` now renders the first code-backed technical catalog,
  but it does not yet render isolated production components or editable
  configurations. The full Lesson Lab remains a migration phase.

## 6. Target architecture

Philoo should remain a modular monolith. The target structure should evolve
inside the existing application rather than beginning with a package split or
microservices.

```text
src/
├── app/
│   ├── aula/[lessonSlug]/[sceneSlug]/page.tsx
│   └── internal/lesson-lab/...
├── domains/
│   └── lessons/
│       ├── runtime/
│       ├── shell/
│       ├── narrative/
│       ├── activities/
│       ├── characters/
│       ├── assets/
│       ├── validation/
│       └── registry/
├── content/
│   ├── curriculum.ts
│   ├── journeys/
│   └── lessons/
└── design-system/
    ├── tokens/
    ├── primitives/
    ├── motion/
    └── accessibility/
```

This is a target map, not an instruction to move every existing file
immediately. Migration should be incremental and behavior-preserving.

### 6.1 Design system

The design system owns:

- color roles and 60–30–10 application;
- typography roles;
- spacing and sizing scales;
- elevation and Philoo 3D depth;
- borders, radii, paper, notebook, and frame treatments;
- focus, selected, disabled, progress, success, retry, and locked states;
- motion durations and easing;
- reduced-motion behavior;
- responsive breakpoints and touch-target requirements;
- buttons, cards, badges, progress, dialogs, and other primitives.

Lessons may choose approved variants. They must not redefine the base visual
contract.

### 6.2 Lesson runtime

The runtime becomes the canonical owner of:

- lesson identity and version;
- current scene;
- visited scenes;
- named transitions;
- completion;
- scene state;
- learner responses and visibility;
- save points;
- restoration;
- progress derived from the manifest;
- immutable definition version associated with an attempt.

The route is a view of runtime state. The route must not become a second
progress engine.

Recommended eventual route:

```text
/aula/[lessonSlug]/[sceneSlug]
```

One dynamic page resolves the lesson and scene through the registry. Existing
explicit routes should remain until parity is proven; route migration is not a
first extraction step.

### 6.3 Scene registry

The canonical scene definition should be a discriminated union:

```ts
type SceneDefinition =
  | NarrativeDialogueScene
  | CharacterInvitationScene
  | ProgressiveRevealScene
  | ImageChoiceScene
  | ClassificationBoardScene
  | CausalSequenceScene
  | ConceptRevealScene
  | BeliefRevisionScene
  | TransferScene
  | CustomScene;
```

Every scene kind has:

- a stable `kind`;
- a schema version;
- typed configuration;
- a renderer;
- state serialization and sanitization;
- completion rules;
- response visibility rules;
- validation;
- an example;
- documentation;
- tests.

The registry maps `kind` to the schema, renderer, validator, and state adapter.
Lesson content never imports the renderer directly.

### 6.4 Custom scene escape hatch

Custom scenes are required for product originality. They must not become the
default.

A custom scene:

- declares `kind: "custom"`;
- references a registered renderer ID;
- still uses the canonical lesson runtime and shell;
- still declares state, completion, responses, visibility, assets, and
  accessibility behavior;
- explains why an existing pattern cannot serve the learning move;
- is reviewed after use to determine whether a reusable pattern has emerged.

The expected long-term balance is not a hard quota, but a useful planning
model:

- 70–80% stable narrative and activity patterns;
- 20–30% lesson-specific composition or new interaction.

## 7. Canonical contracts

### 7.1 Lesson definition

The lesson definition should contain:

```ts
type LessonDefinition = {
  identity: {
    id: string;
    slug: string;
    locale: "pt-BR";
    version: string;
    schemaVersion: string;
    contentHash: string;
  };
  curriculum: {
    eraId: string;
    journeyId: string;
    chapterId: string;
  };
  title: string;
  motivatingQuestion: string;
  learningClaims: readonly string[];
  entrySceneId: string;
  scenes: readonly SceneDefinition[];
  assets: readonly AssetReference[];
  review: ReviewMetadata;
};
```

The existing `LessonManifest` should evolve toward this contract rather than
being replaced without migration.

### 7.2 Scene definition

Every scene declares:

- stable ID and scene kind;
- learning purpose;
- narrative purpose;
- prompt and authored content;
- semantic assets;
- initial state;
- completion rule;
- feedback strategy;
- stored reasoning artifact;
- response visibility;
- transitions;
- accessibility alternative;
- optional adaptation or hint configuration.

### 7.3 Activity definition

Every activity follows:

```text
stimulus
thinking move
learner state
inspectable artifact
validation
feedback
revision
completion
response visibility
accessible equivalent
```

Example:

```ts
{
  kind: "causal-sequence",
  schemaVersion: "1",
  prompt: "Organize como uma ideia se transforma em ação.",
  items: [...],
  positions: [...],
  demonstratedItemId: "question",
  feedback: {
    incomplete: "...",
    complete: "...",
    breaks: [...]
  },
  response: {
    visibility: "teacher_visible_task"
  }
}
```

The engine owns ordering behavior, drag/tap/keyboard interaction, focus
restoration, responsive presentation, and feedback display. The lesson owns
the words, items, correct relationships, misconceptions, and authored
feedback.

### 7.4 Narrative definition

Narrative patterns should accept semantic content:

```ts
{
  kind: "character-invitation",
  speaker: { characterId: "plato", pose: "invitation" },
  title: "Venha comigo até uma caverna.",
  body: [...],
  source: {...},
  action: {...},
  environment: { assetId: "cave-entry" }
}
```

The renderer owns layout and responsive behavior. The lesson owns the
character, words, source, action, and environment.

### 7.5 Asset reference

Content should reference semantic asset IDs, not file paths:

```ts
type AssetReference = {
  id: string;
  role:
    | "character_pose"
    | "environment"
    | "integrated_scene"
    | "lesson_cover"
    | "evidence"
    | "object"
    | "diagram";
  alt: string;
  focalPoint?: { x: number; y: number };
  mobileFocalPoint?: { x: number; y: number };
};
```

The asset catalog resolves:

- source path;
- dimensions and format;
- allowed crops;
- character identity;
- generation reference;
- prompt/provenance record;
- licensing;
- approval state;
- deprecation.

### 7.6 Character contract

Characters should be selected by semantic purpose:

```ts
{
  characterId: "plato",
  pose: "guided-classification",
  direction: "toward-activity",
  presentation: "activity-portrait"
}
```

Plato’s current pose catalog becomes the first character catalog, not the
permanent universal interface. The universal interface must support future
philosophers, mathematicians, scientists, artists, musicians, teachers, and
fictional guides without pretending that all characters have identical pose
sets.

## 8. Activity package anatomy

Every stable activity should have the same anatomy:

```text
activities/
└── guided-classification/
    ├── schema.ts
    ├── renderer.tsx
    ├── state.ts
    ├── validation.ts
    ├── feedback.ts
    ├── styles.module.css
    ├── example.ts
    ├── guided-classification.test.tsx
    └── README.md
```

Responsibilities:

- `schema.ts`: serializable typed content contract;
- `renderer.tsx`: interaction and presentation;
- `state.ts`: initial state, sanitization, completion, and serialization;
- `validation.ts`: author-time configuration checks;
- `feedback.ts`: generic feedback resolution mechanisms;
- `styles.module.css`: responsive visual implementation using design tokens;
- `example.ts`: non-production example used by the Lesson Lab;
- test: behavior, keyboard, touch-equivalent, state, and feedback coverage;
- README: learning purpose, use/non-use rules, configuration, and authoring
  guidance.

No stable activity folder may depend on a lesson content directory.

## 9. Lesson content anatomy

The normal lesson should contain content rather than implementation:

```text
content/lessons/
└── heraclitus-change/
    ├── lesson.ts
    ├── copy.ts
    ├── assets.ts
    ├── review.ts
    └── custom/
        └── river-model.tsx
```

- `lesson.ts` composes typed scenes and transitions.
- `copy.ts` holds substantial authored text when separating it improves review.
- `assets.ts` registers semantic lesson assets.
- `review.ts` records curriculum, accessibility, brand, and publication state.
- `custom/` exists only when the lesson has a justified custom renderer.

A content folder should not contain general buttons, journey rails, progress
logic, persistence, or duplicated activity engines.

## 10. Promotion lifecycle

Reusable work moves through explicit states:

```text
experiment → candidate → stable → deprecated
```

### Experiment

- Built for one lesson.
- May contain lesson-specific assumptions.
- Must not be advertised as reusable.

### Candidate

- The reusable contract has been identified.
- Cave-specific content is externalized.
- Tested with a second unrelated content example.
- Documented in the Lesson Lab.

### Stable

- Used successfully in at least two meaningfully different contexts.
- Schema and state are versioned.
- Responsive, keyboard, screen-reader, and reduced-motion behavior are
  verified.
- Learning use/non-use rules are reviewed.
- Future breaking changes require a new schema version.

### Deprecated

- Existing published lessons remain renderable.
- New lessons cannot select it.
- A replacement and migration note are documented.

This lifecycle prevents premature abstraction while preserving useful
experiments.

## 11. Lesson Lab

The Lesson Lab is an internal rendered catalog, not a static design document.

For each pattern it shows:

- stable ID and status;
- learning move;
- appropriate and inappropriate uses;
- required content fields;
- rendered desktop, tablet, and phone states;
- empty, active, incomplete, feedback, retry, revised, and complete states;
- keyboard instructions;
- touch interaction;
- non-drag alternative;
- reduced-motion behavior;
- saved response shape;
- visibility classification;
- configuration example;
- lessons currently using it;
- version and deprecation status.

The Lab should also include:

- brand primitives;
- narrative patterns;
- character poses and presentation roles;
- asset focal-point previews;
- shell and journey states;
- long-copy and localization stress cases.

The Lab is initially an internal application route backed by production
components. It should not require a separate UI framework unless the team later
proves that one is useful.

## 12. Authoring and contributor paved road

### 12.1 Normal authoring flow

1. Define the motivating question.
2. Define learning claims and likely misconceptions.
3. Divide the journey into three or four coherent chapters.
4. Map each scene to a required thinking move or narrative purpose.
5. Select stable patterns from the Lesson Lab.
6. Write typed content and formative feedback.
7. Select semantic character and asset roles.
8. Preview all states.
9. Run automatic validation.
10. Complete curriculum, brand, accessibility, and technical review.
11. Publish an immutable lesson version.

### 12.2 New activity flow

1. Demonstrate that no stable pattern serves the thinking move.
2. Build it as a lesson-local experiment.
3. Document the learning evidence it captures.
4. Test it in the real lesson.
5. Review outcomes and usability.
6. Extract only the behavior proven to be reusable.
7. Test the candidate with unrelated content.
8. Promote it only after review.

### 12.3 Contributor reading order

Future lesson contributors should read:

1. Philoo product and learning principles;
2. this Lesson System Map;
3. curriculum hierarchy;
4. activity-library selection rules;
5. brand and character standards;
6. Lesson Lab documentation for selected patterns;
7. the nearest approved example lesson;
8. contribution and definition-of-done checklist.

No employee should need to reconstruct the architecture from Git history or
old chat memory.

## 13. Automation and validation

### 13.1 Author-time validation

The lesson validator should eventually reject:

- duplicate scene IDs;
- unreachable scenes;
- scenes without completion paths;
- unknown transitions;
- unknown activity kinds or schema versions;
- missing learning purpose;
- missing response visibility;
- missing alt text;
- unknown asset IDs;
- missing accessible equivalents;
- activity configuration that cannot be serialized;
- invalid character/pose combinations;
- missing feedback or revision path;
- duplicate curriculum IDs.

The existing graph validator is the starting point.

### 13.2 Generated scaffolding

A future generator should create predictable files:

```text
create journey
create lesson
create scene
create activity experiment
register semantic asset
```

The generator must use stable templates from this architecture. It should not
generate large amounts of speculative code.

### 13.3 Quality gates

Every lesson version must pass:

- schema and graph validation;
- TypeScript;
- unit tests for custom state and interaction logic;
- activity-engine contract tests;
- responsive checks at phone, tablet, laptop, and large desktop;
- keyboard and focus-flow checks;
- screen-reader naming checks;
- reduced-motion checks;
- color-contrast checks;
- meaningful image alternatives;
- asset-resolution checks;
- curriculum review;
- philosophical/source review;
- brand review;
- content proofreading;
- production build.

Visual completion alone is not lesson completion.

## 14. Versioning and published attempts

Lessons, scene schemas, activities, and assets need different version concerns.

### Lesson version

Changes when published content or the learning sequence changes.

### Activity schema version

Changes when the saved configuration or learner-state contract changes.

### Asset version

Changes when an approved image is replaced while historical rendering may need
the former file.

### Attempt binding

A student attempt must remain bound to the lesson version and compatible
activity schema versions used when the attempt began.

The existing `lessonVersion`, `contentHash`, and attempt snapshot are the
correct beginning.

No database schema should be created for this system until the code-first
lesson and activity contracts survive at least two or three different lessons.
When persistence design begins, storage volume, immutable snapshots, retention,
Supabase RLS, LGPD, archive policy, and infrastructure cost require a separate
architecture decision with explicit approval.

## 15. Reconciliation strategy

The route-authored experience and the general runtime should converge as
follows:

1. Preserve the accepted route scenes and visual behavior.
2. Define the accepted `As Sombras` route journey as a new canonical manifest.
3. Give every current route scene a stable manifest scene ID.
4. Register current route scene components initially as custom renderers.
5. Move route navigation and journey progress behind runtime transitions.
6. Replace session-only progress with an `AttemptStore` adapter while keeping a
   local preview implementation.
7. Extract reusable narrative patterns and activities incrementally.
8. Convert a custom renderer to a stable scene kind only after parity.
9. Introduce the dynamic lesson route only after current URLs, restoration,
   progress, and responsive behavior are proven equivalent.
10. Retire the older Cave manifest/player only after its durable runtime
    capabilities have been absorbed and all useful tests are preserved.

This strategy avoids a rewrite and keeps the accepted lesson playable
throughout migration.

## 16. First extraction candidates

Recommended order:

### Candidate 1: Character invitation

Source:

- `CaveInvitationScene`;
- `CaveDescentScene`;
- `PhilooNarrativeComposition`;
- semantic character pose catalog.

Why first:

- low interaction risk;
- strong reuse potential;
- proves content/renderer/asset separation.

### Candidate 2: Guided classification board

Source:

- `CaveEvidenceSortScene`;
- `PhilooDiscoveryTable`;
- existing pattern document.

Required work:

- externalize “Pistas da parede” and other Cave copy;
- define serializable state and response;
- validate arbitrary destination IDs;
- provide a second non-Cave example;
- connect completion to runtime.

### Candidate 3: Causal sequence

Source:

- `CaveShadowPathScene`;
- `PhilooCausalPath`.

Required work:

- remove `shadow`, `object`, `name`, light, and wall logic from the engine;
- author feedback through typed causal-break rules;
- externalize labels and ARIA text;
- keep tap, drag, keyboard, focus restoration, and removal behavior.

### Candidate 4: Progressive reveal

Source:

- `CaveBehindWallScene`;
- `CaveDoxaScene`;
- `CaveFirstDoubtScene`.

Required work:

- identify what is genuinely common;
- avoid a universal “reveal everything” component;
- separate conceptual reveal from cinematic reveal where necessary.

### Candidate 5: Image-choice recognition

Source:

- `CaveShadowGameScene`.

Required work:

- make choice, image crop, feedback, retry, and completion generic;
- document that recognition is a scaffold, not the default final learning
  evidence.

## 17. Proof lesson

The first proof should use a different philosopher and different visual
content. A short Heraclitus experience is the recommended candidate because it
can reuse:

- character invitation;
- prediction before reveal;
- causal or chronological ordering;
- concept classification;
- belief revision;
- transfer to a new case.

The proof succeeds only if:

- it reuses stable patterns without importing Cave files;
- activity engines contain no Heraclitus-specific behavior;
- its unique river/change visual can remain custom;
- the lesson definition is mostly content;
- the runtime restores progress;
- the same components remain responsive and accessible;
- no changes made for Heraclitus break `As Sombras`.

This proof is more meaningful than creating several Cave variations because it
tests domain independence.

## 18. Phased implementation plan

### Phase 0 — Approve the map

Deliverables:

- this architecture map;
- confirmed terminology;
- confirmed code-first strategy;
- confirmed proof lesson;
- explicit list of decisions still pending.

No behavior change.

### Phase 1 — Freeze and align

Deliverables:

- current route journey represented in a canonical manifest;
- stable scene IDs;
- behavior and visual parity tests;
- current route components registered as custom scene renderers;
- one runtime source for graph/progress semantics.

Exit condition:

- the current lesson behaves identically through the canonical definition.

### Phase 2 — Extract foundation

Deliverables:

- design-system tokens and primitives used by lesson shell;
- generic shell and journey progress;
- semantic asset contract;
- character catalog contract;
- activity and narrative registry;
- first author validators.

Exit condition:

- lesson-specific code no longer owns platform-level visual or progress logic.

### Phase 3 — Extract first stable patterns

Deliverables:

- character invitation;
- guided classification;
- causal sequence;
- image choice;
- progressive reveal candidate;
- stable package anatomy and tests.

Exit condition:

- each candidate has an unrelated example and no Cave content leakage.

### Phase 4 — Lesson Lab

Deliverables:

- rendered internal catalog;
- pattern status and documentation;
- responsive and state previews;
- asset and character previews;
- configuration examples.

Exit condition:

- a new contributor can select and configure patterns without reading their
  renderer source.

### Phase 5 — Heraclitus proof

Deliverables:

- one short end-to-end lesson using the paved road;
- one justified custom scene;
- production workflow measurement;
- corrections to schemas and documentation.

Exit condition:

- the second lesson is faster to assemble, independently reviewable, and
  introduces no copy-based architecture.

### Phase 6 — Scale content production

Deliverables:

- generators;
- additional stable activities;
- Presocratic journey production;
- contributor checklist and ownership;
- versioned publishing workflow.

### Phase 7 — Evaluate Studio and server storage

Only after contracts stabilize:

- visual authoring;
- role-aware review workflow;
- database storage;
- immutable publication snapshots;
- media pipeline;
- analytics and teacher evidence.

This phase requires a new architecture, cost, retention, and LGPD discussion.

## 19. Definition of done for the paved road

The Lesson System v1 is not complete until a new contributor can:

1. locate the canonical rules without chat history;
2. create a lesson scaffold;
3. select patterns by learning move;
4. author typed content without editing engine code;
5. select semantic assets and characters;
6. preview all relevant states;
7. understand stored learner evidence and visibility;
8. receive useful validation errors;
9. create a justified custom scene without bypassing the runtime;
10. run the quality gates;
11. publish a new immutable version;
12. understand how to contribute a new reusable pattern.

## 20. Decisions requiring approval before implementation

The recommended defaults are:

1. **Architecture:** modular monolith, not packages or microservices.
2. **Authoring source:** version-controlled TypeScript definitions first.
3. **Canonical runtime:** evolve the existing manifest/attempt foundation.
4. **Migration:** register current route scenes as custom renderers before
   extracting them.
5. **Routing target:** one dynamic lesson/scene route after parity.
6. **Proof:** a short Heraclitus lesson.
7. **Pattern promotion:** stable only after two different content contexts.
8. **Custom work:** allowed through a controlled renderer registry.
9. **Lesson Lab:** internal route using real production components.
10. **Database/Studio:** deferred until the code-first contracts stabilize.

Approval of this map authorizes the preparation of a detailed Phase 1
implementation specification. It does not automatically authorize database
schema, storage, retention, routing, or production-publishing changes.
