# Philoo Scene Player and “As Sombras” Session 1 Design

**Status:** Approved direction
**Date:** 2026-07-27
**Audience:** Product, curriculum, design, engineering, and lesson-generation agents
**Extends:** `2026-07-26-philoo-platform-foundation-design.md`

## 1. Outcome

The existing `/aula/as-sombras` experience becomes the **Prologue: Corte de Luz**. It is a short curiosity activation and initial hypothesis, not the complete first lesson.

Its primary action becomes **Começar a investigação**, which opens a scene-based lesson player for the complete first Cave session. The player presents one meaningful scene at a time, shows a stable investigation path, and prevents the learner from becoming lost without turning the experience into a repetitive slideshow.

The first session uses a narrative investigation:

`observe → become competent → encounter anomaly → investigate → model → argue → revise → transfer`

The learner becomes genuinely good at predicting the Cave's shadows before one event breaks the current explanation. The prisoners remain intelligent and reasonable. The lesson does not teach that appearance is automatically false or that disagreement alone creates truth.

## 2. Scope

### Included

- Preserve the complete current Corte de Luz experience as a prologue.
- Save its optional hypothesis locally and restore it later.
- Add a clear start action.
- Add a full-viewport scene player with progress, back, exit, and resume.
- Implement the eight scenes below.
- Implement only the reusable activity primitives those scenes require.
- Implement a bespoke Shadow Laboratory with a semantic alternative.
- Add two approved generated Cave environment assets.
- Use the canonical Plato master without generating a new character identity.
- Support desktop, tablet, and phone.
- Support keyboard, screen readers, reduced motion, and non-drag operation.
- Persist local lesson state without Supabase during this slice.
- Test educational transitions, recovery, and accessible interaction paths.

### Deferred

- Supabase authentication and cloud persistence.
- Teacher reporting.
- Audio production and a general sound system.
- Plato voice acting.
- New Plato expression assets.
- Full lesson authoring UI.
- Sessions 2 and 3.
- Real-time peers or classroom discussion.
- A generic canvas or universal drag-and-drop engine.

## 3. Design principles

### 3.1 Stable orientation, varied thinking

The shell remains stable:

- one scene at a time;
- current act and progress visible;
- one primary next action;
- back, exit, and resume;
- consistent focus behavior;
- private investigation notebook.

The visible activity changes according to the learning claim. The shell is reusable; the Cave mechanic and story are not flattened into a generic template.

### 3.2 No infinite-scroll lesson

The player occupies the available viewport. The scene is the primary surface and the interaction sits in a contextual tray.

On short screens, an individual tray may scroll to remain accessible, but scrolling never advances the narrative. The learner moves through named scenes with explicit controls.

### 3.3 Dramatic irony after the prologue

The prologue already hints at `light → object → wall`. Session 1 does not pretend that the learner has forgotten it.

The opening establishes:

> Você viu a caverna por fora. Agora tente pensar apenas com as pistas que chegam à parede.

The learner then adopts the prisoner's constrained point of view. Knowing that there may be a mechanism does not solve the evidence problem from inside that perspective.

### 3.4 Character relationship

Plato is a Socratic companion outside the literal Cave:

- absent while the learner first experiences the prisoner's viewpoint;
- present after the anomaly;
- present in Thought Space;
- available for optional hints after an attempt;
- present during response review and final revision;
- never a scorekeeper, omniscient narrator, or decorative mascot.

The Pattern-Keeper is an unseen respected prisoner. This character represents the strongest reasonable version of the wall-based model, not a foolish antagonist.

### 3.5 Feedback

The default response loop is:

1. reflect the learner's current claim or action;
2. reveal a consequence or useful clue;
3. identify the unresolved tension;
4. offer one next move;
5. allow retry or revision.

The system remains precise about unsupported causal claims. Nonpunitive feedback does not mean that every explanation is equally supported.

## 4. Player layout

### Desktop and large tablet

```text
┌ exit ─ AS SOMBRAS ─ luminous investigation path ─ 3/8 ─ options ┐
│                                                                  │
│                   ENVIRONMENT / ACTIVE SCENE                     │
│               responsive image + semantic mechanic               │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ scene title        prompt / evidence / contextual interaction    │
│ back                                                continue →   │
└──────────────────────────────────────────────────────────────────┘
```

### Phone

```text
┌ exit ─ AS SOMBRAS ─ 3/8 ┐
│ luminous path / act name │
│                          │
│      ACTIVE SCENE        │
│                          │
├──────────────────────────┤
│ reachable activity tray  │
│ back          continue → │
└──────────────────────────┘
```

The contextual tray becomes a reachable bottom sheet or inline region. It never covers information the learner must inspect.

### Signature visual element

The player is remembered by a **living fissure of baby-blue light** that travels through the Cave path as progress advances. It encodes the investigation's structure and gradually reveals connections; it is not an ornamental progress bar.

The aesthetic risk is the contrast between:

- cinematic, tactile Cave environments;
- precise cream investigation surfaces;
- playful blue coded light;
- deliberately diagrammatic educational overlays.

## 5. Visual system

### Colors

- Philoo sky: `#33BFED`
- Philoo blue: `#5BB8F5`
- Cream paper: `#FBF8F3`
- Cave ink: `#0D1728`
- Reading ink: `#16233A`
- Warm fire: `#F2B84B`
- Evidence teal: `#167C78`
- Tension red: `#B85143`

Baby blue is the brand anchor and the color of investigation, focus, and paths. Cream holds reading and response surfaces. Warm amber belongs to the Cave's mechanism. Red is used sparingly for unresolved tension and never as the sole error signal.

### Typography

Keep the current deliberate roles:

- Bricolage Grotesque for scene questions and decisive prompts;
- Public Sans for instructions and reading;
- IBM Plex Mono for evidence labels, model names, and compact state.

### Generated environment assets

Two new 1672 × 941 source images were generated through the built-in image-generation tool:

1. `cave-stage-source.png` — open Cave environment for orientation and transitions.
2. `cave-wall-stage-source.png` — quiet wall environment for coded shadows and evidence overlays.

They are generated backgrounds, not historical evidence. Production derivatives become:

- `public/images/cave/cave-player-stage.webp`
- `public/images/cave/cave-wall-stage.webp`

The artwork creates atmosphere. Educationally critical light rays, artifacts, wall projections, timing, and source relationships are rendered in deterministic HTML/SVG/CSS so they remain accurate and testable.

### Character assets

Use only `public/images/plato/platao-master.webp` in this slice.

Any future Plato pose must:

1. use the canonical master as a reference;
2. preserve face, silhouette, proportions, hair, costume, and palette;
3. receive an AI-assisted continuity comparison;
4. receive human approval before becoming canonical.

## 6. Session path

The prologue is outside the scene count.

### Scene 1 — Só a parede

**Purpose:** Establish the literal constraint and distinguish observation from inference.

**Experience:**

- fixed prisoner point of view;
- choose `Observar`, `Escutar`, or `Tentar olhar para trás`;
- classify short statements as `percebi` or `concluí`.

**Character:** Plato is absent. The Pattern-Keeper names a recurring shape.

**Feedback example:**

> Você percebeu um contorno. “Pássaro” já é uma explicação. Você consegue verificar a fonte daqui?

**Evidence:** `observation_inference_distinguished`.

### Scene 2 — As regras da parede

**Purpose:** Show why a limited model can still be useful.

**Experience:**

- two demonstrations;
- four novel, untimed forecasts involving silhouette, direction, rhythm, or timing;
- commit before reveal;
- save inferred patterns in the `Caderno da Parede`.

Three model-consistent predictions demonstrate pattern mastery. Otherwise, an additional clue and forecast appear without loss or failure.

**Character:** The Pattern-Keeper explains the civic usefulness of prediction.

**Evidence:** `wall_forecast`, `wall_pattern_mastery`.

### Scene 3 — O pássaro impossível

**Purpose:** Create a curiosity gap when appearance, sound, and timing stop agreeing.

**Experience:**

- predict the familiar bird event;
- reveal a bird-shaped wall projection with visible cues for heavy human footsteps and a human voice;
- choose which mismatch to inspect first: `forma`, `som`, `tempo`, or `repetição`.

Sound is represented visually and through text in this slice. Audio can be added later without changing the evidence contract.

**Character:** Plato enters only after the learner notices the anomaly.

**Evidence:** `anomaly_noticed`, `first_clue_selected`.

### Scene 4 — Siga a incompatibilidade

**Purpose:** Coordinate clues across channels and compare explanations.

**Experience:** Inspect at least two evidence lenses:

- the silhouette remains stable;
- footsteps begin before the projection and continue afterward;
- the voice is human;
- the same voice later accompanies a different projection.

For each clue, decide whether it fits:

- the wall-creature model;
- a hidden-source model;
- both;
- uncertainty.

**Character:** Optional Plato question after one inspection.

**Evidence:** `clue_inspected`, `model_fit_compared`.

### Scene 5 — Espaço de Pensamento

**Purpose:** Construct and test the literal causal model.

**Experience:**

1. enter an explicitly nonliteral side-on Thought Space;
2. complete the chain among fire, carrier, artifact, projection, voice, footsteps, and echo;
3. run the arrangement;
4. change one variable and predict the consequence;
5. optionally explore a sandbox after the core model works.

Drag is an enhancement. Tap-select/place and named move controls are primary alternatives. A structured causal stepper produces equivalent evidence for non-spatial use.

**Character:** Plato asks for predictions and offers optional hints only after an attempt.

**Evidence:** `causal_link_placed`, `model_run`, `counterfactual_predicted`.

### Scene 6 — O melhor argumento contrário

**Purpose:** Build a reasoned response while acknowledging what the rival model explains well.

The Pattern-Keeper argues:

> A parede é a única evidência que todos podem conferir. Ela sempre nos ajudou a prever. Um som estranho não prova um mundo invisível.

**Experience:** Assemble:

- a claim;
- one inspected clue;
- a reasoning bridge;
- one fair acknowledgment;
- a confidence state.

`Ainda não há evidência suficiente` remains a legitimate claim when paired with the next evidence the learner would seek.

Free writing is optional; sentence stems and selectable phrases capture the same core structure.

**Character:** Plato mirrors the assembled response and asks one targeted question.

**Evidence:** `claim_built`, `evidence_linked`, `rival_acknowledged`, `confidence_recorded`.

### Scene 7 — Sua hipótese, de novo

**Purpose:** Make revision and calibrated uncertainty visible as progress.

**Experience:**

- restore the exact prologue hypothesis when one exists;
- choose `manter`, `revisar`, or `ainda não sei`;
- identify the decisive clue;
- optionally edit or add a statement;
- compare before and after.

**Character:** Plato responds to strategy, not identity.

**Evidence:** `hypothesis_revisited`, `decisive_clue_selected`, `revision_recorded`.

### Scene 8 — Outro tipo de sombra

**Purpose:** Transfer the distinction among representation, source, claim, and evidence.

**Experience:**

- show a fictional cropped school-council scene captioned `Todos apoiaram a nova regra`;
- record confidence;
- reveal wider context showing disagreement;
- classify the cropped image, meeting, caption, and current evidence;
- choose the next evidence to seek.

**Character:** Plato asks:

> A imagem é falsa — ou a conclusão foi além dela?

**Evidence:** `transfer_classified`, `next_evidence_selected`, `transfer_confidence_recorded`.

Closing:

> Você ainda não saiu da caverna. Mas a parede já não explica tudo.

The learner does not leave, turn around, see daylight, or choose liberation in Session 1.

## 7. Completion

Completion requires engagement with the reasoning path, not perfect first-attempt performance:

- four forecasts attempted;
- at least two evidence channels inspected;
- one causal model tested;
- representation separated from proposed source;
- one claim connected to relevant evidence;
- one reasonable feature of the rival model acknowledged;
- confidence and revision recorded;
- transfer classification completed.

Weak or incomplete responses open a comparison, counterexample, or hint and then allow revision.

## 8. Reusable versus custom

### Reusable player capabilities

- scene shell, path, navigation, focus management, local save, resume, and replay;
- prediction followed by consequence;
- evidence inspection and configurable branch order;
- competing-model comparison;
- claim–evidence–reason construction;
- fair-rival acknowledgment;
- confidence before and after;
- hypothesis comparison;
- crop/context reveal;
- representation/source/claim/evidence classification;
- investigation notebook;
- optional companion hint and response review;
- feedback and revision contract;
- accessibility adapters.

### Cave configuration

- copy;
- silhouettes and prediction sequences;
- Pattern-Keeper dialogue;
- clue content;
- causal rules;
- transfer case;
- Plato's scene-specific questions.

### Truly custom

- Cave-wall prediction and anomaly playback;
- Shadow Laboratory geometry and variable behavior;
- equivalent semantic causal stepper.

The custom scene still implements serializable state, named events, keyboard and touch support, an accessible equivalent, and recoverable failure.

## 9. Local state for this slice

Until Supabase is introduced, save one versioned local document:

```ts
type CaveSessionStateV1 = {
  version: 1;
  sceneId: CaveSceneId;
  completedSceneIds: CaveSceneId[];
  prologueHypothesis: string;
  forecasts: Array<{
    id: string;
    choice: string;
    matchedPattern: boolean;
  }>;
  inspectedClues: CaveClueId[];
  modelPlacements: Record<CaveModelSlot, CaveModelPiece | null>;
  argument: {
    claim: string;
    evidence: string;
    reason: string;
    acknowledgment: string;
    confidence: "low" | "medium" | "high" | "";
  };
  revision: {
    stance: "maintain" | "revise" | "uncertain" | "";
    decisiveClue: CaveClueId | "";
    text: string;
  };
  transfer: {
    initialConfidence: "low" | "medium" | "high" | "";
    classifications: Record<string, string>;
    nextEvidence: string;
  };
  updatedAt: string;
};
```

Storage key: `philoo:cave-session:v1`.

Corrupt, unknown-version, or unavailable storage falls back to a clean state without blocking the lesson.

## 10. Accessibility and responsive requirements

- WCAG 2.2 AA target.
- Every scene has one heading and a named interaction region.
- Scene changes move focus to the new heading unless the learner is returning backward.
- Interactive targets are at least 44 × 44 CSS pixels.
- Color never carries state alone.
- Dragging, sound, motion, and crop sliders have button or semantic alternatives.
- Reduced motion removes ambient transitions and replaces causal animation with before/after states.
- Text descriptions expose the same clue without giving away a different answer.
- Phone layouts avoid horizontal panning.
- Required checks: 360 × 800, 768 × 1024, 1366 × 768, and 1920 × 1080.

## 11. Validation

Automated tests cover:

- prologue-to-player route;
- hypothesis persistence and recovery;
- forward and backward navigation;
- no advancement before required attempts;
- optional hints only after an attempt;
- model mastery and recovery path;
- evidence minimums;
- argument assembly;
- revision restoration;
- transfer completion;
- corrupt local-state fallback;
- accessible labels and non-drag controls;
- reduced-motion-compatible state.

Manual browser validation covers:

- visual quality at required viewports;
- no page-level lesson scrolling on standard screens;
- stable mobile bottom actions;
- keyboard completion;
- focus order;
- screen-reader naming;
- image crop and contrast;
- performance and layout shift.

## 12. Evidence basis

The design is informed by:

- learner-paced segmenting and signaling;
- ICAP active, constructive, and interactive engagement;
- curiosity and prediction;
- retrieval and generative learning;
- action-oriented feedback and revision;
- Universal Design for Learning;
- self-determination through autonomy, competence, and relatedness;
- philosophical inquiry and dialogic argumentation.

The design must still be tested with real learners. Enjoyment, completion, time, and return do not prove learning. Philoo measures reasoning, calibration, revision, retention, and transfer separately.

