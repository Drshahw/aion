# Sprint 007 - Generalize Executable Behavior

## Status

Planned

## Type

Technical sprint for generalizing executable runtime generation

## Goal

Implement Sprint 007 - Generalize Executable Behavior.

This sprint builds on:

- Sprint 001 - Documentation Alignment & Philosophy
- Sprint 002 - Behavioral Verification Layer
- Sprint 003 - AIONX Operation Dry-Run / Execution
- Sprint 004 - AI Debug & Repair Loop Foundation
- Sprint 005 - Scenario/Test Generation Target
- Sprint 006 - Machine-Native Compact AIONX

## Project Philosophy

AION is not primarily optimized for humans manually reading generated code.
AION is optimized for machine generation, validation, execution, testing, tracing, and repair.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

Humans judge AION output by:

- behavior reports
- scenario results
- guard pass/fail results
- expected vs actual outputs
- effects and audit previews
- smoke tests
- traces

AI agents debug and repair failures based on verification output.

## Sprint 007 Objective

Move executable behavior generation from a narrow hardcoded proof toward a more generic operation-driven generated runtime.

## Current State

The `executable-ts` target proves that AION can generate executable behavior for the car rental vertical slice.

Current proof:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

Current `executable-ts` supports:

- in-memory store
- `resetStore`
- `seedCustomer`
- `seedVehicle`
- `invoiceCreate`
- `invoiceViewOwn`
- audit log entries
- guard checks
- safe stubs for unsupported operations

Current verified behavior:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

Current limitation:
The generated runtime is still too car-rental-specific and invoice-specific.

Sprint 007 should make executable behavior more IR-driven while preserving the existing working proof.

## Important Constraints

- do not attempt full app generation
- do not add database adapters
- do not add HTTP or API routes
- do not build a production runtime
- do not remove the existing car rental proof
- do not break existing smoke tests

This sprint should reduce hardcoding, not eliminate all hardcoding.

## Scope

Generalize `executable-ts` in safe incremental steps:

1. Generate store shape from AION entities.
2. Generate `resetStore` from entities.
3. Generate generic seed helpers for entities.
4. Generate audit log helper from effects.
5. Generate operation function mapping from operation ids.
6. Generate guard enforcement using behavioral verification layer where safe.
7. Preserve existing `invoiceCreate` and `invoiceViewOwn` exports.
8. Emit explicit unsupported-operation stubs for unsupported patterns.
9. Add machine and AI-readable behavior metadata to the generated runtime.

The generated runtime may still contain specialized implementations for:

- `invoice.create`
- `invoice.view_own`

But the surrounding runtime structure should be more generic and derived from AION IR.

## Design Goal

The generated runtime should be less like:

```text
handcrafted invoice runtime
```

and more like:

```text
AION operation runtime scaffold with supported operation implementations
```

Generated runtime should expose metadata such as:

```ts
export const aionRuntimeMetadata = {
  programName: "...",
  operations: [...],
  entities: [...],
  generatedAt: "static-or-omitted-for-determinism",
  target: "executable-ts"
};
```

Keep deterministic output.
Avoid timestamps unless already used. Prefer no `generatedAt` timestamp to keep output stable.

## Likely Files To Update

- `src/compiler/targets/executable-ts/compileToExecutableTypeScript.ts`

Possibly create helper files under:

```text
src/compiler/targets/executable-ts/
```

Suggested helper files:

- `naming.ts`
- `renderStore.ts`
- `renderOperations.ts`
- `renderAudit.ts`

Only create helpers if they keep the compiler cleaner.
Do not over-engineer.

## Detailed Requirements

### 1. Entity-Driven Store Generation

Current generated runtime should not manually hardcode only:

```text
customers
vehicles
invoices
```

Instead, generate store arrays from AION entities.

For the car rental example, generated store should still include:

- `customers`
- `vehicles`
- `invoices`
- `auditLogs`

Rules:

- for each entity id, pluralize simply by adding `s` unless current behavior requires known plural names
- to avoid breaking smoke tests, preserve existing store keys:
  - `customer -> customers`
  - `vehicle -> vehicles`
  - `invoice -> invoices`

Add helper function if needed:

```ts
toStoreCollectionName(entityId: string): string
```

For now:

- `customer -> customers`
- `vehicle -> vehicles`
- `invoice -> invoices`
- default -> `${entityId}s`

### 2. Generic resetStore

Generate `resetStore` so it clears all entity arrays and `auditLogs` based on generated store shape.

### 3. Generic Seed Helpers

Generate seed helper functions for each entity:

- `seedCustomer(customer)`
- `seedVehicle(vehicle)`
- `seedInvoice(invoice)`

But preserve existing required exports:

- `seedCustomer`
- `seedVehicle`

If `seedInvoice` is added, tests can assert it exists, but do not require manual use unless useful.

Naming:

- `customer -> seedCustomer`
- `vehicle -> seedVehicle`
- `invoice -> seedInvoice`

### 4. Runtime Metadata

Generate:

```ts
export const aionRuntimeMetadata = {
  programName: "car-rental-billing",
  version: "0.1.0",
  target: "executable-ts",
  entities: ["customer", "vehicle", "invoice"],
  operations: ["invoice.create", "invoice.view_own"],
  capabilities: [...]
} as const;
```

If capabilities are not readily available, omit or derive using an existing manifest or capability helper.

### 5. Guard Enforcement Integration

If Sprint 002 behavioral verification helpers are available in source, do not import runtime source files from generated output unless `generated-runtime.ts` can compile standalone.

The generated executable runtime should remain self-contained.

Therefore:

- either inline a tiny generated guard checker based on operation guards
- or generate operation-specific guard checks as now
- but structure guard checks around operation metadata

Do not make `generated-runtime.ts` depend on internal AION source files.

The smoke test compiles `generated-runtime.ts` in a temp directory; it must remain self-contained.

### 6. Operation Metadata

Generate internal operation definitions:

```ts
const operationDefinitions = {
  "invoice.create": {
    actor: "admin",
    reads: ["customer", "vehicle"],
    writes: ["invoice"],
    guards: [
      "actor.role == admin",
      "rent_amount >= 0",
      "fines_amount >= 0",
      "salik_amount >= 0"
    ],
    effects: ["audit.log:invoice.create"]
  }
} as const;
```

Use this metadata for:

- audit event selection where possible
- comments
- future guard and report support

### 7. Preserve Existing Operation Functions

Generated runtime must still export:

- `invoiceCreate`
- `invoiceViewOwn`

Existing smoke behavior must remain identical.

### 8. Add a Generic Operation Dispatcher If Safe

Add:

```ts
export function runOperation(operationId: string, actor: Actor, input: Record<string, unknown>): unknown
```

For supported operations:

- `invoice.create -> invoiceCreate(actor, input as InvoiceCreateInput)`
- `invoice.view_own -> invoiceViewOwn(actor, input as InvoiceViewOwnInput)`

For unsupported operations:

- throw clear error: `Unsupported operation: <operationId>`

This is important because it moves toward machine-driven operation execution.

### 9. Safe Unsupported Operation Stubs

For unsupported operations, generated functions or dispatcher branches should fail safely.

Do not silently pass.

### 10. Behavior Report / Trace Hook

Add a simple trace helper:

```ts
export interface RuntimeTraceEvent {
  operationId: string;
  event: string;
  detail?: unknown;
}

export const runtimeTrace: RuntimeTraceEvent[] = [];
```

During `invoiceCreate` and `invoiceViewOwn`:

- push operation start
- push guard failure if failure occurs
- push audit effect written
- push operation success

This does not need to be complex.
It supports future AI debug and repair workflows.

Example trace events:

- `{ operationId: "invoice.create", event: "operation.start" }`
- `{ operationId: "invoice.create", event: "guard.failed", detail: "actor.role == admin" }`
- `{ operationId: "invoice.create", event: "effect.audit", detail: "audit.log:invoice.create" }`
- `{ operationId: "invoice.create", event: "operation.success" }`

`resetStore` should also clear `runtimeTrace`.

### 11. Smoke Test Updates

Update:

```text
scripts/executable-ts-smoke.mjs
```

Add assertions:

- `aionRuntimeMetadata` exists
- `aionRuntimeMetadata.operations` includes `"invoice.create"`
- `aionRuntimeMetadata.entities` includes `"invoice"`
- `seedInvoice` exists if generated
- `runOperation` exists
- `runtimeTrace` exists

Add behavior test:

- call `runOperation("invoice.create", adminActor, invoiceInput)`
- assert invoice created
- assert `runtimeTrace` includes `operation.start` and `operation.success`

Add behavior test:

- call `runOperation("invoice.view_own", customerActor, { invoice_id })`
- assert invoice returned

Add unsupported operation test:

- `runOperation("unknown.operation", actor, {})`
- assert it throws `Unsupported operation`

Keep all existing tests passing:

- `invoiceCreate` direct call
- `invoiceViewOwn` direct call
- permission rejection
- negative amount rejection
- ownership rejection
- audit log assertions

### 12. Public API

If the compiler function is already exported, keep it exported.
No new public API is required unless helper types are intentionally exported.

### 13. Docs

Update:

- `docs/executable-ts.md`
- `docs/runtime.md`
- `docs/roadmap.md`

Mention:

- `executable-ts` is still experimental
- runtime structure is now more operation-driven
- generated runtime includes metadata, dispatcher, trace, and entity-driven store
- it is still not a full app generator
- generalized executable behavior is a bridge between proof target and future runtime execution
- runtime traces support AI repair workflows

### 14. README.md

Only add a short note if needed.
Do not make README too long.

## Acceptance Criteria

- `executable-ts` still generates a working runtime
- existing `executable-ts` smoke behavior still passes
- generated store is entity-driven
- `resetStore` clears all entity arrays, `auditLogs`, and `runtimeTrace`
- generated seed helpers exist for entities
- `aionRuntimeMetadata` is exported
- `operationDefinitions` or equivalent metadata exists internally or is exported if useful
- `runOperation` dispatcher works for `invoice.create` and `invoice.view_own`
- unsupported operation fails safely
- `runtimeTrace` records operation start, success, failure, and effect events
- no external dependencies added
- `generated-runtime.ts` remains self-contained
- `package-lock.json` unchanged unless dependencies changed
- existing AIONX and scenario smoke tests still pass if available

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:executable-ts:smoke
npm run runtime:dry-run:smoke
npm run runtime:aionx:smoke
npm run compiler:scenarios:smoke
npm run compiler:aionx:compact:smoke
npm run out:smoke
```

If some scripts do not exist yet because earlier sprints are not merged, run all available relevant scripts and report which were unavailable.

## PR Title

```text
feat: generalize executable behavior runtime
```

## PR Summary

- makes `executable-ts` runtime structure more IR-driven
- generates entity-driven store and seed helpers
- adds runtime metadata
- adds `runOperation` dispatcher
- adds runtime trace events
- preserves existing invoice behavior
- keeps generated runtime self-contained
- no dependencies added
