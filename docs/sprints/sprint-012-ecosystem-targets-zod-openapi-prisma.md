# Sprint 012 — Ecosystem Targets: Zod / OpenAPI / Prisma

## Status

Planned

## Type

Technical sprint for ecosystem-oriented compiler targets

## Goal

Implement Sprint 012 - Ecosystem Targets: Zod / OpenAPI / Prisma.

This sprint adds the first ecosystem-oriented compiler targets that make AION useful in real software stacks.

## Project Context

Read the canonical project context before starting:

- `docs/vision.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/roadmap.md`

This sprint does not redefine AION philosophy or current capabilities.

## Sprint 012 Objective

Add practical ecosystem targets so AION contracts can generate useful integration artifacts for real TypeScript, API, and database projects.

This sprint should focus on high-signal, developer-useful generated artifacts.

Recommended targets:

1. Zod schemas target
2. OpenAPI target
3. Optional Prisma schema target

If all three are too large, prioritize in this order:

1. Zod
2. OpenAPI
3. Prisma

## Important Constraints

This sprint is not full app generation.
This sprint is not UI generation.
This sprint is not a production runtime.
This sprint is not a database adapter.
This sprint should generate integration artifacts from AION IR.

Sprint 012 should make AION more useful to real projects by generating:

- runtime validation schemas
- API specification contracts
- optional ORM schema contracts

## Target 1: Zod Schemas

Add compile target:

```text
zod
```

Command:

```bash
node dist/src/cli.js compile zod examples/car-rental-system.aion.json --out generated.zod.ts
```

Also test with:

```bash
node dist/src/cli.js compile zod examples/support-ticket-system.aion.json --out support-ticket.zod.ts
```

Purpose:
Generate Zod schemas for:

- entities
- operation inputs
- operation outputs

Generated output should be TypeScript.

Example output shape:

```ts
import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  phone: z.string().optional()
});

export const InvoiceCreateInputSchema = z.object({
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  rent_amount: z.number(),
  fines_amount: z.number(),
  salik_amount: z.number()
});
```

Mapping:

- `string -> z.string()`
- `uuid -> z.string().uuid()`
- `number -> z.number()`
- `integer -> z.number().int()`
- `boolean -> z.boolean()`
- `datetime -> z.string().datetime()`
- `json -> z.unknown()`

Required fields:

- `required true -> required field`
- `required false -> .optional()`

Operation schema naming:

- `invoice.create input -> InvoiceCreateInputSchema`
- `invoice.create output -> InvoiceCreateOutputSchema`
- `ticket.view_own input -> TicketViewOwnInputSchema`

If operation ids include dots or underscores, convert to PascalCase.

Create:

```text
src/compiler/targets/zod/compileToZod.ts
```

Export:

```ts
compileToZod(program: AionProgram): string
```

Update `src/index.ts` to export `compileToZod`.

CLI:

```text
compile zod <file>
```

## Target 2: OpenAPI

Add compile target:

```text
openapi
```

Command:

```bash
node dist/src/cli.js compile openapi examples/support-ticket-system.aion.json --out openapi.json
```

Purpose:
Generate a basic OpenAPI 3.1 JSON spec from AION operations.

Do not overcomplicate.

OpenAPI output should include:

- `openapi: "3.1.0"`
- `info.title` from program name
- `info.version` from program version
- paths generated from operation ids
- requestBody from operation inputs
- response schema from operation outputs
- `components.schemas` for entities

Path convention:

- `invoice.create -> /invoice/create`
- `ticket.view_own -> /ticket/view-own`
- `reply.create -> /reply/create`

Method convention:

- operations with writes -> post
- read-only operations -> get if no inputs or post if inputs are required
- if uncertain, use post for all operations in v0.1 for simplicity

Recommended:
Use `post` for all operations in Sprint 012 to keep it deterministic.

Example path:

```json
"/invoice/create": {
  "post": {
    "operationId": "invoice.create",
    "summary": "Create an invoice for a rental customer.",
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/InvoiceCreateInput"
          }
        }
      }
    },
    "responses": {
      "200": {
        "description": "Successful operation",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/InvoiceCreateOutput"
            }
          }
        }
      }
    }
  }
}
```

Mapping:

- `string -> { "type": "string" }`
- `uuid -> { "type": "string", "format": "uuid" }`
- `number -> { "type": "number" }`
- `integer -> { "type": "integer" }`
- `boolean -> { "type": "boolean" }`
- `datetime -> { "type": "string", "format": "date-time" }`
- `json -> {}`

Create:

```text
src/compiler/targets/openapi/compileToOpenApi.ts
```

Export:

```ts
compileToOpenApi(program: AionProgram): string
```

Update `src/index.ts` to export `compileToOpenApi`.

CLI:

```text
compile openapi <file>
```

## Target 3: Optional Prisma Schema

Add compile target:

```text
prisma
```

Command:

```bash
node dist/src/cli.js compile prisma examples/car-rental-system.aion.json --out schema.prisma
```

Purpose:
Generate a basic Prisma schema from AION entities.

Only implement if it can be done safely without delaying Zod and OpenAPI.

Prisma output should include:

- `generator client`
- `datasource db` with placeholder `env("DATABASE_URL")`
- `model` blocks for each entity

Mapping:

- `string -> String`
- `uuid -> String @id @default(uuid())` only for id field if type uuid
- `number -> Float`
- `integer -> Int`
- `boolean -> Boolean`
- `datetime -> DateTime`
- `json -> Json`

For id field:

- if `field.id === "id"` and `type === "uuid"`, emit `id String @id @default(uuid())`
- otherwise map normally

Required false:

- append `?`

Example:

```prisma
model Customer {
  id String @id @default(uuid())
  full_name String
  phone String?
}
```

Create:

```text
src/compiler/targets/prisma/compileToPrisma.ts
```

Export:

```ts
compileToPrisma(program: AionProgram): string
```

Update `src/index.ts` to export `compileToPrisma`.

CLI:

```text
compile prisma <file>
```

## Smoke Test

Create:

```text
scripts/ecosystem-targets-smoke.mjs
```

The smoke test should:

A) Generate Zod for car rental:

```bash
node dist/src/cli.js compile zod examples/car-rental-system.aion.json --out <tmp>/car-rental.zod.ts
```

Assert file includes:

- `import { z } from "zod"`
- `CustomerSchema`
- `VehicleSchema`
- `InvoiceSchema`
- `InvoiceCreateInputSchema`
- `InvoiceCreateOutputSchema`
- `z.string().uuid()`
- `z.number()`

B) Generate Zod for support ticket if example exists:

```bash
node dist/src/cli.js compile zod examples/support-ticket-system.aion.json --out <tmp>/support-ticket.zod.ts
```

Assert file includes:

- `CustomerSchema`
- `TicketSchema`
- `ReplySchema`
- `TicketCreateInputSchema`

If support ticket example does not exist because Sprint 011 is not merged, skip with a clear note.

C) Generate OpenAPI for car rental:

```bash
node dist/src/cli.js compile openapi examples/car-rental-system.aion.json --out <tmp>/car-rental.openapi.json
```

Parse JSON.

Assert:

- `openapi === "3.1.0"`
- `paths` includes `/invoice/create`
- `paths` includes `/invoice/view-own`
- `components.schemas` includes `Customer`
- `components.schemas` includes `Invoice`

D) Generate OpenAPI for support ticket if available.

Assert:

- `paths` includes `/ticket/create`
- `paths` includes `/ticket/view-own`
- `paths` includes `/reply/create`
- `components.schemas` includes `Ticket`

E) If Prisma target is implemented:

```bash
node dist/src/cli.js compile prisma examples/car-rental-system.aion.json --out <tmp>/schema.prisma
```

Assert:

- `generator client`
- `datasource db`
- `model Customer`
- `model Vehicle`
- `model Invoice`

## package.json

Add script:

```json
"compiler:ecosystem:smoke": "node scripts/ecosystem-targets-smoke.mjs"
```

Do not add dependencies unless absolutely necessary.

Important:
Zod is emitted as code that imports `zod`, but this repo does not need to install `zod` for smoke tests unless the generated file is actually compiled or run.
Smoke should only inspect generated text.
Therefore do not add a `zod` dependency in Sprint 012.

## CI

Update:

```text
.github/workflows/ci.yml
```

Add:

```yaml
- name: Ecosystem targets smoke
  run: npm run compiler:ecosystem:smoke
```

Place it near other compiler smoke tests.

## Documentation

### 1. README.md

Add concise compile target examples:

```bash
node dist/src/cli.js compile zod examples/car-rental-system.aion.json --out generated.zod.ts
node dist/src/cli.js compile openapi examples/car-rental-system.aion.json --out openapi.json
```

If Prisma target exists:

```bash
node dist/src/cli.js compile prisma examples/car-rental-system.aion.json --out schema.prisma
```

### 2. docs/architecture.md

Add ecosystem targets under Target Generation Layer:

- Zod
- OpenAPI
- Prisma if implemented

Explain:

- these targets connect AION contracts to real application stacks
- they do not change the machine-native philosophy
- they are generated integration artifacts

### 3. docs/roadmap.md

Mark Sprint 012 as ecosystem targets.

### 4. docs/targets/ecosystem-targets.md

Create and document:

- purpose
- zod target
- openapi target
- prisma target if implemented
- limitations
- commands

## Acceptance Criteria

- `compile zod` works
- `compile openapi` works
- optional `compile prisma` works if implemented
- `--out` works for new targets
- generated Zod includes entity schemas
- generated Zod includes operation input and output schemas
- generated OpenAPI is valid JSON
- generated OpenAPI includes paths for operations
- generated OpenAPI includes entity schemas
- smoke test passes
- existing smoke tests still pass
- no dependencies added unless justified
- `package-lock.json` unchanged unless dependencies changed

## Validation Commands

```bash
npm run typecheck
npm run schema:check
npm run build
npm test
npm run compiler:ecosystem:smoke
npm run proof:support-ticket:smoke
npm run compiler:executable-ts:smoke
npm run runtime:dry-run:smoke
npm run runtime:aionx:smoke
npm run compiler:scenarios:smoke
npm run compiler:aionx:compact:smoke
npm run out:smoke
```

If some scripts do not exist because earlier sprints are not merged, run all available relevant scripts and report which were unavailable.

## PR Title

```text
feat: add ecosystem compiler targets
```

## PR Summary

- adds Zod compiler target
- adds OpenAPI compiler target
- optionally adds Prisma compiler target
- connects AION contracts to real TypeScript, API, and database ecosystems
- generated artifacts are integration targets, not full app generation
- adds smoke coverage
- no runtime execution changes
- no dependencies added unless justified
