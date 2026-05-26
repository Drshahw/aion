export type {
  AionActor,
  AionActorRole,
  AionDiagnostic,
  AionEntity,
  AionField,
  AionIO,
  AionMetadata,
  AionOperation,
  AionProgram,
  AionScalarType,
  AionValidationResult,
} from "./ir/types.js";

export { AionParseError, parseAionProgram } from "./parser/parseAionProgram.js";
export { validateAionProgram } from "./validator/validateAionProgram.js";
export { compileAionProgramToPlan } from "./compiler/compileAionProgramToPlan.js";
export type { AionCompilePlan, AionCompileStep } from "./compiler/compileAionProgramToPlan.js";
export { compileToTypeScript } from "./compiler/targets/typescript/compileToTypeScript.js";
export type { TypeScriptCompileOptions } from "./compiler/targets/typescript/compileToTypeScript.js";
export { createRuntimeManifest } from "./runtime/createRuntimeManifest.js";
export type { AionRuntimeManifest } from "./runtime/createRuntimeManifest.js";
