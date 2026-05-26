# AION

**AI-native Intermediate Representation for compiling human intent into verified and executable software systems.**

AION is an experimental open-source project exploring a new layer for AI software creation:

```text
Human intent
  -> AI interpretation
  -> AION IR
  -> validation
  -> compile plan
  -> target code / execution plan / runtime
  -> tests
  -> software behavior
```

AION is not trying to replace Python, TypeScript, SQL, or Rust.

AION is a contract layer between human intent, AI agents, and generated software. It gives AI systems a structured representation they can generate, validate, transform, compile, inspect, and eventually execute.

## Current capabilities

AION currently supports:

- AION JSON IR
- Parser
- JSON Schema validation
- Semantic validation
- Compile plans
- Runtime manifests
- CLI
- TypeScript target
- SQL target
- Mermaid graph target
- AIONX native execution plan target
- AIONX run inspection
- Executable TypeScript runtime generation for a narrow vertical slice

The most important current proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

This means AION is no longer only generating static artifacts. It can now compile AION IR into executable TypeScript runtime code and verify generated behavior through smoke tests.

## Install and build

```bash
npm install
npm run build
npm run typecheck
npm run schema:check
```

The CLI is available after build at:

```bash
node dist/src/cli.js
```

Do not assume a global `aion` command exists during local development. Prefer:

```bash
node dist/src/cli.js ...
```

## Start a new AION file

```bash
node dist/src/cli.js init project.aion.json
```

This creates a starter AION JSON IR file.

## Run the car rental example

Validate the example:

```bash
node dist/src/cli.js validate examples/car-rental-system.aion.json
```

Generate a compile plan:

```bash
node dist/src/cli.js plan examples/car-rental-system.aion.json
```

Generate a runtime manifest:

```bash
node dist/src/cli.js manifest examples/car-rental-system.aion.json
```

Generate a Mermaid graph:

```bash
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
```

## Compile targets

### TypeScript

```bash
node dist/src/cli.js compile typescript examples/car-rental-system.aion.json --out generated.ts
```

### SQL

```bash
node dist/src/cli.js compile sql examples/car-rental-system.aion.json --out generated.sql
```

### Mermaid

```bash
node dist/src/cli.js compile mermaid examples/car-rental-system.aion.json --out system.mmd
```

You can also use the graph command:

```bash
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
```

### AIONX

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

Inspect the generated AIONX plan:

```bash
node dist/src/cli.js run app.aionx.json
```

### Executable TypeScript

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

Run the executable TypeScript smoke test:

```bash
npm run compiler:executable-ts:smoke
```

## Proof demo

The shortest proof path is:

```bash
npm install
npm run build
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
npm run compiler:executable-ts:smoke
```

This proves that AION can compile IR into generated TypeScript runtime behavior and execute that generated behavior in a smoke test.

Current verified behavior includes:

- admin can create an invoice
- customer cannot create an invoice
- negative invoice amounts are rejected
- customer can view their own invoice
- customer cannot view another customer's invoice
- audit log entries are written

## Important output note

Prefer `--out` or `-o` when generating files:

```bash
node dist/src/cli.js compile sql examples/car-rental-system.aion.json --out generated.sql
```

Avoid shell redirect for generated artifacts, especially on Windows PowerShell, because redirects may introduce encoding issues.

## Current status

AION is currently a compiler-style stack with an early runtime path.

Stable enough to demonstrate:

- IR validation
- semantic checks
- compile plans
- runtime manifests
- static artifact generation
- AIONX execution plan generation
- AIONX inspection
- executable TypeScript proof for a car rental billing slice

Still experimental:

- AIONX is not a full runtime executor yet
- `aion run` currently inspects AIONX plans instead of executing business logic
- `executable-ts` is a prototype-level target
- executable behavior is currently focused on the car rental invoice example
- there is no real database adapter yet
- AION is not a full app generator yet

## Documentation

See:

- [Vision](docs/vision.md)
- [Architecture](docs/architecture.md)
- [Schema](docs/schema.md)
- [Runtime](docs/runtime.md)
- [Executable TypeScript Target](docs/executable-ts.md)
- [AION Codex Skill](docs/skills/aion-codex-skill.md)

## For AI coding agents

See `docs/skills/aion-codex-skill.md`.

## Project thesis

> Code is no longer only written. It can be compiled from intent.

AION explores what sits between intent and software.

## License

MIT
