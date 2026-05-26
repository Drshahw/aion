import type { AionEntity, AionField, AionIO, AionOperation, AionProgram, AionScalarType } from "../../../ir/types.js";

export function compileToExecutableTypeScript(program: AionProgram): string {
  const chunks: string[] = [
    "/* eslint-disable */",
    `// Generated from AION program: ${program.metadata.name}`,
    "// Experimental executable TypeScript runtime.",
    "// This artifact is a proof-of-concept in-memory runtime, not a full app generator.",
    "",
    compileCommonTypes(program),
    "",
    ...program.entities.flatMap((entity) => [compileEntityInterface(entity), ""]),
    compileStore(program),
    "",
    compileHelpers(program),
    "",
    ...program.operations.flatMap((operation) => [compileOperation(operation), ""]),
  ];

  return `${chunks.join("\n").trim()}\n`;
}

function compileCommonTypes(program: AionProgram): string {
  const actorIds = program.actors.map((actor) => JSON.stringify(actor.id)).join(" | ") || "string";

  return [
    `export type AionActorId = ${actorIds};`,
    "export type RuntimeActorRole = string;",
    "",
    "export interface RuntimeActor {",
    "  id: string;",
    "  role: RuntimeActorRole;",
    "  customer_id?: string;",
    "}",
    "",
    "export interface AuditLogEntry {",
    "  event: string;",
    "  operationId: string;",
    "  actorId: string;",
    "  timestamp: string;",
    "  details?: Record<string, unknown>;",
    "}",
  ].join("\n");
}

function compileEntityInterface(entity: AionEntity): string {
  const lines = [`export interface ${toPascalCase(entity.id)} {`];

  for (const field of entity.fields) {
    lines.push(`  ${compileField(field)}`);
  }

  lines.push("}");
  return lines.join("\n");
}

function compileField(field: AionField): string {
  const optional = field.required ? "" : "?";
  return `${safePropertyName(field.id)}${optional}: ${toTypeScriptType(field.type)};`;
}

function compileStore(program: AionProgram): string {
  const storeLines = ["export interface RuntimeStore {"];

  for (const entity of program.entities) {
    storeLines.push(`  ${pluralize(entity.id)}: ${toPascalCase(entity.id)}[];`);
  }

  storeLines.push("  auditLogs: AuditLogEntry[];");
  storeLines.push("}");
  storeLines.push("");
  storeLines.push("export const store: RuntimeStore = {");

  for (const entity of program.entities) {
    storeLines.push(`  ${pluralize(entity.id)}: [],`);
  }

  storeLines.push("  auditLogs: [],");
  storeLines.push("};");

  return storeLines.join("\n");
}

function compileHelpers(program: AionProgram): string {
  const lines = [
    "export function resetStore(): void {",
  ];

  for (const entity of program.entities) {
    lines.push(`  store.${pluralize(entity.id)} = [];`);
  }

  lines.push("  store.auditLogs = [];");
  lines.push("}");
  lines.push("");

  if (program.entities.some((entity) => entity.id === "customer")) {
    lines.push(
      "export function seedCustomer(customer: Customer): void {",
      "  store.customers.push(customer);",
      "}",
      "",
    );
  }

  if (program.entities.some((entity) => entity.id === "vehicle")) {
    lines.push(
      "export function seedVehicle(vehicle: Vehicle): void {",
      "  store.vehicles.push(vehicle);",
      "}",
      "",
    );
  }

  lines.push(
    "function appendAuditLog(event: string, operationId: string, actorId: string, details?: Record<string, unknown>): void {",
    "  store.auditLogs.push({",
    "    event,",
    "    operationId,",
    "    actorId,",
    "    timestamp: new Date().toISOString(),",
    "    ...(details ? { details } : {}),",
    "  });",
    "}",
    "",
    "function assertGuard(condition: boolean, message: string): void {",
    "  if (!condition) {",
    "    throw new Error(message);",
    "  }",
    "}",
  );

  return lines.join("\n");
}

function compileOperation(operation: AionOperation): string {
  switch (operation.id) {
    case "invoice.create":
      return compileInvoiceCreate(operation);
    case "invoice.view_own":
      return compileInvoiceViewOwn(operation);
    default:
      return compileUnsupportedOperation(operation);
  }
}

function compileInvoiceCreate(operation: AionOperation): string {
  const inputName = `${toPascalCase(operation.id)}Input`;
  const outputName = `${toPascalCase(operation.id)}Output`;

  return [
    "// AION operation: invoice.create",
    `export interface ${inputName} {`,
    ...compileIoLines(operation.inputs ?? []),
    "}",
    "",
    `export interface ${outputName} {`,
    "  invoice_id: string;",
    "}",
    "",
    `export function ${toCamelCase(operation.id)}(actor: RuntimeActor, input: ${inputName}): ${outputName} {`,
    '  assertGuard(actor.role === "admin", "Guard failed for invoice.create: actor.role must be admin.");',
    '  assertGuard(input.rent_amount >= 0, "Guard failed for invoice.create: rent_amount must be >= 0.");',
    '  assertGuard(input.fines_amount >= 0, "Guard failed for invoice.create: fines_amount must be >= 0.");',
    '  assertGuard(input.salik_amount >= 0, "Guard failed for invoice.create: salik_amount must be >= 0.");',
    "",
    "  const customer = store.customers.find((entry) => entry.id === input.customer_id);",
    '  if (!customer) {',
    '    throw new Error(`invoice.create failed: customer not found: ${input.customer_id}`);',
    "  }",
    "",
    "  const vehicle = store.vehicles.find((entry) => entry.id === input.vehicle_id);",
    '  if (!vehicle) {',
    '    throw new Error(`invoice.create failed: vehicle not found: ${input.vehicle_id}`);',
    "  }",
    "",
    "  const invoiceId = `invoice_${store.invoices.length + 1}`;",
    "  const invoice: Invoice = {",
    "    id: invoiceId,",
    "    customer_id: customer.id,",
    "    vehicle_id: vehicle.id,",
    "    rent_amount: input.rent_amount,",
    "    fines_amount: input.fines_amount,",
    "    salik_amount: input.salik_amount,",
    "    total_amount: input.rent_amount + input.fines_amount + input.salik_amount,",
    '    status: "created",',
    "  };",
    "",
    "  store.invoices.push(invoice);",
    '  appendAuditLog("audit.log:invoice.create", "invoice.create", actor.id, { invoice_id: invoiceId });',
    "",
    "  return { invoice_id: invoiceId };",
    "}",
  ].join("\n");
}

function compileInvoiceViewOwn(operation: AionOperation): string {
  const inputName = `${toPascalCase(operation.id)}Input`;

  return [
    "// AION operation: invoice.view_own",
    "// The source IR does not define inputs for invoice.view_own.",
    "// This proof-of-concept runtime infers invoice_id as the required input.",
    `export interface ${inputName} {`,
    "  invoice_id: string;",
    "}",
    "",
    `export function ${toCamelCase(operation.id)}(actor: RuntimeActor, input: ${inputName}): Invoice {`,
    "  const invoice = store.invoices.find((entry) => entry.id === input.invoice_id);",
    "  if (!invoice) {",
    '    throw new Error(`invoice.view_own failed: invoice not found: ${input.invoice_id}`);',
    "  }",
    "",
    '  assertGuard(invoice.customer_id === actor.customer_id, "Guard failed for invoice.view_own: invoice.customer_id must match actor.customer_id.");',
    '  appendAuditLog("audit.log:invoice.view_own", "invoice.view_own", actor.id, { invoice_id: invoice.id });',
    "",
    "  return invoice;",
    "}",
  ].join("\n");
}

function compileUnsupportedOperation(operation: AionOperation): string {
  const inputName = `${toPascalCase(operation.id)}Input`;

  return [
    `// AION operation: ${operation.id}`,
    `// Unsupported executable-ts pattern for now. Generated as a safe stub.`,
    `export interface ${inputName} {`,
    ...compileIoLines(operation.inputs ?? []),
    "}",
    "",
    `export function ${toCamelCase(operation.id)}(_actor: RuntimeActor, _input: ${inputName}): never {`,
    `  throw new Error("executable-ts does not yet support operation: ${operation.id}");`,
    "}",
  ].join("\n");
}

function compileIoLines(values: AionIO[]): string[] {
  if (values.length === 0) {
    return ["  // No explicit inputs defined in the source IR."];
  }

  return values.map((value) => {
    const optional = value.required ? "" : "?";
    return `  ${safePropertyName(value.id)}${optional}: ${toTypeScriptType(value.type)};`;
  });
}

function toTypeScriptType(type: AionScalarType): string {
  switch (type) {
    case "string":
    case "uuid":
    case "datetime":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "json":
      return "unknown";
  }
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(value: string): string {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function safePropertyName(value: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value) ? value : JSON.stringify(value);
}

function pluralize(value: string): string {
  if (value.endsWith("y")) {
    return `${value.slice(0, -1)}ies`;
  }

  if (value.endsWith("s")) {
    return `${value}es`;
  }

  return `${value}s`;
}
