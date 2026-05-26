export interface AionRunInspectionOperation {
  id: string;
  actor: string;
  reads: string[];
  writes: string[];
  guardCount: number;
  effects: string[];
}

export interface AionRunInspection {
  programName: string;
  format: "aionx";
  version: "0.1";
  entityCount: number;
  operationCount: number;
  capabilities: string[];
  operations: AionRunInspectionOperation[];
}

export function inspectAionExecutionPlan(value: unknown): AionRunInspection {
  if (!isRecord(value)) {
    throw new Error("AIONX plan must be a JSON object.");
  }

  if (value.format !== "aionx") {
    throw new Error('AIONX plan format must be "aionx".');
  }

  if (value.version !== "0.1") {
    throw new Error('AIONX plan version must be "0.1".');
  }

  const program = requireRecord(value.program, "program");
  const programName = requireString(program.name, "program.name");
  const capabilities = requireStringArray(value.capabilities, "capabilities");
  const entities = requireArray(value.entities, "entities");
  const operations = requireArray(value.operations, "operations");

  return {
    programName,
    format: "aionx",
    version: "0.1",
    entityCount: entities.length,
    operationCount: operations.length,
    capabilities,
    operations: operations.map((operation, index) => inspectOperation(operation, index)),
  };
}

export function formatAionRunInspection(inspection: AionRunInspection): string {
  const lines = [
    `Program: ${inspection.programName}`,
    `Format: ${inspection.format}@${inspection.version}`,
    `Entities: ${inspection.entityCount}`,
    `Operations: ${inspection.operationCount}`,
    `Capabilities: ${inspection.capabilities.join(", ")}`,
    "",
    "Operations:",
  ];

  for (const operation of inspection.operations) {
    lines.push(`- ${operation.id}`);
    lines.push(`  actor: ${operation.actor}`);
    lines.push(`  reads: ${formatList(operation.reads)}`);
    lines.push(`  writes: ${formatList(operation.writes)}`);
    lines.push(`  guards: ${operation.guardCount}`);
    lines.push(`  effects: ${formatList(operation.effects)}`);
    lines.push("");
  }

  return `${trimTrailingBlankLines(lines).join("\n")}\n`;
}

function inspectOperation(value: unknown, index: number): AionRunInspectionOperation {
  const operation = requireRecord(value, `operations[${index}]`);

  return {
    id: requireString(operation.id, `operations[${index}].id`),
    actor: requireString(operation.actor, `operations[${index}].actor`),
    reads: requireStringArray(operation.reads, `operations[${index}].reads`),
    writes: requireStringArray(operation.writes, `operations[${index}].writes`),
    guardCount: requireStringArray(operation.guards, `operations[${index}].guards`).length,
    effects: requireStringArray(operation.effects, `operations[${index}].effects`),
  };
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`AIONX plan ${path} must be an object.`);
  }

  return value;
}

function requireArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`AIONX plan ${path} must be an array.`);
  }

  return value;
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`AIONX plan ${path} must be a non-empty string.`);
  }

  return value;
}

function requireStringArray(value: unknown, path: string): string[] {
  const array = requireArray(value, path);

  for (const [index, entry] of array.entries()) {
    if (typeof entry !== "string") {
      throw new Error(`AIONX plan ${path}[${index}] must be a string.`);
    }
  }

  return array as string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(", ") : "none";
}

function trimTrailingBlankLines(lines: string[]): string[] {
  let end = lines.length;

  while (end > 0 && lines[end - 1] === "") {
    end -= 1;
  }

  return lines.slice(0, end);
}
