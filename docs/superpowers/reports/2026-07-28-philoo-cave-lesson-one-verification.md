# Cave Lesson One Verification

- Automated tests: **pass** — 43 files, 253 tests, 0 failures.
- Lint: **pass** — `eslint --quiet`, 0 errors.
- Production build: **pass** — Next.js 16.2.12 compiled, type-checked,
  generated 16/16 static pages, and exposed all 12 `As Sombras` lesson routes.
- Diff check: **pass** — `git diff --check` reported no whitespace errors.
- Viewports:
  - 1280×720: base no-scroll contract passed; Story Path and Invitation
    composition checks passed. The Descent composition remains the first
    failing route because its dialogue and guide grow 34px beyond the
    composition box while remaining inside the story surface.
  - 1024×768: base no-scroll contract and the Story Path and Invitation
    composition checks passed.
  - 768×1024: expanded-rail hit testing and no-scroll contract passed; Story
    Path and Invitation composition checks passed.
  - 390×844: collapsed-rail clearance, button/arrow hit testing, and no-scroll
    contract passed; Story Path and Invitation composition checks passed.
- Input:
  - Pointer/touch-equivalent: activity component suites cover wrong then
    correct answers, revisable choices, briefing dismissal, and persistent
    help reopening.
  - Keyboard: component suites cover focus entry, retry focus, dialog return
    focus, revisable controls, journey links, and terminal action focus.
- Activity briefing/help: **pass in automated coverage** for the wall game,
  behind-wall reveal, causal path, and evidence sort. Reopening preserves
  activity state.
- Journey rail: **pass in automated coverage** — current stage, prior-stage
  navigation, navigation direction, collapse/expand, and assistive collapsed
  cue use the approved nine-stage journey.
- Reduced motion: **pass in implementation coverage** — activity and story
  motion rules remove nonessential transforms and use immediate state changes.
- Natural completion time: **14 minutes 19 seconds** in a deliberate
  read-through with one incorrect then correct attempt in each activity.
  Stage-level outliers were the wall-recognition game (2:31) and the taught
  evidence sort (2:18); both remained purposeful interaction rather than
  repeated exposition.
- Navigation race: the deterministic `/first → /second → /first` transition
  cycle is covered and passes. The route shell exposes stable first-render
  geometry boundaries; no oversized blank-route state was reproduced by the
  transition regression suite.
- Outside-world reveal: **absent**. The terminal scene ends with the first
  doubt and the possibility of turning, without showing the exterior.
- Remaining template candidates: briefing dialog, causal path, discovery
  table.
- Permanent-template decision: deferred until user review.

## Integration corrections made during verification

1. Updated four stale journey-rail assertions from the former five-stage
   labels to the approved nine-stage journey.
2. Constrained nested Plato guide artwork to its fixed guide slot at tablet
   and phone breakpoints. The story-level transition remains responsible for
   the entrance motion, avoiding a second image transform that could escape
   the surface.
3. Allowed the reusable narrative composition to honor content minimum height,
   resolving Invitation containment across all four target viewports.

## Remaining concern

The viewport command exits `1` at the Descent scene on 1280×720. Both overflowing
slots remain fully contained by the visible story surface and the page does not
scroll, but the reusable composition box is 34px shorter than its content. This
is recorded rather than hidden or waived; it should be resolved in the next
visual pass before calling the viewport suite fully green.
