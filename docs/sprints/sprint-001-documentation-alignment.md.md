# Sprint 001 — Documentation Alignment & Project State Freeze

## Status

Ready

## Type

Documentation-only

## Sprint Goal

Bring AION documentation in line with the current implemented state of the project.

The key milestone to document is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
````

This sprint should make the project understandable for:

* new developers
* Codex
* AI coding agents
* future contributors
* the project owner

## Why This Sprint Matters

AION has moved beyond static artifact generation.

The project now supports:

* AION JSON IR
* parser
* JSON Schema validation
* semantic validation
* compile plan
* runtime manifest
* TypeScript target
* SQL target
* Mermaid target
* AIONX native execution plan
* AIONX run inspection
* `--out` output support
* executable TypeScript runtime generation for a narrow vertical slice

The documentation must reflect this current reality before new runtime work continues.

## Scope

This sprint is documentation-only.

Allowed changes:

* `README.md`
* `docs/vision.md`
* `docs/architecture.md`
* `docs/schema.md`
* `docs/runtime.md`
* `docs/executable-ts.md`
* `docs/skills/aion-codex-skill.md`
* optional: `docs/token-management.md`
* optional: `docs/sprints/README.md`

Not allowed:

* compiler source changes
* runtime source changes
* CLI behavior changes
* dependency changes
* `package-lock.json` changes

## Tasks

### README

* [ ] Keep README focused on the main project overview.
* [ ] Explain current AION capabilities.
* [ ] Add current proof statement.
* [ ] Add install/build instructions.
* [ ] Add car rental example commands.
* [ ] Add compile target examples.
* [ ] Add AIONX generation and inspection commands.
* [ ] Add executable-ts proof command.
* [ ] Add documentation links.

### Vision

* [ ] Explain AION as a behavioral contract layer.
* [ ] Clarify that AION is not just a code generator.
* [ ] Explain the evolved thesis from static artifacts to executable behavior.
* [ ] Include the current executable TypeScript proof.

### Architecture

* [ ] Document the current pipeline:

```text
Human Prompt
  -> AI interpretation
  -> AION IR
  -> JSON Schema validation
  -> Semantic Validator
  -> Compile Plan
  -> Runtime Manifest
  -> Target Compilers
  -> AIONX
  -> Runtime Inspector
  -> Executable Runtime Target
  -> Smoke Tests
```

* [ ] Document current compiler targets.
* [ ] Document AIONX.
* [ ] Document runtime inspector.
* [ ] Document executable-ts proof.
* [ ] Clearly separate implemented architecture from future architecture.

### Schema

* [ ] Clarify schema validation as the first gate.
* [ ] Explain what schema validation checks.
* [ ] Explain what semantic validation checks.
* [ ] Mention executable targets still depend on valid IR.

### Runtime

* [ ] Create or update `docs/runtime.md`.
* [ ] Explain current runtime status.
* [ ] Document AIONX generation.
* [ ] Document `aion run` inspection.
* [ ] Document executable-ts as a generated runtime proof.
* [ ] List current runtime limitations.
* [ ] List next runtime steps.

### Executable TypeScript

* [ ] Create or update `docs/executable-ts.md`.
* [ ] Explain purpose of `executable-ts`.
* [ ] Document command usage.
* [ ] Explain generated runtime features.
* [ ] Document supported operations:

  * `invoice.create`
  * `invoice.view_own`
* [ ] Document verified smoke-test behavior.
* [ ] Explain current limitations.

### Codex Skill

* [ ] Create or update `docs/skills/aion-codex-skill.md`.
* [ ] Start with setup and installation.
* [ ] Explain local CLI usage.
* [ ] Explain why `npm run build` is required after source changes.
* [ ] Explain AION-first workflow.
* [ ] Explain rules for Codex.
* [ ] Explain definition of done.
* [ ] Explain current limitations.

### Token Management

* [ ] Add `docs/token-management.md` if included in this sprint.
* [ ] Or explicitly defer token management to a future sprint.

### Sprint Docs

* [ ] Add `docs/sprints/sprint-001-documentation-alignment.md`.
* [ ] Optionally add `docs/sprints/README.md`.

## Acceptance Criteria

* [ ] README explains current AION capabilities clearly.
* [ ] Docs state that AION can now generate executable TypeScript behavior for a vertical slice.
* [ ] Docs clearly state that `aion run` is currently inspector-level.
* [ ] Docs clearly state that `executable-ts` is experimental.
* [ ] Docs clearly state that `executable-ts` is not a full app generator.
* [ ] Runtime docs explain AIONX, run inspection, and executable-ts.
* [ ] Architecture docs include current implemented layers.
* [ ] Codex skill explains how AI agents should work with AION.
* [ ] All generated artifact examples use `--out`.
* [ ] No compiler/runtime behavior changed.
* [ ] `package.json` unchanged.
* [ ] `package-lock.json` unchanged.

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
```

## PR Title

```text
docs: update AION project documentation
```

## PR Summary

```md
## Summary

- Updates documentation to reflect current AION capabilities.
- Documents AIONX generation, AIONX run inspection, `--out` support, and executable-ts.
- Adds runtime documentation.
- Adds executable TypeScript target documentation.
- Adds Codex/AI agent workflow guidance.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build

## Notes

- Documentation-only change.
- No compiler/runtime behavior changed.
- package.json unchanged.
- package-lock.json unchanged.
```

## Out of Scope

* generic guard evaluator
* operation dry-run
* executable-ts refactor
* SQL relationships
* app generation
* runtime adapters