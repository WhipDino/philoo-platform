# Philoo Cave Opening — Narrative Continuity and Scene Transition

**Status:** Approved  
**Date:** 2026-07-27  
**Scope:** Only the first two scenes of **As Sombras**  
**Related design:** `2026-07-27-philoo-cave-trilogy-feasible-learning-design.md`

## 1. Problem

The existing first scene instructs the learner to look at a wall before
introducing the cave's prisoners. The second scene then begins with
“Eles” and “essas pessoas,” although no people have been established.
The route changes immediately, and both screens show the same first
chapter dot, so neither the writing nor the interface communicates
continuous movement through a story.

## 2. Narrative decision

The opening becomes a three-beat narrative wire:

`Platão proposes a story → the learner descends with him → they arrive
at the prisoners`

Only the first two beats are implemented now. The third remains the
subject of the next review screen.

### Scene 1 — O começo da história

- **Label:** `Cena 1 · O começo da história`
- **Title:** `Venha comigo até uma caverna.`
- **Story:** `Quero lhe contar uma história. No fundo desta caverna,
  pessoas vivem presas desde crianças e só conseguem olhar para uma
  parede.`
- **Plato's guidance:** `Vamos descer devagar. Eu fico com você e
  mostro o caminho.`
- **Action:** `Descer comigo`
- **Source mark:** `Platão · A República, Livro VII`

The source mark appears once, quietly, on this opening scene. It is a
real attribution: the Cave narrative begins in *Republic* VII at 514a
and continues through 517a. It is not repeated on every story card.

### Scene 2 — A descida

- **Label:** `Cena 2 · A descida`
- **Title:** `A luz fica para trás.`
- **Story:** `Enquanto descemos, pense nas pessoas de quem falei. Elas
  nunca puderam se virar: tudo o que conhecem acontece diante da mesma
  parede.`
- **Plato's guidance:** `Não lhes falta inteligência. Falta-lhes a
  chance de enxergar o que existe atrás delas.`
- **Action:** `Chegar até elas`

This scene remains a descent. It does not claim that the learner can
already see prisoners, chains, fire, or shadows because the current
artwork does not depict those elements. Revealing them with
purpose-built artwork is a decision for the next scene review and is
outside this correction.

The copy does not say that the prisoners refused to turn. In Plato's
account, they have been restrained since childhood and cannot turn.

## 3. Transition decision

Use a small reusable client-side scene-navigation hook rather than
Next.js's experimental View Transitions integration.

On a normal activation of `Descer comigo`:

1. The real link remains present for semantics, prefetching, modified
   clicks, and no-JavaScript fallback.
2. The scene enters a `leaving` phase.
3. The dialogue moves slightly toward its nearest side and fades.
4. Plato moves slightly toward his nearest side and fades a moment
   later.
5. A navy cave veil darkens the environment enough to conceal the
   change between the two background files.
6. Navigation occurs when the scene exit animation completes, with a
   short safety timeout.
7. Scene 2 enters with the veil clearing, then Plato and the dialogue
   settling from opposite sides.

The perceived transition must remain under 700 milliseconds. The cave
does not perform a large pan or zoom. On narrow screens, lateral travel
is reduced to a few pixels.

When `prefers-reduced-motion: reduce` is active, navigation is immediate
and entrance/exit movement is disabled. No meaning depends on motion.

## 4. Progress decision

The three chapter dots are replaced by story-beat progress. Lesson 1
already defines ten beats, so both screens use one shared progress
component:

- Scene 1: `Cena 1 de 10`
- Scene 2: `Cena 2 de 10`

The component keeps Philoo's compact point vocabulary:

- completed beats are small baby-blue points;
- the current beat is an elongated baby-blue point;
- future beats remain muted;
- semantic progress values expose the current and total beats.

## 5. Reusable boundaries

The implementation introduces only the reusable pieces required now:

- a small ordered source of truth for the first two Cave story beats;
- one Cave story-progress component;
- one story-scene navigation hook;
- scene-specific motion choreography in the existing CSS modules.

No motion library, global lesson-shell rewrite, native experimental
View Transitions flag, or new artwork is added in this correction.

## 6. Acceptance criteria

- Scene 1 introduces the cave's people before Scene 2 refers to them.
- Scene 2 explicitly recalls “as pessoas de quem falei.”
- Neither scene asks the learner a question.
- The wording accurately describes the prisoners as unable, not
  unwilling, to turn.
- The authentic *Republic*, Book VII reference appears once.
- The forward transition visually represents moving deeper into the
  cave and hides the background cut.
- The link keeps standard link behavior for modified clicks and
  no-JavaScript use.
- Repeated activation cannot trigger repeated navigation.
- Reduced-motion mode navigates without delayed movement.
- Progress advances from beat 1 to beat 2 out of 10.
- Existing desktop, tablet, phone, and keyboard behavior remains usable.
- The work stops after revising these two scenes for another review.

## 7. Verification

Automated tests cover:

- the approved narrative copy and source mark;
- progress values and completed/current states;
- delayed navigation after a normal transition;
- immediate reduced-motion navigation;
- repeat-activation protection;
- the existing no-question and review-stop contracts.

Browser verification covers:

- the complete Scene 1 → Scene 2 transition;
- direct loading of Scene 2;
- back navigation;
- desktop, tablet portrait, phone portrait, and phone landscape;
- reduced motion;
- browser console errors and horizontal overflow.
