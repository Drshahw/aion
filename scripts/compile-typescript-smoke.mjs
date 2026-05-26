import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "tmp");
const outputPath = join(outputDir, "car-rental-system.generated.ts");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

const generated = execFileSync(
  "node",
  ["dist/src/cli.js", "compile", "--target", "typescript", "examples/car-rental-system.aion.json"],
  { encoding: "utf8" },
);

if (!generated.includes("export interface Customer")) {
  throw new Error("Expected generated TypeScript to include Customer interface.");
}

if (!generated.includes("export async function invoiceCreate")) {
  throw new Error("Expected generated TypeScript to include invoiceCreate operation stub.");
}

writeFileSync(outputPath, generated);

execFileSync("npx", ["tsc", "--target", "ES2022", "--module", "NodeNext", "--moduleResolution", "NodeNext", "--strict", "--noEmit", outputPath], {
  stdio: "inherit",
});

console.log("AION TypeScript compiler smoke test passed.");
