import type { AionProgram } from "../ir/types.js";

export interface AionCompileStep {
  id: string;
  target: "schema" | "operation" | "guard" | "effect" | "test";
  description: string;
  source: string;
}

export interface AionCompilePlan {
  programName: string;
  steps: AionCompileStep[];
}

export function compileAionProgramToPlan(program: AionProgram): AionCompilePlan {
  const steps: AionCompileStep[] = [];

  for (const entity of program.entities) {
    steps.push({
      id: `schema.${entity.id}`,
      target: "schema",
      description: `Create schema artifact for entity ${entity.id}.`,
      source: entity.id,
    });
  }

  for (const operation of program.operations) {
    steps.push({
      id: `operation.${operation.id}`,
      target: "operation",
      description: `Create operation artifact for ${operation.id}.`,
      source: operation.id,
    });

    for (const guard of operation.guards ?? []) {
      steps.push({
        id: `guard.${operation.id}.${slug(guard)}`,
        target: "guard",
        description: `Create guard artifact for ${operation.id}.`,
        source: operation.id,
      });
    }

    for (const effect of operation.effects ?? []) {
      steps.push({
        id: `effect.${operation.id}.${slug(effect)}`,
        target: "effect",
        description: `Create effect artifact for ${operation.id}.`,
        source: operation.id,
      });
    }

    for (const test of operation.tests ?? []) {
      steps.push({
        id: `test.${operation.id}.${slug(test)}`,
        target: "test",
        description: `Create test artifact for ${operation.id}.`,
        source: operation.id,
      });
    }
  }

  return { programName: program.metadata.name, steps };
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "step";
}
