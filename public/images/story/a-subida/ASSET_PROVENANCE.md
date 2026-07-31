# A Subida — asset provenance

**Created:** 2026-07-30  
**Mode:** OpenAI built-in image generation, reference-guided generation/editing  
**Status:** Final lesson assets

The four narrative scenes use accepted Chapter 1 Cave imagery as their style
and continuity reference. The Plato pose uses only
`public/images/plato/reference/plato-canonical.png` as the identity reference.
An earlier set that placed Plato inside the story world was rejected and was
never copied into this directory.

## Shared locked art direction

- polished, warm, cinematic 3D storybook illustration for ages 12–17;
- approachable rather than childish, realistic materials with softly stylized
  proportions;
- coherent Cave lighting and the same central young prisoner in a dark-blue
  tunic across all story images;
- no text, logos, watermarks, modern objects, or Plato in prisoner scenes;
- 16:9 composition with mobile-safe central action and usable negative space.

## `cave-mechanism-discovery-v1.png`

Prompt brief: Continue the accepted Chapter 1 Cave art style. Show the same
blue-tunic prisoner after turning around, discovering the fire, carried
objects, low wall, and the causal path that creates shadows. His expression is
surprised and thoughtful, not triumphant. The mechanism must be visually clear.
No Plato and no embedded labels.

## `rugged-ascent-v1.png`

Prompt brief: In the same art style and with the same prisoner, show a steep,
rough passage leading out of the Cave. He climbs reluctantly and shields his
eyes from painful incoming daylight. Communicate effort, disorientation, and
the contrast between familiar darkness and unfamiliar light. No Plato, chains,
or extra protagonist.

## `eyes-adapt-at-dusk-v1.png`

Prompt brief: In the same art style and with the same prisoner, show the
outside world at dusk. Beside still water, he compares a reflection with the
real tree and stone that produce it. The mood is quiet discovery and gradual
visual adaptation, not instant enlightenment. No Plato.

## `return-decision-v1.png`

Prompt brief: In the same art style and with the same prisoner, show dawn near
the dark Cave entrance. The open world is beautiful behind him, while he turns
toward the Cave with concern and resolve, deciding to return for the others.
Communicate responsibility rather than superiority. No Plato.

## `plato-periagoge-guide-v1.png`

Prompt brief: Using only the canonical Plato identity reference, generate a
full-body transparent PNG. Preserve his short, broad 2.2–2.4-head proportions,
round face, brown eyes, white hair and beard, single laurel crown, purple
one-shoulder mantle with gold trim, ivory tunic, belt, and sandals. Give him a
calm teaching gesture that guides attention screen-right, as if explaining
`periagōgē`, with no environment, floor, text, or other character.

## Output dimensions

- narrative scenes: 1672 × 941 PNG;
- transparent Plato guide: 1153 × 1364 RGBA PNG.

## Plato narrator additions — 2026-07-31

Generation mode: built-in `imagegen`, using
`public/images/plato/reference/plato-canonical.png` as the identity and style
reference. Each result was generated against a flat chroma-green background,
then converted to a transparent PNG with the bundled imagegen helper. Plato is
kept outside all prisoner scene artwork and is composed by the responsive UI.

### `plato-light-pain-guide-v1.png`

Prompt brief: preserve canonical Plato's short, broad proportions, face,
clothing, and soft polished 3D storybook style. Full body, facing screen-right,
gently shading his eyes from imagined brightness with one hand and opening the
other in an empathetic teaching gesture. No cave, prisoner, props, or text.

### `plato-gradual-seeing-guide-v1.png`

Prompt brief: preserve the same canonical identity and full-body proportions,
facing screen-right. One hand indicates an imagined rising sequence while the
other invites patience, conveying gradual adaptation rather than instant
revelation. No literal steps, environment, prisoner, props, or text.

### `plato-return-compassion-guide-v1.png`

Prompt brief: preserve the same canonical identity and full-body proportions,
facing screen-right. One hand rests over his heart while the other reaches
toward an unseen cave, expressing compassion and responsibility rather than
triumph. No cave, prisoner, props, or text.

All three final outputs are 1153 × 1364 RGBA PNG files.
