# Sprint 010 — Operation Dispatcher & Runtime Trace

## Status

Planned

## Type

Technical sprint building on the entity-driven executable runtime

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint Goal

Add operation-driven dispatch and runtime tracing to the generated `executable-ts` runtime, on top of the entity-driven structure from Sprint 009.

This is the second of two sprints that generalize `executable-ts`:

- Sprint 009: entity-driven store, reset, seed helpers, runtime metadata.
- Sprint 010 (this one): operation dispatcher, runtime trace, unsupported-operation handling.

## Why This Sprint Matters

Once the runtime structure is entity-driven and stable (Sprint 009), adding a dispatcher and trace is far safer: it routes to the already-proven `invoiceCreate` / `invoiceViewOwn` functions rather than rewriting them, and the trace gives AI repair workflows machine-readable evidence of what happened during execution. Doing this as a separate, smaller PR keeps the execution-flow change isolated and easy to review.

## Depends On

- Sprint 009 — Entity-Driven executable-ts Runtime

## Design Constraint

- `generated-runtime.ts` must remain **self-contained** and **deterministic**.
- The dispatcher must route to the existing operation functions; it must not rewrite their logic.
- Unsupported operations must fail safely (throw a clear error), never silently pass.
- Existing direct calls (`invoiceCreate`, `invoiceViewOwn`) and all Sprint 009 behavior must keep working.

## Scope

- Add `operationDefinitions` derived from AION operations.
- Add `runOperation(operationId, actor, input)`.
- Route supported operations to existing `invoiceCreate` / `invoiceViewOwn`.
- Add `runtimeTrace`.
- `resetStore` also clears `runtimeTrace`.
- Unsupported operation throws a clear error.
- Existing direct function calls still work.

## Out of Scope

- generic execution for all operations (only `invoice.create` and `invoice.view_own` are routed)
- database adapter
- full AIONX executor
- rewriting generated operation logic
- HTTP/API routes, production runtime, full app generation

## Detailed Requirements

### 1. Operation Metadata

Generate internal operation definitions from AION operations:

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

Use this metadata for audit event selection, comments, and future guard/report support.

### 2. Operation Dispatcher

Add:

```ts
export function runOperation(
  operationId: string,
  actor: Actor,
  input: Record<string, unknown>
): unknown
```

Routing:

- `invoice.create -> invoiceCreate(actor, input as InvoiceCreateInput)`
- `invoice.view_own -> invoiceViewOwn(actor, input as InvoiceViewOwnInput)`
- unsupported -> throw `Unsupported operation: <operationId>`

### 3. Runtime Trace

```ts
export interface RuntimeTraceEvent {
  operationId: string;
  event: string;
  detail?: unknown;
}

export const runtimeTrace: RuntimeTraceEvent[] = [];
```

During `invoiceCreate` and `invoiceViewOwn`, push:

- `operation.start`
- `guard.failed` (with the failed guard as detail) on failure
- `effect.audit` (with the audit effect as detail)
- `operation.success`

`resetStore` must also clear `runtimeTrace`. Keep this simple; it exists to support future AI debug and repair workflows.

## Likely Files To Update

- `src/compiler/targets/executable-ts/compileToExecutableTypeScript.ts`

Optionally:

- `renderOperations.ts`
- `renderAudit.ts`

(only if they keep the compiler cleaner; do not over-engineer)

## Smoke Test Updates

Update `scripts/executable-ts-smoke.mjs` to add:

- `runOperation` exists
- `runtimeTrace` exists
- `runOperation("invoice.create", adminActor, invoiceInput)` creates the invoice and `runtimeTrace` includes `operation.start` and `operation.success`
- `runOperation("invoice.view_own", customerActor, { invoice_id })` returns the invoice
- `runOperation("unknown.operation", actor, {})` throws `Unsupported operation`

Keep all existing assertions (Sprint 009 + original behavior) passing.

## Documentation

Update lightly:

- `docs/executable-ts.md`
- `docs/runtime.md`
- `docs/roadmap.md`

Mention:

- runtime is now operation-driven via a dispatcher
- runtime traces support AI repair workflows
- it is still not a full app generator
- generated runtime stays self-contained

## Acceptance Criteria

- `operationDefinitions` (or equivalent) exists
- `runOperation` dispatcher works for `invoice.create` and `invoice.view_own`
- unsupported operation fails safely with a clear error
- `runtimeTrace` records operation start, success, failure, and effect events
- `resetStore` clears `runtimeTrace`
- existing direct calls and Sprint 009 behavior still pass
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
feat: add operation dispatcher and runtime trace to executable-ts
```

### PR Summary

- adds `operationDefinitions` derived from AION operations
- adds `runOperation` dispatcher routing to existing operation functions
- adds `runtimeTrace` with start / success / guard-failure / effect events
- unsupported operations fail safely
- preserves existing invoice behavior and self-containment
- no dependencies added
