# Sprint 009 — Entity-Driven executable-ts Runtime

## Status

Planned

## Type

Technical sprint for making the generated executable runtime structure IR-driven

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint Goal

Make the `executable-ts` runtime **structure** derive from AION entities instead of being hardcoded to car rental, without meaningfully touching the operation execution flow.

This is the first of two sprints that generalize `executable-ts`:

- Sprint 009 (this one): entity-driven store, reset, seed helpers, and runtime metadata.
- Sprint 010: operation dispatcher, runtime trace, and unsupported-operation handling.

## Why This Sprint Matters

`executable-ts` is the project's most important proof: AION can generate executable behavior from IR. That proof is also fragile. Generalizing it in one large refactor risks breaking the car rental proof, increases review surface, and makes failures hard to localize. Splitting the generalization in two keeps each PR small, keeps every smoke failure easy to debug, and preserves `generated-runtime.ts` self-containment.

## Depends On

- Sprint 002 — Behavioral Verification Layer (guard evaluator abstraction; concepts only — generated runtime must NOT import AION source)

## Design Constraint

- `generated-runtime.ts` must remain **self-contained** (no imports from internal AION source files). The smoke test compiles it standalone in a temp directory.
- Output must remain **deterministic** (no timestamps; prefer omitting `generatedAt`).
- Existing behavior for `invoice.create` / `invoice.view_own` must remain identical and the existing `compiler:executable-ts:smoke` must keep passing.

This sprint reduces hardcoding; it does not eliminate all hardcoding, and it does not change the operation execution flow.

## Current `executable-ts` Behavior (to preserve)

The generated runtime currently supports an in-memory store, `resetStore`, `seedCustomer`, `seedVehicle`, `invoiceCreate`, `invoiceViewOwn`, audit log entries, guard checks, and safe stubs for unsupported operations. Verified behavior: admin can create invoice; customer cannot; negative amount rejected; total calculated; invoice stored; customer can view own invoice; cannot view another's; audit log written.

All of the above must still hold after this sprint.

## Scope

- Generate store arrays from AION entities.
- Generate `resetStore` from the entity list.
- Generate seed helpers from the entity list.
- Add `aionRuntimeMetadata`.
- Keep `invoiceCreate` and `invoiceViewOwn` almost unchanged.
- Keep `generated-runtime.ts` self-contained.
- Keep `compiler:executable-ts:smoke` passing.

## Out of Scope

- `runOperation` dispatcher (Sprint 010)
- `runtimeTrace` (Sprint 010)
- generic execution for all operations
- deep guard integration into execution
- big rewrite of `invoiceCreate` / `invoiceViewOwn`
- database adapters, HTTP/API routes, production runtime, full app generation

## Detailed Requirements

### 1. Entity-Driven Store Generation

Generate store arrays from AION entities instead of hardcoding `customers` / `vehicles` / `invoices`.

To avoid breaking smoke tests, preserve existing store keys via simple pluralization:

- `customer -> customers`
- `vehicle -> vehicles`
- `invoice -> invoices`
- default -> `${entityId}s`

Add a helper if useful:

```ts
toStoreCollectionName(entityId: string): string
```

The generated store must still include `customers`, `vehicles`, `invoices`, and `auditLogs`.

### 2. Generic resetStore

Generate `resetStore` so it clears all entity arrays and `auditLogs` based on the generated store shape.

### 3. Generic Seed Helpers

Generate a seed helper per entity:

- `customer -> seedCustomer`
- `vehicle -> seedVehicle`
- `invoice -> seedInvoice`

Preserve the existing required exports `seedCustomer` and `seedVehicle`. `seedInvoice` may be added; tests can assert it exists.

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

If capabilities are not readily available, omit or derive them from an existing manifest/capability helper. Keep it deterministic.

### 5. Preserve Existing Operation Functions

Generated runtime must still export `invoiceCreate` and `invoiceViewOwn`, with identical behavior.

## Likely Files To Update

- `src/compiler/targets/executable-ts/compileToExecutableTypeScript.ts`

Optionally create helpers only if they keep the compiler cleaner (do not over-engineer):

- `naming.ts`
- `renderStore.ts`

## Smoke Test Updates

Update `scripts/executable-ts-smoke.mjs` to add:

- `aionRuntimeMetadata` exists
- `aionRuntimeMetadata.operations` includes `"invoice.create"`
- `aionRuntimeMetadata.entities` includes `"invoice"`
- `seedInvoice` exists (if generated)

Keep all existing assertions passing:

- `invoiceCreate` direct call
- `invoiceViewOwn` direct call
- permission rejection
- negative amount rejection
- ownership rejection
- audit log assertions

## Documentation

Update lightly:

- `docs/executable-ts.md`
- `docs/runtime.md`
- `docs/roadmap.md`

Mention:

- `executable-ts` is still experimental
- runtime structure is now entity-driven (store / reset / seed / metadata)
- operation execution flow is unchanged (dispatcher and trace come in Sprint 010)
- generated runtime stays self-contained

## Acceptance Criteria

- `executable-ts` still generates a working runtime
- existing `executable-ts` smoke behavior still passes
- generated store is entity-driven
- `resetStore` clears all entity arrays and `auditLogs`
- generated seed helpers exist for entities
- `aionRuntimeMetadata` is exported
- `invoiceCreate` and `invoiceViewOwn` behavior is unchanged
- `generated-runtime.ts` remains self-contained
- no external dependencies added
- `package-lock.json` unchanged unless dependencies changed

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

## PR

### PR Title

```text
feat: make executable-ts runtime structure entity-driven
```

### PR Summary

- generates entity-driven store, `resetStore`, and seed helpers from AION entities
- adds `aionRuntimeMetadata`
- preserves existing `invoiceCreate` / `invoiceViewOwn` behavior
- keeps generated runtime self-contained
- defers dispatcher and trace to Sprint 010
- no dependencies added
