import type { AionEntity, AionField, AionIO, AionOperation, AionProgram, AionScalarType } from "../../../ir/types.js";

export interface TypeScriptCompileOptions {
  header?: boolean;
}

export function compileToTypeScript(program: AionProgram, options: TypeScriptCompileOptions = {}): string {
  const includeHeader = options.header ?? true;
  const chunks: string[] = [];

  if (includeHeader) {
    chunks.push("/* eslint-disable */");
    chunks.push(`// Generated from AION program: ${program.metadata.name}`);
    chunks.push("// This file is a prototype artifact. Review behavior before production use.");
    chunks.push("");
  }

  for (const entity of program.entities) {
    chunks.push(compileEntityInterface(entity));
    chunks.push("");
  }

  for (const operation of program.operations) {
    chunks.push(compileOperationTypes(operation));
    chunks.push("");
    chunks.push(compileOperationStub(operation));
    chunks.push("");
  }

  return `${chunks.join("\n").trim()}\n`;
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

function compileOperationTypes(operation: AionOperation): string {
  const inputName = `${toPascalCase(operation.id)}Input`;
  const outputName = `${toPascalCase(operation.id)}Output`;

  return [
    `export interface ${inputName} {`,
    ...(operation.inputs ?? []).map((input) => `  ${compileIo(input)}`),
    "}",
    "",
    `export interface ${outputName} {`,
    ...(operation.outputs ?? []).map((output) => `  ${compileIo(output)}`),
    "}",
  ].join("\n");
}

function compileIo(io: AionIO): string {
  const optional = io.required ? "" : "?";
  return `${safePropertyName(io.id)}${optional}: ${toTypeScriptType(io.type)};`;
}

function compileOperationStub(operation: AionOperation): string {
  const functionName = toCamelCase(operation.id);
  const inputName = `${toPascalCase(operation.id)}Input`;
  const outputName = `${toPascalCase(operation.id)}Output`;
  const metadata = {
    actor: operation.actor,
    reads: operation.reads ?? [],
    writes: operation.writes ?? [],
    guards: operation.guards ?? [],
    effects: operation.effects ?? [],
    invariants: operation.invariants ?? [],
    tests: operation.tests ?? [],
  };

  return [
    "/**",
    ` * AION operation: ${operation.id}`,
    ` * Intent: ${operation.intent}`,
    " * Metadata:",
    ...JSON.stringify(metadata, null, 2).split("\n").map((line) => ` * ${line}`),
    " */",
    `export async function ${functionName}(input: ${inputName}): Promise<${outputName}> {`,
    "  void input;",
    `  throw new Error("AION operation stub not implemented: ${operation.id}");`,
    "}",
  ].join("\n");
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
