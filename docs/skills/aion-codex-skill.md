# AION Codex Skill

## 0. Setup and Installation

Codex must first verify the local AION environment before using the repo.

### Fresh clone setup

If working from a fresh clone:

```bash
npm install
npm run build
```

Then verify:

```bash
npm run typecheck
npm run schema:check
```

### Existing repo setup

If dependencies are already installed:

```bash
git pull
npm run build
```

Then verify:

```bash
npm run typecheck
npm run schema:check
```

### Why build matters

- The CLI runs from `dist/src/cli.js`.
- TypeScript source changes are not available to the CLI until `npm run build` is executed.
- After any change to `src/`, Codex must run `npm run build` before testing CLI behavior.

### Do not use global install yet

- AION is currently used locally from the repo.
- Prefer `node dist/src/cli.js ...` or `npm run aion -- ...`.
- Do not assume `aion` is globally installed.

### Clean generated file output

- Prefer `--out` / `-o` instead of shell redirect.
- This avoids Windows PowerShell encoding issues.

Examples:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
```

## 1. Purpose

- AION is an AI-native intermediate representation.
- Codex should use AION as a contract before writing application code.
- The goal is to move from prompt to validated behavior to generated artifacts to implementation.

## 2. Core workflow

```text
User request
→ Draft AION IR
→ Validate
→ Generate compile plan
→ Generate graph for human review
→ Compile AIONX
→ Run AIONX inspector
→ Compile executable-ts for proof when applicable
→ Only then implement or extend application code
```

## 3. Required commands

```bash
npm install
npm run build
npm run typecheck
npm run schema:check

node dist/src/cli.js init project.aion.json

node dist/src/cli.js validate project.aion.json
node dist/src/cli.js plan project.aion.json
node dist/src/cli.js manifest project.aion.json

node dist/src/cli.js graph project.aion.json --out system.mmd
node dist/src/cli.js compile sql project.aion.json --out schema.sql
node dist/src/cli.js compile typescript project.aion.json --out generated.ts
node dist/src/cli.js compile aionx project.aion.json --out app.aionx.json
node dist/src/cli.js run app.aionx.json

node dist/src/cli.js compile executable-ts project.aion.json --out generated-runtime.ts
```

## 4. Rules for Codex

- Do not write app code before AION validation passes.
- Do not invent actors, entities, or permissions outside AION without updating the IR.
- If implementation requires a new rule, update AION first.
- If generated code and AION disagree, AION is the source of truth.
- Keep PRs small and target one capability at a time.
- Prefer smoke tests that execute generated artifacts.
- Do not add dependencies unless necessary.
- Do not modify package-lock.json unless dependencies changed.

## 5. When creating a new project

A) Start with:

```bash
node dist/src/cli.js init app.aion.json
```

B) Replace the starter IR with the user's domain:

- metadata
- actors
- entities
- operations
- inputs
- outputs
- guards
- effects
- invariants
- tests

C) Run:

```bash
node dist/src/cli.js validate app.aion.json
node dist/src/cli.js plan app.aion.json
node dist/src/cli.js graph app.aion.json --out system.mmd
node dist/src/cli.js compile aionx app.aion.json --out app.aionx.json
node dist/src/cli.js run app.aionx.json
```

D) If the system has a supported executable slice, run:

```bash
node dist/src/cli.js compile executable-ts app.aion.json --out generated-runtime.ts
```

## 6. When modifying an existing project

- locate the related AION operation/entity
- update AION IR first
- validate
- regenerate affected artifacts
- run relevant smoke tests
- then patch implementation code

## 7. Definition of done

A Codex task using AION is done only when:

- AION validates
- compile plan succeeds
- relevant artifacts are generated with `--out`
- generated graph or run inspector output is checked
- tests or smoke tests pass
- PR summary explains which AION operations/entities changed

## 8. Current limitations

- executable-ts is currently an experimental vertical-slice target
- it is not a full app generator yet
- AIONX run is currently an inspector, not a full runtime executor
- app-level generation is still future work
- some targets are prototype-level

## 9. Example: mini support ticket system

Example prompt:

```text
Build a mini support ticket system where customers create tickets,
agents reply, customers can only view their own tickets,
admins can view all tickets, and all writes create audit logs.
```

Codex should first produce AION IR with:

- actors: customer, agent, admin
- entities: customer, ticket, reply, audit_log
- operations: ticket.create, ticket.view_own, reply.create, ticket.view_all
- guards and effects

## 10. Final guidance

AION is the behavioral contract.
Codex is the implementer.
If behavior is unclear, clarify or update AION before writing code.
