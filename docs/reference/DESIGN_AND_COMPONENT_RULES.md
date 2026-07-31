# Reference — Design and Component Rules

Use this before changing buttons, cards, typography, shell layout, colors, or
responsive behavior.

## Visual identity

- warm white/cream dominates the canvas;
- pale Philoo blue supports secondary surfaces;
- saturated blue marks action, progress, and current state;
- semantic success/warning/error colors are exceptions, not decoration;
- tactile 3D depth comes from restrained lower shadows and borders;
- shapes are rounded, not toy-like;
- Fredoka is expressive display type;
- Nunito is reading/UI/wordmark type;
- IBM Plex Mono is reserved for evidence and technical microcopy.

## Ownership test

Before editing a value, classify it:

### Content-owned

Safe to change in lesson configuration:

- title, prompt, explanation;
- labels and feedback;
- cards/choices/answers;
- semantic icon or approved tone role;
- selected approved character preset.

### Component-owned

Change only when improving every consumer:

- button geometry and 3D behavior;
- focus style;
- minimum target size;
- card structure;
- responsive breakpoint behavior;
- feedback placement;
- drag/touch/keyboard equivalence.

### System-owned

Change only as a deliberate design-system decision:

- brand palette;
- typography roles;
- shared shell dimensions;
- notebook/Folio identity;
- journey rail behavior;
- global spacing rhythm.

## Buttons

A Philoo primary action must:

- communicate one clear next action;
- have at least 44 px interactive height, preferably 48 px;
- use visible keyboard focus;
- preserve label clarity on phone;
- use the Philoo blue family;
- not rely on animation or color alone to communicate state.

Do not restyle one lesson's button locally when the intent is global. Update the
shared component or token and verify every consumer.

## Responsive rules

- desktop, tablet, and phone are compositions—not scale factors;
- long rows become scrollable or wrap deliberately;
- cards use one column on narrow screens unless horizontal browsing is the
  product behavior;
- text uses flexible containers and safe wrapping;
- dialogs and internal panels must fit short notebook screens;
- philosopher art can move or shrink but must preserve gaze and meaning;
- no page-level horizontal overflow.

Required viewports are defined in
`src/domains/lesson-library/exercise-catalog.ts`.

## When customization becomes a new component

Create or version a component when:

- the learning sequence changes;
- the interaction artifact changes;
- accessibility requires a different control model;
- a per-lesson conditional would alter protected behavior;
- three or more consumers need the same new behavior.

Do not create a component merely to rename text or swap approved content.
