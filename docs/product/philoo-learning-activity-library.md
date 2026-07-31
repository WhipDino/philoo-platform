# Philoo Learning Activity Library

For the concrete inventory of activities already built in `As Sombras`, their
screen contracts, current coupling, and proposed reusable component parameters,
also read `docs/product/PHILOO_EXERCISE_CATALOG_V1.md`.

The first reusable engine is implemented at
`src/domains/lesson-library/activities/guided-classification/`. Its Cave
configuration and unrelated Socratic-dialogue proof demonstrate how lesson
content changes without changing renderer behavior.

The stable developer API is `src/domains/lesson-library/index.ts`. Authors use
`<GuidedClassificationExercise config={activity} />`; they do not recreate the
screen. Approved character treatments are resolved by
`getGuidedClassificationGuide(...)`, with generation pose, crop, direction,
proportion and responsive dimensions stored in code beside the engine.

**Status:** Product standard, version 1
**Date:** 2026-07-27
**Audience:** Curriculum designers, product designers, engineers, reviewers, and lesson-generation agents
**Primary age range:** 13–16, with supported access for approximately 11–17

## 1. Purpose

Philoo does not choose an exercise because a widget is available or because a lesson needs “something interactive.” It chooses the learner's required thinking move first.

The reusable activity contract is:

`stimulus → thinking move → inspectable reasoning artifact → feedback → revision`

The interface can vary radically while the educational reasoning remains explicit. A matching interaction is appropriate when the goal is recognition or discrimination. It is not an adequate substitute for explaining a relationship, evaluating evidence, constructing an argument, or revising a belief.

This library is expandable. It is not a menu that every lesson must exhaust, and it does not authorize agents to publish activities without human curriculum review.

## 2. Selection rules

Every activity brief must identify:

1. the learning claim;
2. the exact cognitive move;
3. the artifact or event that makes the learner's thinking inspectable;
4. the likely misconception;
5. the feedback and revision path;
6. the accessible equivalent;
7. the reason this interaction is better than a simpler one.

Additional rules:

- Prefer active, constructive, and genuinely interactive thinking over passive consumption.
- Use recognition tasks as scaffolds, not as the default endpoint.
- Every lesson includes at least one constructive response in the learner's own organization or words.
- Do not place two low-level recognition exercises consecutively unless deliberate spaced retrieval requires it.
- Do not require long typing on a phone when selection, ordering, drawing, or sentence stems can capture the same evidence.
- Keep free-text reflection private by default.
- Let support fade according to demonstrated readiness, not a visible “child” or “teen” label.
- Meaningful uncertainty is an allowed outcome.
- Philosophical positions are not marked correct because they match Philoo's preferred conclusion. Reasoning quality is assessed.
- Novelty serves the learning move. Decorative novelty is removed.

## 3. Learning goal map

| Learning goal | Best-aligned activity families | Evidence of success |
|---|---|---|
| Retain concepts and distinctions | Free recall, spaced mixed retrieval, two-way cues | Delayed unaided recall rather than recognition alone |
| Explain and organize | Self-explanation, teach-back, causal or concept maps | Correct relationships in the learner's own organization |
| Form precise concepts | Example/non-example, boundary cases, own counterexamples | Discrimination of close cases and novel transfer |
| Read argument structure | Tagging, reconstruction, hidden premises, argument maps | Accurate structural relationships |
| Evaluate claims and evidence | Comparison, evidence triage, source triangulation, repair | Relevance, credibility, sufficiency, and inference quality |
| Construct an argument | Claim–evidence–reason, objection–reply, revision | Clear support, explicit bridge, and responsiveness |
| Understand another view | Steelman, role swap, dialogue repair, lens rotation | Accurate and charitable representation before critique |
| Deliberate ethically | Evolving dilemmas, trade-off maps, perspective lenses | Consistency, consequences, values, and uncertainty |
| Transfer | Novel cases, analogy mapping, thought experiments, claim audits | Reasoning beyond the practiced wording or setting |
| Regulate thinking | Confidence calibration, revision records, retrospectives | Calibration and productive response to evidence |

## 4. Activity patterns

### A. Curiosity and orientation

#### 1. Prediction before reveal

The learner commits to an expectation before seeing the consequence. The reveal must make the prediction useful for later explanation, not merely produce surprise.

Best for: causality, misconceptions, narrative mysteries, confidence calibration.

#### 2. Spot the anomaly

A familiar pattern contains one meaningful mismatch. The learner identifies what changed and which explanation is threatened.

Best for: curiosity gaps, model revision, evidence inspection.

#### 3. Mystery clue

The learner selects which clue to inspect first. Branches may change evidence order while still reaching required learning evidence.

Best for: inquiry, source evaluation, bounded autonomy.

#### 4. Observation or inference

The learner separates what was directly perceived from what was inferred or named.

Best for: media literacy, science, Plato's Cave, historical sources.

#### 5. Confidence commitment

The learner records confidence before feedback, then examines whether certainty was warranted.

Best for: calibration and belief revision. Never turn confidence into a wager for points.

### B. Retrieve and organize

#### 6. Free-recall burst

Before cues appear, the learner reconstructs a small number of ideas or relationships.

Best for: retrieval and consolidation. Keep it low stakes and provide feedback.

#### 7. Spaced mixed retrieval

Earlier concepts return after time and are mixed with current ideas or cases.

Best for: durable retention and discrimination.

#### 8. Two-way cue

Retrieve a concept from a case, then create or select a case from the concept.

Best for: vocabulary that must transfer beyond memorized definitions.

#### 9. Teach-back map

Create a small map and explain how its links work, optionally to Plato or another character.

Best for: causal systems, theories, relationships.

### C. Form and distinguish concepts

#### 10. Example/non-example sort

Sort close cases and identify the decisive feature. Matching without justification is only the first step.

Best for: concept boundaries and misconceptions.

#### 11. Boundary continuum

Place cases from “clearly fits” through “uncertain” to “clearly does not fit,” then defend one placement.

Best for: concepts without simple binary edges.

#### 12. Example–counterexample forge

Create one case that supports a claim and one that defeats or limits it.

Best for: universals, definitions, philosophical principles.

#### 13. Compare–contrast matrix

Compare two explanations across explicit criteria such as assumptions, predictions, implications, and unresolved problems.

Best for: competing theories and historical perspectives.

#### 14. Odd one out, many reasons

Choose the item that differs. Several choices may be defensible if the distinction is clear and relevant.

Best for: flexible classification and conceptual language.

#### 15. Causal or chronological sequence

Reconstruct an ordered process or timeline and explain one dependency.

Best for: mechanisms and historical sequences. Provide move buttons as an alternative to dragging.

### D. Investigate and test models

#### 16. Manipulable model

Change one variable and observe a meaningful consequence. The simulation must expose the causal relation being learned.

Best for: light and shadow, systems, dilemmas with changing conditions.

#### 17. Predict–observe–explain

Commit to a prediction, run a demonstration, then explain the difference between expectation and result.

Best for: causal understanding and misconception repair.

#### 18. Variable isolation

Choose which factor to change while holding others stable, then compare outcomes.

Best for: scientific and social-causal reasoning.

#### 19. Counterfactual test

Ask what should happen if the learner's model is correct under a changed condition.

Best for: model quality, transfer, philosophical thought experiments.

#### 20. Diagnose and repair

Inspect a flawed model or explanation, identify the exact failure, and improve it.

Best for: causal chains, arguments, fallacies. Prefer this to superficial “spot the fallacy” labels.

#### 21. Evidence that would decide

Given two plausible explanations, choose or generate the next observation that would distinguish them.

Best for: inquiry design and epistemic humility.

### E. Analyze and evaluate reasoning

#### 22. Argument-part tagging

Label claims, reasons, evidence, assumptions, qualifications, objections, and replies.

Best for: short texts and dialogue excerpts.

#### 23. Scrambled reconstruction

Reorder statements into the strongest coherent argument, then explain one connection.

Best for: argument structure and reasoning bridges.

#### 24. Hidden-premise completion

Supply the missing rule that connects a reason to its conclusion.

Best for: warrants and unstated assumptions.

#### 25. Support-and-attack map

Build a visual map of supporting reasons, objections, and replies.

Best for: complex debate and seeing multiple independent reasons.

#### 26. Evidence triage

Rank or classify evidence separately by relevance, credibility, and sufficiency.

Best for: media claims and historical sources. Never collapse these dimensions into one opaque score.

#### 27. Strongest explanation comparison

Compare what each model explains, what it predicts, and what remains unresolved.

Best for: avoiding false certainty and simplistic correct/incorrect framing.

### F. Construct arguments and dialogue

#### 28. Claim–evidence–reason builder

Construct a claim, select relevant evidence, and state the bridge explaining why that evidence supports the claim.

Best for: making reasoning inspectable. Sentence stems can reduce typing without reducing rigor.

#### 29. Steelman before critique

Improve an opposing view until its advocate could recognize it, then respond.

Best for: citizenship, disagreement, philosophical pluralism.

#### 30. Objection–reply ladder

Build claim → objection → reply → stronger objection → revised position.

Best for: responsive reasoning rather than isolated opinion.

#### 31. Best next dialogue move

Choose or write a move such as clarify, request evidence, offer a counterexample, qualify, concede, or synthesize.

Best for: Socratic and civic dialogue.

#### 32. Question forge

Turn an ambiguous stimulus into philosophical questions, improve them, and compare their depth.

Best for: learner agency and inquiry. Popularity is not the quality criterion.

#### 33. Role-swap synthesis

Represent another position fairly, then state what both views illuminate and leave unresolved.

Best for: perspective-taking and synthesis.

### G. Deliberate, transfer, and create

#### 34. Evolving dilemma

Make an initial judgment, reveal one changed fact at a time, and identify what should and should not change.

Best for: ethics, principles, consistency, confidence.

#### 35. Lens rotation

Examine one case through consequences, duties, virtue, care, justice, or other lesson-specific lenses.

Best for: comparing what frameworks reveal or omit.

#### 36. Analogy bridge

Map structural similarities and important differences between a learned case and a novel one.

Best for: far transfer and avoiding surface-level analogy.

#### 37. Thought-experiment builder

Change one variable, predict the implications, identify what the case tests, and state a limitation.

Best for: philosophy and counterfactual reasoning.

#### 38. Real-world claim audit

Inspect a public or fictional media claim, distinguish fact from inference, and produce a qualified conclusion.

Best for: citizenship and media literacy. Use fictional cases until source, privacy, and moderation processes are ready.

#### 39. Multimodal explanation

Express an idea through a short written response, sketch, structured diagram, audio explanation, or small comic sequence.

Best for: learner agency and accessibility. Modes must assess the same underlying learning claim.

#### 40. Teach the character

Explain the idea to a character who asks a targeted follow-up or presents a counterexample.

Best for: self-explanation and character relationship. The character must not pretend to understand unsupported reasoning.

### H. Reflect and revise

#### 41. Belief-revision record

Capture the initial view, strongest new clue, updated view, confidence, and what could change it further.

Best for: making revision visible as progress.

#### 42. Decisive-clue selection

Identify which observation most affected the learner's model and explain why.

Best for: evidence relevance and metacognition.

#### 43. Reasoning retrospective

Identify the weakest step, the strategy that helped, and the next strategy to try.

Best for: self-regulation.

#### 44. Delayed echo

Return to an earlier question in a later scene or lesson without reproducing its wording.

Best for: retrieval, transfer, and narrative continuity.

## 5. Feedback contract

Nonpunitive feedback remains intellectually precise.

The default loop is:

1. state what the learner currently claims or did;
2. show the consequence or useful evidence;
3. name the unresolved tension;
4. offer one feasible next move;
5. allow retry or revision;
6. reflect when the change itself is educationally important.

Use a hint ladder:

`general cue → focused question → partial structure → worked example`

Rules:

- Require a meaningful attempt before revealing feedback that would give away the answer.
- Focus on the task, reasoning process, and strategy—not intelligence or personality.
- Explain why a response is incomplete or unsupported.
- Offer one high-value improvement at a time.
- Never remove lives, access, status, or already-earned progress for an error.
- Closed structural tasks may receive immediate correctness feedback.
- Contested philosophical conclusions receive rubric-linked feedback about reasons, evidence, objections, and uncertainty.
- Strategic hint use is evidence of self-regulation, not a reason for penalty.

Preferred example:

> Sua pista descreve o som, mas sua conclusão é sobre a forma. Que relação liga os dois?

Avoid:

> Errado. Tente novamente.

## 6. Age and accessibility adaptation

The platform uses one respected core experience.

For learners needing more support:

- shorter concrete stimuli;
- sentence stems;
- smaller maps and argument sets;
- visible examples;
- optional spoken or selection-based response;
- one variable at a time;
- earlier hint availability.

For learners ready for more depth:

- ambiguity and competing evidence;
- open explanation;
- counterfactual tests;
- stronger rival arguments;
- multiple sources;
- cross-context transfer.

Every activity requires:

- keyboard and touch operation;
- at least 44 × 44 CSS-pixel targets;
- screen-reader names and logical focus;
- reduced-motion behavior;
- text and visual equivalents for meaningful sound;
- a non-drag alternative;
- no information encoded only through color;
- no time pressure unless it is itself the learning target and an untimed alternative exists.

## 7. Engagement features Philoo does not use

Philoo does not use:

- public leaderboards;
- mandatory streaks;
- lives, energy, or lockouts;
- speed bonuses for reflective work;
- points as a proxy for understanding;
- badges for mere completion;
- hint penalties;
- popularity voting on answers;
- scoring of moral or political agreement;
- random rewards or loot-box loops;
- opaque AI judgments;
- endless novelty disconnected from the lesson.

Progress is expressed through an investigation map, completed reasoning moves, saved revisions, and future opportunities to retrieve or transfer an idea.

## 8. Outcome measures

Product analytics and teacher evidence must distinguish engagement from learning.

Useful measures include:

- delayed concept retrieval;
- near and far transfer;
- argument-structure accuracy;
- evidence relevance, credibility, and sufficiency;
- counterargument and reply quality;
- fair representation of another view;
- confidence calibration;
- quality of revision after feedback;
- justified concession and synthesis.

Time on page, clicks, completion, and voluntary return may inform usability. They do not prove learning.

## 9. Evidence basis and limitations

This library is an evidence-informed Philoo synthesis, not a claim that every named UI pattern has been independently validated for digital philosophy lessons at ages 11–17.

The strongest basis comes from research on retrieval and spacing, generative learning, ICAP engagement, feedback and revision, critical-thinking instruction, adolescent dialogue, self-determination, and multimedia learning. Direct evidence for pedagogical agents and Philosophy for Children is mixed. Character presence and enjoyment must therefore be evaluated separately from reasoning, retention, and transfer.

Core references:

- [IES: Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1)
- [Chi and Wylie: ICAP Framework](https://education.asu.edu/sites/default/files/lcl/chiwylie2014icap_2.pdf)
- [Fiorella and Mayer: Learning as a Generative Activity](https://www.cambridge.org/core/books/learning-as-a-generative-activity/6FBA6FA357F88F7C0C308A4D3B445FE3)
- [Abrami et al.: Strategies for Teaching Students to Think Critically](https://doi.org/10.3102/0034654314551063)
- [Kuhn and Crowell: Dialogic Argumentation With Young Adolescents](https://www.psychologicalscience.org/journals/psychological-science/0956797611402512/)
- [National Academies: How People Learn II](https://www.nationalacademies.org/read/24783/chapter/9)
- [CAST UDL Guidelines 3.0](https://udlguidelines.cast.org/more/about-guidelines-3-0/)
- [Ryan and Deci: Self-Determination Theory in Education](https://doi.org/10.1016/j.cedpsych.2020.101860)
- [Sailer and Homner: Gamification of Learning Meta-analysis](https://link.springer.com/article/10.1007/s10648-019-09498-w)
- [EEF: Philosophy for Children Effectiveness Trial](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/philosophy-for-children-effectiveness-trial)

