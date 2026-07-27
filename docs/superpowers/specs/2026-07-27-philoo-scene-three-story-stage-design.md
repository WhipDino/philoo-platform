# Philoo Scene 3 Story Stage Design

**Status:** Approved direction, pending written-spec review  
**Date:** 2026-07-27  
**Route:** `/aula/as-sombras/so-a-parede`

## Goal

Replace Scene 3's monolithic AI-generated cinematic still with a deliberately
composed Philoo Story Stage.

The scene must still feel like Platão is leading the learner deeper into the
Cave, but it should read as a designed digital product rather than a gallery of
generated images. Empty space is used as narrative focus, not filled with
decoration.

This is the first experiment. Scene 4 remains unchanged until Scene 3 is
reviewed in the browser.

## Preserved contract

The following stay unchanged:

- the three existing dialogue beats;
- the approved cream dialogue-card language;
- progress `3/10`;
- previous route `/aula/as-sombras/a-descida`;
- next route `/aula/as-sombras/eles-dao-nomes`;
- the existing scene transition;
- Platão's canonical identity, clothing, proportions, and palette;
- keyboard access, live dialogue announcements, and reduced-motion support.

The existing full-frame assets
`cave-descent-journey-v1.webp` and
`cave-descent-journey-mobile-v2.webp` are removed from this route but kept in
the repository for instant rollback.

## Chosen direction

Scene 3 becomes a layered theatrical stage rather than one finished
illustration.

The first implementation reuses the approved transparent Platão pose from
Scene 2. AI does not compose the background, prisoners, lighting, layout, or
completed screen. Those elements are assembled intentionally in React, SVG,
and CSS.

The stage contains six independent roles:

1. **Cave atmosphere** — a low-contrast continuation of the approved Scene 2
   cave, treated as texture rather than focal artwork.
2. **Cave architecture** — broad navy SVG arches create depth and make the
   composition recognizably Philoo rather than photorealistic.
3. **Descent path** — a soft baby-blue line travels deeper into the scene and
   advances with the dialogue.
4. **Story evidence** — a diminishing entrance glow, three distant prisoner
   silhouettes, and a warm wall glow appear only when the narration earns them.
5. **Platão** — a separate transparent character layer, visually grounded with
   contact shadow, reflected cave color, and lamp glow.
6. **Dialogue surface** — the approved cream voice card remains semantic HTML
   and never becomes part of a generated image.

The memorable Philoo signature is the path of inquiry: it begins near Platão's
lamp and guides the eye into the Cave without becoming a score or progress bar.

## Beat progression

### Beat 1 — Leaving the entrance

Platão and the card are present. A cool entrance glow is still visible behind
the learner, while the path begins near Platão and disappears into the dark.
The distant figures are not yet emphasized.

When the learner continues, the entrance glow quietly diminishes and the path
extends further down the stage.

### Beat 2 — People in the depths

Three simple, dignified prisoner silhouettes resolve at the end of the path.
They have no generated faces or detailed anatomy. Their restrained shapes keep
the focus on their shared condition rather than turning them into interchangeable
AI characters.

Platão remains the narrator and visual anchor. The scene does not ask a
question.

### Beat 3 — The wall ahead

A warm vertical area appears beyond the prisoners, suggesting the wall that
occupies their view. The path reaches the group and stops. No object source is
shown and no shadow mechanism is explained yet.

The final action remains `Chegar mais perto`, leading to Scene 4.

## Visual composition

### Wide desktop

- Dialogue card: upper-left quiet region.
- Platão: lower-right foreground, approximately 38–46% of stage height.
- Descent path: begins near Platão's lamp and curves toward the center depth.
- Prisoners and wall glow: smaller focal group in the center distance.
- At least 35% of the scene remains visually quiet.

### Tablet portrait and landscape

- The vector stage uses one responsive `viewBox`; it is not a cropped landscape
  photograph.
- Platão, path, prisoners, and wall are repositioned as independent layers.
- The card may widen slightly but cannot cover Platão, the figures, or the path
  destination.

### Phone

- The dialogue card occupies the safe upper region.
- Platão and the path remain below the card.
- Prisoners and wall move deeper into the lower half as a compact tableau.
- No educational element depends on hover or pixel-perfect overlap.

Reference checks: `1440×900`, `1366×768`, `1024×768`, `768×1024`,
`390×844`, and `360×800`.

## Technology decision

Use:

- Next.js and React for scene state and semantic content;
- inline SVG for the cave arches, path, glows, prisoner silhouettes, and wall;
- CSS Modules for responsive composition, atmosphere, depth, and stable
  surfaces;
- **Motion for React** for beat-driven SVG and layer transitions.

Install only the `motion` package. Use `LazyMotion`, `m`, and `domAnimation`
inside the Scene 3 client boundary, wrapped by
`MotionConfig reducedMotion="user"`. This keeps Motion aligned with React state,
supports SVG path animation, and avoids loading the full default `motion`
component feature set.

Motion documents a small initial footprint when `LazyMotion` and `m` are used,
and it provides explicit reduced-motion behavior:

- [Motion for React](https://motion.dev/docs/react)
- [Motion bundle-size guidance](https://motion.dev/docs/react-reduce-bundle-size)
- [Motion reduced-motion support](https://motion.dev/docs/react-use-reduced-motion)

Native CSS remains responsible for simple hover states and optional ambient
opacity. Motion is used only where the current dialogue beat changes the visual
story state.

Do not add:

- Rive: it requires a separate `.riv` authoring workflow and adds a compressed
  runtime of roughly 222–648 KB depending on renderer;
- GSAP: its timeline power is unnecessary for three state-driven beats;
- Three.js, PixiJS, canvas, or WebGL;
- a new UI component framework.

Rive may be reconsidered later only if Philoo adopts a professionally rigged,
cross-platform character-animation workflow.

## Component boundary

Scene 3 remains a small client feature:

```text
CavePrisonerWallScene
├── StoryStage
│   ├── CaveArchitecture
│   ├── DescentPath
│   ├── PrisonerTableau
│   └── PlatoLayer
├── DialogueCard
├── CaveStoryProgress
└── useStorySceneTransition
```

`StoryStage` receives only the current dialogue index and renders decorative
layers. Dialogue and navigation remain real HTML outside the SVG. Decorative
SVG content is hidden from assistive technology; one concise stage description
is exposed through the existing image role.

The experiment does not create a general lesson-scene configuration format.
Reusable extraction happens only after this scene is visually approved.

## Motion behavior

- All changes are triggered by dialogue state, never by independent timers.
- Path drawing lasts approximately 450–700 ms.
- Light and silhouette reveals use restrained opacity and scale changes.
- Platão may shift only a few pixels to maintain a living presence; he does not
  float or loop continuously.
- This first experiment has no looping dust or particle animation.
- Reduced-motion mode shows every beat's final composition immediately and
  removes path travel, spatial shifts, and ambient loops.

## Character asset rule

Use the approved transparent
`public/images/story/plato-descent-v1.png`. A new pose is not part of this
experiment. After the layered composition is reviewed, character pose may be
considered as a separate, reversible change.

## Accessibility and interaction

- Keep one stable `Continuar` button through the first two beats.
- Transfer focus to `Chegar mais perto` when it replaces the button.
- Preserve `role="status"` and polite dialogue announcement.
- Provide an immediate static final state when reduced motion is preferred.
- Keep touch targets at least `44×44px`.
- Decorative SVG layers use `aria-hidden="true"` and cannot intercept pointer
  events.

## Verification

The focused test must continue to verify:

- all three dialogue beats;
- progress `3/10`;
- final route;
- focus persistence through dialogue changes;
- focus transfer to the final link.

Browser review must verify every reference viewport, all three beats, normal
motion, and reduced-motion mode. The next route and Scene 4 must remain
unchanged.

## Success criteria

- The screen no longer reads as a single AI-generated illustration.
- Platão remains recognizable as the guide and main character.
- Each dialogue beat visibly advances the same story space.
- The learner can understand the descent, the prisoners, and the approaching
  wall without extra explanatory labels.
- Philoo cream, baby blue, rounded shapes, and deliberate empty space dominate
  the product identity.
- The system is feasible to repeat with new philosophers by changing stage
  geometry, props, palette, and character pose—not by generating a complete
  screenshot.

## Out of scope

- redesigning Scene 4;
- changing the story copy or curriculum;
- building the first activity;
- adding sound;
- extracting a universal stage framework;
- deployment, Supabase, authentication, or lesson persistence.
