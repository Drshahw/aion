# AION

**AI-native Intermediate Representation for compiling human intent into verified software systems.**

AION is an experimental open-source project exploring a new layer for AI software creation:

```text
Human prompt → AI understanding → AION IR → validation → target code/runtime → tests → deployable software
```

The core idea is simple but radical: the internal language used by AI does **not** need to be pleasant for humans to write. It needs to be precise, compact, verifiable, and compilable.

AION is not trying to replace Python, TypeScript, SQL, or Rust. Instead, it aims to become an intermediate representation that AI systems can generate, validate, transform, compile, and explain.

## Why AION?

Most AI coding workflows today jump directly from natural language to source code:

```text
Prompt → Code
```

That shortcut is powerful, but fragile. Important things often remain implicit:

- permissions
- data ownership
- side effects
- invariants
- failure handling
- audit logs
- tests
- runtime constraints

AION inserts a structured intermediate layer:

```text
Prompt → AION IR → Code / Runtime / Tests
```

This makes the system easier to validate before code is generated.

## Current status

AION is at **v0 / research prototype** stage.

The first milestone is not a full programming language. It is a small, typed, JSON-based IR that can describe:

- actors
- entities
- fields
- operations
- inputs and outputs
- guards and permissions
- reads and writes
- effects
- invariants
- tests

## Repository structure

```text
src/
  ir/          TypeScript types for AION IR
  parser/      JSON parser for AION programs
  validator/   structural and semantic validation
  compiler/    target artifact compilers and compile-plan stubs
  runtime/     execution-plan/runtime stubs
schema/        JSON Schema definitions for AION IR
examples/      sample AION IR files
docs/          project vision and architecture notes
tests/         early validation tests
```

## Quick start

```bash
npm install
npm run typecheck
npm run schema:check
npm run build
```

## CLI usage

After building the project, run the CLI against any `.aion.json` file:

```bash
npm run aion -- validate examples/car-rental-system.aion.json
npm run aion -- plan examples/car-rental-system.aion.json
npm run aion -- manifest examples/car-rental-system.aion.json
npm run aion -- compile --target typescript examples/car-rental-system.aion.json
npm run aion -- compile --target sql examples/car-rental-system.aion.json
```

Commands:

- `validate`: parse and validate an AION IR file.
- `plan`: validate and generate a compile plan.
- `manifest`: validate and generate a runtime manifest.
- `compile`: validate and compile AION IR to a target artifact.

## TypeScript compiler target

The first experimental compiler target emits TypeScript interfaces and operation stubs from an AION program.

```bash
npm run build
npm run aion -- compile --target typescript examples/car-rental-system.aion.json > generated.ts
```

The output is intentionally a prototype artifact. It is meant to prove the pipeline:

```text
AION IR → validation → TypeScript artifact
```

## SQL compiler target

The experimental SQL compiler target emits PostgreSQL-compatible DDL from AION entities.

```bash
npm run build
npm run aion -- compile --target sql examples/car-rental-system.aion.json > generated.sql
```

The current target maps AION scalar types to PostgreSQL-style column types and emits `CREATE TABLE IF NOT EXISTS` statements.

## JSON Schema

AION v0.1 includes a formal JSON Schema:

```text
schema/aion-0.1.schema.json
```

Use it as the first validation gate before semantic validation:

```text
Prompt → AI-generated AION JSON → JSON Schema validation → AION semantic validation → compile plan
```

Run the schema check locally:

```bash
npm run schema:check
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
  compileToSql
} from "aion-ir";

const program = parseAionProgram(source);
const validation = validateAionProgram(program);

if (!validation.ok) {
  console.log(validation.diagnostics);
}

const plan = compileAionProgramToPlan(program);
const manifest = createRuntimeManifest(program);
const typescript = compileToTypeScript(program);
const sql = compileToSql(program);
```

## Tiny example

```json
{
  "aion": "0.1",
  "kind": "system",
  "metadata": {
    "name": "hello-aion"
  },
  "actors": [
    { "id": "user", "role": "human" }
  ],
  "entities": [
    {
      "id": "message",
      "fields": [
        { "id": "id", "type": "uuid", "required": true },
        { "id": "body", "type": "string", "required": true }
      ]
    }
  ],
  "operations": [
    {
      "id": "message.create",
      "intent": "Create a message",
      "actor": "user",
      "writes": ["message"],
      "inputs": [
        { "id": "body", "type": "string", "required": true }
      ],
      "outputs": [
        { "id": "message_id", "type": "uuid", "required": true }
      ],
      "guards": ["body.length > 0"],
      "effects": ["audit.log:message.create"],
      "invariants": ["message.body must not be empty"],
      "tests": ["reject empty body"]
    }
  ]
}
```

## Project thesis

> Code is no longer only written. It can be compiled from intent.

AION explores what sits between intent and software.

## License

MIT
