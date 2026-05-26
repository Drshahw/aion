import { execFileSync } from "node:child_process";

const generated = execFileSync(
  "node",
  ["dist/src/cli.js", "graph", "examples/car-rental-system.aion.json"],
  { encoding: "utf8" },
);

if (!generated.includes("flowchart LR")) {
  throw new Error("Expected generated graph to be a Mermaid flowchart.");
}

if (!generated.includes("operation_invoice_create")) {
  throw new Error("Expected generated graph to include invoice.create operation node.");
}

if (!generated.includes("entity_invoice")) {
  throw new Error("Expected generated graph to include invoice entity node.");
}

if (!generated.includes("-->|writes|")) {
  throw new Error("Expected generated graph to include write edges.");
}

if (!generated.includes("-.->|reads|")) {
  throw new Error("Expected generated graph to include read edges.");
}

console.log("AION graph exporter smoke test passed.");
