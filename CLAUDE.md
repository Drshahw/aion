# CLAUDE.md

Guidance for Claude Code when working in the AION repository.

## What AION Is

AION is a **contract-first compiler for AI-assisted software development**. It turns human intent into a validated behavioral contract (AION JSON IR), then lowers that contract into machine-native execution plans and executable artifacts that can be verified.

**Human-readable source code is not the trust boundary. Behavioral verification is the trust boundary.** Optimize for machine generation, validation, execution, repair, testing, and low-token workflows — not for hand-written or hand-read source.

## The Pipeline

```text
Human intent
  -> AION JSON IR (behavioral contract)
  -> schema validation + semantic validation
  -> compile plan + runtime manifest
  -> target generation (typescript | sql | mermaid | aionx | executable-ts)
  -> AIONX inspection
  -> executable behavior smoke test
```

Current proof: `AION IR -> executable TypeScript runtime -> executed behavior smoke test passed` (car rental vertical slice in [examples/car-rental-system.aion.json](examples/car-rental-system.aion.json)).

## Setup & Build

```bash
npm install          # first time
npm run build        # tsc -> dist/ (REQUIRED after any change under src/)
npm run typecheck    # tsc --noEmit
npm run schema:check # validate JSON Schema
```

The CLI runs from `dist/src/cli.js`. **Do not assume `aion` is globally installed.** Use:

```bash
node dist/src/cli.js ...   # or: npm run aion -- ...
```

Always `npm run build` before testing CLI behavior — the CLI executes compiled `dist/`, not `src/`.

## Core CLI Commands

```bash
node dist/src/cli.js init [file.aion.json]                          # starter IR
node dist/src/cli.js validate <file.aion.json>                      # parse + validate
node dist/src/cli.js plan <file.aion.json>                          # compile plan
node dist/src/cli.js manifest <file.aion.json>                      # runtime manifest
node dist/src/cli.js graph <file.aion.json> --out system.mmd        # Mermaid
node dist/src/cli.js compile aionx <file.aion.json> --out app.aionx.json
node dist/src/cli.js run app.aionx.json                             # AIONX inspector
node dist/src/cli.js compile executable-ts <file.aion.json> --out generated-runtime.ts
node dist/src/cli.js compile typescript|sql|mermaid <file.aion.json> --out ...
```

Prefer `--out` / `-o` over shell redirect when generating artifacts (avoids PowerShell encoding issues — this is a Windows dev environment).

## Required Workflow

```text
User request
-> Draft or update AION IR
-> Validate
-> Generate compile plan
-> Generate graph
-> Compile AIONX
-> Run AIONX inspector
-> Compile executable-ts when applicable
-> Run smoke tests
-> Only then implement or extend application code
```

Make behavior explicit in AION **before** patching implementation code.

## Code Layout

- `src/ir/types.ts` — the AION IR type definitions (Program, Actor, Entity, Operation, etc.). Source of truth for the contract shape.
- `src/parser/` — parse raw JSON into `AionProgram`.
- `src/validator/validateAionProgram.ts` — semantic validation; emits `error`/`warning` diagnostics with stable codes.
- `src/compiler/compileAionProgramToPlan.ts` — compile plan.
- `src/compiler/targets/{typescript,sql,graph,aionx,executable-ts}/` — one target per directory.
- `src/runtime/` — runtime manifest + AIONX inspection.
- `src/cli.ts` — CLI entry; commands and `--out`/`--target` flag handling.
- `schema/aion-0.1.schema.json` — JSON Schema for the IR.
- `scripts/*.mjs` — smoke tests (run against compiled `dist/`).
- `docs/` — vision, architecture, runtime, roadmap, sprints, codex skill.

## Conventions

- TypeScript ESM (`"type": "module"`), `NodeNext` resolution — **relative imports use `.js` extension** even for `.ts` files.
- `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` are on. Honor them.
- Validation diagnostics use stable `code` constants (e.g. `OPERATION_ACTOR_UNKNOWN`) and a `path` — match that style when adding checks.
- Tests use Vitest (`npm test`); behavior is proven via smoke scripts that execute generated artifacts.

## Rules

- Do not write app code before AION validation passes.
- Do not invent actors, entities, permissions, guards, or effects outside AION without updating the IR. If generated code and AION disagree, **AION is the source of truth**.
- Keep PRs small — one capability at a time.
- Prefer smoke tests that execute generated artifacts over source inspection.
- Do not add dependencies unless necessary. Do not modify `package-lock.json` unless dependencies changed.
- In documentation-only PRs, do not change compiler/runtime behavior.

## Debugging — Order of Evidence

1. validation diagnostics
2. compile plan output
3. graph output
4. AIONX inspection output
5. smoke test output
6. scenario / behavior reports
7. generated source inspection (only when needed)

## Definition of Done

- AION validates and the compile plan succeeds.
- Relevant artifacts generated with `--out`.
- Generated graph or AIONX run output checked.
- Relevant tests / smoke tests pass (`npm run typecheck`, `npm run build`, `npm run schema:check`, plus the relevant `compiler:*:smoke`).
- PR summary explains which AION operations or entities changed.

## Current Limitations

- AIONX run is inspector-level only; it does not execute business logic yet.
- `executable-ts` is experimental and vertical-slice focused.
- No generic behavioral verification layer, no AI repair loop, no compact machine-native AIONX, no database adapter, no full app generator, no production runtime yet.

See [docs/roadmap.md](docs/roadmap.md) for the sprint sequence toward these.

## Sprint Docs Convention

- Sprint docs live in [docs/sprints/](docs/sprints/), one file per sprint, following the template in [docs/sprints/README.md](docs/sprints/README.md).
- **Sprint numbers are stable IDs, not schedule positions.** Never renumber/rename an existing sprint file. To insert a sprint, use the next unused number and add it to the "Execution Order" list in `docs/roadmap.md`. To reorder, edit only that list.
- Don't copy project philosophy or current-state into sprint docs — link to the canonical docs and keep each sprint scoped to its own work.
