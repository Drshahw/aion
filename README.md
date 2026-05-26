# AION

**AI-native Intermediate Representation for compiling human intent into verified software systems.**

AION is an experimental open-source project exploring a new layer for AI software creation:

```text
Human prompt → AI understanding → AION IR → validation → target code/runtime → tests → deployable software
```

AION is not trying to replace Python, TypeScript, SQL, or Rust. Instead, it aims to become an intermediate representation that AI systems can generate, validate, transform, compile, and explain.

## Quick start

```bash
npm install
npm run typecheck
npm run schema:check
npm run build
```

## Start a new AION file

```bash
npm run aion -- init
npm run aion -- init gym.aion.json
```

## CLI usage

```bash
npm run aion -- validate examples/car-rental-system.aion.json
npm run aion -- plan examples/car-rental-system.aion.json
npm run aion -- manifest examples/car-rental-system.aion.json
npm run aion -- graph examples/car-rental-system.aion.json
npm run aion -- compile typescript examples/car-rental-system.aion.json
npm run aion -- compile sql examples/car-rental-system.aion.json
npm run aion -- compile mermaid examples/car-rental-system.aion.json
npm run aion -- compile aionx examples/car-rental-system.aion.json
npm run aion -- run app.aionx.json
```

For clean generated files, use `node` directly:

```bash
node dist/src/cli.js compile typescript examples/car-rental-system.aion.json --out generated.ts
node dist/src/cli.js compile sql examples/car-rental-system.aion.json --out generated.sql
node dist/src/cli.js compile mermaid examples/car-rental-system.aion.json --out system.mmd
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
node dist/src/cli.js run app.aionx.json
```

Use `--out` or `-o` instead of shell redirect on Windows PowerShell to avoid encoding issues in generated files.

## AIONX native target

AIONX is the first native AION target. It emits a machine-readable execution plan instead of human-oriented source code.

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
node dist/src/cli.js run app.aionx.json
```

`run` is currently an inspector and dry-run runtime. It prints a summary of the compiled AIONX execution plan, but it does not execute business logic yet.

The underlying AIONX artifact is still the first compiled internal plan that a future AION Runtime can interpret, optimize, replay, or execute.

## Existing targets

- TypeScript interfaces and operation stubs
- PostgreSQL-compatible SQL DDL
- Mermaid behavior graph
- AIONX native execution plan

## JSON Schema

AION v0.1 includes a formal JSON Schema at `schema/aion-0.1.schema.json`.

See `docs/schema.md` for details.

## Project thesis

> Code is no longer only written. It can be compiled from intent.

AION explores what sits between intent and software.

## License

MIT
