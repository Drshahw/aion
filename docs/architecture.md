# AION Architecture

AION is a compiler-style stack for turning human intent into validated, generated, inspectable, and eventually executable software behavior.

The current architecture is:

```text
Human Prompt
  -> AI interpretation
  -> AION IR
  -> JSON Schema validation
  -> Semantic Validator
  -> Compile Plan
  -> Runtime Manifest
  -> Target Compilers
  -> AIONX
  -> Runtime Inspector
  -> Executable Runtime Target
  -> Smoke Tests
```

## 1. Human prompt

AION starts from human intent.

The human describes what the system should do, who can do it, what data exists, what rules apply, and what behavior must be verified.

AION does not require the human to write implementation code directly.

## 2. AI interpretation

An AI agent can translate the human request into AION IR.

The AI should not jump directly from prompt to application code. It should first create or update the AION behavioral contract.

## 3. AION IR

The AION IR is the stable internal shape of an AION program.

Current primitives include:

- metadata
- actors
- entities
- fields
- operations
- inputs
- outputs
- reads
- writes
- guards
- effects
- invariants
- tests

The IR is currently represented as JSON.

## 4. JSON Schema validation

AION includes a formal JSON Schema for v0.1 programs.

Schema validation is the first gate. It checks the structural shape of the IR before semantic validation or target generation.

It verifies things such as:

- AION version
- program kind
- required metadata
- actor shape
- entity shape
- field shape
- operation shape
- allowed scalar types
- allowed actor roles
- unknown top-level properties

Schema validation does not replace semantic validation.

## 5. Semantic validator

The semantic validator checks cross-reference and behavioral issues that JSON Schema cannot fully verify.

It checks issues such as:

- unsupported AION version
- unsupported program kind
- duplicate actor ids
- duplicate entity ids
- duplicate field ids
- duplicate operation ids
- unknown operation actors
- unknown read/write entities
- invalid scalar types
- write operations without audit effects
- operations without guards
- operations without test expectations

The validator produces diagnostics with errors and warnings.

Target generation should not happen until semantic validation passes.

## 6. Compile plan

The compile plan is not final application code.

It is a structured list of generation steps derived from the AION IR. It tells the compiler what categories of artifacts can be produced from the program.

The current compile plan includes steps for:

- schemas
- operations
- guards
- effects
- tests

The compile plan is useful for humans and agents because it makes the compiler's intended work visible before generating target artifacts.

## 7. Runtime manifest

The runtime manifest summarizes executable capabilities inferred from the AION program.

It includes:

- program name
- version
- actors
- entities
- operations
- inferred capabilities

Current inferred capabilities include patterns such as:

- read
- write
- guarded execution
- audit log
- test generation

The manifest helps describe what a future runtime or generated runtime must support.

## 8. Target compilers

AION currently includes multiple compiler/export targets.

### TypeScript target

Generates TypeScript interfaces and operation stubs from AION IR.

Use:

```bash
node dist/src/cli.js compile typescript examples/car-rental-system.aion.json --out generated.ts
```

### SQL target

Generates SQL DDL from AION entities.

Use:

```bash
node dist/src/cli.js compile sql examples/car-rental-system.aion.json --out generated.sql
```

### Mermaid target

Generates a visual behavior graph.

Use:

```bash
node dist/src/cli.js compile mermaid examples/car-rental-system.aion.json --out system.mmd
```

or:

```bash
node dist/src/cli.js graph examples/car-rental-system.aion.json --out system.mmd
```

### AIONX target

Generates a native AION execution plan.

Use:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

### executable-ts target

Generates a self-contained in-memory executable TypeScript runtime for a narrow vertical slice.

Use:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

This target is experimental, but it proves that AION IR can generate executable behavior.

## 9. AIONX native execution plan

AIONX is the current native AION execution plan format.

It is machine-readable and includes:

- format
- version
- program metadata
- capabilities
- entities
- operations
- reads
- writes
- inputs
- outputs
- guards
- effects
- invariants
- tests
- execution metadata

Current AIONX operation execution metadata is intentionally deferred and stub-level.

That means AIONX is currently a plan format, not a full executor.

## 10. Runtime inspector

The CLI command:

```bash
node dist/src/cli.js run app.aionx.json
```

currently inspects an AIONX execution plan.

It validates basic AIONX structure and prints a readable summary, including:

- program name
- format and version
- entity count
- operation count
- capabilities
- operations
- actors
- reads
- writes
- guard counts
- effects

This is not full business logic execution yet.

The current runtime inspector is a bridge toward future runtime execution.

## 11. Executable TypeScript proof

The `executable-ts` target generates a self-contained TypeScript runtime.

Current generated runtime features include:

- in-memory store
- `resetStore`
- `seedCustomer`
- `seedVehicle`
- `invoiceCreate`
- `invoiceViewOwn`
- audit log entries
- guard checks

The current scope is intentionally narrow and focused on the car rental example.

Supported operations:

- `invoice.create`
- `invoice.view_own`

Unsupported operation patterns are generated as safe stubs that throw an error.

This proves that AION can generate executable operation behavior from IR, not only static artifacts.

## 12. Smoke tests

The executable TypeScript smoke test verifies generated runtime behavior.

Run:

```bash
npm run compiler:executable-ts:smoke
```

The smoke test compiles the car rental AION IR into a generated runtime, compiles that runtime, imports it, and executes generated behavior.

Verified behavior includes:

- generated runtime exports expected functions
- admin can create invoice
- invoice total is calculated
- invoice is stored
- audit log is written
- non-admin customer cannot create invoice
- negative amount is rejected
- customer can view own invoice
- customer cannot view another customer's invoice
- invoice view audit log is written

## Current architecture summary

```text
AION JSON IR
  -> parse
  -> schema validation
  -> semantic validation
  -> compile plan
  -> runtime manifest
  -> target artifacts
      -> TypeScript
      -> SQL
      -> Mermaid
      -> AIONX
      -> executable-ts
  -> inspection / smoke tests
```

## Current limitations

AION is still experimental.

Current limitations:

- AIONX run is inspector-level only
- AIONX does not execute business logic yet
- executable-ts is prototype-level
- executable-ts currently supports a narrow car rental invoice slice
- no real database adapter exists yet
- no generic full application generator exists yet
- guard evaluation is not generic yet
- persistence is not implemented in the generated runtime

## Future runtime architecture

Future runtime work may add:

- generic guard evaluator
- operation dry-run
- generic operation execution
- storage adapters
- audit/event log runtime
- deterministic replay
- policy evaluation
- generated test execution
- adapter-based app integration

The intended direction is:

```text
AION IR
  -> AIONX
  -> runtime executor
  -> storage adapter
  -> audit/event log
  -> deterministic replay
  -> verified behavior
```