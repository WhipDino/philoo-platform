# Task 9 report — Complete Lesson One

## Outcome

Implemented the final Cave lesson route as three connected beats:

1. A visual anomaly interrupts the prisoners’ familiar pattern.
2. The learner chooses or writes a possible response and receives a distinct,
   non-punitive reflection from Platão.
3. A prisoner attempts to turn for the first time, then the lesson stops before
   revealing the ascent or outside world.

The terminal state reads “Você concluiu: Dentro da caverna” and keeps the
lesson journey rail available for revisiting earlier scenes.

## TDD evidence

- **RED:** `npm test -- src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx`
  failed because `./cave-first-doubt-scene` did not exist.
- **GREEN:** the same focused command passes **3/3 tests**.
- Tests protect:
  - contradiction → reflection → first-turn sequence;
  - all three distinct, non-punitive Platão responses;
  - optional response with a 180-character limit;
  - local completion without a Lesson Two link or outside-world reveal;
  - canonical `first-doubt` and `invite-turn` Platão poses;
  - retained journey rail.

## Verification

- `npm run lint -- --quiet` — clean.
- Desktop geometry at 1280×720:
  - no document overflow (`1280×720`);
  - anomaly image and guide card align exactly from `y=184` to `bottom=691`;
  - Platão renders at `286×150` inside the guide card.
- Phone geometry at 390×844:
  - no horizontal document overflow (`scrollWidth=390`);
  - image appears first (`y=158`), then the guide/choices (`y=386`);
  - Platão expands to `326×170`;
  - long content remains available through the lesson’s existing scroll
    container rather than being hidden behind the journey control.

## Files

- `src/domains/lessons/as-sombras/cave-first-doubt-scene.tsx`
- `src/domains/lessons/as-sombras/cave-first-doubt-scene.module.css`
- `src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx`
- `src/app/aula/as-sombras/a-primeira-duvida/page.tsx`

## Concerns

None blocking. The phone layout is intentionally vertically progressive:
image, choices, then Platão’s response, rather than compressing the ending into
one viewport.
