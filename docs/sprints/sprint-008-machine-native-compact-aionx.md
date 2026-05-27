# Sprint 008 — Machine-Native Compact AIONX

## Status

Planned

## Type

Technical sprint for machine-native plan compaction

## Goal

Implement Sprint 008 - Machine-Native Compact AIONX.

This sprint builds on:

- Sprint 001 - Documentation Alignment & Philosophy
- Sprint 002 - Behavioral Verification Layer
- Sprint 003 - AIONX Operation Dry-Run / Execution
- Sprint 004 - AI Debug & Repair Loop Foundation
- Sprint 005 - Scenario/Test Generation Target

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint 008 Objective

Add the first compact machine-native AIONX format.

Current AIONX is readable JSON and useful for inspection.
That is good for early development.

But AION's long-term direction requires a representation optimized for machines:

- deterministic
- compact
- low-token
- parse-friendly
- stable
- suitable for execution and dry-run
- suitable for AI repair workflows
- not primarily optimized for human readability

This sprint should add a compact AIONX output mode without removing the existing readable AIONX format.

## Commands

Current readable AIONX command:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

Desired new compact command:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --compact --out app.compact.aionx.json
```

or:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --format compact --out app.compact.aionx.json
```

Prefer supporting `--compact` first.
Support `--format compact` only if easy.

## Important Constraints

- do not break existing AIONX output
- do not break `aion run app.aionx.json`
- do not remove readable AIONX
- do not make compact AIONX the default yet

This sprint introduces compact AIONX as an additional machine-oriented target mode.

Current readable AIONX is the human and agent-readable plan.
Compact AIONX is the machine-native low-context plan.

## High-Level Design

Readable AIONX:

```json
{
  "format": "aionx",
  "version": "0.1",
  "program": {
    "name": "car-rental-billing"
  },
  "entities": [],
  "operations": []
}
```

Compact AIONX:

```json
{
  "f": "aionx",
  "v": "0.1",
  "p": ["car-rental-billing", "0.1.0"],
  "c": ["audit-log", "guarded-execution", "read", "test-generation", "write"],
  "e": [
    ["customer", [["id", "uuid", 1], ["full_name", "string", 1], ["phone", "string", 0]]],
    ["vehicle", [["id", "uuid", 1], ["plate_number", "string", 1], ["model", "string", 0]]],
    ["invoice", [["id", "uuid", 1], ["customer_id", "uuid", 1], ["vehicle_id", "uuid", 1]]]
  ],
  "op": [
    [
      "invoice.create",
      "admin",
      ["customer", "vehicle"],
      ["invoice"],
      ["actor.role == admin", "rent_amount >= 0"],
      ["audit.log:invoice.create"]
    ]
  ]
}
```

Suggested compact keys:

- `f` = format
- `v` = version
- `p` = program tuple
- `c` = capabilities
- `e` = entities
- `op` = operations

Entity tuple:

```text
[entityId, fields]
```

Field tuple:

```text
[fieldId, type, requiredFlag]
```

`requiredFlag`:

- `1` = required
- `0` = optional

Operation tuple:

```text
[
  operationId,
  actor,
  reads,
  writes,
  guards,
  effects
]
```

This compact shape does not need to include every readable AIONX field in Sprint 008.
It should include enough for:

- operation identification
- entity and field awareness
- guard verification
- effect preview
- future dry-run and execution

## Minimum Required Compact Content

- format
- version
- program name
- capabilities
- entities and fields
- operations
- operation actor
- reads
- writes
- guards
- effects

## Out Of Scope

- binary encoding
- compression
- bytecode
- VM execution
- changing AION IR
- replacing readable AIONX
- optimizing for absolute minimum bytes
- compact source maps
- full runtime execution

## Required File

Create:

```text
src/compiler/targets/aionx/compileToCompactAionExecutionPlan.ts
```

## Suggested Exports

```ts
export interface CompactAionExecutionPlan {
  f: "aionx";
  v: "0.1";
  p: [string, string?];
  c: string[];
  e: CompactAionEntity[];
  op: CompactAionOperation[];
}

export type CompactAionEntity = [
  id: string,
  fields: CompactAionField[]
];

export type CompactAionField = [
  id: string,
  type: string,
  required: 0 | 1
];

export type CompactAionOperation = [
  id: string,
  actor: string,
  reads: string[],
  writes: string[],
  guards: string[],
  effects: string[]
];

export function compileToCompactAionExecutionPlan(
  program: AionProgram
): CompactAionExecutionPlan;

export function compileToCompactAionExecutionPlanJson(
  program: AionProgram
): string;
```

## Implementation Notes

- use existing capability inference if available
- keep output deterministic
- sort arrays only if existing readable AIONX already sorts or if safe
- preserve program order if that is current behavior
- JSON output should be minified or compact by default
- do not pretty-print compact JSON unless a future flag requires it
- add trailing newline if that is current CLI convention

## CLI Updates

Update:

```text
src/cli.ts
```

Support:

```text
compile aionx <file> --compact
```

Behavior:

- if target is `aionx` and `--compact` is present, emit compact AIONX JSON
- otherwise keep existing readable AIONX behavior
- `--out` should work normally
- existing `compile aionx` command must remain unchanged

Optional:

```text
--format compact
```

Keep implementation simple.

## Public API

Update:

```text
src/index.ts
```

Export:

- `compileToCompactAionExecutionPlan`
- `compileToCompactAionExecutionPlanJson`
- `CompactAionExecutionPlan`
- `CompactAionEntity`
- `CompactAionField`
- `CompactAionOperation`

## Smoke Test

Create:

```text
scripts/compact-aionx-smoke.mjs
```

The test should:

1. Generate compact AIONX:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --compact --out <tmp>/app.compact.aionx.json
```

2. Assert file exists.

3. Parse JSON.

4. Assert:

- `f === "aionx"`
- `v === "0.1"`
- `p[0] === "car-rental-billing"`
- `c` includes `"audit-log"`
- `e` includes `customer`, `vehicle`, `invoice`
- `op` includes `invoice.create`
- `op` includes `invoice.view_own`

5. Compare compact size to readable AIONX.

Generate readable AIONX:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out <tmp>/app.aionx.json
```

Assert:

- compact file length is smaller than readable file length

6. Optional:

Assert compact JSON does not contain verbose keys:

- `"format"`
- `"program"`
- `"entities"`
- `"operations"`

This confirms a machine-oriented representation.

## package.json

Add script:

```json
"compiler:aionx:compact:smoke": "node scripts/compact-aionx-smoke.mjs"
```

Do not add dependencies.
Do not modify `package-lock.json` unless dependencies changed.

## CI

Update:

```text
.github/workflows/ci.yml
```

Add:

```yaml
- name: Compact AIONX compiler smoke
  run: npm run compiler:aionx:compact:smoke
```

Place it near other compiler smoke tests.

## Documentation

1. `docs/runtime.md`

Add section:

```text
## Compact AIONX
```

Explain:

- readable AIONX is useful for inspection
- compact AIONX is machine-oriented
- compact AIONX is lower-token and less human-readable
- humans should review behavior reports, not compact machine plans
- compact AIONX is not bytecode yet
- compact AIONX is a step toward machine-native execution

Include command:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --compact --out app.compact.aionx.json
```

2. `docs/architecture.md`

Add Compact AIONX under Machine-Native Plan Layer.

Explain:

- readable AIONX = inspection and debug artifact
- compact AIONX = machine execution and repair artifact
- future versions may lower compact AIONX further into bytecode or runtime-specific plans

3. `docs/roadmap.md`

Mark Sprint 008 as Compact AIONX and machine-native plan work.

4. `README.md`

Add a concise example only if README does not become too long:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --compact --out app.compact.aionx.json
```

Mention:

- use compact AIONX for machine-oriented workflows
- use normal AIONX for inspection

## Acceptance Criteria

- existing readable AIONX output remains unchanged
- `compile aionx --compact` emits compact JSON
- compact JSON is valid JSON
- compact JSON includes program, capabilities, entities, operations, guards, and effects
- compact JSON is smaller than readable AIONX for the car rental example
- `--out` works with compact mode
- existing AIONX run inspector smoke still passes
- existing operation dry-run smoke still passes if implemented
- existing executable-ts smoke still passes
- no dependencies added
- `package-lock.json` unchanged unless dependencies changed

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:aionx:compact:smoke
npm run runtime:dry-run:smoke
npm run runtime:aionx:smoke
npm run compiler:executable-ts:smoke
npm run compiler:scenarios:smoke
npm run out:smoke
```

If some scripts do not exist yet because earlier sprints are not merged, run all available relevant scripts and report which were unavailable.

## PR Title

```text
feat: add compact AIONX output
```

## PR Summary

- adds compact machine-oriented AIONX output mode
- supports `compile aionx --compact`
- keeps readable AIONX unchanged
- adds smoke coverage comparing compact vs readable output
- documents compact AIONX as a step toward machine-native execution
- no dependencies added
