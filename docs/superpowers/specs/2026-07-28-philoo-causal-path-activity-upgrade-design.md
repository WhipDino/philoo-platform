# Philoo Causal Path Activity Upgrade

## Goal

Make **O caminho da sombra** immediately understandable, visually balanced,
and easy to revise without changing its core learning objective:

`Luz → Objeto → Sombra → Nome dado`.

The activity must teach its interaction before asking the learner to perform
it, give a meaningful causal hint at every position, and let the learner undo
placements without punishment.

## Briefing demonstration

The existing `PhilooActivityBriefing` remains the entry point. Its
demonstration area will contain a small live HTML/CSS version of the real
activity rather than a video, GIF, or unrelated illustration.

The demonstration sequence is:

1. The tray shows the real **Objeto** piece.
2. A visible mouse cursor enters the demonstration.
3. The cursor presses the **Objeto** piece.
4. The piece lifts with the same tactile shadow used by the activity.
5. The cursor drags it along a short curved path to **Posição 2**.
6. The slot receives the piece and changes its label to **Objeto**.
7. A short success pulse confirms the placement.
8. After a pause, the demonstration resets and may replay.

The labels, colors, icons, and destination styling must match the real
exercise. A small **Ver novamente** control replays the sequence. The
demonstration is illustrative, not interactive, and must not change the real
activity state.

With `prefers-reduced-motion: reduce`, the popup shows the final state
(`Objeto` placed in `Posição 2`) without cursor travel, looping, or pulsing.

## Causal hints

Every position has a stable question that previews its relationship:

1. **Luz:** “A fogueira produz a luz.”
2. **Posição 2:** “O que a luz encontra pelo caminho?”
3. **Posição 3:** “O que aparece quando a luz é bloqueada?”
4. **Posição 4:** “Como as pessoas passam a chamar a forma que veem?”

When a piece is placed, its explanation replaces the question. Removing the
piece restores the position’s original question.

The fourth piece is labelled **Nome dado**, not only **Nome**. Its explanation
is “As pessoas dão um nome à forma que interpretam.” This keeps the final
relationship natural in Portuguese without introducing the more technical
term “nomeação.”

## Placement and removal behavior

- Drag-and-drop and the existing select-then-place interaction remain
  available.
- Clicking a filled, learner-controlled position returns its piece to the
  tray.
- The demonstrated **Luz** position remains fixed and cannot be removed.
- Removing a piece clears completion when necessary and presents a concise,
  non-punitive status message.
- Keyboard and screen-reader users receive an explicit control name such as
  “Posição 2, Objeto. Devolver peça” and focus returns to the now-available
  tray piece after removal.
- Placed pieces remain represented by one shared state; drag, tap, removal,
  validation, and announcements cannot disagree.

## Layout

The activity keeps its current Philoo identity but uses the available stage
more deliberately:

- The tray, path, and feedback form one vertically centered activity board.
- The four path positions become taller and slightly more expressive.
- Spacing between the tray, path, and feedback increases enough to distinguish
  the three regions.
- Empty space is redistributed above and below the board rather than filled
  with decorative content.
- Desktop and tablet keep the four-step horizontal path.
- Phone keeps sequential, comfortable controls and may scroll vertically
  inside the lesson surface without horizontal overflow.

## Component boundaries

- `PhilooCausalPath` owns hints, placement, removal, validation, focus, and
  announcements.
- `CaveShadowPathScene` owns the lesson copy, activity board composition, and
  popup content.
- A small causal-path demonstration component owns only the briefing animation
  and has no access to learner progress.

## Verification

Automated coverage must prove:

- all four hints appear in the correct positions;
- placing a piece replaces its hint with its explanation;
- clicking a filled position returns the piece and restores the hint;
- demonstrated light cannot be removed;
- keyboard focus and accessible state follow removal;
- the animated demonstration uses **Objeto** and **Posição 2**;
- replay works without affecting the real activity;
- reduced motion renders a stable completed example.

Visual checks cover 1280×720, 768×1024, and 390×844 with no overlap,
horizontal overflow, clipped controls, or excessive unused lower space.
