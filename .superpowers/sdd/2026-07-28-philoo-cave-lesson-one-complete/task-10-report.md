# Task 10 report — Stable Cave route entry geometry

## Root cause

The browser geometry captured at 1440×900 was already contained:

- `[data-philoo-story-shell]`: 808px high, `top=74`, `bottom=882`
- `[data-philoo-folio-stage]`: 804px high, `top=76`, `bottom=880`
- document horizontal overflow: false
- document vertical overflow: false
- computed transform on both elements: `none`

Because the folio did not exceed the story surface, no scene-specific height
override or additional CSS containment was justified.

The deterministic failure was instead in `useStorySceneTransition`: after an
exit began, changing its `href` left `phaseRef`, `hasNavigatedRef`, the visual
`leaving` phase, and the old timeout associated with the previous destination.
That stale state could survive a client-route identity change and leave the
newly rendered scene transformed until navigation completed.

## TDD evidence

- **RED:** the new regression rerendered a transition from `/first` to
  `/second` while it was leaving. It failed because `data-phase` remained
  `leaving` instead of returning to `idle`.
- A shell contract test also failed because the stable motion sizing slot did
  not yet expose `data-philoo-story-motion-slot` on first render.
- **GREEN:** destination changes now clear and null any pending timeout, reset
  the navigation refs, and derive an immediate idle phase for the new `href`.
  The journey shell exposes both stable first-render geometry boundaries:
  `[data-philoo-story-shell]` and `[data-philoo-story-motion-slot]`.

The final implementation deliberately does not call `setState` synchronously
inside the reset effect. The visible phase is derived from the destination
that owns it, while the effect is limited to synchronizing the timer and refs.

## Verification

- `npm test -- src/domains/lessons/use-story-scene-transition.test.tsx src/domains/lessons/philoo-story-shell.test.tsx src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx`
  — 3 files, 12 tests passed.
- Scoped ESLint over the four owned production/test files — clean.
- Initial browser geometry measurement at 1440×900 — contained as recorded
  above, with no document overflow.

The requested ten-pass client-navigation stress loop and full build could not
be completed inside Task 10 because another active task temporarily put
`cave-shadow-path-scene.tsx` into an in-progress parse-error state while all
agents shared the same worktree. I did not modify or revert that agent’s
files. Full production build and repeated integration navigation remain for
the final verification task after concurrent edits settle.

## Files

- `src/domains/lessons/use-story-scene-transition.ts`
- `src/domains/lessons/use-story-scene-transition.test.tsx`
- `src/domains/lessons/philoo-story-shell.tsx`
- `src/domains/lessons/philoo-story-shell.test.tsx`

## Concerns

No blocking concern within the owned transition contract. Integration
navigation still needs the final-suite rerun documented above.

## Fix round 1

The scoped review identified a destination-cycle gap in the first fix:
`/first` could enter `leaving`, switch to `/second` and correctly display
`idle`, but switching back to `/first` reused the old stored
`{ href: "/first", phase: "leaving" }` state.

- **RED:** the new `/first → /second → /first` regression failed because the
  final render resurrected `data-phase="leaving"`.
- **GREEN:** a guarded functional state adjustment now replaces transition
  state with the new destination’s idle state whenever `href` changes. The
  existing effect continues to clear the pending timeout and reset navigation
  refs.
- The state adjustment uses React’s supported guarded render pattern rather
  than a synchronous state update inside an effect, keeping the project’s
  `react-hooks/set-state-in-effect` rule clean.
- Fresh verification:
  - hook and shell suites: **2 files, 11 tests passed**;
  - scoped ESLint over the hook/shell production and test files: clean.
