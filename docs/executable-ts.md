# Executable TypeScript Target

`executable-ts` is an experimental proof target.

Its purpose is to prove behavior generation, not to produce final human-written application code.
The generated code does not need to be the final developer-facing abstraction.
Success is measured by behavior passing tests and scenarios.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

## Purpose

The purpose of `executable-ts` is to prove this path:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

This makes `executable-ts` a proof artifact and runtime direction signal, not a promise of final production code shape.

## Commands

Generate the runtime:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

Run the smoke test:

```bash
npm run compiler:executable-ts:smoke
```

## Current Proof Scope

The current proof is intentionally narrow and focused on the car rental vertical slice.

Supported operations:

- `invoice.create`
- `invoice.view_own`

Generated runtime features currently include:

- in-memory store
- audit log store
- `resetStore`
- `seedCustomer`
- `seedVehicle`
- `invoiceCreate`
- `invoiceViewOwn`
- guard checks
- audit log entries
- safe stubs for unsupported operations

## Verified Behavior

The current smoke test verifies:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

This is the important proof. The generated artifact is useful because the behavior executes and verifies, not because the generated source is ideal for manual maintenance.

## How To Evaluate Success

Success for `executable-ts` should be evaluated by:

- behavior passes
- guards are enforced
- outputs are correct
- effects are produced
- smoke scenarios remain green

Not by:

- whether humans want to manually maintain the generated code
- whether the generated code is the final abstraction layer
- whether internal machine-oriented structure looks familiar to application developers

## Role in the AION Stack

`executable-ts` currently serves as:

- proof that AION can lower behavior into executable artifacts
- a testing target
- a runtime direction milestone
- a useful artifact for AI debugging and repair loops

If behavior fails, AI can patch:

- the AION contract
- the compiler target
- the generated artifact
- the verification path

The human should review behavior outputs, not depend on source-level trust.

## Current Limitations

Current limitations include:

- experimental implementation
- vertical-slice focus
- no generic behavioral verification layer yet
- no generic guard evaluator yet
- no database adapter
- no production runtime packaging
- not a full application generator

## Recommended Workflow

```bash
npm run build
npm run typecheck
npm run schema:check

node dist/src/cli.js validate examples/car-rental-system.aion.json
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
npm run compiler:executable-ts:smoke
```

If generated behavior and AION disagree, AION is the source of truth.
