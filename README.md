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
  compiler/    target artifact compiler stubs
  runtime/     execution-plan/runtime stubs
examples/      sample AION IR files
docs/          project vision and architecture notes
tests/         early validation tests
```

## Quick start

```bash
npm install
npm run typecheck
npm run build
```

## CLI usage

After building the project, run the CLI against any `.aion.json` file:

```bash
npm run aion -- validate examples/car-rental-system.aion.json
npm run aion -- plan examples/car-rental-system.aion.json
npm run aion -- manifest examples/car-rental-system.aion.json
```

Commands:

- `validate`: parse and validate an AION IR file.
- `plan`: validate and generate a compile plan.
- `manifest`: validate and generate a runtime manifest.

## Library usage

```ts
import {
  parseAionProgram,
  validateAionProgram,
  compileAionProgramToPlan,
  createRuntimeManifest
} from "aion-ir";

const program = parseAionProgram(source);
const validation = validateAionProgram(program);

if (!validation.ok) {
  console.log(validation.diagnostics);
}

const plan = compileAionProgramToPlan(program);
const manifest = createRuntimeManifest(program);
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
