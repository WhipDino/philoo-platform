# Responsive Classification Activity

## Goal

Keep the approved desktop classification board intact while giving tablet and
phone learners layouts designed for their available space. The lesson must
remain usable without rotating the device, horizontal scrolling, or performing
precise drag gestures.

## Responsive modes

### Desktop: board

At wide sizes, preserve the current experience:

- Plato and the challenge introduction remain above the board.
- Learners drag clues into the three colored pockets.
- Tapping a clue and then a pocket remains available as an alternative.
- The journey rail continues to occupy its dedicated right column.

### Tablet: compact board

The activity remains a board because the three destinations can still be
compared comfortably:

- The clue tray and three pockets fit within the lesson surface.
- Text and touch targets remain readable without shrinking the interface.
- The collapsed journey rail is only a compact 68 × 68 floating control. It
  does not inherit full height, reserve a column, or overlap the activity.
- Opening the journey creates a bounded overlay whose top and bottom align
  with the lesson surface. The overlay scrolls internally when required.

### Phone: guided classification

Replace the stacked desktop board with a sequential interaction:

- Show one unclassified clue at a time in a large tactile card.
- Show three large colored destination buttons beneath it: **Vi**,
  **Concluí**, and **Ainda não sei**.
- Selecting a destination animates the clue toward that destination and
  advances to the next clue.
- A compact progress label shows how many clues have been organized.
- Learners can review and change previous choices before checking the result.
- Dragging is optional rather than required; portrait orientation is fully
  supported.
- Plato is larger and remains visually connected to the challenge dialogue.
- The journey opens as a bounded bottom sheet from its compact floating
  control.

## Interaction and state

Desktop, tablet, and phone use the same cards, destination definitions,
placements, scoring, and callbacks. Responsive presentation must not create a
second source of lesson state. Moving between breakpoints preserves every
answer.

The phone presentation automatically selects the next unplaced clue. Revising
an existing choice returns that clue to the active position and exposes the
three destinations again.

## Accessibility

- Every action remains operable by touch and keyboard.
- Destination buttons include their label and explanatory hint.
- Progress changes and completed placements are announced politely.
- Motion respects `prefers-reduced-motion`.
- No essential instruction depends only on color or dragging.

## Visual continuity

All modes retain the approved Philoo identity: cream paper, baby-blue tactile
layers, rounded Baloo/Nunito typography, soft shadows, and the blue, apricot,
and lavender classification colors. Responsive changes alter composition and
interaction density, not the visual language.

## Verification

Verify at representative phone, tablet, laptop, and desktop widths:

- no horizontal page overflow;
- no journey overlap while collapsed;
- journey overlay remains within the visible lesson bounds;
- Plato is readable and intentionally cropped;
- all six clues can be classified, revised, and checked;
- answers survive breakpoint changes;
- desktop drag-and-drop behavior remains unchanged.
