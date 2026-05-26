import type { AionDiagnostic, AionProgram, AionValidationResult } from "../ir/types.js";

const VALID_SCALAR_TYPES = new Set([
  "string",
  "number",
  "integer",
  "boolean",
  "uuid",
  "datetime",
  "json",
]);

const VALID_ACTOR_ROLES = new Set(["human", "agent", "system", "service"]);

export function validateAionProgram(program: AionProgram): AionValidationResult {
  const diagnostics: AionDiagnostic[] = [];

  if (program.aion !== "0.1") {
    diagnostics.push(error("AION_VERSION_UNSUPPORTED", "Only AION version 0.1 is currently supported.", "aion"));
  }

  if (program.kind !== "system") {
    diagnostics.push(error("AION_KIND_UNSUPPORTED", "Only kind=system is currently supported.", "kind"));
  }

  if (!program.metadata?.name) {
    diagnostics.push(error("METADATA_NAME_REQUIRED", "metadata.name is required.", "metadata.name"));
  }

  validateActors(program, diagnostics);
  validateEntities(program, diagnostics);
  validateOperations(program, diagnostics);

  return {
    ok: diagnostics.every((diagnostic) => diagnostic.level !== "error"),
    diagnostics,
  };
}

function validateActors(program: AionProgram, diagnostics: AionDiagnostic[]): void {
  if (!Array.isArray(program.actors) || program.actors.length === 0) {
    diagnostics.push(error("ACTORS_REQUIRED", "At least one actor is required.", "actors"));
    return;
  }

  const actorIds = new Set<string>();

  program.actors.forEach((actor, index) => {
    const path = `actors.${index}`;

    if (!actor.id) {
      diagnostics.push(error("ACTOR_ID_REQUIRED", "Actor id is required.", `${path}.id`));
    } else if (actorIds.has(actor.id)) {
      diagnostics.push(error("ACTOR_ID_DUPLICATE", `Duplicate actor id: ${actor.id}.`, `${path}.id`));
    } else {
      actorIds.add(actor.id);
    }

    if (!VALID_ACTOR_ROLES.has(actor.role)) {
      diagnostics.push(error("ACTOR_ROLE_INVALID", `Invalid actor role: ${actor.role}.`, `${path}.role`));
    }
  });
}

function validateEntities(program: AionProgram, diagnostics: AionDiagnostic[]): void {
  if (!Array.isArray(program.entities) || program.entities.length === 0) {
    diagnostics.push(warning("ENTITIES_EMPTY", "No entities were defined. This may be valid for pure workflow programs.", "entities"));
    return;
  }

  const entityIds = new Set<string>();

  program.entities.forEach((entity, entityIndex) => {
    const entityPath = `entities.${entityIndex}`;

    if (!entity.id) {
      diagnostics.push(error("ENTITY_ID_REQUIRED", "Entity id is required.", `${entityPath}.id`));
    } else if (entityIds.has(entity.id)) {
      diagnostics.push(error("ENTITY_ID_DUPLICATE", `Duplicate entity id: ${entity.id}.`, `${entityPath}.id`));
    } else {
      entityIds.add(entity.id);
    }

    if (!Array.isArray(entity.fields) || entity.fields.length === 0) {
      diagnostics.push(error("ENTITY_FIELDS_REQUIRED", `Entity ${entity.id} must define at least one field.`, `${entityPath}.fields`));
      return;
    }

    const fieldIds = new Set<string>();
    let hasIdField = false;

    entity.fields.forEach((field, fieldIndex) => {
      const fieldPath = `${entityPath}.fields.${fieldIndex}`;

      if (!field.id) {
        diagnostics.push(error("FIELD_ID_REQUIRED", "Field id is required.", `${fieldPath}.id`));
      } else if (fieldIds.has(field.id)) {
        diagnostics.push(error("FIELD_ID_DUPLICATE", `Duplicate field id ${field.id} on entity ${entity.id}.`, `${fieldPath}.id`));
      } else {
        fieldIds.add(field.id);
      }

      if (field.id === "id") {
        hasIdField = true;
      }

      if (!VALID_SCALAR_TYPES.has(field.type)) {
        diagnostics.push(error("FIELD_TYPE_INVALID", `Invalid field type: ${field.type}.`, `${fieldPath}.type`));
      }
    });

    if (!hasIdField) {
      diagnostics.push(warning("ENTITY_ID_FIELD_MISSING", `Entity ${entity.id} has no id field.`, `${entityPath}.fields`));
    }
  });
}

function validateOperations(program: AionProgram, diagnostics: AionDiagnostic[]): void {
  if (!Array.isArray(program.operations) || program.operations.length === 0) {
    diagnostics.push(error("OPERATIONS_REQUIRED", "At least one operation is required.", "operations"));
    return;
  }

  const actorIds = new Set(program.actors?.map((actor) => actor.id) ?? []);
  const entityIds = new Set(program.entities?.map((entity) => entity.id) ?? []);
  const operationIds = new Set<string>();

  program.operations.forEach((operation, operationIndex) => {
    const operationPath = `operations.${operationIndex}`;

    if (!operation.id) {
      diagnostics.push(error("OPERATION_ID_REQUIRED", "Operation id is required.", `${operationPath}.id`));
    } else if (operationIds.has(operation.id)) {
      diagnostics.push(error("OPERATION_ID_DUPLICATE", `Duplicate operation id: ${operation.id}.`, `${operationPath}.id`));
    } else {
      operationIds.add(operation.id);
    }

    if (!operation.intent) {
      diagnostics.push(error("OPERATION_INTENT_REQUIRED", `Operation ${operation.id} must include intent.`, `${operationPath}.intent`));
    }

    if (!operation.actor || !actorIds.has(operation.actor)) {
      diagnostics.push(error("OPERATION_ACTOR_UNKNOWN", `Operation ${operation.id} references unknown actor: ${operation.actor}.`, `${operationPath}.actor`));
    }

    validateEntityReferences(operation.reads, entityIds, diagnostics, `${operationPath}.reads`, "read", operation.id);
    validateEntityReferences(operation.writes, entityIds, diagnostics, `${operationPath}.writes`, "write", operation.id);

    if ((operation.writes?.length ?? 0) > 0 && (operation.effects ?? []).every((effect) => !effect.startsWith("audit.log"))) {
      diagnostics.push(warning("WRITE_WITHOUT_AUDIT", `Operation ${operation.id} writes data but has no audit.log effect.`, `${operationPath}.effects`));
    }

    if ((operation.guards?.length ?? 0) === 0) {
      diagnostics.push(warning("OPERATION_GUARDS_EMPTY", `Operation ${operation.id} has no guards or permission constraints.`, `${operationPath}.guards`));
    }

    if ((operation.tests?.length ?? 0) === 0) {
      diagnostics.push(warning("OPERATION_TESTS_EMPTY", `Operation ${operation.id} has no test expectations.`, `${operationPath}.tests`));
    }
  });
}

function validateEntityReferences(
  references: string[] | undefined,
  entityIds: Set<string>,
  diagnostics: AionDiagnostic[],
  path: string,
  action: "read" | "write",
  operationId: string,
): void {
  references?.forEach((reference, index) => {
    if (!entityIds.has(reference)) {
      diagnostics.push(error("OPERATION_ENTITY_UNKNOWN", `Operation ${operationId} references unknown ${action} entity: ${reference}.`, `${path}.${index}`));
    }
  });
}

function error(code: string, message: string, path?: string): AionDiagnostic {
  return { level: "error", code, message, path };
}

function warning(code: string, message: string, path?: string): AionDiagnostic {
  return { level: "warning", code, message, path };
}
