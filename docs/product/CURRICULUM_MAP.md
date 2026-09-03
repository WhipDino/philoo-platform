# Philoo Curriculum Map

**Status:** Initial product structure  
**Updated:** 2026-09-02

## Canonical hierarchy

Philoo organizes the suggested learning path in four levels:

1. **Era** — a broad historical and intellectual world, such as Ancient
   Philosophy.
2. **Journey** — one coherent investigation with a clear motivating question.
3. **Chapter** — one short playable step. After the Cave, one chapter is
   **one philosopher and their whole idea** (about 5–7 Folio stages). A
   journey still groups three or four such chapters. Do not split one
   belief across three lessons.
4. **Scene or activity** — the narrative, dialogue, observation, choice,
   classification, or reflection inside a chapter.

The portal should expose eras, journeys, and chapters. Scenes belong inside
the lesson player and should not make the portal path look unnecessarily long.

The hierarchy is structural, not the visual presentation. In `Meu caminho`,
chapters should feel like episodes in a familiar streaming library: strong
artwork, a short premise, progress, and immediate play state. Journeys form
visual shelves or collections. Do not return to a plain numbered timeline.

## Opening sequence

### Era 1 — Filosofia Antiga

#### Journey 1 — A Caverna de Platão

Motivating question: **Por que não devemos aceitar a primeira aparência?**

1. As Sombras
2. A Subida
3. O Retorno

This is the invitation to philosophy. It comes first for pedagogical reasons,
not chronological ones: it gives the student a vivid reason to question,
investigate sources, and revise an initial belief.

`A Subida` follows Plato's sequence rather than a modernized shortcut: the
prisoner discovers the fire and objects, is forced through a painful ascent,
adapts gradually through shadows, reflections, objects, the night sky and the
Sun, then decides to return. Its central learning move is `περιαγωγή`
(`periagōgē`): education as a reorientation of attention. The chapter asks
students to compare models, limit claims to available evidence and revise an
explanation without erasing what earlier observations genuinely showed.

#### Journey 2 — Os primeiros filósofos

Motivating question: **Do que o mundo é feito — e como ele muda?**

1. Tales e a arché
2. Heráclito e a mudança
3. Parmênides e o que permanece
4. Demócrito e os átomos

Each of these is **one complete Folio chapter**. The philosopher of that
chapter is the guide (first person, short bio, city image, one concept-word).
Contract: `docs/reference/PHILOSOPHER_LESSON.md`. Do not split Tales across
three lessons.

Other Presocratic thinkers can appear as characters, comparisons, optional
discoveries, or later companion journeys. They should not turn this first
journey into twelve disconnected chapters.

#### Journey 3 — Sofistas e Sócrates

Motivating question: **Vencer uma discussão é o mesmo que buscar a verdade?**

1. O poder da palavra
2. A pergunta socrática
3. Saber que não se sabe
4. A vida examinada

#### Journey 4 — Platão e Aristóteles

Motivating question: **Como podemos conhecer e viver bem?**

1. O mundo das ideias
2. Conhecer pelas causas
3. Virtude e hábito
4. A cidade e a vida comum

## Later eras

The durable top-level sequence can expand into:

- Filosofia Medieval
- Filosofia Moderna
- Filosofia Contemporânea

The exact journeys inside those eras remain a content-design decision. Figures
such as Agostinho, Rousseau, and Nietzsche should enter through motivating
questions and coherent journeys, not as isolated encyclopedia entries.

## Product distinction

`Meu caminho` is the recommended sequence and always communicates the
student's current position. `Biblioteca` (`/inicio?view=explore`) is the
chronological acervo: eras and groups from
`src/domains/curriculum-catalog/library-catalog.ts`. A later “explorar por
pergunta” mode can sit beside it; it is not this shelf.
