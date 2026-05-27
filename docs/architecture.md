# AION Architecture

AION is a layered pipeline for turning human intent into validated behavior, machine-native execution plans, executable artifacts, and behavior reports.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

## Layer Overview

```text
Human Intent Layer
  -> AION Contract Layer
  -> Validation Layer
  -> Target Generation Layer
  -> AIONX Machine Plan Layer
  -> Executable Artifact Layer
  -> Behavioral Verification Layer
  -> AI Debug/Repair Layer
  -> Human Behavior Review Layer
```

## 1. Human Intent Layer

This layer starts with the human describing desired system behavior:

- who can act
- what data exists
- what operations are allowed
- what rules must hold
- what outputs and side effects matter
- what scenarios should pass or fail

The human does not need to manually author final implementation code.

## 2. AION Contract Layer

This layer captures behavior in AION JSON IR.

Current contract primitives include:

- metadata
- actors
- entities
- fields
- operations
- inputs
- outputs
- reads
- writes
- guards
- effects
- invariants
- tests

This is the main human/AI reviewable contract layer.

## 3. Validation Layer

This layer checks whether the contract is structurally and semantically valid before generation.

It currently includes:

- JSON Schema validation
- semantic validation
- compile plan generation
- runtime manifest generation

Validation exists to stop unsupported or inconsistent behavior before targets are emitted.

## 4. Target Generation Layer

This layer lowers the contract into target artifacts.

Current targets include:

- TypeScript
- SQL
- Mermaid
- AIONX
- `executable-ts`

These targets serve different audiences:

- some are human-facing summaries
- some are implementation artifacts
- some are machine-facing execution plans

## 5. AIONX Machine Plan Layer

AIONX is the current machine-native execution plan layer.

It is meant for parseability, determinism, validation, execution planning, and future repair workflows.

Today AIONX contains machine-readable operation, entity, guard, effect, and test metadata. Over time, it may become more compact and less human-readable.

That is acceptable.
Internal machine representations should optimize for machines first.

## 6. Executable Artifact Layer

This layer produces executable outputs that prove or implement behavior.

Today the main proof artifact is the `executable-ts` target, which generates a self-contained in-memory TypeScript runtime for the car rental vertical slice.

This layer is not about preserving a human-friendly abstraction.
It is about producing behavior that can run.

## 7. Behavioral Verification Layer

This layer is where trust is established.

Human-facing outputs should center on:

- behavior reports
- scenario results
- traces
- graphs
- summaries
- smoke test outcomes

Machine-facing outputs should optimize for:

- parseability
- determinism
- validation
- execution
- repair

The system should be trusted because behavior passes verification, not because generated source is pleasant to read.

## 8. AI Debug/Repair Layer

This layer is where AI agents inspect failures and decide what to patch.

The repair target may be:

- the AION contract
- a compiler target
- a runtime path
- a generated artifact
- a test or scenario definition

The agent should prefer evidence from behavior reports, traces, smoke output, and scenario failures over source-level guesswork.

## 9. Human Behavior Review Layer

The human remains the final judge of the system, but the review surface should be behavior-oriented:

- did the scenario pass
- did the guard hold
- did the output match
- did the trace show the right effect
- did the verification report align with intent

The human should not need to manually inspect internal machine representations to establish trust.

## Current Implemented Pipeline

```text
Human intent
  -> AI-authored AION JSON IR
  -> schema validation
  -> semantic validation
  -> compile plan
  -> runtime manifest
  -> target generation
      -> TypeScript
      -> SQL
      -> Mermaid
      -> AIONX
      -> executable-ts
  -> AIONX inspection
  -> executable behavior smoke test
```

## Current Proof

The current proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

Verified behavior currently includes:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

## Current Limitations

Current architecture limits include:

- AIONX run is inspector-level only
- AIONX does not execute business logic yet
- `executable-ts` is experimental and vertical-slice focused
- there is no generic behavioral verification layer yet
- there is no AI repair loop yet
- there is no compact machine-native AIONX yet
- there is no database adapter yet
- there is no full application generator yet
- there is no production runtime yet
