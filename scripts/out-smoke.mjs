import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "aion-out-"));
const aionxPath = join(tempDir, "app.aionx.json");
const graphPath = join(tempDir, "system.mmd");

try {
  const aionxOutput = execFileSync(
    "node",
    ["dist/src/cli.js", "compile", "aionx", "examples/car-rental-system.aion.json", "--out", aionxPath],
    { encoding: "utf8" },
  );

  if (!aionxOutput.includes(`Wrote ${aionxPath}`)) {
    throw new Error("Expected compile aionx --out to confirm written path.");
  }

  if (!existsSync(aionxPath)) {
    throw new Error("Expected compile aionx --out to create the output file.");
  }

  const plan = JSON.parse(readFileSync(aionxPath, "utf8"));

  if (plan.format !== "aionx") {
    throw new Error("Expected written AIONX file to have format aionx.");
  }

  const runOutput = execFileSync("node", ["dist/src/cli.js", "run", aionxPath], { encoding: "utf8" });

  if (!runOutput.includes("Program: car-rental-billing")) {
    throw new Error("Expected run output to include the program name.");
  }

  if (!runOutput.includes("Format: aionx@0.1")) {
    throw new Error("Expected run output to include the AIONX format.");
  }

  const graphOutput = execFileSync(
    "node",
    ["dist/src/cli.js", "graph", "examples/car-rental-system.aion.json", "--out", graphPath],
    { encoding: "utf8" },
  );

  if (!graphOutput.includes(`Wrote ${graphPath}`)) {
    throw new Error("Expected graph --out to confirm written path.");
  }

  if (!existsSync(graphPath)) {
    throw new Error("Expected graph --out to create the output file.");
  }

  const graph = readFileSync(graphPath, "utf8");

  if (!graph.includes("flowchart LR")) {
    throw new Error("Expected written Mermaid graph to include flowchart LR.");
  }

  console.log("AION output file smoke test passed.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
