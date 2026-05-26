# AION Vision

AION is an experiment in AI-native software construction.

The project explores a simple thesis: human intent should not always compile directly into source code. A safer path is:

```text
Prompt
  -> AION IR
  -> validation
  -> compile plan
  -> target code or runtime
  -> tests
```

The evolved thesis is:

```text
Prompt
  -> AION IR
  -> validation
  -> compile plan
  -> executable behavior
  -> runtime verification
```

AION is not just a code generator.

AION is a behavioral contract layer between human intent, AI agents, and generated or executable software.

It gives AI systems a precise intermediate representation that can be generated, checked, transformed, compiled, inspected, tested, and eventually executed.

## Why AION exists

AI coding agents can move very quickly from prompt to code. That speed is useful, but it also creates risk.

Without an intermediate contract, behavior can become implicit, scattered, or invented inside implementation details.

AION introduces a structured layer where the system's intended behavior is explicit before application code is written.

An AION program describes:

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

This makes the behavior easier to validate, review, compile, and compare against generated code.

## Core idea

AION separates behavior from implementation.

The intended system behavior should be captured first. Only after validation should AION generate artifacts, execution plans, runtime code, or application implementation.

AION aims to make this workflow possible:

```text
User request
  -> AI drafts AION IR
  -> AION validates structure and semantics
  -> AION generates a compile plan
  -> AION generates target artifacts
  -> AION generates or verifies executable behavior
  -> AI implements application code against the contract
```

## Principles

1. **Intent first**  
   AION captures what the system must do before deciding how to implement it.

2. **Explicit behavior**  
   Actors, entities, operations, guards, effects, invariants, and tests should be visible to validators and reviewers.

3. **Verification before generation**  
   AION should be checked before target code or runtime behavior is emitted.

4. **Contract before implementation**  
   AI agents should treat AION as the source of truth for behavior.

5. **Explainable systems**  
   Humans should be able to review system behavior without reading every generated implementation detail.

6. **Target independence**  
   AION should be able to compile into TypeScript, SQL, Mermaid graphs, native execution plans, runtime code, tests, policy rules, or future targets.

7. **Runtime direction**  
   AION should move from static generation toward runtime verification and executable behavior.

## Current proof

AION can now compile the car rental example into an executable in-memory TypeScript runtime and verify invoice behavior through smoke tests.

The current proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

This is an important milestone.

It proves AION is not limited to static code or documentation artifacts. AION can generate executable behavior from IR, run that generated behavior, and verify expected operation outcomes.

The current executable proof supports a narrow car rental billing vertical slice, especially:

- `invoice.create`
- `invoice.view_own`

The smoke test verifies behavior such as:

- admin can create an invoice
- customer cannot create an invoice
- negative amounts are rejected
- customer can view their own invoice
- customer cannot view another customer's invoice
- audit log entries are written

## Current scope

AION v0.1 currently focuses on:

- JSON-based AION IR
- parser
- JSON Schema validation
- semantic validation
- compile plan generation
- runtime manifest generation
- TypeScript target
- SQL target
- Mermaid target
- AIONX native execution plan target
- AIONX inspection through `aion run`
- experimental executable TypeScript generation

## Runtime direction

AIONX is the current native execution plan format.

Today, AIONX can be generated and inspected. In future versions, AIONX can become the foundation for a real runtime that evaluates guards, executes operations, connects to storage adapters, emits audit logs, and replays events deterministically.

The runtime direction is:

```text
AION IR
  -> AIONX execution plan
  -> runtime inspection
  -> guard evaluation
  -> operation execution
  -> storage adapters
  -> audit/event log
  -> deterministic replay
```

## Long-term goal

AION should make AI-built software more reliable by giving AI agents a contract they must obey before writing implementation code.

The long-term goal is not simply to generate more code.

The goal is to make software behavior explicit, validated, executable, inspectable, and testable from intent.