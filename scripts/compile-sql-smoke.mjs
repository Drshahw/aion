import { execFileSync } from "node:child_process";

const generated = execFileSync(
  "node",
  ["dist/src/cli.js", "compile", "--target", "sql", "examples/car-rental-system.aion.json"],
  { encoding: "utf8" },
);

if (!generated.includes("CREATE TABLE IF NOT EXISTS \"customer\"")) {
  throw new Error("Expected generated SQL to include customer table.");
}

if (!generated.includes("CREATE TABLE IF NOT EXISTS \"invoice\"")) {
  throw new Error("Expected generated SQL to include invoice table.");
}

if (!generated.includes("PRIMARY KEY (\"id\")")) {
  throw new Error("Expected generated SQL to include primary key definition.");
}

if (!generated.includes("\"total_amount\" numeric NOT NULL")) {
  throw new Error("Expected generated SQL to include invoice total_amount column.");
}

console.log("AION SQL compiler smoke test passed.");
