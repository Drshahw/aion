# Sprint 005 - Scenario/Test Generation Target

## Status

Planned

## Type

Technical sprint building on verification, dry-run, and repair analysis

## Goal

Implement Sprint 005 - Scenario/Test Generation Target.

This sprint builds on:

- Sprint 002 - Behavioral Verification Layer
- Sprint 003 - AIONX Operation Dry-Run / Execution
- Sprint 004 - AI Debug & Repair Loop Foundation

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

## Sprint 005 Objective

Add the first scenario and test generation target.

AION already stores operation-level test expectations in the IR.
This sprint should turn those expectations into generated behavior scenarios and executable test scaffolds.

This is not full formal verification.
This is not a full app generator.
This is not production-grade test generation.
This is the first bridge from AION behavioral contract to behavior-oriented tests.

Core idea:

```text
AION operation tests / guards / effects
  -> generated scenarios
  -> generated test scaffold
  -> behavior verification reports
  -> AI repair loop can consume failures
```

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
- Mermaid target
- AIONX target
- AIONX run inspector
- behavioral verification layer
- AIONX operation dry-run
- AI repair analysis foundation
- executable-ts proof
- `--out` support

## Current Proof

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

## New Compile Target

Sprint 005 should add a new compile target:

```text
scenarios
```

Desired command:

```bash
node dist/src/cli.js compile scenarios examples/car-rental-system.aion.json --out scenarios.md
```

Optional second target if simple:

```bash
node dist/src/cli.js compile test-skeleton examples/car-rental-system.aion.json --out generated.test.ts
```

If both are too large, prioritize `scenarios` first and keep `test-skeleton` as a documented future extension.

Recommended target:
Start with `scenarios` because it is human-readable, AI-readable, and directly aligned with behavioral verification.

Generated scenarios should be Markdown.

## Example Output Shape

```text
# Behavior Scenarios: car-rental-billing

## Operation: invoice.create

Intent:
Create an invoice for a rental customer.

Actor:
admin

Reads:
- customer
- vehicle

Writes:
- invoice

Guards:
- actor.role == admin
- rent_amount >= 0
- fines_amount >= 0
- salik_amount >= 0

Effects:
- audit.log:invoice.create

Scenarios:
- reject negative amounts
- calculate total amount
- write audit log

Suggested Given/When/Then:

### Scenario: reject negative amounts
Given an admin actor
And invoice input with a negative amount
When invoice.create is verified
Then behavior verification should fail

### Scenario: calculate total amount
Given an admin actor
And valid invoice input
When invoice.create is executed or simulated
Then total_amount should equal rent_amount + fines_amount + salik_amount

### Scenario: write audit log
Given an admin actor
And valid invoice input
When invoice.create is executed or simulated
Then audit.log:invoice.create should be produced
```

The generated output does not need to perfectly understand every natural-language test.
It should provide deterministic, useful scenario scaffolding from operation metadata.

## Implementation Requirements

### 1. Add compiler target

Create:

```text
src/compiler/targets/scenarios/compileToScenarios.ts
```

Export:

```ts
compileToScenarios(program: AionProgram): string
```

Behavior:

- generate Markdown
- include program name and description if present
- for each operation include:
  - operation id
  - intent
  - actor
  - reads
  - writes
  - guards
  - effects
  - tests
  - generated scenario scaffolds

### 2. Scenario generation rules

Use deterministic rule-based generation.

For each operation test string:

A) If test text contains `reject` or `deny`:

- Given actor or context
- When operation is verified
- Then behavior verification should fail

B) If test text contains `allow`:

- Given valid actor or context
- When operation is verified
- Then behavior verification should pass

C) If test text contains `audit`:

- Given valid operation context
- When operation is executed or simulated
- Then expected audit effect should be produced

D) If test text contains `calculate` or `total`:

- Given valid numeric input
- When operation is executed or simulated
- Then calculated output should match the invariant or expected formula

E) Fallback:

- Given valid context for `<operation>`
- When `<operation>` is verified
- Then expected behavior should match the AION contract

Important:

- keep generation simple and deterministic
- do not call LLMs
- do not use external packages

### 3. Add CLI target

Update:

```text
src/cli.ts
```

Add:

```text
compile scenarios <file>
```

It should support `--out` / `-o` using existing output handling.

Example:

```bash
node dist/src/cli.js compile scenarios examples/car-rental-system.aion.json --out scenarios.md
```

### 4. Public API

Update:

```text
src/index.ts
```

Export:

- `compileToScenarios`

### 5. Smoke test

Create:

```text
scripts/scenarios-smoke.mjs
```

The smoke test should:

- run `node dist/src/cli.js compile scenarios examples/car-rental-system.aion.json --out <tmp>/scenarios.md`
- assert file exists
- assert content includes:
  - `# Behavior Scenarios: car-rental-billing`
  - `Operation: invoice.create`
  - `Operation: invoice.view_own`
  - `actor.role == admin`
  - `audit.log:invoice.create`
  - `reject negative amounts`
  - `calculate total amount`
  - `deny access to another customer invoice`
  - `Given`
  - `When`
  - `Then`

### 6. package.json

Add script:

```json
"compiler:scenarios:smoke": "node scripts/scenarios-smoke.mjs"
```

Do not add dependencies.
Do not modify `package-lock.json` unless dependencies changed.

### 7. CI

Update:

```text
.github/workflows/ci.yml
```

Add:

```yaml
- name: Scenarios compiler smoke
  run: npm run compiler:scenarios:smoke
```

Place it near other compiler smoke tests.

### 8. README.md

Add a concise section:

```text
### Behavior Scenarios

node dist/src/cli.js compile scenarios examples/car-rental-system.aion.json --out scenarios.md
```

Explain:

- scenarios target generates behavior-oriented scenario documentation from AION operations
- useful for human review and AI repair and debug loops
- not full formal test generation yet

### 9. docs/runtime.md

Add or update a section explaining:

- scenario and test generation is part of behavior verification
- scenario output becomes a human and AI trust artifact
- future versions may generate executable tests from scenario definitions

### 10. docs/architecture.md

Mention:

- Scenario/Test Generation Target sits between contract and verification
- it helps AI debug and repair based on behavior, not source-code reading

### 11. docs/roadmap.md

Mark Sprint 005 as scenario and test generation target.

## Acceptance Criteria

- `compile scenarios` works
- `--out` works for scenarios target
- generated scenarios are deterministic Markdown
- output includes operation metadata
- output includes guards and effects
- output includes test expectations
- output includes Given/When/Then scaffolds
- smoke test passes
- existing smoke tests still pass
- no dependencies added
- `package-lock.json` unchanged unless dependencies changed

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:scenarios:smoke
npm run runtime:dry-run:smoke
npm run runtime:aionx:smoke
npm run compiler:executable-ts:smoke
npm run out:smoke
```

## PR Title

```text
feat: add behavior scenarios compiler target
```

## PR Summary

```md
## Summary

- Adds scenarios compiler target.
- Generates behavior-oriented Markdown scenarios from AION operations.
- Includes guards, effects, tests, and Given/When/Then scaffolds.
- Supports --out.
- Adds smoke coverage.
- Prepares future executable test generation and AI repair loop.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build
- npm test
- npm run compiler:scenarios:smoke
- npm run runtime:dry-run:smoke
- npm run runtime:aionx:smoke
- npm run compiler:executable-ts:smoke
- npm run out:smoke

## Notes

- No dependencies added.
```

## Out Of Scope

- full formal verification
- full app generation
- production-grade test generation
- mandatory `test-skeleton` target
- LLM-based scenario generation
- runtime persistence
- database adapters

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true,
  "relation": {
    "entity": "customer",
    "field": "id"
  }
}
```

Alternative compact form may be allowed later:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true,
  "relation": "customer.id"
}
```

For Sprint 005, prefer the explicit object form because it is clearer for validation.

## Example Target

Current invoice fields:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true
}
```

Desired invoice fields:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true,
  "relation": {
    "entity": "customer",
    "field": "id"
  }
}
```

```json
{
  "id": "vehicle_id",
  "type": "uuid",
  "required": true,
  "relation": {
    "entity": "vehicle",
    "field": "id"
  }
}
```

## Tasks

### IR Types

* [ ] Add optional `relation` support to AION field type.
* [ ] Define relation shape:

```ts
relation?: {
  entity: string;
  field: string;
}
```

### JSON Schema

* [ ] Update `schema/aion-0.1.schema.json`.
* [ ] Allow optional `relation` object on fields.
* [ ] Require `relation.entity`.
* [ ] Require `relation.field`.
* [ ] Ensure both are strings.

### Semantic Validator

* [ ] Validate relation target entity exists.
* [ ] Validate relation target field exists.
* [ ] Validate relation source and target field types are compatible.
* [ ] Emit clear diagnostics for unknown relation entity.
* [ ] Emit clear diagnostics for unknown relation field.
* [ ] Emit clear diagnostics for incompatible field types.

### SQL Compiler

* [ ] Generate foreign key constraints from relations.
* [ ] Preserve existing table generation behavior.
* [ ] Add foreign keys to generated SQL.

Expected SQL shape:

```sql
CREATE TABLE IF NOT EXISTS "invoice" (
  "id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "vehicle_id" UUID NOT NULL,
  ...
  PRIMARY KEY ("id"),
  FOREIGN KEY ("customer_id") REFERENCES "customer"("id"),
  FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id")
);
```

### Example Update

* [ ] Update `examples/car-rental-system.aion.json`.
* [ ] Add relation metadata:

  * `invoice.customer_id -> customer.id`
  * `invoice.vehicle_id -> vehicle.id`

### Tests / Smoke

* [ ] Update SQL smoke test.
* [ ] Assert generated SQL includes:

```text
FOREIGN KEY ("customer_id") REFERENCES "customer"("id")
FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id")
```

* [ ] Add validator test for invalid relation entity.
* [ ] Add validator test for invalid relation field.
* [ ] Add validator test for incompatible relation field type if practical.

### Documentation

* [ ] Update `docs/schema.md`.
* [ ] Update `docs/architecture.md` if needed.
* [ ] Add relationship example to docs.
* [ ] Mention that relationships improve generated SQL and future runtime/app generation.

## Acceptance Criteria

* [ ] AION fields can define relation metadata.
* [ ] Schema validation accepts valid relation objects.
* [ ] Semantic validator rejects unknown relation entities.
* [ ] Semantic validator rejects unknown relation fields.
* [ ] SQL compiler generates foreign keys.
* [ ] Car rental example includes invoice relationships.
* [ ] Existing SQL generation still works.
* [ ] Existing TypeScript generation still works.
* [ ] Existing AIONX generation still works.
* [ ] Existing executable-ts smoke test still passes.
* [ ] No dependencies are added.
* [ ] `package-lock.json` unchanged unless dependencies changed.

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:sql:smoke
npm run compiler:typescript:smoke
npm run compiler:graph:smoke
npm run compiler:executable-ts:smoke
npm run runtime:aionx:smoke
npm run out:smoke
```

## Suggested Technical Proof

```text
AION field relation
  -> schema accepts relation shape
  -> semantic validator checks target
  -> SQL compiler emits foreign key
  -> SQL smoke test passed
```

## PR Title

```text
feat: add entity relationships and SQL foreign keys
```

## PR Summary

```md
## Summary

- Adds relation metadata support to AION fields.
- Validates relation targets in the semantic validator.
- Updates the car rental example with invoice relationships.
- Generates SQL foreign key constraints from AION relations.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build
- npm test
- npm run compiler:sql:smoke
- npm run compiler:typescript:smoke
- npm run compiler:graph:smoke
- npm run compiler:executable-ts:smoke
- npm run runtime:aionx:smoke
- npm run out:smoke

## Notes

- No runtime execution changes.
- No database adapter added.
- package-lock.json unchanged unless dependencies changed.
```

## Out of Scope

* database adapter
* migrations engine
* cascade rules
* joins
* query compiler
* ORM generation
* API generation
* app generation
* runtime persistence
