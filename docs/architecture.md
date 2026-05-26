# AION Architecture

AION starts as a small compiler-style stack.

```text
Human Prompt
  -> AI interpretation
  -> AION IR
  -> Validator
  -> Compile Plan
  -> Target Artifacts
  -> Runtime Manifest
```

## Layers

### 1. IR

The IR defines the stable internal shape of an AION program.

Current primitives:

- metadata
- actors
- entities
- fields
- operations
- inputs
- outputs
- guards
- effects
- invariants
- tests

### 2. Parser

The parser currently accepts JSON text and returns an AION program object.

### 3. Validator

The validator checks structural and semantic issues such as duplicate ids, unknown actors, unknown entities, missing guards, and write operations without audit effects.

### 4. Compile plan

The compile plan is not final code. It is a structured list of artifacts that could be generated from the IR.

### 5. Runtime manifest

The runtime manifest summarizes executable capabilities inferred from the program.

## Near-term targets

- TypeScript type emission
- SQL schema emission
- policy rule emission
- test skeleton emission
- visual graph export
