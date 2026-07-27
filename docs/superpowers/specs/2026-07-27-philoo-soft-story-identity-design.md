# Philoo Soft-Story Identity Design

**Status:** Approved by direct product instruction  
**Date:** 2026-07-27  
**Extends:** `2026-07-27-philoo-as-sombras-living-story-redesign.md`  

## Outcome

Every currently implemented “As Sombras” surface will use the same recognizable
Philoo visual language established in the approved Scene 3:

- cream `#FBF8F3` as the permanent canvas;
- baby-blue `#33BFED` and `#5BB8F5` as tactile accents;
- rounded cream dialogue and activity surfaces with a soft blue lower edge;
- curved baby-blue inquiry rails and small tactile pebbles as the signature;
- large, transparent Platão character art with a restrained blue-gray shadow;
- no oval or circular backdrop behind Platão;
- cave imagery used only when it carries indispensable story information.

The work covers both the five-route cinematic story and the persisted
manifest-driven lesson. It preserves existing lesson logic, saved responses,
accessibility semantics, and educational outcomes.

## Platão continuity

`/public/images/story/plato-welcome-v2.png` is the sole identity reference for
new character generation. New assets must preserve:

- the same face, amber eyes, white hair and beard, laurel, proportions, and
  stylized 3D finish;
- the lavender-and-gold toga, cream tunic, and brown sandals;
- a full-body transparent cutout with head and foot padding;
- no background, embedded text, watermark, or baked cast shadow.

The visible pose must agree with the current text. A new pose is required for
each distinct authored Platão dialogue beat unless an existing pose performs
the exact same narrative action. Image changes occur with the text, not merely
at route boundaries.

## Pose contract

The reusable pose catalog exposes a stable semantic key, source path, and
contextual alt text. Story components select a pose by the active beat instead
of embedding file paths directly.

Required semantic poses:

- invitation;
- descent with lamp;
- entrance fading behind;
- empathy toward the prisoners;
- first reveal of the wall;
- observe at the prisoners’ sightline;
- acknowledge the shadow expert;
- distinguish appearance from source;
- first philosophical question;
- diagnose the anomaly;
- test a predictive model;
- review evidence;
- revision through change;
- revision through maintaining;
- revision through precise uncertainty;
- frame versus conclusion.

## Shared visual grammar

The shared story primitives are:

1. `PhilooStoryShell`: top bar, story progress, cream stage, soft frame, route
   transition phase, and responsive content bounds.
2. `PhilooDialogueCard`: speaker, quote treatment, text, local beat progress,
   tactile action, and live-region behavior.
3. `PlatoGuide`: stable image box, semantic pose lookup, contextual alt text,
   subtle silhouette shadow, and coordinated beat transition.

Scene-specific story information remains variable. The shell must not turn
every screen into the same left-card/right-character template. Layout can
reverse, center, or introduce an activity surface, but must retain the same
materials and proportions.

## Motion

Within a route, a beat change uses one coordinated sequence:

1. the current card and Platão pose soften and move 12–20px;
2. the new pose and text enter together;
3. focus remains on the active action or moves to the final route action.

Between routes, the baby-blue inquiry rail sweeps across the stage while the
content crossfades. Motion never blocks navigation. Under
`prefers-reduced-motion`, transforms are removed and the state changes through
an immediate or short opacity transition.

## Cinematic route requirements

- Scenes 1 and 2 adopt the shared materials without losing their invitation
  and descent meanings.
- Scene 3 switches Platão art on all three dialogue beats.
- Scene 4 removes the AI-composite cave plates from the active presentation.
  Deterministic shadow motifs may be drawn with CSS/SVG while Platão remains a
  separate context-matched cutout.
- Scene 5 presents the evidence-sort activity inside the same tactile identity,
  with Platão visibly introducing the challenge.
- Existing navigation, live regions, focus transfer, and story progress remain
  functional.

## Persisted lesson requirements

- The dark permanent shell becomes cream and baby blue.
- Existing interactions, persistence, graph transitions, and response
  contracts do not change.
- Plato guide appearances use the semantic pose catalog wherever the current
  scene presents his authored guidance.
- Activity controls become rounded and tactile without hiding educationally
  important evidence.
- Cave darkness is localized to evidence stages rather than dominating the
  whole interface.

## Responsive and accessibility requirements

- No educational content may be clipped at 1366×768, 1024×768, 820×1180,
  390×844, or 360×800.
- The Platão image box remains stable across pose changes to prevent layout
  shift.
- Dialogue and actions remain readable in normal document flow.
- Touch targets are at least 44×44px.
- Pose alt text describes the narrative action.
- Decorative rails, pebbles, and shadow motifs are hidden from assistive
  technology.
- Motion honors the user’s reduced-motion preference.

## Acceptance criteria

- All five cinematic routes visibly belong to the approved Scene 3 identity.
- Every distinct Platão dialogue beat in the cinematic route changes to a
  matching pose.
- The persisted lesson shell and its activities use the same material language.
- At least six distinct Platão poses are visible across the complete experience.
- No oval/circular character halo is reintroduced.
- The focused story and lesson tests, full suite, lint, and production build
  pass.
- Desktop and mobile browser review shows no clipping, horizontal overflow, or
  important content hidden behind Platão.
