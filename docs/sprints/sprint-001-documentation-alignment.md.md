# Sprint 001 - Documentation Alignment & Philosophy

## Status

Ready

## Type

Documentation-only

## Goal

Implement Sprint 001 - Documentation Alignment & Philosophy.

This sprint aligns AION documentation with the current project philosophy:

- AION is not merely an AI-native IR
- AION is a contract-first compiler for AI-assisted software development
- human-readable source code is not the trust boundary
- behavioral verification is the trust boundary

## Current Proof

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
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
- Mermaid graph target
- AIONX native execution plan target
- AIONX run inspection
- `--out` / `-o` output file support
- `executable-ts` target
- self-contained in-memory TypeScript runtime generation for the car rental vertical slice

## Verified Behavior In Current Proof

- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total is calculated
- invoice is stored in memory
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written

## Scope

Allowed changes:

- `README.md`
- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/executable-ts.md`
- `docs/skills/aion-codex-skill.md`
- `docs/token-management.md`
- `docs/roadmap.md`

Not allowed:

- compiler source changes
- runtime source changes
- CLI behavior changes
- dependency changes
- `package.json` changes
- `package-lock.json` changes

## Required Positioning

Use this framing:

```text
AION is a contract-first compiler for AI-assisted software development.

It turns human intent into validated behavioral contracts, machine-native execution plans, executable artifacts, and behavior verification reports.
```

Include this trust-boundary statement:

```text
Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.
```

## Documentation Targets

### README

- explain what AION is today
- explain that AION is not just an AI-native IR
- explain the current proof
- document quick start
- document the car rental proof
- document TypeScript, SQL, Mermaid, AIONX, and `executable-ts`
- explain why `--out` should be used
- list current limitations
- link to supporting docs

### Vision

- explain that AION is not primarily a programming language for humans
- explain that AION is not merely an IR
- explain the machine-oriented software generation and verification path
- include the human intent to trusted behavior flow

### Architecture

- distinguish the architecture layers
- separate machine-facing outputs from human-facing outputs
- explain why internal machine representations may become less human-readable over time

### Runtime

- document current runtime state
- document AIONX generation and inspection
- document `executable-ts` as proof
- explain near-term and long-term runtime goals

### Executable TypeScript

- clarify that `executable-ts` is a proof target
- clarify that success is measured by behavioral verification
- clarify that generated code is not the trust boundary

### Codex Skill

- align agent workflow around behavior verification
- prefer reports, tests, smoke output, and scenario results
- add a machine-oriented workflow section

### Token Management

- reflect compact machine-native representation as a future goal
- describe token reduction through contracts, AIONX, scenario reports, and repair reports

### Roadmap

- create `docs/roadmap.md`
- shift roadmap toward verification, execution, repair, compact machine plans, and ecosystem targets

## Validation

Run:

```bash
npm run typecheck
npm run schema:check
npm run build
```

## PR Title

```text
docs: align AION philosophy and roadmap
```

## PR Summary

- reframes AION from AI-native IR toward contract-first machine-oriented software generation
- documents behavioral verification as the trust boundary
- documents current `executable-ts` proof
- adds updated roadmap
- no compiler/runtime behavior changed
