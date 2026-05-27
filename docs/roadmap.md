# AION Roadmap

## Current Proof

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

## Sprint Numbers Are Stable IDs

Sprint numbers are permanent identifiers, not schedule positions. See [`docs/sprints/README.md`](sprints/README.md).

- The **Execution Order** list below is the single authoritative source of sprint sequence.
- To reorder, edit this list only — never rename sprint files.
- To insert a sprint, give it the next unused number (next is **013**) and place it in the list wherever it belongs.

## Execution Order

1. Sprint 001 — Documentation Alignment & Philosophy
2. Sprint 002 — Behavioral Verification Layer
3. Sprint 003 — AIONX Operation Dry-Run / Execution
4. Sprint 004 — AI Debug & Repair Loop
5. Sprint 005 — Scenario/Test Generation Target
6. Sprint 006 — Schema Generality & Domain Portability
7. Sprint 007 — Data Relationships & Referential Integrity
8. Sprint 008 — Machine-Native Compact AIONX
9. Sprint 009 — Entity-Driven executable-ts Runtime
10. Sprint 010 — Operation Dispatcher & Runtime Trace
11. Sprint 011 — Mini Project Proof
12. Sprint 012 — Ecosystem Targets

## Sprint Details

### Sprint 001 - Documentation Alignment & Philosophy

Covers:

- docs alignment
- project philosophy
- current proof
- trust boundary
- updated positioning

### Sprint 002 - Behavioral Verification Layer

Covers:

- guard and scenario evaluation
- pass/fail reports
- human-readable behavior output
- effect preview

### Sprint 003 - AIONX Operation Dry-Run / Execution

Covers:

- run one operation from AIONX with context
- operation-level result
- guard result
- effect result

### Sprint 004 - AI Debug & Repair Loop

Covers:

- AI reads failing behavior reports
- AI identifies the layer to patch
- AI repairs contract, compiler, runtime, or generated artifact
- tests rerun until behavior passes

### Sprint 005 - Scenario/Test Generation Target

Covers:

- generate behavioral scenarios
- generate executable tests
- Given/When/Then style behavior reports

### Sprint 006 - Schema Generality & Domain Portability

Covers:

- prove the AION v0.1 schema and semantic validator are domain-neutral
- minimal second-domain positive fixture
- negative fixtures so the schema is not too loose
- checkpoint before the Mini Project Proof; no domain-specific schema rules

### Sprint 007 - Data Relationships & Referential Integrity

Covers:

- optional `relation` metadata on AION fields
- semantic validation of relation targets (entity / field / type compatibility)
- SQL foreign key generation
- lands before the second-domain proof and ecosystem targets, so the data model is relation-aware

### Sprint 008 - Machine-Native Compact AIONX

Covers:

- compact execution format
- lower-token machine representation
- deterministic and parse-friendly machine layer

### Sprint 009 - Entity-Driven executable-ts Runtime

Covers:

- entity-driven store, `resetStore`, and seed helpers
- runtime metadata
- preserve existing invoice behavior; runtime stays self-contained

### Sprint 010 - Operation Dispatcher & Runtime Trace

Covers:

- `operationDefinitions` from AION operations
- `runOperation` dispatcher routing to existing operation functions
- `runtimeTrace` events
- safe unsupported-operation handling

### Sprint 011 - Mini Project Proof

Covers:

- new project from zero (support ticket), with real relations
- intent to contract to machine plan to verification to AI repair to working behavior

### Sprint 012 - Ecosystem Targets

Covers:

- Zod
- OpenAPI
- Prisma / Drizzle (relation-aware)
- API contracts

## Note on foundations before ecosystem targets

Two foundations are deliberately sequenced before the Mini Project Proof and Ecosystem Targets:

- Sprint 006 proves the schema is domain-neutral, so the second domain is a real proof, not a debugging session.
- Sprint 007 makes the data model relation-aware. Without relations, SQL/Prisma/Drizzle output is just disconnected tables; with relations, AION describes real system structure.

## Note on executable-ts generalization

Generalizing `executable-ts` is intentionally split into two sprints because it is the highest-risk area of the roadmap.

The generated runtime must remain self-contained, deterministic, and behavior-compatible with the existing car rental proof while becoming more IR-driven.

To reduce risk:

- Sprint 009 focuses only on entity-driven store, reset, seed helpers, and runtime metadata.
- Sprint 010 adds operation dispatcher, runtime trace, and unsupported-operation handling.

This avoids a large rewrite that could break the current executable behavior proof.
