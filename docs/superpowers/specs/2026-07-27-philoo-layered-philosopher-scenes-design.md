# Philoo Layered Philosopher Scenes Design

**Status:** Approved for one reversible Plato experiment

**Rollback point:** `74f9502` (`feat: approve refined Plato welcome screen`)

## Purpose

Make each philosopher feel physically present inside a world connected to
their ideas, while keeping the character reusable across poses, screen sizes,
and lessons.

This system must reuse a visual grammar without forcing every philosopher into
the same composition.

## Core decision

Philoo will build scenes from coordinated visual layers instead of baking the
philosopher permanently into a single background image.

A fully generated combined illustration may be used later for rare cinematic
moments. It is not the default because it makes responsive crops, pose changes,
identity continuity, and iteration substantially harder.

## Reusable scene grammar

Every guided scene may use these seven roles:

1. **World backdrop**
   Establishes the philosopher's physical and conceptual setting.
2. **Environmental light**
   Applies the world's light direction and color to both the character and
   surrounding space.
3. **Philosopher**
   Uses a canonical transparent character asset with a scene-appropriate pose.
4. **Physical grounding**
   Adds contact shadow, reflected color, and floor alignment so the character
   has weight.
5. **Foreground depth**
   Places subtle atmosphere or environmental material in front of part of the
   character to create occlusion and depth.
6. **Narrative connection**
   Connects a meaningful gesture or object to the teaching surface. It may be
   a Philoo-blue thread, a ripple, a geometric line, or another world-specific
   visual behavior.
7. **Teaching surface**
   Keeps Philoo's warm cream, rounded, readable interface integrated with the
   scene without pretending to be a literal object in the historical world.

The roles are reusable. Their visual expression is philosopher-specific.

## Plato Cave experiment

The current approved Plato and cave assets remain unchanged. Integration is
created with reversible presentation layers:

- reduce the studio-bright cutout quality with a restrained cave color grade;
- add a cool rim from the cave entrance and a faint cream bounce from the
  dialogue side, clipped to Plato's silhouette;
- place a soft, perspective-aware contact shadow below his sandals;
- add a low foreground veil of cave haze and darkness across the floor;
- keep Plato's face, eyes, hands, and expression clear;
- originate the animated Philoo thread at Plato's open hand and terminate it
  underneath the dialogue card;
- use a separate mobile thread geometry for the stacked composition;
- retain the current cream card, copy, progress, and primary action.

No new cave image or new Plato pose is required for this experiment.

## Responsive behavior

- **Wide desktop:** Plato occupies the left scene plane, the card occupies the
  right plane, and the connection curves from his open hand to the card.
- **Tablet and short desktop:** Character scale, contact shadow, and connection
  geometry adapt without covering the card or cropping hands and feet.
- **Phone:** Plato remains above the card. A shorter vertical connection links
  his lower hand area to the card, while atmosphere stays behind readable
  content.
- The scene must not introduce nested scrolling or hide required content.
- Responsive checks cover approximately `1440×900`, `1024×768`, `768×1024`,
  `390×844`, and `360×800`.

## Motion and accessibility

- Atmosphere may move only through slow opacity or position changes.
- The narrative thread may retain its gentle traveling-dot motion.
- `prefers-reduced-motion` removes atmosphere and thread movement while keeping
  the complete spatial relationship visible.
- Decorative layers remain hidden from assistive technology and do not
  intercept pointer events.
- Text contrast and keyboard focus remain unchanged.

## Future philosopher examples

- **Thales:** shoreline, vessel, rain, or reflection; the connection behaves
  like a ripple or stream.
- **Pythagoras:** rope geometry, tiled proportions, or musical strings; the
  connection follows a constructed line or vibration.
- **Democritus:** grains, fragments, or particles; the connection follows a
  separation or recombination.

These environments should support the idea being explored without reducing a
philosopher to a decorative stereotype or presenting uncertain history as
fact.

## Acceptance criteria

- Plato reads as standing inside the cave rather than pasted over it.
- Identity, pose, costume, and facial readability remain unchanged.
- Physical contact with the cave floor is believable.
- At least one foreground layer crosses in front of the lower character plane
  without obscuring important anatomy.
- The connection visibly begins at Plato's gesture and leads to the card.
- The cream and baby-blue Philoo identity remains dominant.
- Desktop, tablet, and phone layouts remain usable and unclipped.
- Reduced-motion mode remains coherent.
- The experiment can be removed by reverting the integration commit, restoring
  `74f9502` exactly.

## Out of scope

- Later lesson screens
- New philosopher characters
- New Plato poses
- A generalized configuration API before this visual experiment is approved
- WebGL or a full 3D runtime
