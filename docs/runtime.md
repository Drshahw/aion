# AION Runtime

AION runtime work is currently split into three related areas:

- AIONX execution plan generation
- AIONX run inspection
- executable-ts generated runtime proof

AION is not a full runtime executor yet, but the project now has a clear path from validated IR to executable behavior.

## Current status

Current runtime-related capabilities:

1. AION can generate an AIONX native execution plan.
2. AION can inspect an AIONX plan with `aion run`.
3. AION can generate a self-contained executable TypeScript runtime for the car rental vertical slice.
4. AION can run smoke tests against generated executable behavior.

The key proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

## AIONX

AIONX is the current native AION execution plan format.

It is a machine-readable JSON artifact generated from AION IR.

Generate AIONX with:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

Inspect AIONX with:

```bash
node dist/src/cli.js run app.aionx.json
```

## What AIONX contains

AIONX currently includes:

- format
- version
- program metadata
- capabilities
- entities
- operations
- operation actors
- reads
- writes
- inputs
- outputs
- guards
- effects
- invariants
- tests
- execution metadata

Current execution metadata is intentionally deferred and stub-level.

AIONX should be understood as a native execution plan format, not a full executor yet.

## AIONX run inspection

The command:

```bash
node dist/src/cli.js run app.aionx.json
```

currently inspects an AIONX file.

It validates the basic AIONX structure and prints a readable summary:

- program name
- format and version
- entity count
- operation count
- capabilities
- operation ids
- actors
- reads
- writes
- guard counts
- effects

This is useful because it proves the CLI can consume generated AIONX artifacts and reason about their structure.

It does not execute business logic yet.

## executable-ts

`executable-ts` is an experimental compiler target.

It generates a self-contained in-memory TypeScript runtime from AION IR.

Generate it with:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

Run the smoke test with:

```bash
npm run compiler:executable-ts:smoke
```

## Current executable-ts scope

The current generated runtime supports the car rental invoice vertical slice.

Supported operations:

- `invoice.create`
- `invoice.view_own`

Current generated runtime features include:

- in-memory store
- `resetStore`
- `seedCustomer`
- `seedVehicle`
- `invoiceCreate`
- `invoiceViewOwn`
- audit log entries
- guard checks

Unsupported operation patterns are emitted as safe stubs.

## Verified runtime behavior

The executable TypeScript smoke test verifies that generated runtime behavior can execute.

Verified behavior includes:

- generated runtime exports expected functions
- admin can create invoice
- customer cannot create invoice
- negative rent amount is rejected
- invoice total is calculated
- invoice is written to the in-memory store
- customer can view their own invoice
- customer cannot view another customer's invoice
- audit log is written for invoice creation
- audit log is written for invoice viewing

This is the first proof that AION can generate executable behavior from IR.

## Limitations

Current limitations:

- AION is not a full runtime executor yet
- `aion run` is currently inspector-level
- AIONX does not execute business logic yet
- executable-ts is prototype-level
- executable-ts is focused on the car rental vertical slice
- generated runtime is not a full application
- generated runtime has no persistence layer
- no database adapter exists yet
- guard evaluation is not generic yet
- storage and event replay are not implemented yet

## Next runtime steps

Potential next runtime steps:

1. Guard evaluator  
   Evaluate AION guard expressions in a generic runtime.

2. Operation dry-run  
   Simulate operation execution without mutating storage.

3. Generic operation execution  
   Execute operation definitions beyond the current vertical slice.

4. Storage adapters  
   Connect runtime execution to real persistence layers.

5. Audit/event log runtime  
   Turn AION effects into structured runtime events.

6. Deterministic replay  
   Replay events and operations for verification and debugging.

7. Runtime test execution  
   Convert AION test expectations into executable tests.

8. Policy integration  
   Use guards and actor definitions as enforceable runtime policy.

## Runtime direction

The long-term direction is:

```text
AION IR
  -> validation
  -> AIONX
  -> runtime inspector
  -> runtime executor
  -> storage adapter
  -> audit/event log
  -> deterministic replay
```

The current milestone is smaller but important:

```text
AION IR
  -> executable TypeScript runtime
  -> smoke-tested behavior
```