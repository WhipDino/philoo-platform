# Philoo Guided Dialogue Card

## Purpose

Make it immediately clear that the philosopher is speaking while preserving
Philoo's soft, tactile identity. This pattern replaces decorative character
auras that visually separate the guide from the lesson.

## Approved composition

- Place the philosopher directly on the cream lesson surface.
- Keep only the character's natural soft drop shadow.
- Present the spoken content in a rounded cream quotation card with Philoo's
  baby-blue lower layer.
- Use the label `Platão explica`, a restrained quotation mark, and two small
  baby-blue voice dots between the philosopher's gesture and the card.
- Let the philosopher slightly overlap the card so both read as one composition.
- Do not use a speech-balloon triangle, spotlight oval, gradient aura, or nested
  decorative frame.

## Responsive behavior

- Desktop: philosopher and quotation card share one horizontal composition.
- Tablet: preserve the horizontal relationship while reducing the overlap and
  type scale.
- Phone: stack the philosopher above the quotation card; keep the voice dots as
  a short vertical bridge so speaker attribution remains clear.
- All states must fit the lesson frame without introducing internal scrolling.

## Motion and accessibility

- The quotation card and philosopher enter together using the existing lesson
  transition.
- Voice dots may use a subtle staggered opacity animation, disabled by
  `prefers-reduced-motion`.
- The visual treatment does not replace semantic headings or text. Reading
  order remains philosopher context, explanation, then action.

## Scope

Apply the pattern to the Dóxa connection moment only. Treat it as a candidate
reusable lesson pattern after visual approval in the running application.
