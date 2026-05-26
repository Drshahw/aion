# Sprint 002 — Generic Guard Evaluator

## Status

Planned

## Type

Runtime foundation / Compiler support

## Sprint Goal

Add a generic, safe guard evaluator for simple AION guard expressions.

The goal is to start moving AION away from hardcoded vertical-slice behavior and toward reusable runtime verification.

Current proof:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
````

Current limitation:

```text
Guard behavior is still mostly hardcoded inside executable-ts.
```

Sprint 002 should introduce a reusable evaluator that can understand simple guard expressions from AION IR, such as:

```text
actor.role == admin
rent_amount >= 0
fines_amount >= 0
salik_amount >= 0
invoice.customer_id == actor.customer_id
```

## Why This Sprint Matters

The current `executable-ts` target proves that AION can generate executable behavior for a narrow car rental invoice slice.

That is a major proof, but it is still too specific.

A generic guard evaluator is the next step because guards are central to AION behavior:

* permissions
* ownership rules
* input constraints
* operation safety
* runtime verification
* future policy enforcement

Once guard evaluation becomes generic, future runtime features can use it:

```text
AIONX operation dry-run
generic executable-ts generation
runtime execution
policy checks
test generation
storage adapters
```

This sprint should not build a full runtime yet.

It should build the first reusable guard evaluation foundation.

## Current Context

AION currently supports:

* AION JSON IR
* schema validation
* semantic validation
* compile plan
* runtime manifest
* TypeScript target
* SQL target
* Mermaid target
* AIONX target
* AIONX run inspector
* executable-ts vertical slice
* `--out` support

The current executable TypeScript proof supports:

* `invoice.create`
* `invoice.view_own`

The smoke test verifies:

* admin can create invoice
* customer cannot create invoice
* negative amount is rejected
* customer can view own invoice
* customer cannot view another customer’s invoice
* audit log is written

Sprint 002 should preserve all of this behavior.

## Scope

Build a safe expression evaluator for simple comparison guards.

Supported examples:

```text
actor.role == admin
actor.role != customer
rent_amount >= 0
fines_amount >= 0
salik_amount >= 0
invoice.customer_id == actor.customer_id
```

Supported operators:

```text
==
!=
>=
<=
>
<
```

Supported value types:

```text
number literals
string literals
unquoted string literals
dotted paths
bare input aliases
```

Supported path examples:

```text
actor.role
actor.customer_id
input.rent_amount
input.fines_amount
input.salik_amount
invoice.customer_id
```

Bare aliases should resolve like this:

```text
rent_amount -> context.input.rent_amount, then context.rent_amount
fines_amount -> context.input.fines_amount, then context.fines_amount
salik_amount -> context.input.salik_amount, then context.salik_amount
```

## Out of Scope

This sprint must not implement:

* full expression language
* JavaScript eval
* arbitrary function calls
* boolean `&&` / `||`
* nested expressions
* database execution
* full AIONX runtime execution
* operation dry-run CLI
* full app generation
* generic storage adapter
* production policy engine

Those belong to later sprints.

## Design Rules

### 1. No `eval`

The evaluator must not use:

```ts
eval()
new Function()
```

Guard expressions must be parsed safely.

### 2. Fail safely

Unsupported expressions should not silently pass.

If the evaluator cannot parse or evaluate a guard, it should return a failed evaluation with a useful reason.

Example:

```ts
{
  expression: "unsupported expression",
  passed: false,
  reason: "Unsupported guard expression"
}
```

### 3. Keep output inspectable

Guard results should preserve the original expression.

Example:

```ts
{
  expression: "actor.role == admin",
  passed: true
}
```

### 4. Keep existing behavior stable

The current executable-ts smoke test must still pass.

Existing behavior for `invoice.create` and `invoice.view_own` must not regress.

## Proposed Files

Create:

```text
src/runtime/evaluateGuards.ts
```

Add tests in the existing test structure, or create a focused test file if appropriate.

Possible test file:

```text
src/runtime/evaluateGuards.test.ts
```

or script-level smoke test:

```text
scripts/guard-evaluator-smoke.mjs
```

Prefer unit tests if the repo already uses Vitest.

## Proposed API

```ts
export interface AionGuardEvaluation {
  expression: string;
  passed: boolean;
  reason?: string;
}

export function evaluateGuardExpression(
  expression: string,
  context: Record<string, unknown>
): AionGuardEvaluation;

export function evaluateOperationGuards(
  guards: string[],
  context: Record<string, unknown>
): AionGuardEvaluation[];
```

## Example Contexts

### Admin invoice create context

```json
{
  "actor": {
    "id": "admin-1",
    "role": "admin"
  },
  "input": {
    "rent_amount": 1600,
    "fines_amount": 400,
    "salik_amount": 80
  }
}
```

Expected:

```text
actor.role == admin -> pass
rent_amount >= 0 -> pass
fines_amount >= 0 -> pass
salik_amount >= 0 -> pass
```

### Customer invoice create context

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer"
  },
  "input": {
    "rent_amount": 1600,
    "fines_amount": 400,
    "salik_amount": 80
  }
}
```

Expected:

```text
actor.role == admin -> fail
rent_amount >= 0 -> pass
fines_amount >= 0 -> pass
salik_amount >= 0 -> pass
```

### Customer view own invoice context

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer",
    "customer_id": "cust-001"
  },
  "invoice": {
    "id": "inv-001",
    "customer_id": "cust-001"
  }
}
```

Expected:

```text
invoice.customer_id == actor.customer_id -> pass
```

### Customer view other invoice context

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer",
    "customer_id": "cust-001"
  },
  "invoice": {
    "id": "inv-002",
    "customer_id": "cust-999"
  }
}
```

Expected:

```text
invoice.customer_id == actor.customer_id -> fail
```

## Tasks

### Guard Evaluator

* [ ] Create `src/runtime/evaluateGuards.ts`.
* [ ] Define `AionGuardEvaluation`.
* [ ] Implement `evaluateGuardExpression`.
* [ ] Implement `evaluateOperationGuards`.
* [ ] Support comparison operators:

  * [ ] `==`
  * [ ] `!=`
  * [ ] `>=`
  * [ ] `<=`
  * [ ] `>`
  * [ ] `<`
* [ ] Support dotted path resolution.
* [ ] Support bare input aliases.
* [ ] Support number literals.
* [ ] Support quoted string literals.
* [ ] Support unquoted string literals.
* [ ] Fail safely for unsupported expressions.

### Tests

* [ ] Add tests for passing role guard.
* [ ] Add tests for failing role guard.
* [ ] Add tests for numeric `>=` guards.
* [ ] Add tests for negative amount failure.
* [ ] Add tests for dotted path equality.
* [ ] Add tests for missing path failure.
* [ ] Add tests for unsupported expression failure.
* [ ] Add tests for multiple guard evaluation.

### Public API

* [ ] Export `evaluateGuardExpression`.
* [ ] Export `evaluateOperationGuards`.
* [ ] Export `AionGuardEvaluation`.

### Integration

* [ ] Keep `compiler:executable-ts:smoke` passing.
* [ ] Optionally integrate evaluator into `executable-ts` only where safe.
* [ ] Do not rewrite the whole executable-ts target in this sprint.
* [ ] Do not change generated runtime behavior unless required to preserve existing semantics.

### Documentation

* [ ] Add a short section to `docs/runtime.md` explaining guard evaluator status.
* [ ] Add a note to `docs/architecture.md` if the evaluator becomes part of the runtime layer.
* [ ] Keep docs concise; this sprint is primarily technical.

## Acceptance Criteria

* [ ] Guard evaluator can evaluate simple comparison expressions.
* [ ] Guard evaluator supports actor, input, and entity context values.
* [ ] Guard evaluator supports bare aliases for input values.
* [ ] Guard evaluator rejects unsupported expressions safely.
* [ ] Tests cover passing and failing guard cases.
* [ ] Existing executable-ts smoke test still passes.
* [ ] Existing AIONX run inspector still works.
* [ ] No behavior is invented outside AION IR.
* [ ] No dependencies are added unless absolutely necessary.
* [ ] `package-lock.json` is unchanged unless dependencies changed.

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
AION guard string
  -> safe parsed comparison
  -> context value resolution
  -> runtime boolean result
  -> tests passed
```

## PR Title

```text
feat: add generic guard evaluator
```

## PR Summary

```md
## Summary

- Adds a generic evaluator for simple AION guard expressions.
- Supports comparison-based guards for actor, input, and entity contexts.
- Adds tests for passing, failing, and unsupported guard cases.
- Prepares executable-ts and future AIONX dry-run support to move beyond hardcoded guard logic.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build
- npm test
- npm run compiler:executable-ts:smoke
- npm run runtime:aionx:smoke
- npm run out:smoke

## Notes

- No full runtime execution added yet.
- No operation dry-run CLI added yet.
- No dependencies added.
- package-lock.json unchanged unless dependencies changed.
```

## Out of Scope

* AIONX operation dry-run
* operation-level CLI context
* generic executable-ts rewrite
* storage adapters
* app generation
* SQL relationships
* test skeleton target