# Philoo Story Folio Design

**Date:** 2026-07-27
**Status:** Approved concept; written specification awaiting review

## Objective

Turn the main lesson area from a large cream canvas containing separate cards into one believable Philoo object: an illustrated story folio. The folio must feel tactile, playful, and polished without becoming childish, and it must belong to the same visual family as the journey notebook on the right.

The first implementation trial applies this system only to the current `Mais fundo` scene at `/aula/as-sombras/so-a-parede`. The reusable primitives will support later scenes, but those scenes are not part of the trial.

## Core Metaphor

- The journey rail is the learner's notebook: it answers “Where am I?”
- The story folio is the current illustrated page: it answers “What is happening now?”
- The philosopher is the guide: they connect the narrative, illustration, and action.

The rail and folio share a material grammar, not an identical appearance. The rail keeps its ruled notebook paper. The folio uses clean cream pages so the story remains the focus.

## Visual Construction

The folio is one layered object:

1. A warm cream top sheet (`#FBF8F3`).
2. A pale baby-blue middle edge (`#DDF4FC`).
3. A stronger cyan backing sheet (`#33BFED`), offset down and right.
4. One soft ambient shadow and one subtle inset highlight.
5. Rounded geometry and a single, consistent light direction.

The scene title becomes a chapter tab attached to the folio's top edge. It must not read as another floating pill.

Depth is concentrated in the folio, the active journey stage, and pressable controls. Dialogue and media surfaces use lighter shadows so they remain part of the folio rather than becoming independent stickers.

The design excludes torn paper, tape, doodles, spirals, decorative background illustrations, glass effects, and extra ruled lines.

## Composition System

### `PhilooStoryFolio`

Owns the physical layers, chapter tab, viewport sizing, and internal content boundary. The outer page remains baby blue and the journey rail remains unchanged.

### `PhilooSceneComposition`

Accepts named React slots rather than a rigid lesson schema:

- `character`
- `primary`
- `secondary`
- `activity`

It supports four layout modes:

- `conversation`: philosopher and dialogue share one visual baseline.
- `illustrated`: philosopher plus a joined media-and-dialogue stack.
- `workbench`: compact guide area plus the interactive workspace.
- `reflection`: conclusion or student response with the philosopher nearby.

Individual lessons may supply custom content while inheriting Philoo's material, spacing, responsive behavior, and motion.

### `PhilooCharacterStage`

Provides a stable region for Plato or another philosopher. A controlled overlap and existing transparent-image shadow ground the character on the folio. No circle, pedestal, or decorative backdrop is added.

### `PhilooContentSheet`

Provides related treatments for dialogue, narration, notes, feedback, and instructions. Dialogue remains recognizable through quotation marks and speaker color treatment, not a literal comic speech-bubble tail or a “Platão diz” label.

### `PhilooMediaWindow`

Frames a real lesson illustration. In illustrated scenes it shares width and geometry with the dialogue sheet beneath it. A small overlap or shared edge makes the two read as one story stack.

## First Trial: `Mais fundo`

The current scene will use the `conversation` mode:

- `Mais fundo` becomes the attached chapter tab.
- Plato occupies one side of the folio and is aligned to its lower visual ledge.
- The dialogue sheet occupies the complementary side and aligns with Plato as one composition.
- The content cluster fills the folio intentionally; remaining whitespace reads as page margin, not an unused canvas.
- The current tactile Continue button remains.
- No new illustration is required for this trial.
- The journey rail and its navigation behavior remain unchanged.

The trial is successful when Plato, dialogue, title, and folio read as one authored scene at first glance.

## Responsive Behavior

The story folio is an inline-size query container because its available width changes when the journey rail expands or collapses.

- Wide desktop: a horizontal spread.
- Compact desktop and tablet: a tighter two-region composition with scaled spacing.
- Mobile: a single-page composition with intentional reordering and reduced decorative depth.

The outer lesson page remains fixed to `100dvh`. Narrative scenes must not require page scrolling at the agreed laptop, tablet, or mobile targets. A future workbench may use bounded internal scrolling only as a last-resort fallback when an accessible activity cannot fit.

Images keep stable aspect ratios, use `object-fit`, and provide accurate responsive `sizes`.

## Motion

The folio, header, background, and journey rail remain stationary during scene navigation. Only the inner scene composition transitions.

- Forward navigation: the old scene fades and rises slightly; the new scene enters from slightly below.
- Backward navigation: the direction reverses.
- Plato, dialogue, media, and activity content move as one authored composition.
- Reduced-motion users receive a short crossfade without translation.

The visual folio trial may be reviewed before this coordinated route transition is added.

## Technology

Use the existing stack:

- CSS Modules, Grid, pseudo-elements, multiple shadows, and container queries.
- Motion for layout and scene transitions.
- Next Image for responsive illustrations.

Do not add Canvas, WebGL, Three.js, Pixi, Konva, Lottie, CSS Paint, or another component framework. These do not solve the composition problem.

## Accessibility

- Preserve semantic headings, landmark labels, focus order, and keyboard operation.
- Decorative folio layers remain hidden from assistive technology.
- Text never depends on background imagery for contrast.
- Touch targets remain at least 44px.
- Respect the user's reduced-motion preference.
- The chapter tab is a heading treatment, not an interactive tab control.

## Focused Verification

The trial requires:

- component checks for the `conversation` composition and optional slots;
- no outer-page overflow at representative laptop, tablet, and mobile viewports;
- correct layout with the journey rail expanded and collapsed;
- readable text and visible focus states;
- reduced-motion behavior;
- one visual review of the current `Mais fundo` scene before rollout.

## Non-Goals

- Redesigning every lesson scene in the first pass.
- Changing the journey rail.
- Creating new Plato artwork.
- Building the student portal.
- Adding sound or new activities.
- Migrating legacy lesson screens.

## Rollout Decision

After the current scene is approved visually, the same primitives can be applied in this order:

1. the remaining conversation scenes;
2. the illustrated narrative scene;
3. the first workbench activity;
4. later lesson families and philosophers.
