# Guided Classification Board

**Pattern ID:** `guided-classification-board`  
**Status:** Working draft from the first-lesson experiment
**First implementation:** `As Sombras · O que realmente chegou até elas?`  
**Activity-library families:** observation or inference, example/non-example,
evidence triage, concept classification

## Purpose

This file records decisions currently being tested. It does not become a
permanent activity-library contract until the complete first lesson is
finished, reviewed, and explicitly approved. At that point, retain only the
parts that proved reusable in the real lesson.

Use this pattern when a learner must place a small set of statements, examples,
or clues into meaningful categories and must be able to revise the
classification. Do not use it when ordering, constructing an argument, free
recall, or extended explanation is the actual learning move.

The reusable learning loop is:

`philosopher frames the challenge → learner sorts → interface preserves the
reasoning artifact → learner checks → philosopher gives formative feedback →
learner revises`

## Required Composition

The activity lives inside the standard Philoo lesson shell and journey rail.
Its content has four authored regions:

1. **Guide card:** a philosopher portrait emerges from the lower edge of a
   tactile card. The philosopher states the challenge in direct speech.
2. **Progress card:** a compact fraction and plain-language status sit beside
   the guide card on wide screens and below it on narrower screens.
3. **Source tray:** remaining cards stay in a stable board that does not
   continuously shrink while the learner works.
4. **Destination pockets:** two to four labeled, icon-supported pockets receive
   cards. Color reinforces meaning but never replaces the label.

The philosopher, spoken instruction, progress, tray, and pockets must read as
one activity—not independent stickers placed on a blank page.

## Philosopher Portrait Contract

This pattern uses a dedicated **activity-guide portrait**, not a full-body
scene pose.

- Generate it from the philosopher's single canonical reference, never from a
  previous generated pose.
- Frame the head, shoulders, upper chest, and enough forearms or hands to make
  the speaking gesture readable.
- Use a transparent PNG with no environment, text, logo, frame, or cast
  rectangle.
- The lower torso is intentionally hidden behind the guide card's front edge.
  The overlap must make the philosopher appear to emerge from the card, never
  float as a disconnected head.
- The card edge sits in front of the portrait at the lower crop; face, beard,
  shoulders, and relevant gesture sit above it.
- Use an attentive, warm, open-mouth speaking expression. Avoid exaggerated
  surprise or preschool-cartoon emotion.
- Direct the philosopher's eyes and gesture toward the spoken challenge. In the
  default desktop composition, the portrait is on the left and the copy is on
  the right.
- Preserve canonical face, age, proportions, hair, clothing, materials, and
  palette. Only expression, gaze, and gesture may change.
- Alt text describes the communicative action, not the crop:
  `Aristóteles apresenta o desafio e indica as opções`.

The same portrait may be reused for another state only when its expression,
gaze, and gesture still match the new text. Feedback states normally use
separate semantic portraits such as `gentle-retry` and
`celebrate-discovery`.

## Guide Copy Contract

The main sentence is the philosopher's spoken challenge:

> Escolha uma pista e arraste para o bolso que fizer mais sentido.

The accessible fallback is interface guidance and must be visually secondary:

> Se preferir, toque na pista e depois no bolso.

Do not make the philosopher recite implementation details, progress counts, or
accessibility terminology. Keep the spoken instruction to one short thinking
move.

## Dragging and Layering

- Pointer and touch dragging are primary.
- Click or tap a card, then click or tap a pocket, is the required fallback.
- Keyboard selection and placement remain available.
- A dragged card renders in a dedicated activity-level overlay above the tray,
  every pocket, their inner slots, and the lesson surface.
- No ancestor of a draggable card may clip the drag overlay.
- The source position may retain a subtle placeholder while dragging.
- Valid pockets lift or glow as the pointer crosses them.
- A valid drop uses a short spring into the pocket.
- An invalid drop returns to origin without changing placement.
- Reduced motion uses an immediate transfer and restrained opacity change.

## Stable Tray and Completion State

The source tray reserves a stable footprint while cards remain. Cards reflow
within that footprint; the tray must not repeatedly collapse and create a
moving hole in the board.

When no cards remain, replace the empty list with a compact completion panel:

- a check or stacked-card icon;
- `Todas as pistas foram organizadas`;
- a short prompt to review the pockets;
- the check action near the completed board.

The tray may reduce to its compact completion height only once, after the final
card is placed. The destination pockets then become the visual center. Do not
leave a large empty blue rectangle.

## Progress Badge

Use a centered fraction lockup:

```text
  3
 ───
  6
```

The current value is dominant, the total is smaller but not detached, and both
share one optical center. Use tabular numerals. The accessible status remains
`3 de 6 pistas organizadas`.

Do not position the total as a tiny superscript floating at the right edge.

## Responsive Rules

### Wide desktop

- Guide and progress form a two-card row.
- The tray and all pockets share the activity board below.
- The guide portrait and spoken copy remain horizontally composed.
- Dragged cards remain above every column.

### Landscape and portrait tablet

- Preserve generous touch targets.
- Guide and progress may stack when the lesson rail reduces content width.
- Use either a two-column board or a horizontally scrollable pocket group only
  when every label remains readable.
- Never compress category copy into narrow vertical text.

### Phone

- Stack guide, progress, tray, and pockets.
- Keep portrait and spoken challenge in one compact horizontal card.
- Use full-width pockets and a minimum 44 × 44 CSS-pixel target.
- The lesson surface may scroll internally; the document body does not gain an
  independent competing scroll.

## Data Boundary

The reusable component receives cards, destinations, placements, selection,
and callbacks. Lesson-specific code owns:

- the learning claim;
- card text;
- category meaning;
- answer key;
- misconception-aware feedback;
- philosopher identity and semantic portrait assets;
- navigation and completion behavior.

The component never decides philosophical correctness and never adds scores,
lives, timers, or punishment.

## Generation Checklist

When a lesson-generation agent selects this pattern:

1. State the learning claim and justify classification as the required
   thinking move.
2. Define two to four categories with short labels, explanations, icons, and
   non-color meaning.
3. Write five to eight concise cards with plausible misconceptions.
4. Define the answer key and formative explanation for likely errors.
5. Generate the activity-guide portrait from the canonical philosopher
   reference using the portrait contract above.
6. Generate feedback portraits only when the state needs a different
   expression or gesture.
7. Configure the reusable board; do not fork its layout for one lesson.
8. Verify drag overlay, click/tap fallback, keyboard use, revision, reduced
   motion, and status announcements.
9. Review untouched, partial, complete, incorrect, and corrected states on
   desktop, tablet, and phone.
10. Reject the result if the portrait floats, drag passes behind a pocket, the
    tray leaves a large empty void, or text becomes cramped.

## Acceptance Criteria

- The philosopher visibly introduces the challenge and appears anchored to the
  guide card.
- Dragged cards remain fully visible above all destinations.
- Progress is optically centered and understandable at a glance.
- The board does not progressively collapse as cards leave the tray.
- The final empty-tray state is compact and purposeful.
- Placements remain revisable without penalty.
- Desktop and tablet are equally intentional; phone is fully usable.
- Another philosopher can use the pattern by supplying content and canonical
  portrait assets, without changing component structure or CSS.
