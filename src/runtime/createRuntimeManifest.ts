import type { AionProgram } from "../ir/types.js";

export interface AionRuntimeManifest {
  name: string;
  version: string;
  actors: string[];
  entities: string[];
  operations: string[];
  capabilities: string[];
}

export function createRuntimeManifest(program: AionProgram): AionRuntimeManifest {
  return {
    name: program.metadata.name,
    version: program.metadata.version ?? program.aion,
    actors: program.actors.map((actor) => actor.id),
    entities: program.entities.map((entity) => entity.id),
    operations: program.operations.map((operation) => operation.id),
    capabilities: inferCapabilities(program),
  };
}

function inferCapabilities(program: AionProgram): string[] {
  const capabilities = new Set<string>();

  for (const operation of program.operations) {
    if ((operation.reads?.length ?? 0) > 0) capabilities.add("read");
    if ((operation.writes?.length ?? 0) > 0) capabilities.add("write");
    if ((operation.guards?.length ?? 0) > 0) capabilities.add("guarded-execution");
    if ((operation.effects ?? []).some((effect) => effect.startsWith("audit.log"))) capabilities.add("audit-log");
    if ((operation.tests?.length ?? 0) > 0) capabilities.add("test-generation");
  }

  return [...capabilities].sort();
}
