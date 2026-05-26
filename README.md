# AION

**AI-native Intermediate Representation for compiling human intent into verified software systems.**

AION is an experimental open-source project exploring a new layer for AI software creation:

```text
Human prompt → AI understanding → AION IR → validation → target code/runtime → tests → deployable software
```

The core idea is simple but radical: the internal language used by AI does **not** need to be pleasant for humans to write. It needs to be precise, compact, verifiable, and compilable.

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

The default command creates `project.aion.json`. AION refuses to overwrite an existing file.

## CLI usage

For human-readable console output, use `npm run aion`:

```bash
npm run aion -- validate examples/car-rental-system.aion.json
npm run aion -- plan examples/car-rental-system.aion.json
npm run aion -- manifest examples/car-rental-system.aion.json
npm run aion -- graph examples/car-rental-system.aion.json
npm run aion -- compile typescript examples/car-rental-system.aion.json
npm run aion -- compile sql examples/car-rental-system.aion.json
npm run aion -- compile mermaid examples/car-rental-system.aion.json
```

When redirecting generated artifacts to files, use `node` directly or `npm run --silent` so npm's script banner is not written into the file:

```bash
node dist/src/cli.js compile typescript examples/car-rental-system.aion.json > generated.ts
node dist/src/cli.js compile sql examples/car-rental-system.aion.json > generated.sql
node dist/src/cli.js graph examples/car-rental-system.aion.json > system.mmd
```

## Graph export

The graph exporter emits a Mermaid flowchart so humans can review system behavior without reading raw AION IR.

```bash
npm run build
node dist/src/cli.js graph examples/car-rental-system.aion.json > system.mmd
```

The graph includes actors, entities, operations, read/write edges, guards, and effects.

## Compiler targets

```bash
node dist/src/cli.js compile typescript examples/car-rental-system.aion.json > generated.ts
node dist/src/cli.js compile sql examples/car-rental-system.aion.json > generated.sql
node dist/src/cli.js compile mermaid examples/car-rental-system.aion.json > system.mmd
```

## JSON Schema

AION v0.1 includes a formal JSON Schema:

```text
schema/aion-0.1.schema.json
```

See `docs/schema.md` for details.

## Library usage

```ts
import {
  parseAionProgram,
  validateAionProgram,
  compileAionProgramToPlan,
  createRuntimeManifest,
  compileToTypeScript,
  compileToSql,
  compileToMermaid
} from "aion-ir";

const program = parseAionProgram(source);
const validation = validateAionProgram(program);
const plan = compileAionProgramToPlan(program);
const manifest = createRuntimeManifest(program);
const typescript = compileToTypeScript(program);
const sql = compileToSql(program);
const mermaid = compileToMermaid(program);
```

## Project thesis

> Code is no longer only written. It can be compiled from intent.

AION explores what sits between intent and software.

## License

MIT
