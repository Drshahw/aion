import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const cwd = mkdtempSync(join(tmpdir(), "aion-init-"));
const outputPath = join(cwd, "starter.aion.json");

const initOutput = execFileSync(
  "node",
  [join(process.cwd(), "dist", "src", "cli.js"), "init", outputPath],
  { encoding: "utf8" },
);

if (!initOutput.includes("Created")) {
  throw new Error("Expected init command to confirm file creation.");
}

if (!existsSync(outputPath)) {
  throw new Error("Expected init command to create starter file.");
}

const created = JSON.parse(readFileSync(outputPath, "utf8"));

if (created.aion !== "0.1") {
  throw new Error("Expected starter file to use AION version 0.1.");
}

const validationOutput = execFileSync(
  "node",
  [join(process.cwd(), "dist", "src", "cli.js"), "validate", outputPath],
  { encoding: "utf8" },
);

if (!validationOutput.includes('"ok": true')) {
  throw new Error("Expected generated starter file to validate successfully.");
}

try {
  execFileSync("node", [join(process.cwd(), "dist", "src", "cli.js"), "init", outputPath], {
    encoding: "utf8",
    stdio: "pipe",
  });
  throw new Error("Expected init command to refuse overwriting existing files.");
} catch (error) {
  const status = error && typeof error === "object" && "status" in error ? error.status : undefined;
  if (status === 0) {
    throw error;
  }
}

console.log("AION init smoke test passed.");
