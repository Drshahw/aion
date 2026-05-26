# Executable TypeScript Target

The `executable-ts` target is an experimental AION compiler target that generates executable TypeScript runtime code from AION IR.

It exists to prove that AION can generate behavior, not only static artifacts.

## Purpose

The purpose of `executable-ts` is to prove this path:

```text
AION IR -> executable TypeScript runtime -> executed behavior smoke test passed
```

This is an important milestone because it shows that AION IR can describe behavior clearly enough for the compiler to generate runnable operation logic.

## Command

Generate the runtime:

```bash
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
```

Run the smoke test:

```bash
npm run compiler:executable-ts:smoke
```

## Current generated features

The generated runtime currently includes:

- TypeScript interfaces for AION entities
- in-memory store
- audit log store
- `resetStore`
- `seedCustomer`
- `seedVehicle`
- `invoiceCreate`
- `invoiceViewOwn`
- guard checks
- audit log entries
- safe stubs for unsupported operations

## Current supported operations

The current executable proof is intentionally narrow.

Supported car rental operations:

- `invoice.create`
- `invoice.view_own`

Other operation patterns are generated as safe stubs that throw an explicit unsupported-operation error.

## `invoice.create`

The generated `invoiceCreate` function currently verifies and performs behavior for invoice creation.

Current behavior:

- requires actor role to be `admin`
- rejects negative `rent_amount`
- rejects negative `fines_amount`
- rejects negative `salik_amount`
- checks that the customer exists
- checks that the vehicle exists
- creates an invoice id
- calculates `total_amount`
- writes invoice to the in-memory store
- appends an audit log entry
- returns `invoice_id`

## `invoice.view_own`

The generated `invoiceViewOwn` function currently verifies customer-owned invoice access.

Current behavior:

- accepts an inferred `invoice_id` input
- finds the invoice in the in-memory store
- rejects missing invoices
- checks that `invoice.customer_id` matches `actor.customer_id`
- appends an audit log entry
- returns the invoice

## Verified behaviors

The smoke test verifies:

- generated runtime exports expected functions
- admin can create invoice
- customer cannot create invoice
- negative amount is rejected
- invoice total amount is calculated
- invoice is stored
- audit log is written after invoice creation
- customer can view own invoice
- customer cannot view another customer's invoice
- audit log is written after invoice view

## Why this matters

Before `executable-ts`, AION could already generate useful static artifacts such as TypeScript, SQL, Mermaid graphs, compile plans, manifests, and AIONX execution plans.

With `executable-ts`, AION proves a stronger claim:

```text
AION can generate executable behavior from IR.
```

This shifts AION from pure static generation toward runtime verification.

## Current limitations

The `executable-ts` target is experimental.

Current limitations:

- prototype-level implementation
- focused on the car rental vertical slice
- supports only specific invoice operation patterns
- not a generic app generator yet
- no persistence layer
- no database adapter
- no HTTP/API layer
- no authentication layer
- no generic guard expression evaluator yet
- no generic invariant engine yet
- no generated UI
- no production runtime packaging

## Intended use

Use `executable-ts` as a proof and testing target.

Good uses:

- proving that AION behavior can execute
- testing a vertical slice
- validating generated operation behavior
- demonstrating runtime direction
- giving AI agents a behavioral target to preserve

Not yet intended for:

- production applications
- full-stack app generation
- persistent storage
- generic domain execution
- deployment as a complete service

## Development workflow

Recommended workflow:

```bash
npm install
npm run build
npm run typecheck
npm run schema:check

node dist/src/cli.js validate examples/car-rental-system.aion.json
node dist/src/cli.js compile executable-ts examples/car-rental-system.aion.json --out generated-runtime.ts
npm run compiler:executable-ts:smoke
```

## Agent guidance

AI coding agents should treat `executable-ts` as an executable proof target.

If behavior changes:

1. Update AION IR first.
2. Validate AION.
3. Regenerate executable TypeScript.
4. Run the smoke test.
5. Only then update application code.

If generated code and AION disagree, AION is the source of truth.