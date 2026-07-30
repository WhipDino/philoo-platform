# Student Learning Platform Research

**Date:** 2026-07-30
**Audience:** Brazilian students, initially ages 13–16
**Question:** What should Philoo's student home optimize for?

## Product conclusion

Philoo is not a school-management dashboard. Its student home should optimize
for entering a philosophical investigation, understanding personal progress,
and choosing what to explore next. Class logistics and announcements are
supporting utilities.

## Evidence translated into design

### 1. Make the learning action unmistakable

Khan Academy places the most active learner item first. Duolingo redesigned its
home around one guided path because learners were unsure what the best next
action was. Brilliant organizes courses into progressive learning paths with
interactive lessons and checkpoints.

**Philoo decision:** the active lesson is a learning workspace, not a
promotional banner. It names the lesson, current chapter, exact resume point,
progress, remaining effort, and one dominant `Continuar aula` action.

Sources:

- [Khan Academy learner home](https://support.khanacademy.org/hc/en-us/articles/360030629852-What-is-my-Learner-Home-page-and-what-can-I-do-there)
- [Duolingo home-screen learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [Brilliant learning paths](https://brilliant.org/help/features/what-are-learning-paths/)

### 2. Support competence before adding rewards

A meta-analysis covering 144 studies and more than 79,000 students found that
competence was the strongest predictor of self-determined motivation, followed
by autonomy and relatedness. A review focused on early adolescents associates
autonomy support, structure, and involvement with motivation and engagement.

**Philoo decision:** show where the learner stopped, what has been discovered,
and a small number of meaningful next choices. Do not use punitive lives,
public rankings, or arbitrary reward clutter.

Sources:

- [Pathways to Student Motivation meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8935530/)
- [Need-supportive teaching and early adolescent engagement](https://www.sciencedirect.com/science/article/pii/S1747938X12000632)

### 3. Use curiosity as a doorway to content

Curiosity improves memory for both target and incidental information. Research
on information gaps distinguishes short-lived curiosity from sustained
interest: the learner needs enough context to recognize a meaningful gap, but
not so much that the answer feels already known or impossibly remote.

**Philoo decision:** organize exploration around human questions, such as
“Como saber se algo é verdade?”, instead of administrative course codes. Each
question leads to a guided journey.

Sources:

- [Curiosity and hippocampus-dependent learning](https://escholarship.org/uc/item/2zd605r7)
- [Curiosity, interest, and information gaps](https://discovery.ucl.ac.uk/10133801/1/Donnellan2021_Article_HowAreCuriosityAndInterestDiff.pdf)

### 4. Remove information that competes with learning

Multimedia-learning research supports coherence and signaling: remove
interesting but irrelevant material and deliberately cue the essential action.
Visual cues are especially helpful for learners with less prior knowledge.

**Philoo decision:** remove schedules and clocks from the home. Announcements
live in a dedicated utility area. The visual hierarchy signals lesson status,
resume point, progress, and action.

Sources:

- [Systematic review of multimedia-learning principles](https://doi.org/10.1186/s40561-022-00200-2)
- [Meta-analysis of cueing and cognitive load](https://pmc.ncbi.nlm.nih.gov/articles/PMC5576760/)

### 5. Put characters inside the learning loop

Duolingo's character work places characters where learners spend time and lets
them react to learning. Characters are not isolated decorative mascots.

**Philoo decision:** Plato appears inside the active lesson stage and points
toward the unresolved investigation. He does not decorate announcements or
generic navigation.

Source:

- [Duolingo character design and motivation](https://blog.duolingo.com/building-character/)

## Implemented hierarchy

1. Persistent platform header: `Início`, `Explorar`, `Meu caminho`, notices,
   and profile.
2. Active lesson workspace with one dominant learning action.
3. Compact journey progress showing the three Cave chapters.
4. One quiet teacher activity.
5. Exploration library organized by philosophical questions.
6. Notices and profile as secondary views.

This remains a front-end preview. Personalization, assignments, and progress
will become server-backed only after the authentication/data architecture is
discussed.
