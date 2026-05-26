# Sprint 003 — AIONX Operation Dry-Run

## Status

Planned

## Type

Runtime / CLI

## Sprint Goal

Add operation-level dry-run support to `aion run`.

The goal is to move AIONX from system-level inspection toward operation-level runtime verification.

Current behavior:

```bash
node dist/src/cli.js run app.aionx.json
````

This prints a summary of the AIONX execution plan.

Desired new behavior:

```bash
node dist/src/cli.js run app.aionx.json --operation invoice.create --context examples/contexts/admin-invoice-create.json
```

This should evaluate the selected operation’s guards against a provided context and print whether the dry-run passed or failed.

## Why This Sprint Matters

AION currently can inspect AIONX plans, but it cannot yet answer:

```text
Can this actor execute this operation with this input/context?
```

Sprint 003 should add that missing bridge.

This is not full execution yet. It should not write to a database, mutate storage, or perform real effects.

It should only:

```text
AIONX operation
  -> context JSON
  -> guard evaluation
  -> effects preview
  -> dry-run pass/fail result
```

## Current Context

AION currently supports:

* AION IR
* validation
* compile plan
* runtime manifest
* AIONX target
* AIONX run inspector
* executable-ts proof
* `--out` support

Sprint 002 is expected to add:

* Generic Guard Evaluator
* safe comparison evaluation
* support for actor/input/entity paths

Sprint 003 should use that evaluator.

## Scope

Add operation-level dry-run mode to:

```bash
node dist/src/cli.js run <file.aionx.json>
```

New supported flags:

```bash
--operation <operation-id>
--context <context.json>
```

Optional short forms:

```bash
-op <operation-id>
-c <context.json>
```

Example:

```bash
node dist/src/cli.js run app.aionx.json --operation invoice.create --context examples/contexts/admin-invoice-create.json
```

## Expected Output — Passing Case

```text
Operation: invoice.create
Actor: admin

Guards:
✅ actor.role == admin
✅ rent_amount >= 0
✅ fines_amount >= 0
✅ salik_amount >= 0

Effects:
- audit.log:invoice.create

Result:
dry-run passed
```

## Expected Output — Failing Case

```text
Operation: invoice.create
Actor: admin

Guards:
❌ actor.role == admin
✅ rent_amount >= 0
✅ fines_amount >= 0
✅ salik_amount >= 0

Effects:
- audit.log:invoice.create

Result:
dry-run failed
```

## Supported Example Operations

Use the current car rental example.

Operations:

```text
invoice.create
invoice.view_own
```

## Example Context Files

Create:

```text
examples/contexts/admin-invoice-create.json
examples/contexts/customer-invoice-create-denied.json
examples/contexts/customer-view-own-invoice.json
examples/contexts/customer-view-other-invoice-denied.json
```

### `admin-invoice-create.json`

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

Expected result:

```text
dry-run passed
```

### `customer-invoice-create-denied.json`

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

Expected result:

```text
dry-run failed
```

### `customer-view-own-invoice.json`

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

Expected result:

```text
dry-run passed
```

### `customer-view-other-invoice-denied.json`

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

Expected result:

```text
dry-run failed
```

## Tasks

### Runtime Dry-Run

* [ ] Create operation dry-run helper.
* [ ] Read AIONX file.
* [ ] Validate basic AIONX format.
* [ ] Find operation by id.
* [ ] Load context JSON.
* [ ] Evaluate operation guards using Generic Guard Evaluator.
* [ ] Collect effects.
* [ ] Return pass/fail result.

### CLI

* [ ] Extend `run` command with `--operation`.
* [ ] Extend `run` command with `--context`.
* [ ] Support `-op` alias if practical.
* [ ] Support `-c` alias if practical.
* [ ] Keep existing `aion run app.aionx.json` inspector behavior unchanged.
* [ ] If `--operation` is provided without `--context`, fail clearly.
* [ ] If operation does not exist, fail clearly.
* [ ] If context JSON is invalid, fail clearly.

### Example Contexts

* [ ] Add admin invoice create context.
* [ ] Add customer invoice create denied context.
* [ ] Add customer view own invoice context.
* [ ] Add customer view other invoice denied context.

### Tests / Smoke

* [ ] Add dry-run smoke script.
* [ ] Compile AIONX from car rental example.
* [ ] Run passing `invoice.create` dry-run.
* [ ] Run failing `invoice.create` dry-run.
* [ ] Run passing `invoice.view_own` dry-run.
* [ ] Run failing `invoice.view_own` dry-run.
* [ ] Assert output includes guard expressions.
* [ ] Assert output includes `dry-run passed` or `dry-run failed`.

### Public API

* [ ] Export operation dry-run helper if appropriate.
* [ ] Export dry-run result types if appropriate.

### Documentation

* [ ] Update `docs/runtime.md`.
* [ ] Update README only if needed.
* [ ] Document that dry-run evaluates guards only.
* [ ] Document that dry-run does not execute writes or effects.

## Proposed Files

```text
src/runtime/dryRunAionOperation.ts
scripts/dry-run-aionx-smoke.mjs
examples/contexts/admin-invoice-create.json
examples/contexts/customer-invoice-create-denied.json
examples/contexts/customer-view-own-invoice.json
examples/contexts/customer-view-other-invoice-denied.json
```

Potentially updated:

```text
src/cli.ts
src/index.ts
package.json
.github/workflows/ci.yml
README.md
docs/runtime.md
```

## Acceptance Criteria

* [ ] `aion run app.aionx.json` still works as inspector.
* [ ] `aion run app.aionx.json --operation invoice.create --context ...` works.
* [ ] Passing contexts return `dry-run passed`.
* [ ] Failing contexts return `dry-run failed`.
* [ ] Guard expressions are printed with pass/fail status.
* [ ] Effects are printed but not executed.
* [ ] Missing operation returns clear error.
* [ ] Missing context returns clear error.
* [ ] Invalid context JSON returns clear error.
* [ ] No database writes happen.
* [ ] No business logic execution happens beyond guard evaluation.
* [ ] Existing executable-ts smoke test still passes.
* [ ] Existing AIONX run inspector smoke test still passes.
* [ ] `package-lock.json` unchanged unless dependencies changed.

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run runtime:aionx:smoke
npm run out:smoke
npm run compiler:executable-ts:smoke
npm run runtime:dry-run:smoke
```

## Suggested Technical Proof

```text
AIONX operation
  -> context JSON
  -> generic guard evaluator
  -> guard pass/fail report
  -> dry-run result
```

## PR Title

```text
feat: add AIONX operation dry-run
```

## PR Summary

```md
## Summary

- Adds operation-level dry-run support to `aion run`.
- Supports `--operation` and `--context` for AIONX files.
- Evaluates operation guards against context JSON.
- Prints guard pass/fail results and effects preview.
- Adds example contexts and smoke coverage.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build
- npm test
- npm run runtime:aionx:smoke
- npm run out:smoke
- npm run compiler:executable-ts:smoke
- npm run runtime:dry-run:smoke

## Notes

- This is not full runtime execution.
- Effects are previewed, not executed.
- No database/storage adapter added.
- package-lock.json unchanged unless dependencies changed.
```

## Out of Scope

* full operation execution
* database writes
* storage adapters
* audit event persistence
* deterministic replay
* generic executable-ts rewrite
* app generation