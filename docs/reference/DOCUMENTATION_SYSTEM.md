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

## Website rendering

The repository Markdown remains the canonical source. The technical website
renders that source directly:

- `/tecnico` — visual overview and task router;
- `/tecnico/guias/comecar` — first complete article;
- `/tecnico/guias/[slug]` — complete curated guides;
- `/tecnico/busca?q=...` — full-text search across the actual guide contents;
- `/tecnico/biblioteca` — live code-backed exercise catalog and component demo.

`src/domains/technical-docs/technical-docs-registry.ts` maps stable website
slugs to repository source paths. Adding an important guide requires adding it
to that registry; its tests reject duplicate slugs, duplicate sources, and
missing files. Do not copy Markdown into a page component. The renderer,
sidebar, table of contents, source link, search, and previous/next navigation
must all continue to consume the same registered source.

The website is the readable interface for humans. Repository paths remain
essential for terminal-based coding agents and for Git review. Both surfaces
therefore expose the same information without maintaining two copies.

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
- folio/chapter UX after As Sombras and A Subida: `docs/reference/FOLIO_CHAPTER_PATTERNS.md`;
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
- a reusable Folio or chapter UX rule is learned from a shipped lesson;
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
