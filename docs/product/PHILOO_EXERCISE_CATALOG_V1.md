# Philoo Exercise Catalog v1

**Status:** Complete inventory and proposed reusable API for review
**Date:** 2026-07-30
**Source lesson:** `A Caverna de Platão · As Sombras`
**Relationship:** Concrete companion to
`docs/architecture/PHILOO_LESSON_SYSTEM_MAP_V1.md`
**Implementation status:** Mapping plus the first extracted engine. EX-05 now
exists as a typed reusable component; the remaining named APIs are target
contracts and do not all exist as stable components yet.

## 1. Purpose

This document maps every screen in the accepted `As Sombras` route experience
where the student actively does something, then separates:

- platform navigation;
- narrative progression;
- instructional interaction;
- practice activity;
- assessable reasoning activity;
- lesson-specific cinematic work.

It records:

- why the interaction exists;
- what the student does;
- what remains visually fixed;
- what future lessons may configure;
- what learner state it produces;
- how feedback and completion work;
- which character pose is required;
- how it behaves on desktop, tablet, phone, keyboard, touch, and reduced
  motion;
- whether it is already reusable or still coupled to the Cave.

The intended author experience is similar to using a component library:

```ts
{
  kind: "guided-classification",
  config: {
    title: "...",
    guide: {...},
    workedExample: {...},
    categories: [...],
    cards: [...],
    feedback: {...}
  }
}
```

The lesson author supplies content. Philoo supplies the screen structure,
journey rail, main Folio container, interaction behavior, responsiveness,
accessibility, animation, feedback presentation, and progress integration.

## 2. Vocabulary

### Platform shell

The common lesson frame:

- top header;
- exit/back behavior;
- lesson identity;
- main story/activity surface;
- right journey rail on desktop;
- collapsible/overlay journey presentation at smaller sizes;
- progress, restoration, and transition behavior.

### Folio stage

The main notebook-paper content container:

- chapter eyebrow;
- screen title;
- context;
- optional moment count;
- main content body;
- completion/action dock.

### Narrative interaction

The student advances, reveals, or explores authored story content. It can be
active without being an exercise that evaluates a response.

### Practice activity

The student makes a choice or performs a structure-building move and receives
feedback, usually with retry.

### Reasoning activity

The student produces an inspectable artifact such as a classification,
sequence, comparison, argument, or revision that can be saved.

### Custom scene

A scene whose visual or learning behavior is sufficiently unique that it
should not be forced into a generic engine.

## 3. Invariant screen contract

The reusable exercise must not rebuild the whole page. The exact screen is a
composition of three layers:

```text
Philoo lesson shell
├── header and exit
├── main Folio container
│   ├── exercise heading/context
│   ├── optional briefing/help
│   ├── exercise renderer
│   ├── feedback
│   └── completion action
└── right journey rail
```

Target React composition:

```tsx
<PhilooLessonShell lesson={lesson} attempt={attempt}>
  <PhilooFolioStage chrome={scene.chrome}>
    <ActivityRenderer definition={scene.activity} />
  </PhilooFolioStage>
</PhilooLessonShell>
```

The activity renderer does not receive or control:

- the current URL;
- the journey rail;
- the overall lesson title;
- global progress;
- page background;
- mobile navigation;
- attempt persistence implementation.

The runtime and shell own those concerns.

The activity receives:

- authored content;
- semantic assets;
- character presentation;
- current serializable activity state;
- completion and response callbacks.

This boundary preserves the exact Philoo screen while allowing a new lesson to
replace content safely.

## 4. Accepted route interaction inventory

The current accepted route journey has ten route scenes.

| Route | Current screen | Student action | Category | Reusable target |
|---|---|---|---|---|
| `/primeira-tela` | Plato invites the student | Continue into the story | Narrative progression | `character-invitation` |
| `/a-descida` | Plato guides the descent | Continue to the prisoners | Narrative progression | `guided-transition` |
| `/so-a-parede` | Layered prisoner scene | Advance dialogue beats | Narrative interaction | `guided-dialogue-sequence` candidate |
| `/eles-dao-nomes` | Prisoners name appearances | Advance image/dialogue beats | Narrative interaction | `guided-dialogue-sequence` candidate |
| `/jogo-da-parede` | Recognize three shadows | Choose labels, retry, advance rounds | Practice activity | `image-choice-rounds` |
| `/o-que-existe-atras` | Reveal Cave mechanism | Reveal ordered layers | Instructional interaction | `progressive-mechanism-reveal` |
| `/caminho-da-sombra` | Build causal path | Tap/drag pieces into an order | Reasoning activity | `causal-sequence` |
| `/doxa` | Cropped event becomes full event | Advance, reveal image, connect concept | Concept interaction | `concept-crop-reveal` |
| `/o-que-chegou-ate-eles` | Sort Cave statements | Learn example, tap/drag cards, check, revise | Reasoning activity | `guided-classification` |
| `/a-primeira-duvida` | Anomaly and prisoner turn | Advance reveal and conclusion beats | Narrative interaction | `anomaly-cliffhanger` candidate |

The right journey rail and the main Folio container are shared screen
infrastructure, not ten separate templates.

## 5. Shared lesson interactions

### SYS-01 — Lesson journey rail

**Current implementation:** `PhilooLessonJourneyRail`
**Current owner:** `PhilooStoryShell`
**Student action:** inspect position, collapse/expand, revisit available stages
**Classification:** platform infrastructure, not an exercise

Fixed:

- position on the right at large widths;
- standard Philoo paper/card treatment;
- current, available, and upcoming states;
- responsive overlay/collapsed behavior;
- keyboard-accessible controls;
- progress derived from canonical scene state.

Configurable:

- lesson title;
- journey description;
- stage labels;
- stage IDs;
- stage-to-scene relationships;
- optional approved stage icons.

Must not be authored inside individual exercises.

### SYS-02 — Folio activity screen

**Current implementation:** `PhilooFolioStage`
**Classification:** platform infrastructure

Current inputs:

- `eyebrow`;
- `title`;
- `titleId`;
- `context`;
- optional current/total moments;
- optional path;
- content body;
- completion action;
- footer label.

Target improvement:

- accept a serializable `chrome` configuration;
- resolve the action from runtime transition state;
- avoid lesson authors passing arbitrary layout markup for standard patterns.

### SYS-03 — Activity briefing

**Current implementation:** `PhilooActivityBriefing`
**Used by:** image choice, mechanism reveal, and causal sequence
**Student action:** learn purpose, inspect demonstration, begin/return
**Classification:** shared instructional interaction

Fixed:

- modal behavior;
- focus trapping;
- Escape behavior;
- inert background;
- scroll lock;
- primary action;
- responsive layout;
- character and demonstration composition.

Currently configurable:

- title;
- purpose;
- steps;
- start label;
- Plato pose;
- custom demonstration node.

Required target parameters:

```ts
type ActivityBriefingConfig = {
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guide: {
    characterId: string;
    poseRole: "activity-introduction";
    faces: "left" | "right" | "forward";
  };
  demonstration:
    | { kind: "text"; text: string }
    | { kind: "worked-example"; exampleId: string }
    | { kind: "custom"; rendererId: string };
};
```

Current coupling to remove:

- `PlatoGuide`;
- `PlatoPoseKey`;
- “Platão te acompanha”;
- `ReactNode` as the only demonstration contract.

## 6. Reusable exercise specifications

## EX-01 — Image choice rounds

**Current screen:** `Jogue como eles`
**Current route:** `/aula/as-sombras/jogo-da-parede`
**Current component:** `CaveShadowGameScene`
**Learning move:** recognition/discrimination as a scaffold
**Status:** candidate; behavior is useful but still scene-local

### Student experience

1. Briefing explains the purpose.
2. One image or focused part of an image appears.
3. Choices are shuffled.
4. The student selects a label.
5. Incorrect selection triggers nonpunitive retry feedback.
6. Correct selection shows specific success feedback.
7. The student advances to the next round.
8. Completion unlocks a transition and a final conceptual question.

### Fixed visual contract

- standard lesson shell and right journey rail;
- Folio masthead and action dock;
- one dominant image stage;
- round label above the image;
- help button;
- large tactile choice buttons below or beside the stage;
- visible status/feedback card;
- no lost lives, points, or punitive state;
- celebratory state remains calm and intellectual;
- phone layout preserves image, choices, and feedback without horizontal
  overflow.

### Configurable content

```ts
type ImageChoiceRoundsConfig = {
  prompt: string;
  briefing: ActivityBriefingConfig;
  media: {
    assetId: string;
    mode: "single-per-round" | "sprite-focus";
  };
  rounds: readonly {
    id: string;
    imageAssetId?: string;
    focusRegionId?: string;
    alt: string;
    question: string;
    choices: readonly {
      id: string;
      label: string;
    }[];
    correctChoiceId: string;
    success: string;
    retry: string;
  }[];
  completion: {
    message: string;
    question?: string;
    transition: string;
  };
};
```

### Saved artifact

```ts
type ImageChoiceRoundsState = {
  roundIndex: number;
  attemptsByRound: Record<string, number>;
  selectedByRound: Record<string, string>;
  completed: boolean;
};
```

Default visibility: `system_telemetry` for attempts; completion may contribute
to `derived_rubric` only when the lesson explicitly defines a rubric.

### Character pose

Briefing role:

- character on the left;
- body and gaze directed toward the image/choices on the right;
- semantic pose role: `activity-introduction`;
- current Plato example: `observe-with-them`.

### Reuse example

Pythagoras:

- replace shadow image with a geometric or musical-ratio stimulus;
- replace labels with possible pattern names;
- replace feedback and final question;
- generate/register a Pythagoras `activity-introduction` pose;
- keep the screen, rounds, retry, accessibility, responsiveness, and journey
  behavior unchanged.

### Extraction work

- move round logic out of `CaveShadowGameScene`;
- remove shadow-specific DOM names;
- support semantic asset IDs;
- externalize all retry and status copy;
- serialize state;
- add a non-Cave test example.

## EX-02 — Progressive mechanism reveal

**Current screen:** `O que existe atrás?`
**Current route:** `/aula/as-sombras/o-que-existe-atras`
**Current component:** `CaveBehindWallScene`
**Learning move:** inspect an ordered mechanism one part at a time
**Status:** candidate; current implementation is Cave-specific

### Student experience

1. Briefing explains what is being investigated.
2. A complete scene exists underneath muted/highlight layers.
3. Only the next reveal control is available.
4. Each action highlights a part of the image and adds an explanation.
5. Back moves to the previous reveal state rather than immediately leaving.
6. Completion unlocks the next activity.

### Fixed visual contract

- large evidence image on the main side;
- discovery/reveal panel on the supporting side;
- numbered sequential controls;
- visible revealed/available/waiting states;
- progressive explanatory notes;
- help button and briefing;
- Folio moment counter;
- final action appears only after the last reveal;
- responsive stacking preserves image before controls;
- reveal information is not encoded only by color.

### Configurable content

```ts
type ProgressiveMechanismRevealConfig = {
  briefing: ActivityBriefingConfig;
  image: {
    assetId: string;
    alt: string;
  };
  intro: {
    title: string;
    body: string;
  };
  reveals: readonly {
    id: string;
    controlLabel: string;
    explanation: string;
    highlight: {
      kind: "region";
      regionId: string;
    };
  }[];
  completion: {
    transition: string;
    label: string;
  };
};
```

### Saved artifact

```ts
type ProgressiveRevealState = {
  revealedStep: number;
  completed: boolean;
};
```

Default visibility: `system_telemetry`.

### Character pose

Briefing role:

- character reveals or points toward the mechanism;
- gaze follows the first meaningful region;
- semantic role: `mechanism-reveal`;
- current Plato example: `reveal-behind`.

### Reuse example

Pythagoras:

- reveal string length;
- reveal vibration;
- reveal ratio;
- reveal musical interval.

The artwork and explanations change. The screen and sequential reveal behavior
remain identical.

### Extraction work

- externalize reveal data and region geometry;
- define asset-region metadata;
- serialize progress;
- remove Cave copy;
- test with a non-spatial or diagram-based mechanism.

## EX-03 — Causal sequence

**Current screen:** `O caminho da sombra`
**Current route:** `/aula/as-sombras/caminho-da-sombra`
**Current components:** `CaveShadowPathScene`, `PhilooCausalPath`
**Learning move:** order a causal or logical process and inspect the first
broken relationship
**Status:** strong candidate; reusable behavior exists but contains Cave logic

### Student experience

1. Briefing and worked example explain the move.
2. One item may be demonstrated in its position.
3. Remaining pieces sit in a tray.
4. The student taps or drags a piece to a position.
5. A placed piece can be returned or moved.
6. Full sequences are checked.
7. Feedback identifies the first broken relationship.
8. Correct completion unlocks the next scene.

### Fixed visual contract

- standard shell, Folio, and right journey rail;
- activity briefing;
- piece tray;
- numbered sequence positions;
- tap-to-select and destination selection;
- pointer drag;
- native drag where supported;
- removal/revision behavior;
- focus restoration when a piece returns;
- live feedback;
- demonstrated position treatment;
- mobile layout that does not require drag.

### Configurable content

```ts
type CausalSequenceConfig = {
  briefing: ActivityBriefingConfig;
  prompt: string;
  pieces: readonly {
    id: string;
    label: string;
    explanation: string;
    iconId?: string;
    assetId?: string;
  }[];
  correctOrder: readonly string[];
  demonstratedItemId?: string;
  positionHints: readonly string[];
  feedback: {
    initial: string;
    incomplete: string;
    complete: string;
    breaks: readonly {
      beforeId?: string;
      actualId?: string;
      expectedId?: string;
      message: string;
    }[];
    fallback: string;
  };
  completion: {
    transition: string;
  };
};
```

### Saved artifact

```ts
type CausalSequenceState = {
  positions: readonly (string | null)[];
  completed: boolean;
  attempts: number;
};
```

Default visibility: `teacher_visible_task` when ordering is meaningful learning
evidence; otherwise `system_telemetry`.

### Character pose

Briefing role:

- character visually traces a path from left to right;
- hands must support ordering rather than generic celebration;
- semantic role: `causal-sequence`;
- current Plato example: `causal-path`.

### Current hidden coupling

`PhilooCausalPath` currently contains:

- item IDs `shadow`, `object`, and `name`;
- feedback about light, wall, shadow, and naming;
- completion text “Da luz ao nome”;
- Cave-specific ARIA language.

These must become configuration before the component is stable.

### Reuse example

Pythagoras:

```text
string length → vibration frequency → numerical ratio → perceived interval
```

Only the pieces, hints, feedback, and character change.

## EX-04 — Concept crop and reveal

**Current screen:** `Dóxa`
**Current route:** `/aula/as-sombras/doxa`
**Current component:** `CaveDoxaScene`
**Learning move:** form an initial interpretation from incomplete evidence,
then revise after a wider frame
**Status:** candidate; currently a custom four-moment scene

### Student experience

1. Learn the term and provisional definition.
2. Inspect a deliberately cropped event.
3. Keep an initial impression without forced typing.
4. Reveal the complete event.
5. Read how the wider frame changes the plausible interpretation.
6. Connect the example back to the philosophical concept through the guide.

### Fixed visual contract

- four visible moments;
- concept artifact/definition;
- dominant media frame;
- cropped and full states;
- strong reveal cue;
- explanation after reveal;
- final guide connection;
- focus moves to the new moment heading;
- back returns to the previous moment;
- semantic image alternatives differ between cropped and full states.

### Configurable content

```ts
type ConceptCropRevealConfig = {
  concept: {
    term: string;
    originalLanguage?: {
      text: string;
      lang: string;
    };
    grammaticalNote?: string;
    definition: string;
    explanation: string;
  };
  example: {
    assetId: string;
    croppedAlt: string;
    fullAlt: string;
    cropRegionId: string;
    observationPrompt: string;
    revealExplanation: string;
  };
  guide: {
    characterId: string;
    poseRole: "concept-connection";
    explanation: readonly string[];
  };
  completion: {
    transition: string;
    label: string;
  };
};
```

### Saved artifact

Current route does not collect a response.

Target optional state:

```ts
type ConceptCropRevealState = {
  moment: 1 | 2 | 3 | 4;
  initialInterpretation?: string;
  completed: boolean;
};
```

If an interpretation is collected, it is `private_reflection` by default.

### Character pose

- character on the side opposite the final explanation;
- gaze and open hand connect the revealed media to the concept;
- semantic role: `concept-connection`;
- current Plato example: `doxa`.

### Reuse example

A different Plato chapter could use:

- a partial political speech;
- a cropped painting;
- part of a geometric diagram;
- a short musical fragment without its resolution.

The term, media, crop, explanation, character, and copy change. The four-moment
screen remains.

## EX-05 — Guided classification board

**Current screen:** `O que realmente chegou até eles?`
**Current route:** `/aula/as-sombras/o-que-chegou-ate-eles`
**Current components:** `GuidedClassificationActivity`,
`CaveEvidenceSortScene`, `PhilooDiscoveryTable`
**Learning move:** classify statements or evidence into meaningful categories,
check, understand errors, and revise
**Status:** extracted foundation with two unrelated configurations

### Implemented source

- stable public import:
  `src/domains/lesson-library/index.ts`;
- one-call author component:
  `guided-classification-exercise.tsx`;
- engine:
  `src/domains/lesson-library/activities/guided-classification/guided-classification-activity.tsx`;
- serializable contract and state sanitizer:
  `guided-classification-contract.ts`;
- approved character presets and asset-generation brief:
  `guided-classification-character-presets.ts`;
- Cave content configuration:
  `src/domains/lessons/as-sombras/cave-evidence-sort-config.ts`;
- unrelated proof configuration:
  `guided-classification-examples.ts`;
- rendered technical example: `/tecnico/biblioteca`.

### Public code API

Lesson authors should import from the stable library entry point rather than
from internal files:

```tsx
import {
  GuidedClassificationExercise,
  getGuidedClassificationGuide,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";

type CategoryId = "claim" | "reason" | "question";

const activity = {
  id: "socratic-dialogue-v1",
  schemaVersion: "1",
  guide: getGuidedClassificationGuide("plato"),
  // typed lesson content
} satisfies GuidedClassificationConfig<CategoryId>;

export function LessonActivity() {
  return <GuidedClassificationExercise config={activity} />;
}
```

`GuidedClassificationExercise` owns state, sanitization, answer checking,
feedback, keyboard/touch interactions and responsive composition. Pass
`initialState`, `onStateChange`, and `onComplete` only when the lesson runtime
needs persistence or completion events.

`GuidedClassificationActivity` remains exported as the lower-level controlled
API for a runtime that already owns `value` and `onChange`.

### Student experience

1. A worked example teaches the categories with unrelated content.
2. The guide points toward the example and future board.
3. The student acknowledges the example.
4. Cards enter an unplaced tray.
5. Categories appear as labeled “bags” or pockets.
6. The student drags a card or taps it and chooses a destination.
7. On phone, one active card is presented with large destination choices.
8. The student can move placed cards.
9. Once all cards are placed, the student checks the classification.
10. Feedback names what needs revision without punishment.
11. Correct classification unlocks the next scene.

### Fixed visual contract

- standard shell and journey rail;
- Folio main container;
- worked-example phase before independent phase when configured;
- philosopher/guide on the left of the worked example;
- guide looks and gestures toward the example/categories on the right;
- three or another small number of category pockets;
- cards with tactile paper/3D treatment;
- drag, tap, keyboard, and mobile destination-button paths;
- progress count;
- check action only when all required cards are placed;
- visible reasoning feedback;
- cards remain revisable after feedback;
- reduced-motion layout changes without losing meaning.

This is the exact screen the user described as “the bags” drag-and-drop
exercise.

### Configurable content

```ts
type GuidedClassificationConfig<CategoryId extends string> = {
  id: string;
  schemaVersion: "1";
  guide?: PhilooLessonCharacterGuideConfig;
  workedExample: {
    eyebrow: string;
    title: string;
    introductionTitle: string;
    introductionBody: string;
    items: readonly {
      categoryId: CategoryId;
      statement: string;
      explanation: string;
    }[];
    continueLabel: string;
  };
  prompt: {
    title: string;
    instruction: string;
    selectedInstruction: string;
    idleInstruction: string;
  };
  categories: readonly {
    id: CategoryId;
    label: string;
    hint: string;
    icon: GuidedClassificationIcon;
    tone: GuidedClassificationTone;
    correctionHint: string;
  }[];
  cards: readonly {
    id: string;
    text: string;
    answer: CategoryId;
  }[];
  feedback: {...};
  labels: {...};
  table: GuidedClassificationTableCopy;
};
```

The engine must not accept arbitrary `ReactNode` icons or arbitrary CSS color
names in long-term content. Semantic `iconId` and approved tone roles keep
content serializable and brand-safe.

### Saved artifact

```ts
type GuidedClassificationState<CategoryId extends string = string> = {
  schemaVersion: "1";
  stage: "example" | "challenge";
  selectedCardId: string | null;
  placements: Readonly<Record<string, CategoryId>>;
  hasChecked: boolean;
  lastMove: {
    cardId: string;
    destinationId: CategoryId;
  } | null;
};
```

Default visibility:

- placements: `teacher_visible_task` when assigned by a teacher;
- otherwise `derived_rubric` or local lesson evidence according to lesson
  review;
- worked-example acknowledgement: `system_telemetry`.

### Character pose

This contract is intentionally precise:

- character appears on the left;
- character looks to the student’s right;
- torso and primary gesture lead toward the example or pockets;
- character does not cover card destinations;
- mobile placement may move above the categories, but gaze still leads into
  the work;
- pose role: `guided-classification`;
- current Plato example: `teaching-pointer` for the worked example and
  `guided-classification` for activity briefing imagery.

These constraints are executable data in
`guided-classification-character-presets.ts`, not documentation only.
`getGuidedClassificationGuide("plato")` resolves the approved pose and
responsive image `sizes` value. `GUIDED_CLASSIFICATION_CHARACTER_BRIEF`
records direction, gesture, crop, safe area, preferred `2:3` source ratio and
the rendered desktop/tablet/phone dimensions. Lesson configs must not hardcode
asset paths or reproduce those measurements.

For Pythagoras, generate a new image from the canonical Pythagoras reference
using the same pose role. Do not copy Plato’s image or use a previous generated
pose as the identity reference.

### Coupling removed in the first extraction

The extraction removed the previous Cave language from
`PhilooDiscoveryTable`, including:

- the heading “Pistas da parede”;
- Cave-oriented tray language.

All visible table language is now configuration. The three tone names remain
approved protected visual roles in v1 rather than arbitrary lesson-authored
CSS.

### Reuse example

Second Plato lesson:

- categories might become `aparência`, `causa`, and `pergunta`;
- cards contain new claims;
- the worked example changes;
- Plato uses the same semantic pose role or a newly generated compatible pose;
- the shell, right rail, Folio, bags, card motion, phone behavior, checking,
  feedback surface, and completion behavior remain the same.

## 7. Reusable narrative interaction specifications

## NAR-01 — Character invitation

**Current source:** `CaveInvitationScene`
**Student action:** read and continue
**Status:** strong narrative candidate

Parameters:

- chapter label;
- scene title;
- speaker;
- character pose role;
- title;
- body paragraphs;
- guidance;
- source citation;
- action label and transition;
- optional environment/media.

Fixed:

- Folio composition;
- dialogue hierarchy;
- character grounding;
- action dock;
- responsive ordering.

This is not an exercise, but it belongs in the reusable screen library.

## NAR-02 — Guided transition

**Current source:** `CaveDescentScene`
**Student action:** read and continue
**Status:** strong narrative candidate

Same base API as character invitation with a different narrative intent and
pose role.

## NAR-03 — Guided dialogue sequence

**Current sources:** `CavePrisonerWallScene`, `CaveShadowNamesScene`
**Student action:** advance through dialogue/media beats
**Status:** candidate

Parameters:

- ordered beats;
- speaker role;
- dialogue;
- media asset;
- media alt;
- character or environmental focal point;
- per-beat action label;
- final transition.

Saved state:

```ts
type DialogueSequenceState = {
  beatIndex: number;
  completed: boolean;
};
```

This pattern must not assume Plato or prisoners.

## NAR-04 — Anomaly cliffhanger

**Current source:** `CaveFirstDoubtScene`
**Student action:** reveal anomaly, observe character turn, reach takeaway
**Status:** candidate, possibly custom

Parameters:

- anomaly asset and explanation;
- character response;
- cinematic bridge asset;
- ordered beats;
- takeaways;
- reward or chapter completion copy;
- next chapter transition.

Its cinematic image composition may remain custom while its beat/state
contract becomes reusable.

## 8. Existing foundation activities not in the accepted route

These components exist in the repository and may become part of the library,
but they are not all present in the accepted ten-route Story Folio journey.

| Component | Thinking move | Current status | Required before stable |
|---|---|---|---|
| `PredictionConsequence` | prediction before reveal | Good engine | standard visual shell, serializable content/state, second-domain test |
| `EvidenceInspector` | inspect and compare clues | Good engine | Story Folio integration, feedback contract review |
| `ConfidenceControl` | confidence calibration | Good primitive | integrate with activity response contract |
| `CerResponse` | claim–evidence–reason construction | Good engine | Story Folio screen recipe and author guide |
| `RevisionMap` | belief revision | Good engine | current/new lesson integration and visibility defaults |
| `TransferClassification` | novel-case transfer | Good engine | generic domain review and catalog preview |
| older `ShadowLaboratory` | manipulable causal model | custom experiment | decide whether to preserve, extract, or archive |

They should appear in the Lesson Lab under **foundation candidates**, not
“production stable,” until exercised by the accepted runtime and at least two
content contexts.

## 9. Generic activity runtime API

The author should not call many unrelated React components manually. A scene
definition should select an engine by `kind`.

```ts
type ActivityDefinition =
  | {
      kind: "image-choice-rounds";
      schemaVersion: "1";
      config: ImageChoiceRoundsConfig;
    }
  | {
      kind: "progressive-mechanism-reveal";
      schemaVersion: "1";
      config: ProgressiveMechanismRevealConfig;
    }
  | {
      kind: "causal-sequence";
      schemaVersion: "1";
      config: CausalSequenceConfig;
    }
  | {
      kind: "concept-crop-reveal";
      schemaVersion: "1";
      config: ConceptCropRevealConfig;
    }
  | {
      kind: "guided-classification";
      schemaVersion: "1";
      config: GuidedClassificationConfig;
    };
```

The runtime performs:

```ts
const registration = activityRegistry[definition.kind];

registration.validate(definition.config);
registration.render({
  definition,
  state,
  onCommit,
  onComplete,
});
```

This is the library/function model the user described, with stronger safety:

- typed parameters;
- author validation;
- shared interaction behavior;
- shared layout;
- serializable state;
- versioned schemas;
- future compatibility with a visual Studio.

## 10. Locked versus configurable

### Locked by Philoo

- lesson header and journey rail behavior;
- Folio geometry and main container behavior;
- right-rail relationship to content;
- typography roles;
- color roles;
- button and card depth;
- feedback placement;
- responsive breakpoints and stacking;
- minimum touch targets;
- focus and keyboard behavior;
- reduced motion;
- nonpunitive retry;
- response visibility requirement;
- progress and restoration integration;
- schema and graph validation.

### Configurable by the lesson

- philosophical objective;
- prompt;
- source text;
- categories;
- cards;
- choices;
- correct relationships;
- misconceptions;
- authored feedback;
- worked example;
- guide character;
- semantic pose role;
- images and focal points;
- title, context, and action labels;
- transition targets;
- visibility class within approved rules.

### Custom only with justification

- completely new page geometry;
- different journey/navigation behavior;
- new feedback model;
- new state/persistence behavior;
- new interaction mechanic;
- new animation language;
- bypassing the Folio or shell.

## 11. Character-pose roles for exercises

Characters use semantic roles, not filenames.

Initial exercise roles:

| Pose role | Visual purpose | Default placement |
|---|---|---|
| `activity-introduction` | Invite the learner to begin | Left, faces right |
| `guided-classification` | Point toward cards/categories | Left, faces right |
| `mechanism-reveal` | Present an image mechanism | Supporting side, faces content |
| `causal-sequence` | Trace an ordered path | Left or above path, follows direction |
| `concept-connection` | Connect example to concept | Opposite text/media connection |
| `evidence-review` | Invite inspection of clues | Faces evidence surface |
| `gentle-retry` | Guide revision after feedback | Faces active correction area |
| `completion-recognition` | Recognize a meaningful discovery | Does not obscure next action |

Each character catalog maps only supported roles to approved assets.

```ts
type CharacterPresentation = {
  characterId: string;
  poseRole: ExercisePoseRole;
  faces: "left" | "right" | "forward";
  screenSide: "left" | "right" | "integrated";
};
```

“Left” and “right” always describe the learner’s screen.

## 12. Building the second Plato lesson

The second Plato lesson should not begin by copying the `as-sombras` directory.

Recommended workflow:

1. List the new lesson’s learning claims.
2. Identify its narrative scenes.
3. Select which existing exercises genuinely fit.
4. Create new typed configurations.
5. Reuse Plato’s approved character identity.
6. Reuse a pose only when its semantic role and direction fit.
7. Generate a new pose when the role exists but current framing does not fit.
8. Register new environments/evidence assets semantically.
9. Keep the shell, Folio, rail, activity behavior, feedback surfaces,
   responsiveness, and persistence unchanged.
10. Build custom work only for the lesson’s unique intellectual or cinematic
    moment.

Example:

```ts
const ascentClassification = {
  kind: "guided-classification",
  schemaVersion: "1",
  config: {
    guide: {
      characterId: "plato",
      poseRole: "guided-classification",
      screenSide: "left",
      faces: "right",
    },
    workedExample: {...},
    prompt: "Que tipo de dificuldade aparece em cada passo da subida?",
    categories: [...],
    cards: [...],
    feedback: {...},
    completion: {
      transition: "continue_ascent",
      label: "Continuar a subida",
    },
  },
} satisfies ActivityDefinition;
```

The `GuidedClassificationActivity` renderer should not change for this lesson.

## 13. Extraction readiness

| ID | Pattern | Behavior reusable now? | Content fully external? | Exact screen documented? | Stable library status |
|---|---|---:|---:|---:|---|
| SYS-01 | Journey rail | Mostly | Mostly | Yes | Foundation |
| SYS-02 | Folio stage | Yes | Mostly | Yes | Foundation |
| SYS-03 | Activity briefing | Yes | No, Plato-coupled | Yes | Candidate |
| EX-01 | Image choice rounds | Scene-local | No | Yes | Experiment |
| EX-02 | Progressive reveal | Scene-local | No | Yes | Experiment |
| EX-03 | Causal sequence | Yes | No, Cave-coupled | Yes | Candidate |
| EX-04 | Concept crop reveal | Scene-local | No | Yes | Experiment |
| EX-05 | Guided classification | Yes | Yes | Yes | Foundation v1 |
| NAR-01 | Character invitation | Mostly | Mostly | Yes | Candidate |
| NAR-02 | Guided transition | Mostly | Mostly | Yes | Candidate |
| NAR-03 | Dialogue sequence | Scene-local | No | Yes | Experiment |
| NAR-04 | Anomaly cliffhanger | Scene-local | No | Yes | Experiment |

No exercise should be described to future contributors as a one-call stable
library component until its row reaches:

```text
behavior reusable = yes
content fully external = yes
second unrelated example = yes
responsive/accessibility tests = yes
state versioned = yes
```

## 14. Definition of done for an exercise

An exercise is ready for simple reuse only when:

1. the learning move and non-use cases are documented;
2. the screen runs inside the standard shell/Folio/rail;
3. all lesson content is passed through typed configuration;
4. no philosopher or lesson language remains in engine code;
5. character assets use semantic pose roles;
6. images use semantic asset IDs and focal points;
7. learner state is serializable and sanitizable;
8. response visibility is explicit;
9. completion is reported through the runtime;
10. retry and revision are nonpunitive;
11. tap, keyboard, and non-drag alternatives exist;
12. phone, tablet, laptop, and desktop are verified;
13. reduced motion is supported;
14. configuration validation provides useful author errors;
15. the engine is tested with at least two unrelated content contexts;
16. the component appears in the Lesson Lab;
17. a contributor can reuse it without opening its renderer source.

## 15. Responsive equivalence contract

Responsive does not mean reproducing the same pixels at a smaller size. It
means preserving the same:

- learning claim;
- intellectual action;
- information order;
- feedback and revision path;
- emotional tone;
- character intention;
- completion meaning.

The composition may change to keep those invariants usable.

### 15.1 Shared measured defaults

These are protected library defaults extracted from the accepted route. They
belong to layout tokens, not lesson-author parameters.

| Surface | Current protected default |
|---|---|
| Page horizontal inset | `clamp(12px, 2.3vw, 34px)` |
| Top bar | `74px`; `64px` on phone |
| Narrative area | maximum `1180px` |
| Shell plus journey rail | maximum `1536px` |
| Expanded journey rail | `312px` |
| Collapsed desktop rail | `68px` |
| Collapsed tablet/phone rail button | `56px × 56px` |
| Desktop story minimum height | `max(640px, 100dvh - 102px)` |
| Folio body padding | `clamp(23px, 3dvh, 34px) clamp(22px, 2.8vw, 38px)` |
| Action dock | minimum `68px` |
| Primary touch target | `48px` recommended; never below `44px` |
| Phone breakpoint | up to `720px` |
| Tablet band | `721px–1180px` |
| Short-height check | `740px` and below |

The breakpoint values describe the current implementation. Container queries
remain preferable for activity internals because the journey rail changes the
space available without changing the browser viewport.

### 15.2 Exercise geometry

| ID | Desktop geometry | Tablet adaptation | Phone adaptation |
|---|---|---|---|
| EX-01 | `16:9` image, three choice columns, content max `880px` | compress below a `780px` container | stack choices below `600px`; choices min `48px` |
| EX-02 | `16:9` exhibit plus `230px`/`0.35fr` panel | compress below `820px` | stack below `640px`; controls min `50px` |
| EX-03 | three pieces, four positions, positions min `94px` | compress below `720px` | vertical flow below `520px`; tap is primary |
| EX-04 | crop `16:8.4`, full view `16:6.6`, synthesis horizontal | reorganize below `900px` | media becomes `4:3`; synthesis stacks below `700px` |
| EX-05 | example columns `190–250px + 1fr`; three destinations | table becomes one column below `780px` | dedicated flow below `520px`; destination min `78px`, card min `52px` |

### 15.3 Required verification matrix

Every extracted engine and every authored instance must be checked at:

| Device intent | Viewport | What must be verified |
|---|---:|---|
| Phone | `390 × 844` | touch, vertical order, text, overlay rail, focus |
| Tablet portrait | `768 × 1024` | intermediate composition, rail, overflow |
| Tablet landscape | `1024 × 768` | short height, dock, reachable actions |
| Notebook | `1366 × 720` | priority above fold, no trapped scroll |
| Desktop | `1440 × 900` | full composition, proportion, visual rhythm |

The matrix also requires:

- 200% browser zoom;
- keyboard-only completion;
- reduced-motion mode;
- long but valid Portuguese content;
- missing/slow image fallback;
- coarse pointer;
- state restoration after refresh.

## 16. Technical dependency contract

The current library baseline is intentionally small:

| Concern | Technology | Library rule |
|---|---|---|
| UI/runtime | React 19 + Next.js 16 App Router | renderers stay framework-local and typed |
| Types | TypeScript strict mode | no untyped lesson configuration |
| Styling | CSS Modules | tokens and container queries own geometry |
| Motion | Motion | enhancement only; reduced-motion equivalent required |
| Images | `next/image` | semantic asset ID, dimensions, focal point, fallback |
| Icons | Phosphor Icons | icon reinforces text; never the only instruction |
| Pointer input | Pointer Events | preferred shared pointer abstraction |
| Drag input | native HTML drag/drop where useful | never the only completion path |
| Persistence | versioned attempt snapshot | engines expose serializable state |
| Tests | Vitest + Testing Library | behavior, keyboard, sanitization, contracts |

Adding a dependency to one exercise requires a library-level reason. Lesson
authors cannot introduce a new package from configuration.

## 17. Asset production contract

Every exercise asset record must include:

```ts
type LessonAsset = {
  id: string;
  kind: "environment" | "evidence" | "character" | "object" | "diagram";
  src: string;
  width: number;
  height: number;
  aspectRatio: `${number}:${number}`;
  focalPoint: { x: number; y: number };
  alt: string;
  safeCrop: "center" | "top" | "bottom" | "custom";
};
```

Character assets add:

```ts
type CharacterAsset = LessonAsset & {
  characterId: string;
  poseRole: string;
  screenSide: "left" | "center" | "right";
  faces: "left" | "front" | "right";
  pointsToward?: "content" | "action" | "evidence" | "none";
  transparentBackground: true;
};
```

This is how the library records that a philosopher must stand on a particular
side, face the correct direction, and support the learner's attention instead
of being decorative.

## 18. Documentation surface

The first code-backed documentation surface lives at:

```text
/tecnico/biblioteca
```

It reads from `src/domains/lesson-library/exercise-catalog.ts` and exposes:

- shared screen anatomy;
- measured defaults;
- responsive verification viewports;
- maturity/status definitions;
- author-controlled fields;
- library-protected behavior;
- technical dependencies;
- links to the accepted source scenes.

The route is deliberately absent from student navigation and uses
`robots: noindex, nofollow`. It is not access-controlled in v1. Authentication
must be decided together with the platform account architecture before this
surface contains private implementation material or authoring controls.

## 19. Next implementation order

After this catalog is approved:

1. make the accepted `As Sombras` manifest canonical;
2. create the activity registry contract;
3. generalize `PhilooActivityBriefing`;
4. connect `guided-classification` to the versioned runtime and response
   visibility contract;
5. extract `causal-sequence`;
6. extract `image-choice-rounds`;
7. extract `progressive-mechanism-reveal`;
8. decide whether `concept-crop-reveal` is generic or a composed custom scene;
9. add all candidates to the Lesson Lab;
10. reuse approved components in the second Plato lesson.

This order produces an actual reusable library rather than another layer of
documentation around scene-local code.
