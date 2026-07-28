# SDD ledger — plan: docs/superpowers/plans/2026-07-28-philoo-cave-lesson-one-complete.md

Baseline: 34 test files, 220 tests passed on branch codex/story-folio at dc6e1f3.

Task 1: clarification — `cave-shadow-names-scene.test.tsx` added to ownership because the brief required its route assertion to change.
Task 1: cross-task check — verify `/aula/as-sombras/jogo-da-parede` exists after Task 4.
Task 1: minor (deferred) — journey test covers IDs, dual-scene grouping, and terminal href but not every label and intermediate href.
Task 1: complete (commits dc6e1f3..e8fd9aa, review clean apart from one cross-task verification and one deferred minor).
Task 2: complete (commits e8fd9aa..68c3a4a, review clean).
Task 3: complete (commits 68c3a4a..73ddd73, visual and code review clean).
Task 4: fix round 1/5 (2 addressed, 0 open — distinct success beats and keyboard retry focus; commits 2c2a925..d9590a5).
Task 4: cross-task check resolved — `/aula/as-sombras/jogo-da-parede` exists and renders.
Task 4: integration follow-up — update five stale journey fixture assertions before final full-suite verification.
Task 4: complete (commits 73ddd73..d9590a5, review clean after fix round 1).
Task 5: complete (commits d9590a5..6cfa368, review clean).
Task 5: user-directed layout correction complete (`aa044ed`, review clean — enlarged Platão, integrated right guide/control column, aligned evidence geometry, responsive reveal states).
Task 6: minor (deferred) — reusable component still contains Cave-specific group label and causal feedback semantics.
Task 6: minor (deferred) — small helper text contrast should be raised from roughly 3.6:1.
Task 6: fix round 1/5 (3 addressed, 0 open — unique IDs, first-open focus, announced placed state; commits c787c67..fa7b890).
Task 6: complete (commits 6cfa368..fa7b890, review clean after fix round 1).
Task 7: minor (deferred) — initial aria-controls points to a reveal region mounted only after expansion.
Task 7: fix round 1/5 (typography raised broadly; one beat-label issue remained; commits 67a679c..11159bd).
Task 7: fix round 2/5 (1 addressed, 0 open — beat label is 14px at 5.23:1 contrast; commits 11159bd..b3f9999).
Task 7: complete (commits fa7b890..b3f9999, review clean after fix round 2).
Task 8: complete (commits aa044ed..58e8bed, review clean — briefing, worked example, four-card prisoner-viewpoint application, responsive interaction).
Task 9: fix round 1/5 (2 addressed, 0 open — beat-transition focus management and exact prisoner-viewpoint reflection prompt; commits df42026..9cd4b8b).
Task 9: complete (commits 58e8bed..9cd4b8b, review clean after fix round 1).
Task 10: fix round 1/5 (1 addressed, 0 open — stale leaving state invalidated across href cycles; commits b1a5a1a..e4c3f9b).
Task 10: complete (commits 9cd4b8b..e4c3f9b, review clean after fix round 1).
User-directed activity briefing refinement: complete (`911c52d`, review clean — briefings and persistent help on three activities, no persistent Platão; drag/drop exception preserved).
Task 11: integration corrections — four stale journey assertions updated; nested Plato guide constrained at tablet/phone sizes; Invitation composition honors content minimum height.
Task 11: verification — 43 files/253 tests pass, lint clean, production build 16/16 pages, natural timing 14:19.
Task 11: remaining concern — viewport checker exits 1 at Descent 1280×720 because slots exceed the composition box by 34px while remaining inside the story surface with no page scroll. Recorded for the next visual pass.
