import type { AionProgram } from "../ir/types.js";

export class AionParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AionParseError";
  }
}

export function parseAionProgram(input: string): AionProgram {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown JSON parse error";
    throw new AionParseError(`Invalid AION JSON: ${detail}`);
  }

  if (!isRecord(parsed)) {
    throw new AionParseError("AION program must be a JSON object.");
  }

  return parsed as unknown as AionProgram;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
