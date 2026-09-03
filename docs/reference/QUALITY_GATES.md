# Reference — Quality Gates

## Code gates

Run:

```bash
npm test
npm run lint
npm run build
```

No new lint warning is acceptable. Existing known warnings must not be used to
hide new ones.

## Responsive gates

Verify:

| Viewport | Purpose |
| --- | --- |
| 390 × 844 | phone touch flow and wrapping |
| 768 × 1024 | tablet portrait |
| 1024 × 768 | tablet landscape/short height |
| 1366 × 720 | notebook short height |
| 1440 × 900 | full desktop composition |

Check:

- no page-level horizontal overflow;
- no clipped copy or media;
- minimum 44 px interactive targets;
- primary action remains reachable;
- no trapped internal scroll (folio page, exercise card, or activity briefing);
- briefing demos do not overlap their captions or Confirm chip;
- Folio exercise card: equal inset from masthead dash to card top and from
  3D slab to folio floor; two-column boards centered on the divider
  (`docs/reference/FOLIO_LAYOUT_CONTRACT.md`);
- the intellectual sequence remains equivalent.

## Interaction gates

- keyboard path;
- touch path;
- drag alternative;
- visible focus;
- correct and incorrect/revision paths;
- restored state;
- repeated completion safety;
- reduced motion when applicable.

## Learning gates

- activity matches the intended thinking move;
- the student's reasoning produces an inspectable artifact;
- feedback explains rather than punishes;
- revision remains possible;
- private answers remain private unless explicitly marked;
- no public ranking, lost lives, or coercive streak behavior;
- student-facing copy has no em dash (`—`);
- folio Continuar is hidden until the exercise is correct;
- story happens before the exercise that checks that story.

## Asset gates

Use `docs/reference/CHARACTERS_AND_ASSETS.md`. Verify resolution, crop, gaze,
alt text, provenance, and every target viewport.

## Documentation gates

When an API, path, status, workflow, or product rule changes:

- update the owning reference;
- update `docs/START_HERE.md` if routing changes;
- update the technical website when contributors need the information;
- update project state and handoff;
- commit documentation with the code.

## Handoff evidence

Record:

- tests/build/lint result;
- viewports checked;
- known warnings or limitations;
- commit/branch;
- exact next work.
