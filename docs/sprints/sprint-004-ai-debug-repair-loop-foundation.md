# Sprint 004 - AI Debug & Repair Loop Foundation

## Status

Planned

## Type

Technical sprint building on behavior verification and AIONX dry-run

## Goal

Implement Sprint 004 - AI Debug & Repair Loop Foundation.

This sprint builds on:

- Sprint 002 - Behavioral Verification Layer
- Sprint 003 - AIONX Operation Dry-Run / Execution

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

## Sprint 004 Objective

Create the first AI-readable repair analysis layer.

When a behavior verification or dry-run fails, AION should be able to produce a structured repair report that helps an AI agent understand:

- what failed
- why it likely failed
- which layer may be responsible
- what repair options are available
- whether the failure may actually represent correct rejection behavior

This sprint does not need to auto-modify files.
This sprint does not need to implement automatic patching.
This sprint does not need to build a full AI agent.
This sprint creates the structured analysis and reporting layer that a future AI repair loop can consume.

Core idea:

```text
behavior verification failed
  -> structured failure analysis
  -> likely failure layer
  -> suggested repair actions
  -> AI can patch in a future step
```

Important:
The output should be useful for AI agents, but also readable by humans.

## Current Implemented Capabilities

- AION JSON IR
- validation
- compile plan
- runtime manifest
- AIONX
- AIONX inspector
- AIONX operation dry-run
- behavioral verification reports
- executable-ts proof
- smoke tests

## Expected Existing APIs

- `evaluateGuardExpression`
- `evaluateOperationGuards`
- `formatBehaviorVerificationReport`
- `dryRunAionOperation`
- `formatAionOperationDryRun`

## New Capability

Add repair analysis for behavior verification results.

## Required File

Create:

```text
src/runtime/analyzeBehaviorFailure.ts
```

## Suggested Types

```ts
export type AionFailureLayer =
  | "contract"
  | "context"
  | "guard"
  | "effect"
  | "generated-runtime"
  | "test-scenario"
  | "unknown";

export interface AionRepairSuggestion {
  title: string;
  description: string;
  targetLayer: AionFailureLayer;
}

export interface AionBehaviorFailureAnalysis {
  passed: boolean;
  summary: string;
  likelyLayer: AionFailureLayer;
  failedGuards: AionGuardEvaluation[];
  suggestions: AionRepairSuggestion[];
}
```

## Required Exports

```ts
export function analyzeBehaviorFailure(
  report: AionBehaviorVerificationReport
): AionBehaviorFailureAnalysis;

export function formatBehaviorFailureAnalysis(
  analysis: AionBehaviorFailureAnalysis
): string;
```

## Behavior

If `report.passed === true`:

- return `passed: true`
- `summary: "Behavior verification passed. No repair needed."`
- `likelyLayer: "unknown"`
- `failedGuards: []`
- `suggestions: []`

If `report.passed === false`:

- collect failed guards
- infer likely layer using simple heuristics
- produce repair suggestions

## Heuristics

### 1. Actor role mismatch

If a failed expression includes:

```text
actor.role == <role>
```

Likely layer:

```text
context
```

Suggested repairs:

- Check whether the actor role in the context is correct.
- If this actor should be allowed, update the AION guard.
- If this actor should not be allowed, the failure may be expected behavior.

### 2. Numeric guard failure

If a failed expression includes:

```text
>= 0
<=
>
<
```

Likely layer:

```text
context
```

Suggested repairs:

- Check input values in the context.
- If negative or out-of-range values should be allowed, update the AION contract.
- Otherwise, this failure is expected validation behavior.

### 3. Ownership guard failure

If a failed expression includes:

```text
customer_id
actor.customer_id
```

Likely layer:

```text
context
```

Suggested repairs:

- Check whether the actor is trying to access their own resource.
- Check whether the entity context has the expected `customer_id`.
- If cross-customer access should be allowed, update the AION guard.

### 4. Missing path or missing value

If a failed guard reason mentions missing path, undefined value, or unresolved path:

Likely layer:

```text
context
```

Suggested repairs:

- Add the missing value to the context.
- Check whether the operation dry-run context is complete.
- If the operation requires this value, document it in the AION operation input and context expectations.

### 5. Unsupported expression

If a failed guard reason mentions unsupported expression:

Likely layer:

```text
guard
```

Suggested repairs:

- Rewrite the guard into currently supported syntax.
- Or wait for structured guard expression support.
- Do not silently bypass unsupported guards.

### 6. Unknown fallback

Likely layer:

```text
unknown
```

Suggested repairs:

- Inspect the failed guard.
- Compare AION contract, context, and generated runtime behavior.
- Add a more specific analyzer heuristic if this failure pattern repeats.

## Formatter Output

Example output for failed customer `invoice.create`:

```text
Repair Analysis: behavior verification failed

Likely layer:
context

Failed guards:
- actor.role == admin

Suggestions:
1. Check whether the actor role in the context is correct.
2. If this actor should be allowed, update the AION guard.
3. If this actor should not be allowed, the failure may be expected behavior.
```

Example output for passing behavior:

```text
Repair Analysis: behavior verification passed

No repair needed.
```

## Tests

Create:

```text
src/runtime/analyzeBehaviorFailure.test.ts
```

Required test cases:

1. Passing report returns no repair needed.
2. Failing actor.role guard.
3. Failing numeric guard.
4. Failing ownership guard.
5. Unsupported guard.
6. Missing path.
7. Formatter includes repair analysis sections.

## Integration

If Sprint 003 dry-run exists, optionally add a flag:

```text
--repair-hints
```

Example:

```bash
node dist/src/cli.js run app.aionx.json --operation invoice.create --context examples/contexts/customer-invoice-create-denied.json --repair-hints
```

When `--repair-hints` is provided and behavior verification fails:

- print normal dry-run report
- then print repair analysis

If adding a CLI flag is too large, keep this sprint API and test only, and defer CLI integration.
Prefer a small, safe implementation.

## Public API

Update:

```text
src/index.ts
```

Export:

- `analyzeBehaviorFailure`
- `formatBehaviorFailureAnalysis`
- `AionFailureLayer`
- `AionRepairSuggestion`
- `AionBehaviorFailureAnalysis`

## Documentation

Update lightly:

1. `docs/runtime.md`
2. `docs/architecture.md`
3. `docs/roadmap.md`

Document that:

- AION should produce behavior reports that AI agents can use to debug
- Sprint 004 adds failure analysis and repair suggestions
- it does not auto-patch yet
- human trust comes from behavior verification and repair reports

## Acceptance Criteria

- passing behavior report produces no repair needed
- failing behavior report produces structured failure analysis
- actor role guard failures produce useful context and contract suggestions
- numeric guard failures produce input and context suggestions
- ownership guard failures produce ownership and context suggestions
- unsupported guard failures fail safely and suggest supported syntax
- missing path failures suggest completing context
- formatter produces human and AI-readable repair analysis
- public API exports repair analyzer and types
- existing tests still pass
- existing behavior verification tests still pass
- existing AIONX dry-run smoke still passes if implemented
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
feat: add AI repair analysis foundation
```

## PR Summary

- adds behavior failure analysis
- identifies likely failure layers
- produces AI-readable repair suggestions
- prepares future AI debug and repair loop
- does not auto-patch files
- does not add full runtime execution
- no dependencies added

## Out Of Scope

- auto-modifying files
- automatic patching
- full AI agent implementation
- full runtime execution
- database adapters
- production repair loop orchestration
