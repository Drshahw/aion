import type { AionActor, AionEntity, AionOperation, AionProgram } from "../../../ir/types.js";

export interface MermaidCompileOptions {
  direction?: "LR" | "TD";
  header?: boolean;
}

export function compileToMermaid(program: AionProgram, options: MermaidCompileOptions = {}): string {
  const direction = options.direction ?? "LR";
  const includeHeader = options.header ?? true;
  const lines: string[] = [];

  if (includeHeader) {
    lines.push("%% Generated from AION program: " + sanitizeMermaidText(program.metadata.name));
  }

  lines.push(`flowchart ${direction}`);
  lines.push("  classDef actor fill:#eef,stroke:#667,stroke-width:1px;");
  lines.push("  classDef entity fill:#efe,stroke:#686,stroke-width:1px;");
  lines.push("  classDef operation fill:#ffe,stroke:#aa7,stroke-width:1px;");
  lines.push("  classDef guard fill:#f8f8ff,stroke:#88a,stroke-dasharray: 4 3;");
  lines.push("  classDef effect fill:#fff0f0,stroke:#a88,stroke-dasharray: 4 3;");
  lines.push("");

  for (const actor of program.actors) {
    lines.push(compileActor(actor));
  }

  for (const entity of program.entities) {
    lines.push(compileEntity(entity));
  }

  for (const operation of program.operations) {
    lines.push(compileOperation(operation));
  }

  lines.push("");

  for (const operation of program.operations) {
    lines.push(...compileOperationEdges(operation));
  }

  return `${lines.join("\n").trim()}\n`;
}

function compileActor(actor: AionActor): string {
  const id = nodeId("actor", actor.id);
  const label = `${actor.id}<br/>${actor.role}`;
  return `  ${id}["${escapeLabel(label)}"]:::actor`;
}

function compileEntity(entity: AionEntity): string {
  const id = nodeId("entity", entity.id);
  const label = `${entity.id}<br/>entity`;
  return `  ${id}[("${escapeLabel(label)}")]:::entity`;
}

function compileOperation(operation: AionOperation): string {
  const id = nodeId("operation", operation.id);
  const label = `${operation.id}<br/>${operation.intent}`;
  return `  ${id}(["${escapeLabel(label)}"]):::operation`;
}

function compileOperationEdges(operation: AionOperation): string[] {
  const lines: string[] = [];
  const operationId = nodeId("operation", operation.id);
  const actorId = nodeId("actor", operation.actor);

  lines.push(`  ${actorId} -->|acts| ${operationId}`);

  for (const entity of operation.reads ?? []) {
    lines.push(`  ${operationId} -.->|reads| ${nodeId("entity", entity)}`);
  }

  for (const entity of operation.writes ?? []) {
    lines.push(`  ${operationId} -->|writes| ${nodeId("entity", entity)}`);
  }

  (operation.guards ?? []).forEach((guard, index) => {
    const guardId = nodeId("guard", operation.id, index);
    lines.push(`  ${guardId}{"${escapeLabel(guard)}"}:::guard`);
    lines.push(`  ${guardId} -.->|guards| ${operationId}`);
  });

  (operation.effects ?? []).forEach((effect, index) => {
    const effectId = nodeId("effect", operation.id, index);
    lines.push(`  ${operationId} -.->|effect| ${effectId}["${escapeLabel(effect)}"]:::effect`);
  });

  return lines;
}

function nodeId(prefix: string, value: string, index?: number): string {
  const suffix = index === undefined ? "" : `_${index}`;
  return `${prefix}_${value.replace(/[^a-zA-Z0-9_]/g, "_")}${suffix}`;
}

function escapeLabel(value: string): string {
  return sanitizeMermaidText(value).replace(/"/g, "&quot;");
}

function sanitizeMermaidText(value: string): string {
  return value.replace(/\r?\n/g, " ").trim();
}
