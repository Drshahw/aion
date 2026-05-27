# AION Vision

AION is a contract-first compiler for AI-assisted software development.

AION is not primarily a programming language for humans.
AION is not merely an intermediate representation.
AION is a machine-oriented software generation and verification path.

Its purpose is to turn human intent into validated behavioral contracts, lower those contracts into machine-native execution plans and executable artifacts, and produce behavior humans can trust through verification.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

## Core Flow

```text
Human intent
  -> AION behavioral contract
  -> validation
  -> machine-native execution plan
  -> executable artifact
  -> behavioral verification
  -> AI repair loop
  -> trusted software behavior
```

## Why AION Exists

AI can generate code quickly, but speed alone does not create trust.
If behavior is implicit inside generated source, both humans and agents are forced to recover intent by reading implementation details after the fact.

AION exists to make behavior explicit before or alongside implementation:

- the human describes intent
- AI converts intent into a behavioral contract
- AION validates the contract
- AION lowers the contract into machine-native plans and executable artifacts
- AI debugs and repairs failures
- humans evaluate outputs, traces, scenarios, and reports

## Positioning

"AI-native IR" is still a real technical layer in AION, but it is not the product thesis.

Better positioning:

```text
AION is a contract-first compiler for AI-assisted software development.
```

It turns human intent into:

- validated behavioral contracts
- machine-native execution plans
- executable artifacts
- behavior verification reports

## Project Philosophy

AION should optimize for:

- machine generation
- validation
- execution
- repair
- testing
- tracing
- behavior reports
- low-context and low-token workflows

AION should not optimize primarily for:

- humans manually writing source code
- humans manually debugging generated code
- human readability of internal machine representations

## Layers of Trust

The human should not need to trust generated software because the generated source "looks right."

The human should trust the system because behavior is:

- validated
- executed
- tested
- traced
- reported

That is the shift from source review to behavioral verification.

## Current State

AION currently includes:

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
- `executable-ts` target

## Current Proof

The current proof is:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

This proves that AION is already beyond static description. It can generate executable behavior for a narrow vertical slice and confirm that behavior through smoke testing.

Verified behavior in the current proof includes:

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

## Current Limitations

Current limitations are important:

- AIONX run is inspector-level only
- AIONX does not execute business logic yet
- `executable-ts` is experimental and vertical-slice focused
- there is no generic behavioral verification layer yet
- there is no AI repair loop yet
- there is no compact machine-native AIONX yet
- there is no full production runtime yet

## Strategic Direction

The roadmap should continue moving toward:

1. contract-first system definition
2. behavioral verification layer
3. machine-native execution
4. AI debug and repair
5. compact machine-oriented artifacts
6. stronger proof through executable scenarios and reports

The end state is not "more generated code."
The end state is trusted software behavior produced from intent.
