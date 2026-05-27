# AION Sprints

This directory holds one document per sprint. Sprints describe **the work of that sprint only**.

## Sprint Numbers Are Stable IDs

A sprint's number is a **permanent identifier**, not a position in the schedule.

```text
The number identifies the sprint. It never changes.
Execution order lives only in docs/roadmap.md.
```

Rules:

- A sprint keeps its number and filename **for its entire life**, even if its place in the schedule changes.
- **Execution order is defined only in [`docs/roadmap.md`](../roadmap.md)** — the "Execution Order" list there is authoritative.
- To **insert** a sprint, give it the **next unused number** and place it wherever it belongs in the roadmap order. Do **not** renumber existing sprints.
- To **reorder** sprints, edit only the roadmap order list. Do not rename files.
- Cross-references between sprints (e.g. `Depends On`) use the stable number; because numbers never change, those references stay valid forever.

The current IDs (001–012) happen to match the initial execution order, but from now on they are frozen identities. The next new sprint is **013**, regardless of where it sits in the schedule.

This convention exists because position-based numbering forced a cascade of renames and reference edits every time a sprint was inserted or reordered. Stable IDs remove that churn.

## Single Source of Truth

Shared project context lives once, in the canonical docs — never copied into sprint files:

- [`docs/vision.md`](../vision.md) — AION philosophy and the trust boundary
- [`docs/architecture.md`](../architecture.md) — current system layers
- [`docs/runtime.md`](../runtime.md) — runtime status
- [`docs/roadmap.md`](../roadmap.md) — sprint ordering

Rule:

```text
Philosophy and current state live once.
Sprint docs link to them.
Sprint docs only describe the work of that sprint.
```

A sprint document must **not** copy the full project philosophy or the full current-capabilities list. If a sprint needs a constraint that is specific to its own work (e.g. "the simple evaluator is a bridge, not the final guard language"), state that as a focused `Design Constraint`, not as a restatement of project philosophy.

## Canonical Sprint Template

When creating a new sprint, use the next unused number as a stable ID (do not pick a number based on where it sits in the schedule), then add it to the Execution Order list in `docs/roadmap.md`.

```md
# Sprint 0NN — Title

(0NN is the next unused stable ID, not a schedule position.)

## Status

Planned | Ready | Done

## Type

One line describing the kind of sprint.

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint Goal

What this sprint delivers.

## Why This Sprint Matters

How it moves AION forward.

## Depends On

- Sprint 0NN — ... (by stable ID; dependency, not schedule order)

## Design Constraint

(Optional) Constraints specific to this sprint's work.

## Scope

What is in scope.

## Out of Scope

What is explicitly not in scope.

## Tasks

The concrete work items.

## Acceptance Criteria

How we know the sprint is done.

## Validation Commands

The commands that must pass.

## PR

PR title and summary.
```
