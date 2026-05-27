# Sprint 008 - Mini Project Proof

## Status

Planned

## Type

Technical sprint for second-domain proof validation

## Goal

Implement Sprint 008 - Mini Project Proof.

This sprint validates the AION-first workflow on a new domain beyond the existing car rental example.

## Project Philosophy

AION is not primarily optimized for humans manually reading generated code.
AION is optimized for machine generation, validation, execution, testing, tracing, and repair.

Human-readable source code is not the trust boundary.
Behavioral verification is the trust boundary.

Humans judge AION output by:

- behavior reports
- scenario results
- guard pass/fail results
- expected vs actual outputs
- effects and audit previews
- smoke tests
- traces

AI agents debug and repair failures based on verification output.

## Current Proof

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

Current proof domain:

```text
car rental billing
```

## Sprint 008 Objective

Create a second mini project proof using the AION-first workflow.

Recommended domain:

```text
Mini Support Ticket System
```

The goal is not to build a full app.
The goal is to prove that AION can model, validate, compile, inspect, generate scenarios, and partially verify a new behavioral domain.

This sprint should answer:

```text
Can AION handle a new domain from intent to contract to generated artifacts and behavior reports?
```

## New Example File

Create:

```text
examples/support-ticket-system.aion.json
```

## Domain

A small support ticket system where:

- customers create support tickets
- customers can view only their own tickets
- agents can reply to tickets
- admins can view all tickets
- write operations produce audit logs

## Actors

- customer
- agent
- admin

## Entities

- customer
- ticket
- reply
- audit_log if appropriate

Suggested entity fields:

### customer

- `id`: uuid, required
- `full_name`: string, required
- `email`: string, required

### ticket

- `id`: uuid, required
- `customer_id`: uuid, required
- `subject`: string, required
- `status`: string, required
- `created_at`: datetime, optional

### reply

- `id`: uuid, required
- `ticket_id`: uuid, required
- `author_id`: uuid, required
- `author_role`: string, required
- `body`: string, required
- `created_at`: datetime, optional

### audit_log

- `id`: uuid, required
- `event`: string, required
- `actor_id`: uuid, required
- `target_id`: uuid, optional
- `created_at`: datetime, optional

## Operations

### 1. ticket.create

Actor:

```text
customer
```

Intent:

```text
Allow a customer to create a support ticket.
```

Reads:

- customer

Writes:

- ticket

Inputs:

- `customer_id`: uuid
- `subject`: string
- `body`: string

Outputs:

- `ticket_id`: uuid

Guards:

- `actor.role == customer`
- `actor.customer_id == customer_id`

Effects:

- `audit.log:ticket.create`

Tests:

- allow customer to create own ticket
- reject ticket creation for another customer
- write audit log

### 2. ticket.view_own

Actor:

```text
customer
```

Intent:

```text
Allow a customer to view only their own ticket.
```

Reads:

- ticket

Writes:

- none

Inputs:

- `ticket_id`: uuid

Outputs:

- `ticket`: json

Guards:

- `actor.role == customer`
- `ticket.customer_id == actor.customer_id`

Effects:

- `audit.log:ticket.view_own`

Tests:

- allow customer to view own ticket
- deny access to another customer ticket

### 3. reply.create

Actor:

```text
agent
```

Intent:

```text
Allow a support agent to reply to a ticket.
```

Reads:

- ticket

Writes:

- reply

Inputs:

- `ticket_id`: uuid
- `body`: string

Outputs:

- `reply_id`: uuid

Guards:

- `actor.role == agent`

Effects:

- `audit.log:reply.create`

Tests:

- allow agent to reply
- reject customer reply through agent operation
- write audit log

### 4. ticket.view_all

Actor:

```text
admin
```

Intent:

```text
Allow admin to view all tickets.
```

Reads:

- ticket

Writes:

- none

Inputs:

- none or optional filters

Outputs:

- `tickets`: json

Guards:

- `actor.role == admin`

Effects:

- `audit.log:ticket.view_all`

Tests:

- allow admin to view all tickets
- reject non-admin access

## Important Constraint

Use the current AION IR schema.
Do not invent unsupported schema features unless already implemented.

If relation metadata is not supported yet, keep `customer_id` and `ticket_id` as uuid fields without relation objects.
If operation input and output shapes must match existing schema, follow the current schema strictly.

## Tasks

### 1. Add support ticket AION example

Create:

```text
examples/support-ticket-system.aion.json
```

It must pass:

```bash
node dist/src/cli.js validate examples/support-ticket-system.aion.json
```

### 2. Generate core artifacts

Ensure these commands work:

```bash
node dist/src/cli.js validate examples/support-ticket-system.aion.json
node dist/src/cli.js plan examples/support-ticket-system.aion.json
node dist/src/cli.js manifest examples/support-ticket-system.aion.json
node dist/src/cli.js graph examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.mmd
node dist/src/cli.js compile sql examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.sql
node dist/src/cli.js compile typescript examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.ts
node dist/src/cli.js compile aionx examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.aionx.json
node dist/src/cli.js run <tmp>/support-ticket-system.aionx.json
```

If compact AIONX exists from Sprint 006, also test:

```bash
node dist/src/cli.js compile aionx examples/support-ticket-system.aion.json --compact --out <tmp>/support-ticket-system.compact.aionx.json
```

If scenarios target exists from Sprint 005, also test:

```bash
node dist/src/cli.js compile scenarios examples/support-ticket-system.aion.json --out <tmp>/support-ticket-scenarios.md
```

### 3. Add contexts for dry-run if Sprint 003 exists

Create:

- `examples/contexts/support-ticket/customer-create-ticket.json`
- `examples/contexts/support-ticket/customer-create-ticket-denied.json`
- `examples/contexts/support-ticket/customer-view-own-ticket.json`
- `examples/contexts/support-ticket/customer-view-other-ticket-denied.json`
- `examples/contexts/support-ticket/agent-reply-create.json`
- `examples/contexts/support-ticket/admin-view-all.json`

Context examples:

#### customer-create-ticket.json

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer",
    "customer_id": "cust-001"
  },
  "input": {
    "customer_id": "cust-001",
    "subject": "Car issue",
    "body": "I need help."
  }
}
```

#### customer-create-ticket-denied.json

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer",
    "customer_id": "cust-001"
  },
  "input": {
    "customer_id": "cust-999",
    "subject": "Car issue",
    "body": "I need help."
  }
}
```

#### customer-view-own-ticket.json

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer",
    "customer_id": "cust-001"
  },
  "ticket": {
    "id": "ticket-001",
    "customer_id": "cust-001"
  }
}
```

#### customer-view-other-ticket-denied.json

```json
{
  "actor": {
    "id": "customer-1",
    "role": "customer",
    "customer_id": "cust-001"
  },
  "ticket": {
    "id": "ticket-002",
    "customer_id": "cust-999"
  }
}
```

#### agent-reply-create.json

```json
{
  "actor": {
    "id": "agent-1",
    "role": "agent"
  },
  "input": {
    "ticket_id": "ticket-001",
    "body": "Thanks, we are checking this."
  }
}
```

#### admin-view-all.json

```json
{
  "actor": {
    "id": "admin-1",
    "role": "admin"
  },
  "input": {}
}
```

### 4. Add smoke test

Create:

```text
scripts/support-ticket-proof-smoke.mjs
```

The smoke test should:

A) Validate support ticket AION:

```bash
node dist/src/cli.js validate examples/support-ticket-system.aion.json
```

Assert validation passes.

B) Generate plan and assert output includes:

- `ticket.create`
- `ticket.view_own`
- `reply.create`
- `ticket.view_all`

C) Generate manifest and assert output includes:

- customer
- agent
- admin
- ticket
- reply

D) Generate graph:

```bash
node dist/src/cli.js graph examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.mmd
```

Assert file includes:

- `ticket.create`
- `ticket.view_own`
- `reply.create`
- `ticket.view_all`

E) Generate SQL:

```bash
node dist/src/cli.js compile sql examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.sql
```

Assert file includes:

- `CREATE TABLE`
- `customer`
- `ticket`
- `reply`

F) Generate TypeScript:

```bash
node dist/src/cli.js compile typescript examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.ts
```

Assert file includes:

- `customer`
- `ticket`
- `reply`
- `ticket.create` or equivalent operation output

G) Generate AIONX:

```bash
node dist/src/cli.js compile aionx examples/support-ticket-system.aion.json --out <tmp>/support-ticket-system.aionx.json
```

Assert file parses as JSON.

H) Run AIONX inspector:

```bash
node dist/src/cli.js run <tmp>/support-ticket-system.aionx.json
```

Assert output includes:

- `Program: support-ticket-system`
- `Operations:`
- `ticket.create`
- `ticket.view_own`

I) If scenarios target exists:
Generate scenarios and assert output includes:

- `Behavior Scenarios`
- `ticket.create`
- `ticket.view_own`
- `Given`
- `When`
- `Then`

J) If operation dry-run exists:
Run dry-runs:

- `ticket.create` with `customer-create-ticket.json` should pass
- `ticket.create` with `customer-create-ticket-denied.json` should fail
- `ticket.view_own` with `customer-view-own-ticket.json` should pass
- `ticket.view_own` with `customer-view-other-ticket-denied.json` should fail
- `reply.create` with `agent-reply-create.json` should pass
- `ticket.view_all` with `admin-view-all.json` should pass

If dry-run command is unavailable, skip this section with a clear console note.

### 5. package.json

Add script:

```json
"proof:support-ticket:smoke": "node scripts/support-ticket-proof-smoke.mjs"
```

Do not add dependencies.
Do not modify `package-lock.json` unless dependencies changed.

### 6. CI

Update:

```text
.github/workflows/ci.yml
```

Add:

```yaml
- name: Support ticket proof smoke
  run: npm run proof:support-ticket:smoke
```

Place near other proof and smoke tests.

### 7. Documentation

Create:

```text
docs/examples/support-ticket-system.md
```

Document:

- purpose of the mini project
- actors
- entities
- operations
- expected behavior
- commands to validate and generate artifacts
- what this proof demonstrates

Update:

- `README.md`
- `docs/roadmap.md`

Add a short mention under examples:

```text
Support Ticket System proof
```

Mark Sprint 008 as mini project proof.

## Acceptance Criteria

- new support ticket AION example exists
- example validates
- plan works
- manifest works
- graph generation works
- SQL generation works
- TypeScript generation works
- AIONX generation works
- AIONX inspection works
- scenarios generation works if available
- dry-run works if available
- smoke test covers the proof
- CI includes proof smoke
- no dependencies added
- `package-lock.json` unchanged unless dependencies changed

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run proof:support-ticket:smoke
npm run compiler:scenarios:smoke
npm run runtime:dry-run:smoke
npm run runtime:aionx:smoke
npm run compiler:executable-ts:smoke
npm run compiler:aionx:compact:smoke
npm run out:smoke
```

If some scripts do not exist because earlier sprints are not merged, run all available relevant scripts and report which were unavailable.

## PR Title

```text
example: add support ticket AION proof
```

## PR Summary

- adds support ticket mini project AION example
- validates AION-first workflow on a second domain
- generates plan, manifest, graph, SQL, TypeScript, and AIONX
- includes proof smoke test
- optionally verifies scenarios and dry-run if available
- no dependencies added
