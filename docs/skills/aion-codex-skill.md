# AION Codex Skill

This skill describes how Codex and other AI coding agents should work inside the AION repository.

AION should be treated as the behavioral contract before application code is written or changed.

## Setup

Fresh clone:

```bash
npm install
npm run build
npm run typecheck
npm run schema:check
```

If dependencies are already installed:

```bash
git pull
npm run build
npm run typecheck
npm run schema:check
```

The CLI runs from `dist/src/cli.js`.

After any change under `src/`, run `npm run build` before testing CLI behavior.

Do not assume `aion` is globally installed. Prefer:

```bash
node dist/src/cli.js ...
```

or:

```bash
npm run aion -- ...
```

Prefer `--out` or `-o` instead of shell redirect when generating artifacts.

## Behavioral Contract First

AION is not merely an IR and not primarily a human programming language.
It is the behavioral contract layer for a machine-oriented software generation workflow.

Codex should:

- treat AION as the behavioral contract
- prefer behavior verification over source-code explanation
- use generated reports, tests, smoke output, and scenario results to debug
- patch the AION contract, compiler targets, runtime paths, or generated artifacts based on failing behavior
- avoid assuming human-readable generated code is required for trust
- keep PRs small and validated

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

## Core Workflow

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

The agent should make behavior explicit in AION before patching implementation code.

## Machine-Oriented Workflow

Human asks for behavior.
Codex creates or updates the AION contract.
AION validates.
AION generates execution plan and artifacts.
AION runs behavioral verification.
Codex repairs failures.
Human reviews behavior result.

## Required Commands

```bash
node dist/src/cli.js validate project.aion.json
node dist/src/cli.js plan project.aion.json
node dist/src/cli.js graph project.aion.json --out system.mmd
node dist/src/cli.js compile aionx project.aion.json --out app.aionx.json
node dist/src/cli.js run app.aionx.json
node dist/src/cli.js compile executable-ts project.aion.json --out generated-runtime.ts
```

Validation commands for the repo:

```bash
npm run typecheck
npm run schema:check
npm run build
```

## Debugging Guidance

When behavior fails, prefer this order of evidence:

1. validation diagnostics
2. compile plan output
3. graph output
4. AIONX inspection output
5. smoke test output
6. scenario or behavior reports
7. generated source inspection only when needed

This keeps the workflow aligned with behavior-first trust.

## Rules

- Do not write app code before AION validation passes.
- Do not invent actors, entities, permissions, guards, or effects outside AION without updating the IR.
- If generated code and AION disagree, AION is the source of truth.
- Prefer smoke tests that execute generated artifacts.
- Do not add dependencies unless necessary.
- Do not modify `package-lock.json` unless dependencies changed.
- In documentation-only PRs, do not change compiler/runtime behavior.

## Definition Of Done

A Codex task using AION is done only when:

- AION validates
- compile plan succeeds
- relevant artifacts are generated with `--out`
- generated graph or AIONX run output is checked
- relevant tests or smoke tests pass
- the PR summary explains which AION operations or entities changed

## Current Limitations

- AIONX run is currently inspector-level
- AIONX does not execute business logic yet
- `executable-ts` is currently experimental and vertical-slice focused
- there is no generic behavioral verification layer yet
- there is no AI repair loop yet
- there is no production runtime yet
