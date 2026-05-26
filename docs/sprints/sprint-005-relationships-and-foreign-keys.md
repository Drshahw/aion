# Sprint 005 — Relationships & SQL Foreign Keys

## Status

Planned

## Type

IR / Schema / SQL Compiler

## Sprint Goal

Add first-class relationship support to AION IR and generate SQL foreign keys from those relationships.

Current limitation:

```text
customer_id is only a uuid field.
vehicle_id is only a uuid field.
AION does not yet know that invoice.customer_id references customer.id.
````

Desired behavior:

```text
AION IR
  -> entity relationships
  -> validation
  -> SQL foreign keys
  -> safer generated schema
```

## Why This Sprint Matters

AION currently generates entity tables, but relationships are implicit.

For real software systems, entities are connected:

```text
invoice.customer_id -> customer.id
invoice.vehicle_id -> vehicle.id
reply.ticket_id -> ticket.id
payment.invoice_id -> invoice.id
```

Without explicit relationships, AION cannot fully reason about:

* database integrity
* ownership rules
* joins
* generated SQL constraints
* runtime reads/writes
* access rules
* future app generation

This sprint makes the data model more real.

## Current Context

AION currently supports:

* AION JSON IR
* JSON Schema validation
* semantic validation
* SQL target
* TypeScript target
* AIONX target
* executable-ts proof

The schema docs already make clear that JSON Schema validates structure first, while semantic validation handles cross-reference logic. Relationships should follow that same two-layer model: shape checked by schema, references checked semantically. 

## Scope

Add relationship metadata to fields.

Example:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true,
  "relation": {
    "entity": "customer",
    "field": "id"
  }
}
```

Alternative compact form may be allowed later:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true,
  "relation": "customer.id"
}
```

For Sprint 005, prefer the explicit object form because it is clearer for validation.

## Example Target

Current invoice fields:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true
}
```

Desired invoice fields:

```json
{
  "id": "customer_id",
  "type": "uuid",
  "required": true,
  "relation": {
    "entity": "customer",
    "field": "id"
  }
}
```

```json
{
  "id": "vehicle_id",
  "type": "uuid",
  "required": true,
  "relation": {
    "entity": "vehicle",
    "field": "id"
  }
}
```

## Tasks

### IR Types

* [ ] Add optional `relation` support to AION field type.
* [ ] Define relation shape:

```ts
relation?: {
  entity: string;
  field: string;
}
```

### JSON Schema

* [ ] Update `schema/aion-0.1.schema.json`.
* [ ] Allow optional `relation` object on fields.
* [ ] Require `relation.entity`.
* [ ] Require `relation.field`.
* [ ] Ensure both are strings.

### Semantic Validator

* [ ] Validate relation target entity exists.
* [ ] Validate relation target field exists.
* [ ] Validate relation source and target field types are compatible.
* [ ] Emit clear diagnostics for unknown relation entity.
* [ ] Emit clear diagnostics for unknown relation field.
* [ ] Emit clear diagnostics for incompatible field types.

### SQL Compiler

* [ ] Generate foreign key constraints from relations.
* [ ] Preserve existing table generation behavior.
* [ ] Add foreign keys to generated SQL.

Expected SQL shape:

```sql
CREATE TABLE IF NOT EXISTS "invoice" (
  "id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "vehicle_id" UUID NOT NULL,
  ...
  PRIMARY KEY ("id"),
  FOREIGN KEY ("customer_id") REFERENCES "customer"("id"),
  FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id")
);
```

### Example Update

* [ ] Update `examples/car-rental-system.aion.json`.
* [ ] Add relation metadata:

  * `invoice.customer_id -> customer.id`
  * `invoice.vehicle_id -> vehicle.id`

### Tests / Smoke

* [ ] Update SQL smoke test.
* [ ] Assert generated SQL includes:

```text
FOREIGN KEY ("customer_id") REFERENCES "customer"("id")
FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id")
```

* [ ] Add validator test for invalid relation entity.
* [ ] Add validator test for invalid relation field.
* [ ] Add validator test for incompatible relation field type if practical.

### Documentation

* [ ] Update `docs/schema.md`.
* [ ] Update `docs/architecture.md` if needed.
* [ ] Add relationship example to docs.
* [ ] Mention that relationships improve generated SQL and future runtime/app generation.

## Acceptance Criteria

* [ ] AION fields can define relation metadata.
* [ ] Schema validation accepts valid relation objects.
* [ ] Semantic validator rejects unknown relation entities.
* [ ] Semantic validator rejects unknown relation fields.
* [ ] SQL compiler generates foreign keys.
* [ ] Car rental example includes invoice relationships.
* [ ] Existing SQL generation still works.
* [ ] Existing TypeScript generation still works.
* [ ] Existing AIONX generation still works.
* [ ] Existing executable-ts smoke test still passes.
* [ ] No dependencies are added.
* [ ] `package-lock.json` unchanged unless dependencies changed.

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:sql:smoke
npm run compiler:typescript:smoke
npm run compiler:graph:smoke
npm run compiler:executable-ts:smoke
npm run runtime:aionx:smoke
npm run out:smoke
```

## Suggested Technical Proof

```text
AION field relation
  -> schema accepts relation shape
  -> semantic validator checks target
  -> SQL compiler emits foreign key
  -> SQL smoke test passed
```

## PR Title

```text
feat: add entity relationships and SQL foreign keys
```

## PR Summary

```md
## Summary

- Adds relation metadata support to AION fields.
- Validates relation targets in the semantic validator.
- Updates the car rental example with invoice relationships.
- Generates SQL foreign key constraints from AION relations.

## Validation

- npm run typecheck
- npm run schema:check
- npm run build
- npm test
- npm run compiler:sql:smoke
- npm run compiler:typescript:smoke
- npm run compiler:graph:smoke
- npm run compiler:executable-ts:smoke
- npm run runtime:aionx:smoke
- npm run out:smoke

## Notes

- No runtime execution changes.
- No database adapter added.
- package-lock.json unchanged unless dependencies changed.
```

## Out of Scope

* database adapter
* migrations engine
* cascade rules
* joins
* query compiler
* ORM generation
* API generation
* app generation
* runtime persistence