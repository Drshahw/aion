# Sprint 006 — Schema Generality & Domain Portability

## Status

Planned

## Type

Verification sprint — prove the AION v0.1 schema and semantic validator are domain-neutral

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint Goal

Prove that `schema/aion-0.1.schema.json` and the semantic validator accept arbitrary domains — not just car rental — using the existing primitives (actors, entities, fields, operations, guards, effects, tests), **before** the Mini Project Proof builds a full second domain.

The key question:

```text
Is the AION v0.1 schema genuinely domain-neutral,
or did it only work because the car rental example happened to be simple?
```

## Why This Sprint Matters

The Mini Project Proof (Sprint 010) adds a second domain (support ticket). If we discover schema gaps *during* that sprint and fix the schema *in the same PR*, we can no longer tell whether AION was already domain-neutral or was customized for support tickets. This sprint isolates the schema-generality question into its own checkpoint so the Mini Project Proof is a real proof, not a debugging session.

## Depends On

- Sprint 001 — Documentation Alignment (canonical schema docs)

## Design Constraint

- **Do not add domain-specific schema rules.** The schema must stay generic.
- Prefer **not** changing the schema at all. Only update it if a genuine, generic limitation is discovered — and document why.
- Keep schema (structural) and semantic validator (cross-reference) concerns separate, as `docs/schema.md` describes.

## Scope

- Add a minimal second-domain fixture and confirm it validates with the current schema + semantic validator.
- Add negative fixtures proving the schema/validator are not too loose.
- Document any discovered limitations in `docs/schema.md`.
- A focused smoke test that runs the positive and negative fixtures.

## Out of Scope

- the full support ticket proof (Sprint 010)
- any compiler target work
- runtime/execution changes
- domain-specific schema rules
- relation metadata (Sprint 012)

## Tasks

### 1. Positive fixture (second domain)

Create a minimal, non-car-rental fixture that exercises the core primitives:

```text
examples/fixtures/support-ticket-minimal.aion.json
```

It should define at least: multiple actors (e.g. `customer`, `agent`), 2–3 entities with id fields, and 2–3 operations with guards, effects (including an `audit.log` effect on a write), and test expectations.

Validate:

```bash
node dist/src/cli.js validate examples/fixtures/support-ticket-minimal.aion.json
```

Expected: validation passes (warnings allowed, no errors).

Optionally smoke a couple of generic targets to confirm portability:

```bash
node dist/src/cli.js plan examples/fixtures/support-ticket-minimal.aion.json
node dist/src/cli.js compile aionx examples/fixtures/support-ticket-minimal.aion.json --out <tmp>/support-ticket-minimal.aionx.json
```

### 2. Negative fixtures (schema is not too loose)

Add fixtures under `examples/invalid/` (or `examples/fixtures/invalid/`) that must fail, each isolating one rule:

- unknown scalar type → fail
- missing operation actor → fail
- unknown write entity reference → fail
- write operation without an `audit.log` effect → warning/error per current behavior
- operation without guards → warning/error per current behavior

Each negative fixture should fail (or warn) for exactly the expected reason. Confirm the diagnostic `code` matches the validator's existing codes.

### 3. Smoke test

Create:

```text
scripts/schema-generality-smoke.mjs
```

It should:

- validate the positive fixture and assert `ok === true`
- validate each negative fixture and assert the expected diagnostic `code` / level appears
- print a clear pass/fail summary

### 4. package.json

Add script:

```json
"schema:generality:smoke": "node scripts/schema-generality-smoke.mjs"
```

Do not add dependencies. Do not modify `package-lock.json` unless dependencies changed.

### 5. CI

Add to `.github/workflows/ci.yml` near the other schema/smoke steps:

```yaml
- name: Schema generality smoke
  run: npm run schema:generality:smoke
```

### 6. Documentation

- Update `docs/schema.md` only if a real, generic limitation is found.
- Note explicitly which primitives are confirmed domain-neutral.
- If the schema is already sufficient, record that conclusion so Sprint 010 can rely on it.

## Acceptance Criteria

- a minimal second-domain fixture validates against the current schema + semantic validator with no errors
- negative fixtures fail (or warn) for the expected reasons with the expected diagnostic codes
- the smoke test covers positive and negative cases
- no domain-specific schema rules were added
- if the schema was changed at all, the change is generic and documented with rationale
- `docs/schema.md` reflects the confirmed generality conclusion
- existing smoke tests still pass
- no dependencies added
- `package-lock.json` unchanged unless dependencies changed

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run schema:generality:smoke
npm run runtime:aionx:smoke
npm run compiler:executable-ts:smoke
npm run out:smoke
```

## PR

### PR Title

```text
test: verify AION schema is domain-neutral
```

### PR Summary

- adds a minimal second-domain fixture that validates with the current schema and semantic validator
- adds negative fixtures proving the schema/validator are not too loose
- adds a schema-generality smoke test and CI step
- confirms (or documents limitations of) AION v0.1 domain neutrality before the Mini Project Proof
- no domain-specific schema rules added
- no dependencies added
