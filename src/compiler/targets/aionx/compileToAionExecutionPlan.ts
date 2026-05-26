import type { AionOperation, AionProgram } from "../../../ir/types.js";
import { createRuntimeManifest } from "../../../runtime/createRuntimeManifest.js";

export interface AionExecutionPlanEntity {
  id: string;
  fields: Array<{
    id: string;
    type: string;
    required: boolean;
  }>;
}

export interface AionExecutionPlanOperation {
  id: string;
  actor: string;
  intent: string;
  reads: string[];
  writes: string[];
  inputs: Array<{
    id: string;
    type: string;
    required: boolean;
  }>;
  outputs: Array<{
    id: string;
    type: string;
    required: boolean;
  }>;
  guards: string[];
  effects: string[];
  invariants: string[];
  tests: string[];
  execution: {
    mode: "deferred";
    status: "stub";
  };
}

export interface AionExecutionPlan {
  format: "aionx";
  version: "0.1";
  program: {
    name: string;
    description?: string;
    version: string;
  };
  capabilities: string[];
  entities: AionExecutionPlanEntity[];
  operations: AionExecutionPlanOperation[];
}

export function compileToAionExecutionPlan(program: AionProgram): AionExecutionPlan {
  const manifest = createRuntimeManifest(program);

  return {
    format: "aionx",
    version: "0.1",
    program: {
      name: program.metadata.name,
      ...(program.metadata.description ? { description: program.metadata.description } : {}),
      version: program.metadata.version ?? program.aion,
    },
    capabilities: manifest.capabilities,
    entities: program.entities.map((entity) => ({
      id: entity.id,
      fields: entity.fields.map((field) => ({
        id: field.id,
        type: field.type,
        required: field.required ?? false,
      })),
    })),
    operations: program.operations.map(compileOperation),
  };
}

function compileOperation(operation: AionOperation): AionExecutionPlanOperation {
  return {
    id: operation.id,
    actor: operation.actor,
    intent: operation.intent,
    reads: operation.reads ?? [],
    writes: operation.writes ?? [],
    inputs: (operation.inputs ?? []).map((input) => ({
      id: input.id,
      type: input.type,
      required: input.required ?? false,
    })),
    outputs: (operation.outputs ?? []).map((output) => ({
      id: output.id,
      type: output.type,
      required: output.required ?? false,
    })),
    guards: operation.guards ?? [],
    effects: operation.effects ?? [],
    invariants: operation.invariants ?? [],
    tests: operation.tests ?? [],
    execution: {
      mode: "deferred",
      status: "stub",
    },
  };
}

export function compileToAionExecutionPlanJson(program: AionProgram): string {
  return `${JSON.stringify(compileToAionExecutionPlan(program), null, 2)}\n`;
}
