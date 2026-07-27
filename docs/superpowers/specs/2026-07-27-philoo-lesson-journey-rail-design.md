# Philoo Lesson Journey Rail

**Date:** 2026-07-27  
**Status:** Approved and implemented across the current `As Sombras` journey

## Purpose

Replace the decorative outer ribbon background and the unexplained header dots with a useful, recognizable Philoo element: a collapsible journey rail that shows the learner's progress through the current lesson.

The rail is lesson-level navigation context, never a curriculum catalogue. A course or era page may contain twelve pre-Socratic philosophers; inside a philosopher's lesson, the rail shows only that lesson's meaningful stages.

## Information hierarchy

1. **Course or era page:** chooses among philosophers or lessons.
2. **Lesson journey rail:** shows four to six meaningful stages in the current lesson.
3. **Current scene:** presents one story beat, explanation, image, or activity.

For the current `As Sombras` journey, each implemented screen is represented:

1. O começo da história
2. A descida
3. Mais fundo
4. O mundo na parede
5. Primeiro desafio

Each item owns a route and a scene ID. The current item is highlighted, previously
visited items are links, and unvisited items remain locked.

## Desktop composition

On wide screens, the lesson shell becomes a two-column stage:

- the existing narrative surface on the left;
- the journey rail on the right, aligned to the narrative surface's height.

The rail is expanded by default on the learner's first scene in a lesson. It is 312px wide when expanded and 68px wide when collapsed. Collapsing it recenters the narrative surface instead of leaving a permanent empty slot. The learner's choice persists while moving through that lesson.

The expanded rail contains:

- `Sua jornada`;
- the current lesson title;
- the semantic stage list;
- completed, current, and upcoming states;
- a clearly visible collapse control.

The collapsed rail retains:

- the arrow control;
- a compact stage position;
- enough of the tactile card shape to remain discoverable.

The shared shell is applied across all five current lesson routes.

## Responsive behavior

- **Above 1180px:** rail participates in the two-column layout.
- **721–1180px:** rail opens over the right edge so the story does not become too narrow.
- **720px and below:** the same content opens as a bottom sheet from a persistent compact trigger.

The outer lesson document is locked to the viewport so the story surface and rail
remain fully framed without page scrolling. Dense activities may scroll inside
their own bounded workspace.

## Visual language

The rail is a sibling of Philoo's dialogue cards and buttons, not a conventional dashboard sidebar:

- cream surface (`#FBF8F3`);
- baby-blue structural color (`#33BFED`, `#5BB8F5`);
- dark blue reading text (`#17324A`);
- large rounded corners;
- a cyan offset underlayer and soft shadow that make it feel pressable;
- current stage rendered as the strongest tactile element;
- completed stages clear but quiet;
- upcoming stages visible without looking disabled.

The outer page becomes a restrained pale baby blue. The SVG ribbons and spirals are removed. The paired narrative card and journey rail become the reusable Philoo signature.

## Motion

Use the existing `motion` dependency for coordinated layout animation:

- the rail expands and collapses with a soft spring;
- the narrative surface glides toward or away from center as one composed movement;
- stage-state changes use small opacity and position transitions;
- content does not bounce independently.

The collapse button remains stationary enough to be easily clicked again. `prefers-reduced-motion` replaces spatial animation with a short fade or immediate state change.

## Component boundaries

`PhilooLessonJourneyRail`

- renders the visual rail;
- owns only expanded/collapsed interaction state;
- exposes accessible `aria-expanded` and control labels;
- receives lesson and stage data as props.

`LessonJourneyStage`

```ts
type LessonJourneyStage = {
  id: string;
  label: string;
  sceneIds: readonly string[];
  href: string;
};
```

`PhilooStoryShell`

- composes the narrative surface and rail;
- derives the active stage from the current scene ID;
- removes the duplicated header-dot progress when the rail is present;
- continues to support scenes that have not yet adopted a journey map.

The stage map lives beside each lesson's content definition rather than inside the generic rail.

## Interaction rules

- Previously visited stages are links; unvisited stages cannot be opened.
- The arrow is the only expansion control.
- Keyboard focus is visible.
- The expanded/collapsed state is preserved during navigation within the lesson.
- If a scene is missing from the stage map, the shell falls back to compact numeric progress rather than failing.

## Validation

The proof is successful when:

- the learner can immediately tell where they are in the lesson;
- no curriculum-level list appears inside the lesson;
- the header dots are no longer duplicated;
- expansion and collapse feel like one polished transition;
- the narrative recenters when the rail collapses;
- the design works without the decorative ribbon background;
- desktop, laptop, reduced-motion, keyboard, and mobile layouts remain usable;
- the same component can accept a different stage map for another philosopher without visual redesign.

## Out of scope

- course-level philosopher selection;
- grades, points, settings, or school administration;
- future scenes that have not yet been designed or implemented.
