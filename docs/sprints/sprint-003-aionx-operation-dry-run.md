# Sprint 003 - AIONX Operation Dry-Run / Execution

## Status

Planned

## Type

Technical sprint building on Sprint 002 behavioral verification

## Goal

Implement Sprint 003 - AIONX Operation Dry-Run / Execution.

This sprint builds on Sprint 002 - Behavioral Verification Layer.

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint 002 Dependency

Sprint 002 should already provide:

- `evaluateGuardExpression`
- `evaluateOperationGuards`
- `formatBehaviorVerificationReport`
- `AionGuardEvaluation`
- `AionBehaviorVerificationReport`

## Sprint 003 Objective

Extend `aion run` so it can dry-run a specific AIONX operation using a provided context JSON file.

Current behavior:

```bash
node dist/src/cli.js run app.aionx.json
```

This inspects the full AIONX plan and prints a summary.

Desired new behavior:

```bash
node dist/src/cli.js run app.aionx.json --operation invoice.create --context examples/contexts/admin-invoice-create.json
```

or:

```bash
node dist/src/cli.js run app.aionx.json -op invoice.create -c examples/contexts/admin-invoice-create.json
```

This should:

- read the AIONX file
- find the requested operation
- read the context JSON
- evaluate the operation guards using the Sprint 002 behavioral verification layer
- preview operation effects
- print a behavior verification report
- return a clear pass/fail result

## Core Constraint

This is not full runtime execution.
This is not database execution.
This is not a storage adapter.
This should not mutate state.
This should not perform effects.
Effects should be previewed only.

This is operation-level behavioral verification from AIONX.

It should answer:

```text
Can this actor/context satisfy this operation's guards?
```

## Expected Output

Passing example:

```text
Behavior: invoice.create

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
Behavior: invoice.create

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

## Scope

Add operation-level dry-run to `run`.

Supported flags:

```text
--operation <operation-id>
-op <operation-id>

--context <context-json-path>
-c <context-json-path>
```

Required behavior:

A) If `run` is called without `--operation`:
Keep existing AIONX inspector behavior unchanged.

B) If `run` is called with `--operation`:
Require `--context`.

C) If context is missing:

```text
AION error: Missing --context for operation dry-run.
```

Exit 1.

D) If operation does not exist:

```text
AION error: Operation not found: <operation-id>
```

Exit 1.

E) If context JSON is invalid:

```text
AION error: <clear JSON parse/read error>
```

Exit 1.

F) If AIONX file is invalid:
Existing AIONX validation behavior should continue to fail clearly.

## Required Files

Create:

```text
src/runtime/dryRunAionOperation.ts
examples/contexts/admin-invoice-create.json
examples/contexts/customer-invoice-create-denied.json
examples/contexts/customer-view-own-invoice.json
examples/contexts/customer-view-other-invoice-denied.json
scripts/dry-run-aionx-smoke.mjs
```

## Suggested Exports

`src/runtime/dryRunAionOperation.ts`:

```ts
export interface AionOperationDryRunResult {
  operationId: string;
  passed: boolean;
  guards: AionGuardEvaluation[];
  effects: string[];
}

export function dryRunAionOperation(
  plan: unknown,
  operationId: string,
  context: Record<string, unknown>
): AionOperationDryRunResult;

export function formatAionOperationDryRun(
  result: AionOperationDryRunResult
): string;
```

## Implementation Notes

- validate that plan is an AIONX object
- require `plan.format === "aionx"`
- require `plan.version === "0.1"`
- require operations array
- find operation by id
- operation guards should come from `operation.guards`
- operation effects should come from `operation.effects`
- use `evaluateOperationGuards` from Sprint 002
- use `formatBehaviorVerificationReport` from Sprint 002 if practical
- passed means all guards passed
- do not execute writes
- do not execute effects
- do not call `parseAionProgram` from the run path

## CLI Updates

Update:

```text
src/cli.ts
```

Add parsing helpers if needed:

- `resolveOperationId(args: string[]): string | undefined`
- `resolveContextPath(args: string[]): string | undefined`

Ensure `resolveFilePath` for run ignores:

- `--operation`
- `-op`
- the value after `--operation` / `-op`
- `--context`
- `-c`
- the value after `--context` / `-c`

Keep existing `run app.aionx.json` behavior unchanged.

## Example Context Files

Create directory:

```text
examples/contexts/
```

Add:

1. `examples/contexts/admin-invoice-create.json`
2. `examples/contexts/customer-invoice-create-denied.json`
3. `examples/contexts/customer-view-own-invoice.json`
4. `examples/contexts/customer-view-other-invoice-denied.json`

### admin-invoice-create.json

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
behavior verification passed
```

### customer-invoice-create-denied.json

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
behavior verification failed
```

### customer-view-own-invoice.json

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
behavior verification passed
```

### customer-view-other-invoice-denied.json

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
behavior verification failed
```

## Smoke Test

Create:

```text
scripts/dry-run-aionx-smoke.mjs
```

The smoke test should:

A) Compile AIONX:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out <tmp>/app.aionx.json
```

B) Run passing `invoice.create` dry-run and assert output includes:

- `Behavior: invoice.create`
- `✅ actor.role == admin`
- `✅ rent_amount >= 0`
- `audit.log:invoice.create`
- `behavior verification passed`

C) Run failing `invoice.create` dry-run and assert output includes:

- `Behavior: invoice.create`
- `❌ actor.role == admin`
- `behavior verification failed`

D) Run passing `invoice.view_own` dry-run and assert output includes:

- `Behavior: invoice.view_own`
- `✅ invoice.customer_id == actor.customer_id`
- `audit.log:invoice.view_own`
- `behavior verification passed`

E) Run failing `invoice.view_own` dry-run and assert output includes:

- `Behavior: invoice.view_own`
- `❌ invoice.customer_id == actor.customer_id`
- `behavior verification failed`

F) Confirm inspector mode still works and assert output includes:

- `Program: car-rental-billing`
- `Format: aionx@0.1`
- `Operations: 2`

## Package Script

Update `package.json`:

```json
"runtime:dry-run:smoke": "node scripts/dry-run-aionx-smoke.mjs"
```

Do not add dependencies.
Do not modify `package-lock.json` unless dependencies changed.

## CI Update

Update:

```text
.github/workflows/ci.yml
```

Add:

```yaml
- name: AIONX dry-run smoke
  run: npm run runtime:dry-run:smoke
```

Place it near other runtime and compiler smoke tests.

## Public API

Update:

```text
src/index.ts
```

Export:

- `dryRunAionOperation`
- `formatAionOperationDryRun`
- `AionOperationDryRunResult`

## Documentation Updates

1. `docs/runtime.md`
2. `docs/architecture.md`
3. `README.md`

Keep README concise.

Document that:

- `aion run` can inspect full AIONX plans
- with `--operation` and `--context`, it can verify one operation's guards
- it produces behavior verification reports
- effects are previewed, not executed
- this is not full runtime execution

Example command:

```bash
node dist/src/cli.js run app.aionx.json --operation invoice.create --context examples/contexts/admin-invoice-create.json
```

## Acceptance Criteria

- `aion run app.aionx.json` still works as inspector
- `aion run app.aionx.json --operation invoice.create --context ...` works
- passing contexts produce `behavior verification passed`
- failing contexts produce `behavior verification failed`
- guard pass/fail lines are printed
- effects are previewed
- no effects are executed
- no database or storage mutation occurs
- missing context fails clearly
- missing operation fails clearly
- invalid JSON fails clearly
- smoke test covers passing and failing cases
- existing `executable-ts` smoke test still passes
- existing AIONX run smoke test still passes
- no dependencies added
- `package-lock.json` unchanged unless dependencies changed

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run runtime:dry-run:smoke
npm run runtime:aionx:smoke
npm run compiler:executable-ts:smoke
npm run out:smoke
```

## PR Title

```text
feat: add AIONX operation dry-run
```

## PR Summary

- adds operation-level dry-run to `aion run`
- supports `--operation` and `--context`
- uses behavioral verification layer to evaluate guards
- previews effects but does not execute them
- adds example contexts and smoke coverage
- keeps inspector mode unchanged
- no full runtime execution added
- no dependencies added

## Out Of Scope

- full runtime execution
- database writes
- storage adapters
- audit event persistence
- deterministic replay
- generic `executable-ts` rewrite
- app generation
