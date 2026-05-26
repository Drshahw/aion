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
export { compileToExecutableTypeScript } from "./compiler/targets/executable-ts/compileToExecutableTypeScript.js";
export { compileToSql } from "./compiler/targets/sql/compileToSql.js";
export type { SqlCompileOptions } from "./compiler/targets/sql/compileToSql.js";
export { compileToMermaid } from "./compiler/targets/graph/compileToMermaid.js";
export type { MermaidCompileOptions } from "./compiler/targets/graph/compileToMermaid.js";
export { compileToAionExecutionPlan, compileToAionExecutionPlanJson } from "./compiler/targets/aionx/compileToAionExecutionPlan.js";
export type { AionExecutionPlan } from "./compiler/targets/aionx/compileToAionExecutionPlan.js";
export { createRuntimeManifest } from "./runtime/createRuntimeManifest.js";
export type { AionRuntimeManifest } from "./runtime/createRuntimeManifest.js";
export { inspectAionExecutionPlan, formatAionRunInspection } from "./runtime/inspectAionExecutionPlan.js";
export type { AionRunInspection, AionRunInspectionOperation } from "./runtime/inspectAionExecutionPlan.js";
