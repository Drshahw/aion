# Sprint 004 — Generalize executable-ts Runtime Target

## Status

Planned

## Type

Compiler target / Runtime generation

## Sprint Goal

Move the `executable-ts` compiler target from a narrow car-rental-specific proof toward a more generic executable runtime generator.

Current proof:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
````

Current limitation:

```text
executable-ts currently supports a narrow car rental invoice slice.
```

Sprint 004 should preserve the working proof while reducing hardcoded behavior and increasing the amount of runtime code derived directly from AION IR.

## Why This Sprint Matters

The current `executable-ts` proof is a major milestone because it proves AION can generate executable behavior, not only static artifacts.

But the generated runtime is still too specific.

This sprint should make `executable-ts` more reusable by moving common runtime concepts into generated generic patterns:

* store shape from entities
* guard checks from AION guards
* audit effects from AION effects
* operation mapping from operation ids
* safe stubs for unsupported operations
* source mapping comments from AION operation ids

This sprint should not try to build a full application generator.

## Current Context

AION currently supports:

* AION JSON IR
* validation
* compile plan
* runtime manifest
* TypeScript target
* SQL target
* Mermaid target
* AIONX target
* AIONX run inspector
* `--out`
* executable-ts vertical slice

Current `executable-ts` generated behavior includes:

* in-memory store
* `resetStore`
* `seedCustomer`
* `seedVehicle`
* `invoiceCreate`
* `invoiceViewOwn`
* audit log entries
* guard checks
* safe stubs for unsupported operations

Verified behavior includes:

* admin can create invoice
* customer cannot create invoice
* negative amount is rejected
* invoice total is calculated
* invoice is stored
* customer can view own invoice
* customer cannot view another customer’s invoice
* audit logs are written

## Scope

Generalize `executable-ts` carefully without breaking the current proof.

This sprint should focus on:

```text
Less hardcoding
More IR-driven generation
Same passing smoke tests
```

## Tasks

### Store Generation

* [ ] Generate in-memory store arrays from AION entities.
* [ ] Keep `auditLogs` support.
* [ ] Generate `resetStore()` based on entity list.
* [ ] Generate seed helpers for entities where practical.
* [ ] Keep current `seedCustomer` and `seedVehicle` behavior.

### Operation Mapping

* [ ] Generate comments mapping runtime functions to AION operation ids.
* [ ] Use stable naming for generated operation functions.
* [ ] Preserve existing exported function names:

  * `invoiceCreate`
  * `invoiceViewOwn`
* [ ] Emit safe unsupported stubs for operations that cannot yet be generated.

### Guard Integration

* [ ] Use Generic Guard Evaluator from Sprint 002 where safe.
* [ ] Preserve existing guard behavior.
* [ ] Do not weaken permission checks.
* [ ] Do not allow unsupported guards to silently pass.

### Effects / Audit

* [ ] Generate audit log helper.
* [ ] Derive audit events from AION effects where possible.
* [ ] Preserve:

  * `audit.log:invoice.create`
  * `audit.log:invoice.view_own`

### Generated Runtime Quality

* [ ] Keep generated code deterministic.
* [ ] Keep generated code readable enough for debugging.
* [ ] Add source mapping comments such as:

```ts
// AION operation: invoice.create
```

* [ ] Avoid external dependencies.
* [ ] Avoid changing runtime behavior unless tests prove it is equivalent.

### Tests / Smoke

* [ ] Keep `compiler:executable-ts:smoke` passing.
* [ ] Add assertions if new generic helpers are introduced.
* [ ] Confirm generated runtime still exports expected functions.
* [ ] Confirm generated runtime still executes invoice behavior correctly.

### Documentation

* [ ] Update `docs/executable-ts.md`.
* [ ] Update `docs/runtime.md` if needed.
* [ ] Clearly state what became more generic.
* [ ] Clearly state what is still vertical-slice/prototype-level.

## Acceptance Criteria

* [ ] `executable-ts` still generates a working runtime for car rental.
* [ ] Existing smoke test passes.
* [ ] Generated store is more entity-driven.
* [ ] Audit behavior remains correct.
* [ ] Guard behavior remains correct.
* [ ] Unsupported operations still fail safely.
* [ ] Generated code includes AION operation mapping comments.
* [ ] No new dependencies are added.
* [ ] `package-lock.json` unchanged unless dependencies changed.
* [ ] Docs still clearly say `executable-ts` is not a full app generator.

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:executable-ts:smoke
npm run runtime:aionx:smoke
npm run out:smoke
```

## Suggested Technical Proof

```text
AION IR
  -> executable-ts compiler
  -> more generic generated runtime structure
  -> same invoice behavior
  -> smoke test passed
```

## PR Title

```text
feat: generalize executable TypeScript runtime target
```

## PR Summary

```md
## Summary

- Generalizes parts of the executable TypeScript runtime target.
- Moves generated runtime structure closer to AION IR-driven behavior.
- Adds operation mapping comments and safer unsupported-operation stubs.
- Preserves existing invoice.create and invoice.view_own behavior.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build
- npm test
- npm run compiler:executable-ts:smoke
- npm run runtime:aionx:smoke
- npm run out:smoke

## Notes

- This is not a full app generator.
- executable-ts remains experimental.
- Current executable proof remains focused on the car rental vertical slice.
- package-lock.json unchanged unless dependencies changed.
```

## Out of Scope

* full app generation
* database adapters
* HTTP/API routes
* UI generation
* generic persistence
* production runtime packaging
* SQL relationships
* test skeleton target