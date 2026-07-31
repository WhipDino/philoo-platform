# Philoo Platform

Philoo is a web-first philosophy learning platform for adolescents. This
repository contains the student portal, the first Plato journey, the reusable
lesson foundation, and the beginning of Philoo's activity library.

## Start here

Whether you are a developer, designer, curriculum author, reviewer, or an AI
with no previous context, begin with:

1. [`docs/START_HERE.md`](docs/START_HERE.md) — routes every kind of task to
   the correct documentation.
2. [`docs/project/PROJECT_STATE.md`](docs/project/PROJECT_STATE.md) — explains
   what exists now and what is not implemented.
3. [`CONTRIBUTING.md`](CONTRIBUTING.md) — defines the working and quality
   protocol.

AI coding agents must also follow [`AGENTS.md`](AGENTS.md). It is intentionally
short and points to the same source-of-truth documents used by people.

## Common tasks

| I need to… | Read first |
| --- | --- |
| Create a lesson | [`docs/playbooks/CREATE_A_LESSON.md`](docs/playbooks/CREATE_A_LESSON.md) |
| Choose or reuse an exercise | [`docs/product/PHILOO_EXERCISE_CATALOG_V1.md`](docs/product/PHILOO_EXERCISE_CATALOG_V1.md) |
| Use EX-05 in code | [`docs/reference/LESSON_LIBRARY_API.md`](docs/reference/LESSON_LIBRARY_API.md) |
| Change a button, card, shell, or responsive rule | [`docs/reference/DESIGN_AND_COMPONENT_RULES.md`](docs/reference/DESIGN_AND_COMPONENT_RULES.md) |
| Create or place a philosopher image | [`docs/reference/CHARACTERS_AND_ASSETS.md`](docs/reference/CHARACTERS_AND_ASSETS.md) |
| Validate work before handoff | [`docs/reference/QUALITY_GATES.md`](docs/reference/QUALITY_GATES.md) |
| Continue from another computer/session | [`docs/project/DESKTOP_HANDOFF.md`](docs/project/DESKTOP_HANDOFF.md) |

The same system has a visual interface at
[`/tecnico`](http://127.0.0.1:3000/tecnico). The live exercise catalog is at
[`/tecnico/biblioteca`](http://127.0.0.1:3000/tecnico/biblioteca).

## Run locally

```bash
npm install
npm run dev
```

Primary routes:

- `/inicio`
- `/aula/as-sombras/primeira-tela`
- `/tecnico`
- `/tecnico/biblioteca`

## Source-of-truth rule

Code, tests, assets, decisions, and documentation live together in this
repository and are committed together. Chat history is useful context but is
never the durable source of truth.
