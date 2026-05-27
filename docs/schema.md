# AION JSON Schema

AION v0.1 includes a formal JSON Schema at:

```text
schema/aion-0.1.schema.json
```

The schema defines the structural contract for AION IR programs.

## Purpose

The schema is the first validation gate before semantic validation, compile plans, target generation, and executable runtime generation.

Recommended flow:

```text
Prompt
  -> AI-generated AION JSON
  -> JSON Schema validation
  -> AION semantic validator
  -> compile plan
  -> runtime manifest
  -> target artifacts or executable targets
```

The schema helps prevent invalid IR shapes from reaching deeper compiler or runtime layers.

## What the schema checks

The schema checks structure, required fields, scalar type names, actor roles, and object shapes.

Examples:

- `aion` must be `0.1`
- `kind` must be `system`
- `metadata.name` is required
- at least one actor is required
- at least one operation is required
- actor role must be one of the supported roles
- field and IO types must be supported scalar types
- entities must define fields
- operations must define `id`, `intent`, and `actor`
- unknown top-level properties are rejected
- unknown object properties are rejected in defined structures

## Supported scalar types

AION v0.1 supports:

- `string`
- `number`
- `integer`
- `boolean`
- `uuid`
- `datetime`
- `json`

## Supported actor roles

AION v0.1 supports:

- `human`
- `agent`
- `system`
- `service`

## What the schema does not check

The schema does not fully check cross-reference semantics.

Examples:

- whether an operation actor exists in `actors`
- whether `reads` and `writes` reference existing entities
- whether operation ids are unique
- whether actor ids are unique
- whether entity ids are unique
- whether field ids are unique inside an entity
- whether write operations have audit effects
- whether operations define guards
- whether operations define test expectations

Those checks belong to the AION semantic validator.

## Relationship to semantic validation

Schema validation answers:

```text
Is this shaped like a valid AION v0.1 program?
```

Semantic validation answers:

```text
Does this AION program make sense as a behavioral contract?
```

Both are required.

An AION file should not be compiled into target artifacts or executable runtime code until:

1. JSON Schema validation passes
2. AION semantic validation passes
3. A compile plan can be generated

## Relationship to executable targets

Executable targets such as `executable-ts` still depend on schema validation.

Even when the final output is executable runtime code, schema validation remains the first gate. It ensures the source IR has a predictable shape before the compiler attempts to generate behavior.

The executable path should be treated as:

```text
AION JSON
  -> JSON Schema validation
  -> semantic validation
  -> executable target generation
  -> smoke test
```

## Agent instruction

AI coding agents should treat the schema as the first gate.

An agent should not generate target code, runtime code, or application implementation from AION until:

1. JSON Schema validation passes
2. AION semantic validation passes
3. A compile plan has been generated

This keeps the agent from jumping directly from natural language into source code.

## Practical command

Run:

```bash
npm run schema:check
```

For a full local check, run:

```bash
npm run build
npm run typecheck
npm run schema:check
```