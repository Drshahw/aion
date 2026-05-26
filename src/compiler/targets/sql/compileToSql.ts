import type { AionEntity, AionField, AionProgram, AionScalarType } from "../../../ir/types.js";

export interface SqlCompileOptions {
  header?: boolean;
  dialect?: "postgres";
}

export function compileToSql(program: AionProgram, options: SqlCompileOptions = {}): string {
  const includeHeader = options.header ?? true;
  const chunks: string[] = [];

  if (includeHeader) {
    chunks.push("-- Generated from AION program: " + program.metadata.name);
    chunks.push("-- Dialect: PostgreSQL-compatible prototype DDL");
    chunks.push("-- Review before production use.");
    chunks.push("");
  }

  for (const entity of program.entities) {
    chunks.push(compileEntityTable(entity));
    chunks.push("");
  }

  return chunks.join("\n").trim() + "\n";
}

function compileEntityTable(entity: AionEntity): string {
  const tableName = quoteIdentifier(entity.id);
  const lines = [`CREATE TABLE IF NOT EXISTS ${tableName} (`];
  const fieldLines = entity.fields.map((field) => `  ${compileField(field)}`);

  const primaryKey = findPrimaryKey(entity);
  if (primaryKey) {
    fieldLines.push(`  PRIMARY KEY (${quoteIdentifier(primaryKey.id)})`);
  }

  lines.push(fieldLines.map((line, index) => `${line}${index === fieldLines.length - 1 ? "" : ","}`).join("\n"));
  lines.push(");");

  return lines.join("\n");
}

function compileField(field: AionField): string {
  const parts = [quoteIdentifier(field.id), toSqlType(field.type)];

  if (field.required) {
    parts.push("NOT NULL");
  }

  return parts.join(" ");
}

function findPrimaryKey(entity: AionEntity): AionField | undefined {
  return entity.fields.find((field) => field.id === "id" && field.type === "uuid");
}

function toSqlType(type: AionScalarType): string {
  switch (type) {
    case "string":
      return "text";
    case "number":
      return "numeric";
    case "integer":
      return "integer";
    case "boolean":
      return "boolean";
    case "uuid":
      return "uuid";
    case "datetime":
      return "timestamptz";
    case "json":
      return "jsonb";
  }
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, "\"\"")}"`;
}
