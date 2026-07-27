# Philoo “As Sombras” Living-Story Redesign

**Status:** Approved direction  
**Date:** 2026-07-27  
**Audience:** Product, curriculum, design, art, engineering, and lesson-generation agents  
**Supersedes:** The presentation, character-placement, and scene-layout decisions in `2026-07-27-philoo-lesson-player-design.md`  
**Preserves:** The approved educational reasoning arc and the separation of the Cave myth into three sessions

## 1. Outcome

Session 1 of “As Sombras” becomes an interactive illustrated story led by Plato.

The student should feel that Plato is taking them through a thought experiment, not that a school platform is assigning a sequence of forms. Story, character, atmosphere, and interaction occupy the same composed scene. Explicit questions appear only when a story beat has earned them.

The experience remains educationally rigorous. By the end of Session 1, the learner should understand:

- what the prisoners can and cannot observe;
- why their interpretation of the shadows is reasonable from their position;
- how an incompatible clue can expose the limits of an explanation;
- how light, objects, movement, sound, and the wall can form a causal mechanism;
- why revising a belief after new evidence is a strength;
- how a cropped image or incomplete account can become a modern “shadow.”

Session 1 ends inside the Cave. Turning around, leaving, seeing daylight, and returning belong to Sessions 2 and 3.

## 2. Product promise

Philoo is not another place where a student completes tasks for grades. It offers an experience students do not normally receive at school: philosophy encountered as story, character, curiosity, decision, and discovery.

The desired feeling is:

- warm, playful, and beautiful;
- cinematic enough to create wonder;
- intellectually respectful of children and teenagers;
- expressive without becoming childish;
- guided without becoming professoral;
- interactive without becoming a quiz carousel.

## 3. Sources of truth

### Brand and interface

- Primary blue: `#33BFED`
- Supporting baby blue: `#5BB8F5`
- Cream background: `#FBF8F3`
- Dark reading text: `#1A1A1A`
- Soft border: `#EAE4D7`
- Heading type: Baloo 2
- Body and interface type: Nunito

The shipped Flutter app at `/Users/jv/philoo/philoo_app` is the authoritative mobile reference. The older dark Expo rewrite at `/Users/jv/philoo/philoo` is not a visual reference for this redesign.

### Plato identity

`/Users/jv/philoo/philoo_app/assets/images/bem_vindo.webp` is the canonical identity reference named in the Flutter art catalog.

Strong existing Cave references include:

- `card_caverna_ex01.webp`
- `tela2_caverna.webp`
- `bg_caverna_prisioneiros.webp`
- `bg_caverna_sombras.webp`
- `card_caverna_ex02.webp`
- `card_caverna_ex03.webp`

Useful existing Plato poses include:

- `platao_apresentacao.webp`
- `platao_provocando.webp`
- `platao_alerta.webp`
- `platao_didatico.webp`
- `platao_pensativo_leve.webp`

These assets establish the approved stylized 3D language. New artwork must use the canonical Plato image and the relevant Cave scene as references.

## 4. Chosen direction: living-story hybrid

The design combines cinematic story scenes with focused interactive moments.

During narration and character beats, the learner sees a full illustrated composition. When Plato proposes a challenge, the same scene focuses around an in-world object, a dialogue choice, a thread of evidence, or a temporary notebook surface. The activity does not permanently occupy a separate worksheet below the artwork.

This direction is preferred over:

- a fully cinematic approach, which would demand a unique production-quality illustration for nearly every frame;
- a page-based storybook approach, which would be easier to reuse but would weaken the feeling of inhabiting the Cave.

The hybrid gives the story room to breathe while allowing reusable interaction mechanics and reliable responsive behavior.

## 5. Experience grammar

The recurring rhythm is:

`story → notice → Plato reacts → challenge → visible consequence → story continues`

It is not:

`instruction → answer → feedback → next question`

Rules:

1. No more than one major conceptual question in a story beat.
2. No more than two answer-dominant beats in succession.
3. Every major interaction changes something visible in the story world.
4. Plato introduces activities in character and explains why the challenge matters.
5. Feedback responds to the learner’s actual choice.
6. Incorrect or incomplete attempts reveal tension, consequences, or another clue; they do not subtract lives or shame the learner.
7. Some beats are deliberately only story, atmosphere, conversation, or reflection.
8. The story verb is also the learning verb: observe, predict, inspect, connect, model, defend, and revise.

## 6. Visible structure

The session is presented as three story chapters, not eight equal tasks.

### Chapter 1 — Entre comigo

1. **The invitation**
   - Plato enters with a torch and invites the learner into the thought experiment.
   - This is a character and atmosphere beat, not a question.
   - Plato explains that the learner must temporarily reason only from what reaches the wall.

2. **Only the wall**
   - The scene adopts the prisoners’ restricted point of view.
   - The learner can look, listen, and try to turn through small in-world hotspots.
   - Plato intentionally gives the scene a moment of quiet, then returns to distinguish what was perceived from what was inferred.

3. **The first notebook mark**
   - The learner makes one provisional distinction between a contour and the explanation “bird.”
   - The notebook appears as a soft cream overlay inside the scene and retreats after use.

### Chapter 2 — Aprenda a ler a parede

4. **Meet the Pattern Keeper**
   - A recurring prisoner becomes the intelligent defender of the wall-based interpretation.
   - She is credible, useful, and never treated as foolish.
   - Plato encourages the learner to understand her model before criticizing it.

5. **The wall’s rules**
   - Two or three short predictions are presented as apprenticeship inside the scene, not as a list of multiple-choice cards.
   - The learner manipulates or selects visible shadow cues.
   - Each result plays out on the wall and adds a rule to the notebook.

6. **Why the model feels safe**
   - A quiet story beat shows how the model lets the prisoners coordinate and anticipate events.
   - No answer is required.
   - Plato notices that a limited explanation can still be genuinely useful.

### Chapter 3 — A sombra que não cabe

7. **The impossible bird**
   - The learner makes the now-familiar prediction.
   - The bird silhouette appears, but heavy footsteps and a human voice do not fit.
   - The mismatch is allowed to land before any instruction appears.

8. **Follow the blue thread**
   - Plato appears at full character scale and asks the learner to follow one incompatibility.
   - Shape, footsteps, voice, and timing are tappable in-world clues.
   - A baby-blue thread visually connects discovered evidence.

9. **Build a possible mechanism**
   - Plato opens a clearly nonliteral “thought space.”
   - The learner moves or taps the light, object, carrier, wall, and observer into a causal sequence.
   - Running the model produces the shadow in the scene.
   - A prediction must be made before one counterfactual test.

10. **The strongest disagreement**
    - The Pattern Keeper gives the best version of the wall-based explanation.
    - The learner builds one response from claim, clue, and connection.
    - She reacts without being forced to agree.
    - Plato asks one precise follow-up instead of declaring a winner.

11. **Your first idea, again**
    - The initial hypothesis returns in the notebook.
    - The learner may maintain, revise, or remain uncertain and identifies the clue that mattered most.
    - Plato treats justified uncertainty and evidence-based revision as intellectual progress.

12. **Another kind of shadow**
    - Plato places a cropped modern image on the Cave wall.
    - The learner widens the context and decides which conclusion went beyond the evidence.
    - This remains inside the story world rather than switching to a disconnected worksheet.

13. **Closing**
    - The projection dissolves back into the Cave.
    - Plato closes with: “Você ainda não saiu da caverna. Mas a parede já não explica tudo.”
    - The next-session promise concerns turning toward the source, without beginning Session 2.

## 7. Plato as guide and main character

Plato is a companion, not an avatar, hint icon, narrator badge, or scorekeeper.

### Presence

- When speaking, Plato should normally occupy roughly 25–45% of the visual composition.
- He leads transitions, introduces challenges, observes attempts, reacts, and helps the learner name a discovery.
- During first-person Cave moments he may step visually aside, but the relationship remains continuous and he returns before the learner feels abandoned.
- A tiny portrait may appear only in compact notebook feedback; it cannot be his primary representation.

### Voice

Plato is:

- curious;
- warm;
- provocative;
- metaphorical when useful;
- respectful of the learner’s intelligence;
- concise.

He is never:

- professoral;
- omniscient;
- sarcastic;
- excessively praising;
- punitive;
- a speaker of generic interface instructions.

Dialogue should usually be one to three short sentences. It should name the learner’s actual choice when possible.

### Pose set

The session needs a coherent minimum set:

1. entering with torch;
2. inviting or presenting;
3. listening to the learner;
4. alert or surprised by the anomaly;
5. arranging or connecting clues;
6. reflective beside the notebook;
7. warmly celebrating a justified discovery;
8. closing beside the Cave wall.

Existing approved poses should be reused when they fit. Missing poses should be generated from the canonical Plato reference, inspected for identity continuity, and approved before becoming part of the reusable library.

## 8. Supporting characters

The Pattern Keeper becomes a visible recurring character rather than an unseen label.

Her role is to embody the strongest reasonable inherited explanation. She demonstrates that people can be intelligent, useful, and sincere while working with incomplete evidence.

She must:

- have a consistent face, clothing, proportions, and palette;
- be introduced through action and dialogue;
- react to the learner’s argument;
- retain dignity even when her model is challenged;
- remain available for Sessions 2 and 3.

Other prisoners provide atmosphere and social stakes, but do not become interchangeable talking heads.

## 9. Visual system

### Emotional palette

The interface is light and welcoming:

- Philoo bright blue: `#33BFED`
- Philoo baby blue: `#5BB8F5`
- Cream: `#FBF8F3`
- Pale sky surface: `#EAF7FD`
- Dark reading text: `#1A1A1A`
- Soft border: `#EAE4D7`
- Plato lavender accent: approximately `#CDB9E8`
- Warm torch accent: approximately `#F6C66D`
- Soft peach accent: approximately `#F2B7A0`

Deep navy, black, and brown belong mainly to the illustrated Cave. They must not dominate the permanent interface chrome.

### Typography

- Baloo 2 for expressive chapter titles and short dramatic phrases.
- Nunito for dialogue, instructions, controls, and learner writing.
- No permanent mono type role.
- Avoid enormous tightly tracked editorial headlines.
- Avoid repeated all-uppercase micro-labels.

### Shape and depth

- Cards and speech surfaces use 18–32px corner radii.
- Buttons are rounded, tactile, and clearly pressable.
- Depth comes from soft shadows and a restrained 3–4px lower edge.
- Hairline grids, hard rectangular cards, square buttons, and offset brutalist shadows are removed.
- Dialogue bubbles and notebook surfaces may use organic tails or waves derived from the Flutter app.

### Signature element

A living baby-blue “thread of inquiry” travels with Plato.

It:

- introduces interactable clues;
- connects discovered evidence;
- animates transitions between chapters;
- communicates progress without looking like a grade tracker;
- becomes brighter as the learner forms a stronger explanation.

It is not an eight-node progress bar.

## 10. Scene composition and navigation

There is one meaningful story beat at a time.

Permitted compositions include:

- full illustrated cinematic scene with dialogue;
- Plato and learner-facing conversation;
- in-world hotspot investigation;
- focused manipulation challenge;
- full notebook reflection;
- short atmospheric transition.

The lesson must not impose one identical template on every beat.

Navigation is quiet:

- exit;
- current chapter name;
- three-chapter progress;
- optional sound control when sound exists;
- one contextual next action.

“Back” remains available but visually secondary.

## 11. Responsive behavior

The current fixed-viewport and nested-scroll architecture is removed.

Requirements:

- Never set the entire lesson to a fixed `height: 100dvh` with unreachable overflow.
- Use normal document flow or one clearly identified scroll container.
- Never place educationally important content outside a clipped parent.
- Desktop scenes may compose into a viewport-height canvas when space allows.
- Short desktop screens must extend naturally and remain fully scrollable.
- Tablet and phone may reposition artwork, Plato, dialogue, and activity controls, but should preserve one composed story moment.
- Portrait artwork or deliberate crops should be used when a landscape background cannot preserve the focal point.
- Temporary sheets may overlap decorative artwork, but may not hide clues required by the activity.
- Touch targets are at least 44×44px.

Reference verification sizes:

- 1440×900 desktop;
- 1366×768 short desktop;
- 1024×768 tablet landscape;
- 820×1180 tablet portrait;
- 390×844 phone;
- 360×800 small phone.

## 12. Interaction library

The lesson may use different implementation libraries when they improve a specific mechanic. A library is not itself a design direction.

Reusable activity families:

1. **Explore**
   - tap or keyboard-focus a clue in the illustrated scene;
   - reveal a short consequence or character response.

2. **Manipulate**
   - move light, object, or observer;
   - provide an equivalent ordered-tap control for keyboard and assistive technology.

3. **Connect**
   - join clues, causes, or claims with a visible line;
   - provide an equivalent two-step select-and-connect mode.

4. **Sequence**
   - order a causal chain or event;
   - provide move-up and move-down controls.

5. **Dialogue**
   - choose what to say;
   - let the other character respond to the reasoning, not merely mark correctness.

6. **Notebook**
   - save, compare, and revise the learner’s own explanation.

7. **Perspective**
   - widen a crop, rotate a point of view, or reveal missing context.

Each family must support touch, pointer, keyboard, readable focus states, reduced motion, and a non-drag alternative.

## 13. Art production strategy

### Reuse first

Reuse strong Flutter artwork when it:

- already matches the approved Plato identity;
- has enough resolution;
- contains no visual or textual artifacts;
- composes well on the web;
- accurately supports the story beat.

### Generate only what is missing

New art should prioritize:

- missing Plato poses;
- the Pattern Keeper identity sheet;
- a clean prisoner-view wall scene;
- the impossible-bird story scene;
- a thought-space mechanism scene;
- the closing Cave projection scene;
- portrait-safe variants or separated character/background layers where needed.

### Continuity workflow

Every generated character asset must:

1. include the canonical character reference;
2. include the relevant environment/style reference;
3. state identity invariants explicitly;
4. avoid text inside the image;
5. be visually inspected against the reference;
6. be rejected if the face, silhouette, hair, clothing, or proportions drift;
7. receive a stable semantic filename only after approval.

Critical educational mechanics remain deterministic HTML, SVG, and CSS when exact cause and effect matters.

## 14. Feedback and learning

Feedback follows:

1. reflect the learner’s action or claim;
2. show what consequence it produces;
3. name the unresolved tension;
4. let Plato or another character respond;
5. offer one next move.

The lesson does not use:

- lives;
- point loss;
- red failure screens;
- generic “correct/incorrect” dialogue;
- praise disconnected from reasoning.

The learner’s notebook persists:

- first hypothesis;
- wall rules discovered;
- selected anomaly clue;
- causal model;
- argument;
- final revision;
- transfer principle.

This evidence remains available for later teacher reporting, but the student experience does not resemble a reporting system.

## 15. Accessibility and motion

- All narration and dialogue are available as text.
- Sound is optional and never the only carrier of evidence.
- Off-screen speakers are labeled.
- Contrast remains readable over artwork through localized gradients or speech surfaces.
- Focus order follows the story composition.
- Motion communicates transitions and consequences but never gates understanding.
- Reduced-motion mode replaces travel, parallax, and large transforms with fades or immediate state changes.
- Generated images receive contextual alt text based on their story function.

## 16. What is removed

- the permanent dark navy lesson shell;
- the eight-diamond progress bar;
- the repeated “visual above, worksheet below” composition;
- fixed viewport locking and nested hidden overflow;
- square buttons and square form cards;
- tiny Plato cameo cards as the main character treatment;
- giant editorial headings that compete with the story;
- repeated mono evidence labels;
- four- or five-question runs presented as a conventional quiz;
- hidden character art during activities;
- the legacy instruction that every lesson must use a fixed layout.

## 17. Reusable lesson system

The reusable system is a grammar, not a rigid screen template.

Reusable:

- chapter navigation;
- story transitions;
- Plato dialogue and reaction contracts;
- notebook state;
- feedback structure;
- interaction families;
- art continuity metadata;
- accessibility controls;
- evidence events.

Variable by lesson:

- scene composition;
- character placement;
- activity choice;
- pacing;
- number of quiet beats;
- palette accents;
- environment;
- story conflict;
- generated artwork.

Future lesson-generation agents should select the activity and composition that express the philosophical idea. They must not fill every available slot in a universal lesson layout.

## 18. Acceptance criteria

The redesign is successful when:

### Story and character

- Plato opens the session at full character scale.
- Plato visibly guides transitions and introduces each major challenge.
- At least six distinct Plato poses are used.
- The Pattern Keeper appears as a consistent visible character.
- At least four beats require no learner answer.
- No more than two answer-dominant beats occur consecutively.

### Brand

- Baby blue and cream dominate persistent interface surfaces.
- Baloo 2 and Nunito are the primary type roles.
- Interactive surfaces use the rounded, tactile Philoo shape language.
- The Cave remains atmospheric without turning the whole interface into a black dashboard.

### Experience

- The learner can complete the session without encountering clipped or unreachable content at every reference size.
- There is no nested-scroll trap.
- The impossible-bird reveal lands before instructions appear.
- Activities change the visible story world.
- The notebook restores the learner’s original hypothesis for revision.
- The ending remains inside the Cave.

### Learning

- The learner distinguishes observation from explanation.
- The learner experiences why the prisoners’ model is useful.
- The learner identifies at least one incompatible clue.
- The learner tests a causal mechanism.
- The learner responds to a strong counterargument.
- The learner revises or justifies maintaining the initial hypothesis.
- The learner transfers the principle to incomplete modern context.

## 19. Out of scope

- Sessions 2 and 3;
- production voice acting and a complete sound system;
- teacher dashboards;
- authentication and cloud persistence;
- grading and rewards;
- a general-purpose authoring interface;
- automatic generation of a large philosopher catalog;
- infrastructure, security, or deployment work unrelated to seeing and testing this redesign locally.
