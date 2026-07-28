# Philoo Narrative Composition

Date: 2026-07-28  
Status: implemented and verified
Primary trial route: `/aula/as-sombras/so-a-parede`

## Goal

Create one reusable composition for scenes in which a philosopher guides the
learner through dialogue, with or without an accompanying illustration. The
dialogue, philosopher, and optional image must read as one intentional scene
rather than independent elements placed on an empty canvas.

The pattern must be philosopher-neutral so future lessons can use Aristotle,
Pythagoras, a pre-Socratic philosopher, or another guide without rewriting
scene-specific positioning rules.

## Chosen Direction

Use a centered paired composition.

- On wide screens, the dialogue and philosopher sit side by side and share one
  vertical center.
- The philosopher becomes approximately 15–20% larger than in the current
  Story Path scene.
- The gap between the dialogue and philosopher is controlled by the shared
  composition rather than by individual scenes.
- The philosopher may appear on either side, but alignment, scale, and spacing
  remain consistent.
- The quotation mark moves farther inside the dialogue surface and receives
  reserved space so it never touches an edge or collides with copy.

This direction is preferred over overlapping the philosopher with the card or
placing the philosopher inside the card. Those treatments are more dependent
on a particular pose and are less reliable for a reusable lesson system.

## Reusable Primitive

Introduce a presentational `PhilooNarrativeComposition` primitive with three
semantic slots:

```ts
type PhilooNarrativeCompositionProps = {
  dialogue: ReactNode;
  guide: ReactNode;
  illustration?: ReactNode;
  guideSide?: "start" | "end";
  className?: string;
};
```

The primitive owns:

- desktop grid areas and alignment;
- dialogue, guide, and illustration sizing;
- the gap and shared optical center;
- narrow-screen ordering;
- character containment for differently proportioned philosopher assets;
- responsive layout tokens.

The scene continues to own:

- story copy and speaker;
- philosopher identity and pose;
- illustration source and alternative text;
- beat state, progression, and actions;
- whether the philosopher appears at the start or end.

No lesson-specific philosopher name or Plato-specific selector belongs in the
composition primitive.

## Text-Only Composition

On desktop and larger landscape tablets:

```text
┌──────────────── dialogue ────────────────┐   ┌── philosopher ──┐
│ speaker                                  │   │                  │
│ quotation                               │   │  aligned to the  │
│                                         │   │  dialogue center │
└─────────────────────────────────────────┘   └──────────────────┘
```

- Both columns use `align-items: center`.
- The dialogue remains the wider column.
- The guide container uses a responsive maximum width rather than a fixed
  image width.
- The image uses `object-fit: contain` and a centered object position so pose
  variations remain fully visible.
- The pair is centered within the available story body, including when the
  journey rail reserves horizontal space.

## Illustrated Composition

When an illustration is present, it forms a single narrative stack with the
dialogue:

```text
┌── philosopher ──┐   ┌──────────── illustration ────────────┐
│                  │   └──────────────────────────────────────┘
│ centered against│   ┌──────────────── dialogue ────────────┐
│ the full stack  │   │ speaker and quotation                │
└──────────────────┘   └──────────────────────────────────────┘
```

- Illustration and dialogue share the same width and horizontal alignment.
- The gap between them comes from the shared rhythm token.
- The philosopher is centered against the complete image-plus-dialogue stack,
  not only the card or image.
- Existing 3D borders and tactile shadows remain available to the illustration
  and dialogue components; the composition controls placement, not their
  visual identity.

Scenes without an illustration render the text-only variant automatically.
Activities and other screen types are not forced into this narrative pattern.

## Quotation Treatment

The quotation mark remains a visual signal that the philosopher is speaking.

- Inset it from the top and inline edge with responsive shared tokens.
- Reserve inline padding in the dialogue content so long text cannot enter its
  area.
- Keep its baby-blue color and soft opacity.
- Scale it down modestly on narrow screens while preserving the same inset
  relationship.
- Do not encode the speaker's name into the quotation graphic.

## Responsive Behavior

Wide screens:

- Two columns with a shared optical center.
- Dialogue or image-plus-dialogue stack occupies the larger column.
- Philosopher uses a consistent responsive size cap across poses.

At the existing tablet stack breakpoint and below:

- Text-only order: dialogue, then centered philosopher.
- Illustrated order: illustration, dialogue, then centered philosopher.
- The illustration and dialogue remain the same width.
- The philosopher is large enough to remain a character, not a decorative
  thumbnail, but cannot force vertical overflow.

At short viewport heights:

- Reduce gaps and guide maximum height before reducing copy size.
- Preserve the complete philosopher image.
- Preserve the no-page-scroll lesson contract at the existing viewport
  harness sizes: `1280×720`, `1024×768`, `768×1024`, and `390×844`.

## Adoption

Use the primitive anywhere a philosopher is paired with spoken guidance:

- the three moments inside `PhilooStoryPathStage`;
- invitation and descent scenes that currently pair `PhilooDialogueCard` with
  `PlatoGuide`;
- illustrated story scenes that pair an image, `PhilooDialogueCard`, and
  `PlatoGuide`.

The current Story Path route is the first visual validation. Existing scenes
should preserve their content, pose, direction, and card treatment while
adopting the shared alignment rules.

Future lesson scenes use the same primitive rather than copying CSS grids or
adding philosopher-specific offsets.

## Data and State

The primitive is stateless. Beat changes continue to be controlled by the
scene. When a beat changes, the scene supplies the matching dialogue,
illustration, and philosopher pose as one synchronized render. Existing Motion
transitions wrap the whole composition so its elements enter and leave
together.

If `illustration` is absent, the primitive renders its two-slot mode. No empty
media region remains in the layout.

## Accessibility

- DOM reading order matches narrow-screen visual order.
- Dialogue remains ordinary text with the existing speaker label.
- Illustrations retain meaningful alternative text supplied by the scene.
- Philosopher images retain pose-specific alternative text.
- Layout changes do not alter step navigation or keyboard behavior.
- Reduced-motion preferences keep state changes immediate and synchronized.

## Verification

Focused checks must cover:

- the text-only and illustrated slot structures;
- configurable guide side without changing reading order;
- all Story Path moments using the same alignment;
- image and dialogue width alignment in illustrated mode;
- quote inset and reserved copy space;
- pose changes remaining synchronized with dialogue;
- no regressions to Story Path navigation or final actions;
- no-scroll and containment checks at the four established viewport sizes.

Visual review must include at least one short and one long dialogue, multiple
Plato poses, and one illustrated scene.

## Non-Goals

- No regeneration or replacement of philosopher images.
- No rewriting lesson copy.
- No redesign of the journey rail, Story Path controls, dialogue cards, or
  illustration frames.
- No forced use of the narrative composition on activities, assessments, or
  full-background cinematic scenes.
