import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const outputDir = join(process.cwd(), "tmp");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

const tempDir = mkdtempSync(join(tmpdir(), "aionx-run-"));
const planPath = join(tempDir, "app.aionx.json");

try {
  const plan = execFileSync(
    "node",
    ["dist/src/cli.js", "compile", "aionx", "examples/car-rental-system.aion.json"],
    { encoding: "utf8" },
  );

  writeFileSync(planPath, plan, "utf8");

  const output = execFileSync("node", ["dist/src/cli.js", "run", planPath], { encoding: "utf8" });

  const expectedSnippets = [
    "Program: car-rental-billing",
    "Format: aionx@0.1",
    "Operations: 2",
    "invoice.create",
    "invoice.view_own",
    "audit.log:invoice.create",
  ];

  for (const snippet of expectedSnippets) {
    if (!output.includes(snippet)) {
      throw new Error(`Expected AIONX run output to include: ${snippet}`);
    }
  }

  console.log("AIONX run smoke test passed.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
