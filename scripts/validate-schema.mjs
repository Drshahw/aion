import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const schemaPath = join(root, "schema", "aion-0.1.schema.json");
const validExamplePath = join(root, "examples", "car-rental-system.aion.json");
const invalidExamplePath = join(root, "examples", "invalid", "missing-actor.aion.json");

const ajv = new Ajv2020({ allErrors: true });
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const validate = ajv.compile(schema);

const validExample = JSON.parse(readFileSync(validExamplePath, "utf8"));
const invalidExample = JSON.parse(readFileSync(invalidExamplePath, "utf8"));

const validResult = validate(validExample);
if (!validResult) {
  console.error("Expected valid example to pass schema validation.");
  console.error(validate.errors);
  process.exit(1);
}

const invalidResult = validate(invalidExample);
if (invalidResult) {
  console.error("Expected invalid example to fail schema validation.");
  process.exit(1);
}

console.log("AION schema validation passed.");
