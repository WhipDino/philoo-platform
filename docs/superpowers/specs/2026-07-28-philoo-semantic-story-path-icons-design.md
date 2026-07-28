# Philoo Semantic Story Path Icons

Date: 2026-07-28  
Status: approved direction; awaiting written-spec review  
Trial route: `/aula/as-sombras/so-a-parede`

## Goal

Turn the scene path into a compact, reusable content-language for Philoo. Each
step communicates both where the learner is and what kind of learning moment
it contains. Learners may revisit every step they have already opened without
unlocking future content.

## Icon System

Use `@phosphor-icons/react`. Phosphor's rounded geometry and coordinated
regular, bold, fill, and duotone weights fit Philoo's tactile visual language
and let one icon change state without changing meaning.

The reusable vocabulary is:

| Kind | Portuguese label | Icon | Meaning |
| --- | --- | --- | --- |
| `story` | `História` | `BookOpenTextIcon` | narrative or historical passage |
| `lesson` | `Explicação` | `ChalkboardTeacherIcon` | guided explanation |
| `definition` | `Definição` | `QuotesIcon` | definition or key quotation |
| `concept` | `Ideia` | `LightbulbFilamentIcon` | philosophical idea |
| `activity` | `Atividade` | `PuzzlePieceIcon` | interactive challenge |
| `reflection` | `Reflexão` | `BrainIcon` | personal reflection |
| `conversation` | `Conversa` | `ChatsCircleIcon` | dialogue or debate |

Only explicitly imported icons may enter the client bundle. Do not import the
complete catalog. Icons are decorative inside a fully labelled step control;
the control's accessible name includes both kind and step label.

The trial scene uses:

1. `story` — `A luz fica para trás`
2. `lesson` — `Quem vive aqui`
3. `concept` — `O mundo na parede`

## Compact Step Composition

Keep the three-column reading order, but stop stretching a chip across its
entire grid cell.

- The first chip aligns to the start, the second to the center, and the third
  to the end.
- Each chip uses `width: fit-content` with compact horizontal padding.
- The connector remains behind the chips and is covered by every opaque chip
  surface, so it is visible only in the gaps and never crosses an icon or
  label.
- The active chip keeps Philoo's baby-blue surface and darker blue tactile
  underside, at a smaller size.
- Upcoming chips use a cream surface, readable ink, and a quiet outline.

## Visited State

A visited, non-current step:

- keeps its original semantic icon;
- receives a small check seal attached to the icon medallion;
- uses a pale-blue finished surface with a restrained outline;
- remains visibly quieter than the current step;
- lifts slightly on hover and has a clear keyboard focus ring.

The check never replaces the semantic icon. This preserves the learner's
understanding of the content type after completion.

## Navigation Behavior

The scene tracks two values:

- `currentStep`: the beat currently displayed;
- `furthestStep`: the highest beat the learner has opened.

Rules:

- Continue advances `currentStep` and, when needed, `furthestStep`.
- Any step at or below `furthestStep` is available.
- Clicking a visited step updates `currentStep` immediately and restores its
  matching text and Plato pose through the existing synchronized Motion
  transition.
- Going backward never reduces `furthestStep`; already opened later beats stay
  available.
- The current step is marked with `aria-current="step"` and is not an
  actionable control.
- Unvisited future steps are non-interactive and exposed as unavailable.
- A visited control's accessible name follows the pattern
  `Voltar para História: A luz fica para trás`.

This is in-scene navigation only. It does not create browser-history entries or
change the route.

## Reusable Component Contract

Extend `PhilooStoryPathStep` with a semantic kind:

```ts
export type PhilooStoryPathKind =
  | "story"
  | "lesson"
  | "definition"
  | "concept"
  | "activity"
  | "reflection"
  | "conversation";

export type PhilooStoryPathStep = {
  id: string;
  label: string;
  kind: PhilooStoryPathKind;
};
```

Extend `PhilooStoryPathStageProps` with:

```ts
furthestStep: number;
onStepSelect: (step: number) => void;
```

The stage owns icon selection, state visuals, semantics, and step controls.
The scene owns dialogue state, the furthest-opened value, copy, and Plato pose.

## Responsive Behavior

- Preserve no-scroll behavior at `1280×720`, `1024×768`, `768×1024`, and
  `390×844`.
- Keep every label visible on mobile; the smaller chip and icon replace the
  space formerly occupied by the numeric marker.
- Preserve journey-rail clearance and the mobile 68×68 collapsed control.
- Do not change the right journey rail or any other lesson route.

## Verification

Focused checks must cover:

- semantic icon mapping and absence of numeric markers;
- compact current, visited, and upcoming state contracts;
- only visited steps render controls;
- selecting an earlier visited step restores its dialogue and Plato pose;
- returning backward does not lock a later visited step;
- keyboard focus and accessible names;
- existing final link and forward progression;
- all four viewport/no-scroll checks.

## Non-Goals

- No custom icon artwork.
- No changes to lesson copy, Plato assets, journey rail, or other scenes.
- No global icon migration.
- No direct navigation to unvisited beats.
