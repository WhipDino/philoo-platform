# Philoo Story Path — One-Scene Visual Trial

Date: 2026-07-27  
Status: approved by delegated user decision for a one-scene trial  
Trial route: `/aula/as-sombras/so-a-parede`

## Problem

The journey rail succeeds because it is a complete, useful object: paper,
hierarchy, progress, tactile controls, depth, and motion all reinforce one
another. The current main lesson surface changes only its outer edge. Inside,
the old dialogue card and Plato still float independently on a large blank
canvas, so the result is not visibly different.

The trial must create a recognizable Philoo lesson language, not another card
skin. It must also remain flexible enough for future scenes with a philosopher,
dialogue, an optional illustration, or an activity.

## Chosen Direction

Build the main lesson as a **Philoo Story Path**.

The right rail remains the macro journey through the lesson. The main stage
shows the micro journey through the current scene. A continuous baby-blue
thought path connects the scene masthead, three meaningful story beats, the
current dialogue, Plato, and the forward action.

The path is functional progress, not wallpaper. It makes sparse dialogue-only
scenes feel intentional and gives illustrated or activity scenes a clear place
to join the story later.

## Visual Anatomy

### 1. Main material

- Keep the warm cream `#FBF8F3` and Philoo ink `#17324A`.
- Use one visible cyan underside rather than several nearly invisible sheets.
- Give the page a faint, warm paper grain; do not repeat the rail's notebook
  rules.
- Keep depth concentrated on the main page, current story node, and controls.
- Do not use the rejected attached title tab.

### 2. Scene masthead

The title returns to a normal location inside the upper-left of the page:

- eyebrow: `CENA 3 · A DESCIDA`;
- large display title: `Mais fundo`;
- short context: `Siga Platão até a parede`;
- current beat count on the right.

The masthead is separated from the story body by a quiet dashed rule, echoing
the rail without copying its exact layout.

### 3. Micro story path

The three dialogue beats receive meaningful labels:

1. `A luz fica para trás`
2. `Quem vive aqui`
3. `O mundo na parede`

They sit on one continuous path in reading order. Completed nodes show a check,
the current node becomes a tactile baby-blue capsule with a darker blue
underside, and future nodes stay quiet. This is the same material logic as the
journey rail at a smaller narrative scale.

### 4. Story body

The body is one composition, not nested floating cards:

- Plato is grounded against the page with a restrained cutout shadow.
- Dialogue is typeset on an integrated **voice sheet** with a cyan margin rule,
  speaker label, oversized quote mark, and calm paper tint.
- A short connector from the active story path enters the voice sheet.
- Plato's pose remains synchronized with the current text.
- Optional future media occupies a dedicated story window joined to the same
  path; it never becomes a background hidden by text.

For this text-only trial, Plato and the voice sheet receive enough scale to use
the page confidently. Empty space remains calm rather than being filled with
unrelated decoration.

### 5. Action dock

Progress and the forward action leave the dialogue card and become a shared
bottom dock:

- compact beat confirmation on the left;
- a tactile Philoo button on the right;
- the button compresses physically on press;
- on the final beat, the label changes to `Chegar mais perto`.

The story path visually terminates at this dock.

## Motion

- The masthead and physical page remain stable.
- On Continue, the current path capsule travels to the next node with a spring.
- Dialogue exits softly in the reading direction and the next voice sheet
  arrives while Plato changes pose.
- The action dock remains anchored so the learner never has to hunt for it.
- `prefers-reduced-motion` removes travel and uses an immediate state change.

Use the already installed `motion` package. Do not add a visual framework.

## Reusable Component Boundary

Create one trial primitive with this conceptual API:

```tsx
<PhilooStoryPathStage
  eyebrow="Cena 3 · A descida"
  title="Mais fundo"
  context="Siga Platão até a parede"
  steps={steps}
  currentStep={dialogueIndex}
  guide={<PlatoGuide />}
  primary={<VoiceSheet />}
  action={<button />}
/>
```

The future template may add optional `media`, `support`, and `activity` slots.
Do not implement those unused modes in this trial. The guide must be optional
in the eventual template, but it may remain required in the one-scene trial.

## Responsive Behavior

- `1280×720` and `1024×768`: masthead and micro path span the top; voice sheet
  and Plato form a two-column composition; action dock stays visible.
- `768×1024`: the expanded journey rail must not cover the action or story
  content.
- `390×844`: the journey rail remains collapsed; micro labels compact; Plato,
  dialogue, and action fit without page scrolling.
- No horizontal or vertical page scroll at the four existing acceptance
  viewports.

## Technology Decision

- Use CSS multiple backgrounds and a very subtle inline SVG `feTurbulence`
  texture for paper grain. Both are broadly supported and avoid a raster
  wallpaper asset.
- Use Motion for the active-path spring and coordinated content transition.
- Do not add Rough.js in the trial. Its sketch style is useful, but it risks
  making the product feel younger and less controlled than Plato and the rail.
- Do not add a component library. The identity must come from Philoo-specific
  composition and tokens, not generic controls.

Research references:

- Motion layout/transition primitives: https://motion.dev/docs/react
- Motion layout animation: https://motion.dev/examples/react-layout-animation
- CSS multiple backgrounds: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Backgrounds_and_borders/Using_multiple_backgrounds
- SVG paper texture primitive: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence
- Expressive hierarchy through shape, color, motion, and containment:
  https://design.google/library/expressive-material-design-google-research

## Trial Scope

Change only:

- the reusable main-stage primitive needed by the trial;
- `/aula/as-sombras/so-a-parede`;
- focused tests and the existing viewport regression.

Keep unchanged:

- the outer shell and top header;
- the journey rail's appearance, interaction, and data;
- all copy, Plato poses, focus transfer, and destination;
- every other lesson scene.

## Acceptance Criteria

1. The change is unmistakable in a before/after screenshot.
2. The title is a normal internal masthead, not an attached tab.
3. The main page has a visible, useful micro story path with three labelled
   beats.
4. Dialogue, Plato, progress, and action read as one authored composition.
5. The page does not look like nested cards on a blank canvas.
6. All three dialogue beats, pose changes, focus behavior, and final link work.
7. The journey rail is visually and behaviorally unchanged.
8. The four viewport/no-scroll checks pass.

## Non-Goals

- No migration of the other lesson scenes.
- No new lesson copy, illustrations, sounds, or activities.
- No portal redesign.
- No global typography or palette change.
- No dependency added solely for decoration.
