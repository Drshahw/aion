#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { compileAionProgramToPlan } from "./compiler/compileAionProgramToPlan.js";
import { compileToAionExecutionPlanJson } from "./compiler/targets/aionx/compileToAionExecutionPlan.js";
import { compileToMermaid } from "./compiler/targets/graph/compileToMermaid.js";
import { compileToSql } from "./compiler/targets/sql/compileToSql.js";
import { compileToTypeScript } from "./compiler/targets/typescript/compileToTypeScript.js";
import { createStarterProgramJson } from "./init/createStarterProgram.js";
import { parseAionProgram, AionParseError } from "./parser/parseAionProgram.js";
import { createRuntimeManifest } from "./runtime/createRuntimeManifest.js";
import { formatAionRunInspection, inspectAionExecutionPlan } from "./runtime/inspectAionExecutionPlan.js";
import { validateAionProgram } from "./validator/validateAionProgram.js";

const COMPILE_TARGETS = new Set(["typescript", "sql", "mermaid", "aionx"]);
const OUTPUT_FLAGS = new Set(["--out", "-o"]);
const [, , command, ...args] = process.argv;

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (command === "init") {
  const outputPath = args[0] ?? "project.aion.json";

  if (existsSync(outputPath)) {
    fail(`Refusing to overwrite existing file: ${outputPath}`);
  }

  writeFileSync(outputPath, createStarterProgramJson(), "utf8");
  console.log(`Created ${outputPath}`);
  process.exit(0);
}

const filePath = resolveFilePath(command, args);

if (!filePath) {
  fail(`Missing input file for command: ${command}`);
}

try {
  if (command === "run") {
    const source = readFileSync(filePath, "utf8");
    const inspection = inspectAionExecutionPlan(JSON.parse(source) as unknown);
    process.stdout.write(formatAionRunInspection(inspection));
    process.exit(0);
  }

  const source = readFileSync(filePath, "utf8");
  const program = parseAionProgram(source);

  switch (command) {
    case "validate": {
      const result = validateAionProgram(program);
      printJson(result);
      process.exit(result.ok ? 0 : 1);
    }

    case "plan": {
      const validation = validateAionProgram(program);
      if (!validation.ok) {
        printJson(validation);
        process.exit(1);
      }
      printJson(compileAionProgramToPlan(program));
      process.exit(0);
    }

    case "manifest": {
      const validation = validateAionProgram(program);
      if (!validation.ok) {
        printJson(validation);
        process.exit(1);
      }
      printJson(createRuntimeManifest(program));
      process.exit(0);
    }

    case "graph": {
      const validation = validateAionProgram(program);
      if (!validation.ok) {
        printJson(validation);
        process.exit(1);
      }
      writeOrPrint(compileToMermaid(program), resolveOutPath(args));
      process.exit(0);
    }

    case "compile": {
      const target = resolveTarget(args);
      const outPath = resolveOutPath(args);
      const validation = validateAionProgram(program);
      if (!validation.ok) {
        printJson(validation);
        process.exit(1);
      }

      if (target === "typescript") {
        writeOrPrint(compileToTypeScript(program), outPath);
        process.exit(0);
      }

      if (target === "sql") {
        writeOrPrint(compileToSql(program), outPath);
        process.exit(0);
      }

      if (target === "mermaid") {
        writeOrPrint(compileToMermaid(program), outPath);
        process.exit(0);
      }

      if (target === "aionx") {
        writeOrPrint(compileToAionExecutionPlanJson(program), outPath);
        process.exit(0);
      }

      fail(`Unsupported compile target: ${target ?? "missing"}`);
    }

    default:
      fail(`Unknown command: ${command}`);
  }
} catch (error) {
  if (error instanceof AionParseError) {
    fail(error.message);
  }

  if (error instanceof Error) {
    fail(error.message);
  }

  fail("Unknown AION CLI error.");
}

function resolveFilePath(command: string, args: string[]): string | undefined {
  const ignoredIndexes = getFlagValueIndexes(args, new Set(["--target", "-t", ...OUTPUT_FLAGS]));

  if (command === "compile") {
    return args.find(
      (arg, index) => !isOption(arg) && !ignoredIndexes.has(index) && !COMPILE_TARGETS.has(arg),
    );
  }

  return args.find((arg, index) => !isOption(arg) && !ignoredIndexes.has(index));
}

function resolveTarget(args: string[]): string | undefined {
  const targetFlagIndex = args.findIndex((arg) => arg === "--target" || arg === "-t");
  if (targetFlagIndex >= 0) {
    return args[targetFlagIndex + 1];
  }

  return args.find((arg) => COMPILE_TARGETS.has(arg));
}

function resolveOutPath(args: string[]): string | undefined {
  const outFlagIndex = args.findIndex((arg) => OUTPUT_FLAGS.has(arg));
  if (outFlagIndex < 0) {
    return undefined;
  }

  const outPath = args[outFlagIndex + 1];
  if (!outPath || isOption(outPath)) {
    throw new Error(`Missing output file path after ${args[outFlagIndex]}.`);
  }

  return outPath;
}

function writeOrPrint(output: string, outPath?: string): void {
  if (outPath) {
    writeFileSync(outPath, output, "utf8");
    console.log(`Wrote ${outPath}`);
    return;
  }

  process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
}

function printHelp(): void {
  const executable = basename(process.argv[1] ?? "aion");
  console.log(`AION CLI\n\nUsage:\n  ${executable} init [file.aion.json]\n  ${executable} validate <file.aion.json>\n  ${executable} plan <file.aion.json>\n  ${executable} manifest <file.aion.json>\n  ${executable} graph <file.aion.json> [--out file]\n  ${executable} run <file.aionx.json>\n  ${executable} compile typescript <file.aion.json> [--out file]\n  ${executable} compile sql <file.aion.json> [--out file]\n  ${executable} compile mermaid <file.aion.json> [--out file]\n  ${executable} compile aionx <file.aion.json> [--out file]\n  ${executable} compile --target typescript <file.aion.json> [--out file]\n  ${executable} compile --target sql <file.aion.json> [--out file]\n  ${executable} compile --target mermaid <file.aion.json> [--out file]\n  ${executable} compile --target aionx <file.aion.json> [--out file]\n\nCommands:\n  init       Create a starter AION IR file.\n  validate   Parse and validate an AION IR file.\n  plan       Validate and generate a compile plan.\n  manifest   Validate and generate a runtime manifest.\n  graph      Validate and export AION IR as a Mermaid graph.\n  run        Inspect an AIONX execution plan.\n  compile    Validate and compile AION IR to a target artifact.\n\nOptions:\n  -o, --out  Write generated artifacts as UTF-8 instead of printing to stdout.\n`);
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function getFlagValueIndexes(args: string[], flags: Set<string>): Set<number> {
  const indexes = new Set<number>();

  for (const [index, arg] of args.entries()) {
    if (flags.has(arg)) {
      const valueIndex = index + 1;
      if (valueIndex < args.length) {
        indexes.add(valueIndex);
      }
    }
  }

  return indexes;
}

function isOption(value: string): boolean {
  return value.startsWith("-");
}

function fail(message: string): never {
  console.error(`AION error: ${message}`);
  process.exit(1);
}
