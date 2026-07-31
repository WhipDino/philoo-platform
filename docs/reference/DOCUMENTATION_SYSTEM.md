# Reference — Documentation System

## Goal

A contributor with no prior conversation must be able to identify the correct
source, understand the constraints, make a safe change, validate it, and hand
it off.

## Entry points

- humans: `README.md`;
- AI coding agents: `AGENTS.md`;
- everyone: `docs/START_HERE.md`;
- visual interface: `/tecnico`;
- current status: `docs/project/PROJECT_STATE.md`;
- unfinished work: `docs/project/DESKTOP_HANDOFF.md`.

All entry points converge on the same task routes.

## Documentation layers

1. **Router** — tells the reader what to read.
2. **Project state** — says what is true now.
3. **Playbook** — explains how to perform a workflow.
4. **Reference** — defines an API, rule, or invariant.
5. **Specification/plan** — records a bounded design decision or implementation
   history.
6. **Tests/types/code** — executable truth.

Do not use an old plan as current truth when code and project state disagree.

## Ownership

Every rule should have one owning document. Other documents link to it and
summarize only enough for navigation.

Examples:

- exercise maturity: exercise catalog;
- current branch/status: project state;
- session stopping point: desktop handoff;
- EX-05 public API: lesson library API;
- character production: characters/assets reference;
- task routing: Start Here.

## Update triggers

Update documentation when:

- a file or public import moves;
- an activity changes maturity;
- a reusable API changes;
- a breakpoint or protected behavior changes;
- curriculum order changes;
- an asset becomes canonical;
- a workflow gains or loses a required step;
- validation baseline changes.

## Drift prevention

- colocate engine README/types/tests with implementation;
- encode repeated facts in typed registries where practical;
- test registry links/IDs and public exports;
- keep visual docs driven by typed catalog data;
- commit docs and code together;
- review stale dates, branches, paths, and counts during handoff.

## Repository boundary

Keep documentation here while it describes this product and library. Consider a
separate versioned package/repository only when independent products consume the
same API and release cadence. Until then, separation adds drift without useful
independence.
