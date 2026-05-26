#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { compileAionProgramToPlan } from "./compiler/compileAionProgramToPlan.js";
import { parseAionProgram, AionParseError } from "./parser/parseAionProgram.js";
import { createRuntimeManifest } from "./runtime/createRuntimeManifest.js";
import { validateAionProgram } from "./validator/validateAionProgram.js";

const [, , command, filePath] = process.argv;

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (!filePath) {
  fail(`Missing input file for command: ${command}`);
}

try {
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

function printHelp(): void {
  const executable = basename(process.argv[1] ?? "aion");
  console.log(`AION CLI\n\nUsage:\n  ${executable} validate <file.aion.json>\n  ${executable} plan <file.aion.json>\n  ${executable} manifest <file.aion.json>\n\nCommands:\n  validate   Parse and validate an AION IR file.\n  plan       Validate and generate a compile plan.\n  manifest   Validate and generate a runtime manifest.\n`);
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function fail(message: string): never {
  console.error(`AION error: ${message}`);
  process.exit(1);
}
