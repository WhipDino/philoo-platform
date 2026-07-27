# Philoo Cave Trilogy — Feasible Learning Design

**Status:** Approved direction  
**Date:** 2026-07-27  
**Audience:** Product, curriculum, design, art, and engineering  
**Supersedes:** The scene sequence and bespoke simulation mechanics in `2026-07-27-philoo-as-sombras-living-story-redesign.md`  
**Preserves:** Its brand, character, responsive, accessibility, feedback, and living-story decisions

## 1. Product structure

The student experiences one continuous journey called **O Mito da Caverna**, divided into three independently resumable lessons:

1. **As Sombras**
2. **A Subida**
3. **O Retorno**

The lessons share story state, Plato's relationship with the learner, visual identity, and the learner's private notebook. Each lesson has its own learning outcome, ending, and save point. A student or teacher may stop or assign work between lessons without breaking the narrative.

## 2. Learning spine

### Lesson 1 — As Sombras

The learner understands:

- what the prisoners can observe from their position;
- what they infer from those observations;
- why a shared, limited model can still feel reasonable and produce useful predictions;
- why successful prediction does not prove that a perspective contains the whole reality.

The lesson ends when the possibility of another perspective becomes a question. The prisoner has not yet turned around.

### Lesson 2 — A Subida

The learner understands:

- why turning toward new evidence can initially feel confusing or painful;
- how the sources of the shadows become visible gradually;
- how to revise an explanation when the available evidence changes;
- Plato's idea that education redirects an existing capacity rather than merely inserting facts.

### Lesson 3 — O Retorno

The learner understands:

- why the returning prisoner appears confused or foolish to those who stayed;
- how both the prisoners' and returner's perspectives can be represented fairly;
- how different dialogue strategies affect resistance and understanding;
- the tension between personal freedom, knowledge, and civic responsibility.

## 3. Feasible activity rule

Every activity starts with:

`learning outcome → learner thinking move → feasible mechanic → Philoo visual treatment`

An activity is included only when the learner must classify, connect, compare, sequence, revise, explain, or adopt another perspective. Clicking solely to reveal or restate content is navigation, not a learning activity.

The first production toolkit is:

- semantic React, HTML, CSS, and SVG for dialogue, cards, hotspots, bounded connections, and feedback;
- a drag-and-drop library only for activities where spatial placement or ordering is itself meaningful;
- a motion library for transitions and feedback, never as the only carrier of meaning;
- touch and keyboard alternatives for every drag interaction.

Deferred until repeated lesson needs justify them:

- open-ended node editors;
- canvas or game engines;
- real-time image or shadow simulation;
- interactive animation runtimes requiring a separate authored-asset workflow;
- sound-dependent evidence;
- H5P or another embedded authoring ecosystem.

## 4. Lesson 1 sequence

Lesson 1 contains ten story beats and two required learning activities.

1. **Venha comigo**
   - Existing approved invitation screen.
   - Plato invites the learner into the thought experiment.
   - No question.

2. **A descida**
   - Plato leads the learner deeper into the Cave.
   - The learner sees the physical limits of the prisoners' position.
   - Plato establishes that their perspective is limited, not that their intelligence is deficient.
   - No question or activity.

3. **Só a parede**
   - The prisoners' lifelong point of view is shown.
   - The scene distinguishes their available world from information hidden behind them.
   - No question.

4. **Eles dão nomes**
   - The prisoners name recurring forms and develop shared rules.
   - An experienced prisoner becomes the credible defender of the wall's patterns.
   - No question.

5. **O que chegou até eles?**
   - Activity: organize five to seven statement cards into **observaram**, **concluíram**, and **ainda não podem saber**.
   - Desktop supports drag or tap; phone and keyboard support select-then-place.
   - Feedback explains the evidence boundary without punishment.

6. **A especialista da parede**
   - The experienced prisoner successfully anticipates a recurring pattern.
   - The story shows why the wall model earns trust and social value.
   - No question.

7. **A dúvida de Platão**
   - Plato opens the curiosity gap: reading the wall well does not prove that the wall contains all of reality.
   - No answer is required.

8. **O que a parede consegue provar?**
   - Activity: connect bounded observation cards to the claims they genuinely support.
   - Desktop may display baby-blue SVG connections.
   - Touch and keyboard use a two-step select-and-connect flow.
   - No image manipulation, physics, sound, canvas, or open-ended graph editor is required.

9. **A parede não mentiu**
   - Plato explains that the wall revealed something real without revealing everything.
   - The experienced prisoner remains intelligent and dignified.
   - No question.

10. **A primeira dúvida**
    - The learner chooses one worthwhile question to carry into Lesson 2.
    - Every option is treated as a legitimate inquiry path.
    - The scene ends as turning around becomes imaginable.

The rhythm is:

`four story beats → activity → two story beats → activity → two closing beats`

## 5. Screen 2 acceptance criteria

The immediate implementation milestone is only **A descida**.

- The approved `Venha comigo` screen links to the new scene.
- The new scene uses the same persistent Philoo header, cream-and-baby-blue interface, rounded dialogue surface, and living inquiry thread.
- Plato remains a full-scale guide and is not reduced to an avatar.
- The scene is story-only and asks for no learner response.
- Copy explicitly frames the prisoners' limitation as lack of perspective rather than lack of intelligence.
- The Cave artwork remains atmospheric while the persistent interface stays warm and readable.
- The scene remains usable at 1440×900, 1366×768, 1024×768, 820×1180, 390×844, and 360×800.
- No educational content is clipped or hidden in a nested scroll area.
- Reduced-motion mode preserves all meaning.
- The scene stops after this beat for visual review before Screen 3 is built.

