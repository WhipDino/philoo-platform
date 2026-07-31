# Reference — Characters and Assets

## Principle

Characters are part of the learning direction, not decoration. Their gaze,
gesture, crop, lighting, grounding, and scale must guide attention without
covering the work.

## Before creating an image

Record:

1. target component/scene;
2. character semantic ID;
3. canonical identity reference;
4. pose role;
5. gaze/facing direction;
6. gesture target;
7. transparent or environmental background;
8. safe area;
9. preferred source aspect ratio;
10. responsive rendered dimensions;
11. alt text;
12. provenance/license.

If the target engine exposes a character brief, that code is authoritative.

## Asset types

### Transparent character

Use for reusable guide poses. The component owns placement and environmental
relationship. Do not bake text, buttons, or lesson cards into the asset.

### Integrated environmental scene

Use when the character must share lighting, ground, perspective, and atmosphere
with the environment. The active Cave portal hero is an integrated scene and
must not be rebuilt as an obvious pasted overlay.

An environmental story scene contains only characters who exist in that
story moment. In the Cave trilogy, the prisoner is the protagonist and Plato
is the narrator. Therefore, prisoner scenes must not include Plato. When Plato
comments on the story, render a separate transparent narrator pose beside the
content through the semantic pose catalog. Never combine the stylized Plato
guide and a differently proportioned prisoner inside one generated scene.

### Lesson media

Use for evidence, artworks, diagrams, or contextual imagery. Record crop/focal
point and responsive behavior in the lesson configuration or media contract.

## Semantic access

Prefer:

```ts
getGuidedClassificationGuide("plato")
```

over:

```ts
{ src: "/images/some-file.png", width: 210 }
```

The semantic registry preserves identity and lets assets change without
rewriting lessons.

## Approval checklist

- identity matches the canonical reference;
- one coherent visual style across the entire image;
- hands, face, anatomy, props, and clothing are credible;
- gesture leads toward the intended content;
- no accidental AI artifacts, text, watermarks, or duplicated forms;
- transparent edges are clean when applicable;
- source resolution survives the largest rendered size;
- crop works at all required viewports;
- alt text describes function, not irrelevant appearance;
- file is committed under `public/images/` with a semantic name.

For Plato-specific identity guidance, also read
`docs/product/plato-character-generation-standard.md`.
