# AION

AION is a contract-first compiler for AI-assisted software development.

It turns human intent into validated behavioral contracts, machine-native execution plans, executable artifacts, and behavior verification reports.

AION is not optimized for humans manually writing or reading generated code.
It is optimized for AI agents to generate, validate, execute, test, and repair software behavior while humans judge the system by outputs, scenarios, traces, and verification reports.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

## What AION Is Today

AION has evolved beyond an "AI-native IR" experiment.

"AI-native IR" is still part of the implementation strategy, but it is not the end goal. Today, AION is better understood as a contract-first compiler for AI-assisted software development:

```text
Human intent
  -> AION behavioral contract
  -> validation
  -> machine-native execution plan
  -> executable artifact
  -> behavioral verification
  -> AI repair loop
  -> trusted software behavior
```

AION should optimize for:

- machine generation
- validation
- execution
- repair
- testing
- tracing
- behavior reports
- low-context and low-token workflows

AION should not optimize primarily for:

- humans manually writing source code
- humans manually debugging generated code
- human readability of internal machine representations

## Current Capabilities

AION currently includes:

- AION JSON IR
- parser
- JSON Schema validation
- semantic validation
- compile plan
- runtime manifest
- CLI
- TypeScript target
- SQL target
- Mermaid graph target
- AIONX native execution plan target
- AIONX run inspection
- `--out` / `-o` output file support
- `executable-ts` target
- self-contained in-memory executable TypeScript generation for the car rental vertical slice

## Current Proof

The current proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

Verified behavior in the current `executable-ts` smoke test:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

## Quick Start

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

The CLI runs from:

```bash
node dist/src/cli.js
```

Do not assume `aion` is globally installed. Prefer:

```bash
node dist/src/cli.js ...
```

or:

```bash
npm run aion -- ...
```

## Car Rental Proof

Validate:

```bash
node dist/src/cli.js validate examples/car-rental-system.aion.json
```

Generate compile plan:

```bash
node dist/src/cli.js plan examples/car-rental-system.aion.json
```

Generate graph:

```bash
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
```

Generate AIONX:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

Run AIONX inspector:

```bash
node dist/src/cli.js run app.aionx.json
```

Generate executable TypeScript:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

Run the executable behavior smoke test:

```bash
npm run compiler:executable-ts:smoke
```

Shortest proof path:

```bash
npm install
npm run build
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
npm run compiler:executable-ts:smoke
```

## Generate Artifacts

TypeScript:

```bash
node dist/src/cli.js compile typescript examples/car-rental-system.aion.json --out generated.ts
```

SQL:

```bash
node dist/src/cli.js compile sql examples/car-rental-system.aion.json --out generated.sql
```

Mermaid:

```bash
node dist/src/cli.js compile mermaid examples/car-rental-system.aion.json --out system.mmd
```

or:

```bash
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
```

AIONX:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

`executable-ts`:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

## Why `--out` Should Be Used

Prefer `--out` or `-o` instead of shell redirect when generating artifacts:

```bash
node dist/src/cli.js compile sql examples/car-rental-system.aion.json --out generated.sql
```

This keeps generated artifacts explicit and avoids shell redirect encoding issues, especially in PowerShell.

## Current Limitations

Current limitations include:

- AIONX run is inspector-level only
- AIONX does not execute business logic yet
- `executable-ts` is experimental and vertical-slice focused
- there is no generic behavioral verification layer yet
- there is no AI repair loop yet
- there is no compact machine-native AIONX yet
- there is no database adapter yet
- there is no full app generator yet
- there is no production runtime yet

## Documentation

- [Vision](docs/vision.md)
- [Architecture](docs/architecture.md)
- [Runtime](docs/runtime.md)
- [Executable TypeScript Target](docs/executable-ts.md)
- [AION Codex Skill](docs/skills/aion-codex-skill.md)
- [Token Management](docs/token-management.md)
- [Roadmap](docs/roadmap.md)
- [Schema](docs/schema.md)

## License

MIT
