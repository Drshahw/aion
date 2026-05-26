export type AionScalarType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "uuid"
  | "datetime"
  | "json";

export type AionActorRole = "human" | "agent" | "system" | "service";

export interface AionMetadata {
  name: string;
  description?: string;
  version?: string;
  tags?: string[];
}

export interface AionActor {
  id: string;
  role: AionActorRole;
  description?: string;
}

export interface AionField {
  id: string;
  type: AionScalarType;
  required?: boolean;
  description?: string;
  default?: unknown;
}

export interface AionEntity {
  id: string;
  description?: string;
  fields: AionField[];
}

export interface AionIO {
  id: string;
  type: AionScalarType;
  required?: boolean;
  description?: string;
}

export interface AionOperation {
  id: string;
  intent: string;
  actor: string;
  reads?: string[];
  writes?: string[];
  inputs?: AionIO[];
  outputs?: AionIO[];
  guards?: string[];
  effects?: string[];
  invariants?: string[];
  tests?: string[];
}

export interface AionProgram {
  aion: "0.1";
  kind: "system";
  metadata: AionMetadata;
  actors: AionActor[];
  entities: AionEntity[];
  operations: AionOperation[];
}

export interface AionDiagnostic {
  level: "error" | "warning";
  code: string;
  message: string;
  path?: string;
}

export interface AionValidationResult {
  ok: boolean;
  diagnostics: AionDiagnostic[];
}
