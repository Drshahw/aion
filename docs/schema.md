# AION JSON Schema

AION v0.1 includes a formal JSON Schema at:

```text
schema/aion-0.1.schema.json
```

The schema defines the structural contract for AION IR programs.

## Purpose

The schema is meant to be used before semantic validation.

Recommended flow:

```text
Prompt -> AI-generated AION JSON -> JSON Schema validation -> AION semantic validator -> compile plan -> target artifacts
```

## What the schema checks

The schema checks structure, required fields, scalar type names, actor roles, and object shapes.

Examples:

- `aion` must be `0.1`
- `kind` must be `system`
- `metadata.name` is required
- at least one actor is required
- at least one operation is required
- field and IO types must be one of the supported scalar types
- unknown top-level properties are rejected

## What the schema does not check

The schema does not fully check cross-reference semantics.

Examples:

- whether an operation actor exists in `actors`
- whether `reads` and `writes` reference existing entities
- whether operation ids are unique
- whether write operations have audit effects

Those checks belong to the AION semantic validator.

## Agent instruction

AI coding agents should treat the schema as the first gate.

An agent should not generate target code from AION until:

1. JSON Schema validation passes
2. AION semantic validation passes
3. A compile plan has been generated

This keeps the agent from jumping directly from natural language into source code.
