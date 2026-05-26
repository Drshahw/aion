import { execFileSync } from "node:child_process";

const generated = execFileSync(
  "node",
  ["dist/src/cli.js", "compile", "aionx", "examples/car-rental-system.aion.json"],
  { encoding: "utf8" },
);

const plan = JSON.parse(generated);

if (plan.format !== "aionx") {
  throw new Error("Expected AIONX plan format to be aionx.");
}

if (plan.version !== "0.1") {
  throw new Error("Expected AIONX plan version to be 0.1.");
}

if (plan.program.name !== "car-rental-billing") {
  throw new Error("Expected AIONX plan to include program name.");
}

if (!Array.isArray(plan.entities) || plan.entities.length < 1) {
  throw new Error("Expected AIONX plan to include entities.");
}

if (!Array.isArray(plan.operations) || plan.operations.length < 1) {
  throw new Error("Expected AIONX plan to include operations.");
}

if (!plan.operations.some((operation) => operation.id === "invoice.create")) {
  throw new Error("Expected AIONX plan to include invoice.create operation.");
}

if (!plan.capabilities.includes("audit-log")) {
  throw new Error("Expected AIONX plan to include audit-log capability.");
}

console.log("AIONX compiler smoke test passed.");
