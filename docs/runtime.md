# AION Runtime

AION runtime work is currently split across three concrete pieces:

- AIONX generation
- AIONX inspection
- `executable-ts` proof execution

The runtime direction is machine-oriented.
It does not require humans to read generated code to establish trust.
It must produce behavior reports humans can understand.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

## Current Runtime State

Current runtime-adjacent capabilities:

1. AION can generate an AIONX machine-native execution plan.
2. AION can inspect AIONX with `node dist/src/cli.js run ...`.
3. AION can generate a self-contained executable TypeScript runtime for the car rental vertical slice.
4. AION can run a smoke test against that generated behavior.

The key proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

## AIONX Generation

Generate AIONX with:

```bash
node dist/src/cli.js compile aionx examples/car-rental-system.aion.json --out app.aionx.json
```

AIONX is the current machine-native execution plan target.
It captures contract-derived metadata in a form intended for tools and future runtime paths.

## AIONX Inspection

Inspect AIONX with:

```bash
node dist/src/cli.js run app.aionx.json
```

Today this command is an inspector, not a business-logic executor.
It validates the basic structure of the generated AIONX file and prints a readable summary of the plan.

Current AIONX run limitations:

- no operation execution yet
- no generic guard evaluation yet
- no persistence integration yet
- no replay yet

## `executable-ts` Proof

Generate the runtime proof target with:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

Run the smoke test with:

```bash
npm run compiler:executable-ts:smoke
```

This proof target is experimental and vertical-slice focused.
Its job is to prove that validated AION behavior can lower into an executable artifact and pass behavior checks.

Verified smoke behavior currently includes:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

## Near Runtime Goal

The next runtime step should move from inspection toward verification:

- behavioral verification layer
- operation dry-run
- guard and effect result reporting
- more explicit pass/fail behavior output
- AI-visible failure summaries for repair loops

## Long-Term Runtime Goal

The longer-term runtime direction is:

- machine-native execution plan
- compact AIONX
- deterministic execution and replay
- audit and event traces
- machine-oriented parseable runtime state
- behavior reports for humans

That future runtime does not need to expose human-friendly internal representations.
It does need to expose trustworthy behavioral evidence.

## Runtime Outputs

Machine-facing runtime outputs should optimize for:

- determinism
- parseability
- validation
- execution
- repair

Human-facing runtime outputs should optimize for:

- scenario results
- effect previews
- traces
- behavior summaries
- verification reports

## Current Limitations

Current runtime limitations include:

- AIONX run is inspector-level only
- AIONX does not execute business logic yet
- `executable-ts` is experimental and vertical-slice focused
- there is no generic behavioral verification layer yet
- there is no AI repair loop yet
- there is no compact machine-native AIONX yet
- there is no database adapter yet
- there is no production runtime yet
