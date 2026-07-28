# Philoo Discovery Table Activity

Date: 2026-07-28  
Status: approved experiment; permanent template pending full-lesson review
Primary route: `/aula/as-sombras/o-que-chegou-ate-eles`

## Goal

Transform the first lesson activity into a playful, tactile “Mesa de
Descobertas” that belongs to Philoo’s current folio identity. Preserve the
existing learning goal and state model: the learner separates direct
observation from inference and uncertainty, may revise any placement, and
receives formative rather than punitive feedback.

The result must feel like an activity inside the same lesson—not a form,
dashboard, or unrelated mini-game.

## Chosen Direction

Use a tabletop classification game inside the existing lesson shell.

- Plato introduces the challenge from a large guide card using a dedicated
  head-and-shoulders speaking portrait that emerges from the card edge. A
  compact progress card sits beside it.
- Six evidence fragments appear as tactile cards in a clearly named tray.
- Three large destination pockets represent what the prisoners observed,
  concluded, or still could not know.
- A selected card visibly lifts from the tray. Choosing a destination moves it
  into that pocket and updates progress immediately.
- Completed placements remain selectable so the learner can revise without
  penalty.
- The check action appears only after all six cards have been placed.
- Feedback explains the reasoning and changes Plato’s pose; it never removes
  points, uses failure language, or blocks another attempt.

## Visual Identity

Reuse Philoo’s established lesson tokens:

- cream: `#FBF8F3`;
- primary baby blue: `#33BFED`;
- soft blue: `#5BB8F5`;
- ink: `#17324A`;
- white paper surfaces with subtle paper texture;
- rounded shapes, layered blue underlays, and soft tactile shadows.

The signature element is the set of three “reasoning pockets.” Each pocket
looks like a thick, rounded paper envelope with a colored tab and a subtle
inner slot. Cards visually enter the slot when placed. The effect should be
recognizable and delightful without imitating a physical classroom worksheet.

The three semantic tones are:

- observed: baby blue;
- concluded: warm apricot;
- unknown: soft lavender.

Color supplements labels and icons; it never carries meaning alone.

## Layout

On wide screens, the activity uses the available folio area without page
scroll:

```text
┌──────── Plato guide + instruction ─────┬── progress ────┐
├──────── card tray ─────────┬──── three reasoning pockets ┤
│ six compact cards          │ observed                    │
│ remaining clues            │ concluded                   │
│                            │ unknown                     │
└────────────────────────────┴──────────────────────────────┘
```

The introduction row is a two-card composition:

- a large challenge card occupies most of the row on the left;
- Plato uses a dedicated head-and-shoulders speaking portrait. Its lower edge
  sits behind the card front so he appears to emerge from the surface rather
  than float inside it;
- the spoken challenge is visually primary, while the click/tap alternative is
  secondary interface guidance;
- a compact tactile progress card sits on the right and shows both the numeric
  count and the next instruction;
- the challenge card contains no decorative blue, purple, or yellow stripes;
- the blue, apricot, and lavender destination-pocket colors remain unchanged.

The source tray retains a stable footprint while cards remain. After the final
card leaves it, the tray changes once into a compact completion panel instead
of leaving a large empty blue rectangle.

On tablets and phones:

- the large Plato challenge card stays first;
- the progress card stacks directly below it;
- the card tray becomes a horizontal or two-column collection;
- the three pockets stack below it;
- the activity surface may scroll internally, while the document body keeps
  the existing lesson-shell no-page-scroll behavior;
- controls retain at least a 44px touch target.

## Interaction and Motion

Use pointer and touch drag-and-drop as the primary interaction. A card lifts,
tilts slightly, and follows the learner. Destination pockets react when the
card passes over them, and a valid drop moves the card into that pocket with a
spring transition.

Keep tap/click placement and keyboard placement as an accessible fallback.
Selecting a card by click or keyboard still enables the three destination
pockets, but the visual instruction teaches drag-and-drop first.

Use the existing `motion` package for:

- pointer and touch dragging with momentum disabled;
- a small lift, scale, and restrained tilt while a card is being dragged;
- an activity-level drag overlay whose stacking context stays above every
  pocket and inner slot;
- an active-pocket glow while the pointer is inside a valid destination;
- a shared-layout transition when a card changes between tray and pocket;
- a soft pocket pulse when it receives a card;
- progress number transitions;
- a coordinated feedback reveal;
- a restrained celebratory bounce for Plato after a fully correct check.

Motion must be brief and purposeful. Reduced-motion preferences replace travel,
bounce, and pulse with immediate state changes and opacity-only feedback.

## Reusable Boundaries

The scene owns the Cave-specific copy, cards, correct answers, Plato poses, and
lesson navigation.

Create a presentational `PhilooDiscoveryTable` primitive that owns:

- the card tray;
- destination pockets;
- selected, placed, and checked visual states;
- layout transitions;
- progress presentation;
- keyboard and focus behavior.

Its public types are:

```ts
export type DiscoveryCard = {
  id: string;
  text: string;
};

export type DiscoveryDestination<DestinationId extends string> = {
  id: DestinationId;
  label: string;
  hint: string;
  tone: "blue" | "apricot" | "lavender";
  icon: ReactNode;
};

export type PhilooDiscoveryTableProps<DestinationId extends string> = {
  cards: readonly DiscoveryCard[];
  destinations: readonly DiscoveryDestination<DestinationId>[];
  placements: Readonly<Record<string, DestinationId>>;
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  onPlaceCard: (destinationId: DestinationId) => void;
  onMoveCard: (cardId: string, destinationId: DestinationId) => void;
};
```

The primitive does not know correct answers and does not score work. This keeps
it reusable for ordering evidence, grouping arguments, matching concepts, or
categorizing examples in future lessons.

## Copy

Preserve the activity’s philosophical distinction but make the controls easier
to scan:

- tray: “Pistas da parede”;
- destinations: “Vi”, “Concluí”, and “Ainda não sei”;
- helper text expands each short label without repeating it;
- progress: “0 de 6 pistas organizadas”;
- selected state explicitly names the chosen card and asks the learner to pick
  a pocket;
- check action: “Conferir descobertas”.

The scene title and Plato’s introduction remain conceptually unchanged.

## Accessibility

- Every card remains a native button with `aria-pressed` and pointer-drag
  support.
- Every destination remains a native button and is disabled until a card is
  selected.
- Destination accessible names include both the short label and full hint.
- Status updates announce selection, placement count, and formative feedback.
- Focus remains visible and returns to a sensible control after placement.
- Icons are decorative when their meaning is already present in text.
- The interaction remains fully operable without drag-and-drop.

## Verification

Automated tests must prove:

- the activity uses the reusable discovery-table primitive;
- dragging a card to a valid pocket commits its card and destination IDs;
- dropping outside a pocket returns the card to its origin without changing
  placement;
- card selection and placement still work;
- placed cards can be revised;
- destination buttons are unavailable until a card is selected;
- the check action remains hidden until every card is placed;
- incorrect feedback is formative and switches Plato to the retry pose;
- a correct arrangement switches Plato to the celebration pose;
- the short destination labels and progress copy render;
- reduced motion does not remove functionality.

Visual checks must cover:

- an untouched activity;
- a selected card;
- cards distributed across all three pockets;
- incorrect feedback;
- correct feedback;
- laptop, landscape tablet, portrait tablet, and phone viewports;
- no document-level vertical overflow at the established lesson viewport
  checks.

## Reusable Product Template

This implementation is the candidate reference instance for
`docs/product/activity-patterns/guided-classification-board.md`. Future
philosopher lessons select this documented pattern from the activity library;
they provide lesson content, categories, answers, feedback, and canonical
philosopher portraits without redesigning its structure.

Do not mark the candidate as a permanent library template until the complete
first lesson is finished and reviewed. The final extraction must distinguish
proven lesson-shell rules, proven activity rules, and Cave-specific decisions.

## Non-Goals

- No change to the lesson’s answer key or learning objective.
- No points, timers, streaks, lives, grades, or punitive errors.
- No new cave or prisoner environment image generation. A new canonical
  Plato activity-guide portrait is required.
- No redesign of the lesson shell, journey rail, story scenes, or global
  navigation.
- No new runtime dependency; use React, Motion, and Phosphor Icons already in
  the project.
