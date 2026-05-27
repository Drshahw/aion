# Sprint 002 - Behavioral Verification Layer

## Status

Planned

## Type

First technical sprint after documentation and philosophy alignment

## Goal

Implement Sprint 002 - Behavioral Verification Layer.

This sprint creates a reusable behavioral verification foundation.

It should add a safe guard and scenario verification layer that can evaluate simple AION guard expressions against a runtime context and produce human-readable behavior verification results.

This is not full runtime execution.
This is not a full app generator.
This is not a production policy engine.
This is not a database adapter.

The key question for this sprint is:

```text
Given this operation guard and this context, did the expected behavior pass or fail?
```

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Design Constraint

This sprint must introduce a guard evaluator abstraction.
The initial implementation may support only simple `left operator right` string guards, but the runtime and all future sprints must depend on the abstraction, not directly on the simple parser.

The simple comparison evaluator is a **bridge evaluator, not the final AION guard language**.
(ارزیابی‌گر ساده‌ی `left op right` فقط پل موقت است، نه زبان نهایی Guard در AION.)
Future sprints may add JSONLogic or CEL adapters behind the same interface.

## Sprint 002 Objective

Create a reusable behavioral verification foundation.

The output should be useful for:

- humans reviewing behavior
- AI agents debugging failures
- future AIONX operation dry-run
- future scenario and test generation
- future AI repair loop
- future guard engines (JSONLogic / CEL) without breaking callers

## Research Guidance

Do not invent a large custom expression language.
Keep this sprint intentionally small and safe.

Long-term, AION may adopt JSONLogic or CEL for structured guard expressions.
For this sprint, implement a tiny safe evaluator for the current string guards only as a bridge and foundation.

Do not use `eval()`.
Do not use `new Function()`.
Do not execute arbitrary JavaScript.

## Scope

Add a small behavioral verification layer built on a **pluggable guard evaluation abstraction**:

1. a pluggable guard evaluation layer with:
   - an `AionGuardEvaluator` interface
   - a `SimpleComparisonGuardEvaluator` implementation (the only engine in this sprint)
   - a default evaluator (`defaultGuardEvaluator`) used when no evaluator is passed
   - façade functions (`evaluateGuardExpression`, `evaluateOperationGuards`) that the rest of the system calls — callers must not depend on the simple parser directly
2. simple guard expression evaluation (inside `SimpleComparisonGuardEvaluator`)
3. multiple guard evaluation
4. human-readable verification report formatting
5. tests for pass and fail cases
6. exports from the public API
7. optional short docs update

Naming matters: the simple engine is named `SimpleComparisonGuardEvaluator`, not `AionGuardEvaluator`, so it is never mistaken for the final AION guard language.

## Supported Guard Syntax

The guard syntax for this sprint is:

```text
left operator right
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

Supported values:

- dotted paths such as `actor.role`, `actor.customer_id`, `input.rent_amount`, `invoice.customer_id`
- bare input aliases such as `rent_amount`, `fines_amount`, `salik_amount`
- number literals such as `0`, `1600`, `-1`
- unquoted string literals such as `admin`, `customer`
- quoted string literals such as `"admin"`, `"customer"`

Bare input alias resolution must follow this order:

```text
context.input.rent_amount
context.rent_amount
```

## Example Guards

```text
actor.role == admin
actor.role != customer
rent_amount >= 0
fines_amount >= 0
salik_amount >= 0
invoice.customer_id == actor.customer_id
```

Unsupported expressions should fail safely.

Example unsupported result:

```json
{
  "expression": "actor.role in [admin]",
  "passed": false,
  "reason": "Unsupported guard expression"
}
```

## Required Files

Preferred structure (keeps the abstraction explicit):

```text
src/runtime/guards/types.ts
src/runtime/guards/simpleComparisonEvaluator.ts
src/runtime/guards/evaluateGuards.ts
src/runtime/formatBehaviorReport.ts
src/runtime/guards/evaluateGuards.test.ts
```

If we want to avoid spreading files, a single `src/runtime/evaluateGuards.ts` is acceptable, but it must still expose the same concepts:

```text
AionGuardEvaluator
SimpleComparisonGuardEvaluator
defaultGuardEvaluator
evaluateGuardExpression
evaluateOperationGuards
```

## Required API

### Engine abstraction (`types.ts`)

```ts
export type AionGuardEngineKind =
  | "simple-comparison"
  | "jsonlogic"
  | "cel";

export type AionGuardExpression = string | Record<string, unknown>;

export interface AionGuardEvaluationContext {
  actor?: unknown;
  input?: unknown;
  [key: string]: unknown;
}

export interface AionGuardEvaluation {
  expression: AionGuardExpression;
  expressionText?: string;
  engine: AionGuardEngineKind;
  passed: boolean;
  reason?: string;
  actual?: unknown;
  expected?: unknown;
  operator?: string;
}

export interface AionGuardEvaluator {
  kind: AionGuardEngineKind;
  evaluate(
    expression: AionGuardExpression,
    context: AionGuardEvaluationContext
  ): AionGuardEvaluation;
}
```

Note: `expression` is typed `string | Record<string, unknown>` from day one so JSONLogic/CEL adapters fit later. This sprint's engine only supports the `string` form; object expressions fail safely as unsupported.

### Simple engine (`simpleComparisonEvaluator.ts`)

```ts
export class SimpleComparisonGuardEvaluator implements AionGuardEvaluator {
  kind = "simple-comparison" as const;

  evaluate(
    expression: AionGuardExpression,
    context: AionGuardEvaluationContext
  ): AionGuardEvaluation {
    // only `left op right` string guards; everything else fails safely
  }
}
```

### Façade (`evaluateGuards.ts`)

The rest of the system depends only on these — never on the simple parser directly:

```ts
export const defaultGuardEvaluator: AionGuardEvaluator =
  new SimpleComparisonGuardEvaluator();

export function evaluateGuardExpression(
  expression: AionGuardExpression,
  context: AionGuardEvaluationContext,
  options?: { evaluator?: AionGuardEvaluator }
): AionGuardEvaluation {
  const evaluator = options?.evaluator ?? defaultGuardEvaluator;
  return evaluator.evaluate(expression, context);
}

export function evaluateOperationGuards(
  guards: AionGuardExpression[],
  context: AionGuardEvaluationContext,
  options?: { evaluator?: AionGuardEvaluator }
): AionGuardEvaluation[] {
  return guards.map((guard) =>
    evaluateGuardExpression(guard, context, options)
  );
}
```

Sprints 003, 004, and 007 call this façade, so swapping the engine later does not break them.

`src/runtime/formatBehaviorReport.ts`:

```ts
export interface AionBehaviorVerificationReport {
  title: string;
  passed: boolean;
  guards: AionGuardEvaluation[];
  effects?: string[];
}

export function formatBehaviorVerificationReport(
  report: AionBehaviorVerificationReport
): string;
```

## Expected Report Format

Passing example:

```text
Behavior: invoice.create with admin

Guards:
✅ actor.role == admin
✅ rent_amount >= 0
✅ fines_amount >= 0
✅ salik_amount >= 0

Effects:
- audit.log:invoice.create

Result:
behavior verification passed
```

Failing example:

```text
Behavior: invoice.create with customer

Guards:
❌ actor.role == admin
✅ rent_amount >= 0
✅ fines_amount >= 0
✅ salik_amount >= 0

Effects:
- audit.log:invoice.create

Result:
behavior verification failed
```

This report is the human trust layer.
The human should not need to read generated code to understand whether the behavior passed.

## Tests

Prefer Vitest unit tests because the repo already uses Vitest.

Required test cases:

1. Passing role guard
2. Failing role guard
3. Passing numeric guard with bare alias
4. Failing numeric guard
5. Passing dotted path equality
6. Failing dotted path equality
7. Missing path fails safely
8. Unsupported expression fails safely
9. Multiple guard evaluation
10. Behavior report formatting
11. Object/non-string expression fails safely as unsupported
12. A custom evaluator passed via `options.evaluator` is used instead of the default (proves the abstraction is pluggable)

## Public API

Update:

```text
src/index.ts
```

Export:

- `evaluateGuardExpression`
- `evaluateOperationGuards`
- `formatBehaviorVerificationReport`
- `defaultGuardEvaluator`
- `SimpleComparisonGuardEvaluator`
- `AionGuardEvaluator`
- `AionGuardEngineKind`
- `AionGuardExpression`
- `AionGuardEvaluationContext`
- `AionGuardEvaluation`
- `AionBehaviorVerificationReport`

## Optional Script

If needed, no new script is required if `npm test` already runs Vitest.

A focused smoke script is optional:

```text
scripts/behavior-verification-smoke.mjs
```

Prefer unit tests unless there is a strong reason to add a script.

## Light Documentation Updates

If implementation proceeds, keep documentation changes short:

1. `docs/runtime.md`
2. `docs/architecture.md`
3. `docs/roadmap.md`

Add only the minimal notes needed to explain the new verification layer and Sprint 002 scope.

## Acceptance Criteria

- a pluggable `AionGuardEvaluator` interface exists
- `SimpleComparisonGuardEvaluator` is the only engine and is named as a bridge, not as the AION guard language
- runtime and façade depend on the abstraction, not on the simple parser directly
- `evaluateGuardExpression` / `evaluateOperationGuards` accept an optional `evaluator` and fall back to `defaultGuardEvaluator`
- guard expression type is `string | Record<string, unknown>`; object expressions fail safely as unsupported
- guard evaluator can evaluate simple comparison expressions
- guard evaluator supports actor, input, and entity context values
- guard evaluator supports bare aliases for input values
- guard evaluator rejects unsupported expressions safely
- guard results preserve original expression
- behavior report formatter produces human-readable pass/fail output
- tests cover passing and failing guard cases
- tests cover missing path and unsupported expression cases
- public API exports evaluator and report formatter
- existing `executable-ts` smoke test still passes
- existing AIONX run inspector still works
- no dependencies added
- `package-lock.json` unchanged unless dependencies changed

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

## PR Title

```text
feat: add behavioral verification layer
```

## PR Summary

- adds a pluggable guard evaluator abstraction (`AionGuardEvaluator`)
- adds `SimpleComparisonGuardEvaluator` as the first (bridge) engine
- adds façade (`evaluateGuardExpression` / `evaluateOperationGuards`) so callers never depend on the parser directly
- adds behavior verification report formatting
- adds tests for pass, fail, missing, unsupported, and evaluator-swap cases
- prepares AIONX operation dry-run, AI repair loop, and future JSONLogic/CEL engines
- no full runtime execution added
- no dependencies added

## Out Of Scope

- full runtime execution
- full app generation
- production policy engine
- database adapter
- operation dry-run CLI
- large custom expression language
- full JSONLogic implementation
- full CEL implementation
- boolean composition (`AND` / `OR` / `NOT`)
- nested logical expressions

Constraint: although these engines are out of scope for this sprint, the `AionGuardEvaluator` API must be compatible with future JSONLogic / CEL adapters without changing its callers.
