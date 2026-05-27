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

## Project Philosophy

AION is not primarily optimized for humans manually reading generated code.
AION is optimized for machine generation, validation, execution, testing, tracing, and repair.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

Humans should judge AION output by:

- behavior reports
- scenario results
- guard pass/fail results
- expected vs actual outputs
- effects and audit previews
- smoke tests
- traces

AI agents should debug and repair failures based on verification output.

## Current Implemented Capabilities

- AION JSON IR
- parser
- JSON Schema validation
- semantic validation
- compile plan
- runtime manifest
- CLI
- TypeScript target
- SQL target
- Mermaid graph target
- AIONX native execution plan target
- AIONX run inspection
- `--out` / `-o` output file support
- `executable-ts` target
- `executable-ts` generates a self-contained in-memory TypeScript runtime for the car rental vertical slice
- smoke test confirms generated runtime behavior executes

## Current Proof

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

Verified behavior in the current `executable-ts` smoke:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

## Sprint 002 Objective

Create a reusable behavioral verification foundation.

The output should be useful for:

- humans reviewing behavior
- AI agents debugging failures
- future AIONX operation dry-run
- future scenario and test generation
- future AI repair loop

## Research Guidance

Do not invent a large custom expression language.
Keep this sprint intentionally small and safe.

Long-term, AION may adopt JSONLogic or CEL for structured guard expressions.
For this sprint, implement a tiny safe evaluator for the current string guards only as a bridge and foundation.

Do not use `eval()`.
Do not use `new Function()`.
Do not execute arbitrary JavaScript.

## Scope

Add a small behavioral verification layer that supports:

1. simple guard expression evaluation
2. multiple guard evaluation
3. human-readable verification report formatting
4. tests for pass and fail cases
5. exports from the public API
6. optional short docs update

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

Create:

```text
src/runtime/evaluateGuards.ts
src/runtime/formatBehaviorReport.ts
src/runtime/evaluateGuards.test.ts
```

## Required API

`src/runtime/evaluateGuards.ts`:

```ts
export interface AionGuardEvaluation {
  expression: string;
  passed: boolean;
  reason?: string;
  actual?: unknown;
  expected?: unknown;
  operator?: string;
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

## Public API

Update:

```text
src/index.ts
```

Export:

- `evaluateGuardExpression`
- `evaluateOperationGuards`
- `formatBehaviorVerificationReport`
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

- adds safe guard evaluator for simple AION guard expressions
- adds behavior verification report formatting
- adds tests for pass, fail, missing, and unsupported guards
- prepares AIONX operation dry-run and AI repair loop
- no full runtime execution added
- no dependencies added

## Out Of Scope

- full runtime execution
- full app generation
- production policy engine
- database adapter
- operation dry-run CLI
- large custom expression language
