# Philoo Dóxa Guided Reveal

## Goal

Turn the Dóxa scene into one clear learning thread for children and teenagers:

1. learn what **dóxa** means;
2. form an impression from a cropped image;
3. discover the complete event;
4. understand, through Plato, how that experience relates to the prisoners and
   the shadows.

The scene must remain playful and immediately understandable without adding a
second activity or grading the learner.

## Guided image interaction

The existing image remains one large accessible button that alternates between
the cropped and complete frame.

Before the first reveal, a tactile baby-blue cue appears over the image. It
contains a hand-tap icon and performs two gentle tap motions followed by a short
pause, then repeats. The cue is visual guidance rather than another control;
clicking anywhere on the image opens the frame.

The cue disappears immediately after the learner reveals the complete image and
does not return while the component remains mounted, including when the learner
returns to the cropped view.

With `prefers-reduced-motion: reduce`, the cue remains visible in a stable state
without tapping, pulsing, or looping.

## Teaching copy

The definition remains:

> Dóxa é uma opinião ou crença formada a partir de como algo aparece para nós.

Before revealing the image, the learner is invited to notice what the cropped
frame makes them imagine. No answer is scored.

After revealing it, the generic explanation is replaced by the concrete event:

> No recorte, parecia que as crianças disputavam o giz. Ao abrir o quadro,
> vemos que uma estava entregando o giz à outra.

Plato then makes the philosophical bridge directly:

> Você não inventou a disputa: formou uma ideia com a parte que conseguiu ver.
> Os prisioneiros faziam o mesmo com as sombras — transformavam uma pista
> incompleta em uma crença sobre o mundo.

The previous generic statements about “a true but incomplete image,” prisoners
“not pretending,” and separating appearance from invention are removed or
absorbed into this single explanation. The learner should not have to connect
three independent concepts without guidance.

## Plato

Plato remains in the left concept column and uses the existing approved `doxa`
pose. On desktop he becomes a principal teaching figure rather than a small
decoration:

- his visible size increases substantially;
- he is aligned with the analogy text;
- the card no longer leaves a large empty region around a tiny character.

Tablet keeps the current successful two-card composition with only proportional
size adjustments. Phone stacks Plato and his explanation compactly without
cropping his face, covering text, or forcing horizontal scrolling.

## Responsive composition

- Desktop keeps a two-column lesson: vocabulary and Plato on the left, image
  investigation on the right.
- The desktop left column is rebalanced so Plato fills the lower card and the
  analogy remains easy to scan.
- Tablet preserves the current visually successful horizontal concept row and
  full-width example below it.
- Phone uses one vertical sequence: definition, Plato’s bridge, image prompt,
  reveal, and next action.
- The image, cue, and copy must remain fully visible and usable at 1280×720,
  768×1024, and 390×844.

## Accessibility

- The full image surface remains a native button with `aria-expanded` and a
  state-specific accessible name.
- The animated hand cue is decorative and hidden from assistive technology;
  button text continues to describe the action.
- Keyboard focus remains visibly styled.
- Revealed copy is announced through the existing status region.
- Reduced-motion preferences remove the cue animation and reveal transition.

## Verification

Automated tests must prove:

- the tap cue exists before the first reveal;
- clicking the image removes the cue;
- returning to the cropped view does not restore it;
- the concrete crayon explanation appears only after reveal;
- Plato’s explicit cave analogy is present;
- the same accepted image asset is used for both crop states;
- no grading language or score is introduced.

Visual checks cover desktop, tablet, and phone for Plato scale, cue placement,
copy readability, image expansion, scrolling, and absence of overlap or
horizontal overflow.
