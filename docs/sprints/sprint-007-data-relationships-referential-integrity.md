# Sprint 007 — Data Relationships & Referential Integrity

## Status

Planned

## Type

Technical sprint for IR relation metadata and relational SQL generation

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint Goal

Add optional relation metadata to AION fields so the IR can express foreign-key relationships, validate them semantically, and lower them into SQL foreign key constraints.

## Why This Sprint Matters

Today `customer_id` is just a `uuid` with no link to `customer.id` — to the machine it is a value, not a relationship. The SQL target cannot emit foreign keys, and the ecosystem targets (Prisma / Drizzle in Sprint 012) are weak without relations. This sprint must land **before** the Mini Project Proof and Ecosystem Targets so that the second domain has real relationships (`ticket.customer_id -> customer.id`, `reply.ticket_id -> ticket.id`) and the generated SQL/Prisma describes actual structure instead of disconnected tables. It adds the smallest relation primitive that unlocks relational generation without introducing an ORM or query layer.

## Depends On

- Sprint 006 — Schema Generality & Domain Portability (relations build on a schema confirmed domain-neutral)

## Relation Shape

Add an optional `relation` object on fields. Explicit object form (preferred for clear validation):

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

For this sprint, prefer the explicit object form because it is clearer for validation.

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

## Scope

- optional `relation` metadata on AION fields (IR + JSON Schema)
- semantic validation of relation targets
- SQL foreign key generation from relations
- car rental example updated with invoice relationships
- tests and smoke coverage

## Out of Scope

- database adapter
- migrations engine
- cascade rules
- joins
- query compiler
- ORM generation
- API generation
- app generation
- runtime persistence

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

## PR

### PR Title

```text
feat: add entity relationships and SQL foreign keys
```

### PR Summary

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
