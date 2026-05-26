import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "aion-executable-ts-"));
const runtimeTsPath = join(tempDir, "generated-runtime.ts");
const runtimeJsPath = join(tempDir, "dist", "generated-runtime.js");
const tsconfigPath = join(tempDir, "tsconfig.json");

try {
  const compileOutput = execFileSync(
    "node",
    ["dist/src/cli.js", "compile", "executable-ts", "examples/car-rental-system.aion.json", "--out", runtimeTsPath],
    { encoding: "utf8" },
  );

  if (!compileOutput.includes(`Wrote ${runtimeTsPath}`)) {
    throw new Error("Expected executable-ts compile output to confirm the written file.");
  }

  if (!existsSync(runtimeTsPath)) {
    throw new Error("Expected executable-ts compile output file to exist.");
  }

  writeFileSync(
    tsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          outDir: "./dist",
          rootDir: ".",
          strict: true,
          skipLibCheck: true,
        },
        include: ["./generated-runtime.ts"],
      },
      null,
      2,
    ),
    "utf8",
  );

  execFileSync("node", ["node_modules/typescript/bin/tsc", "-p", tsconfigPath], { stdio: "inherit" });

  const runtimeModule = await import(pathToFileURL(runtimeJsPath).href);
  const { resetStore, seedCustomer, seedVehicle, invoiceCreate, invoiceViewOwn, store } = runtimeModule;

  for (const [name, value] of Object.entries({ resetStore, seedCustomer, seedVehicle, invoiceCreate, invoiceViewOwn, store })) {
    if (value === undefined) {
      throw new Error(`Expected generated runtime to export ${name}.`);
    }
  }

  resetStore();
  seedCustomer({ id: "cust_1", full_name: "Test Customer", phone: "123" });
  seedVehicle({ id: "veh_1", plate_number: "A123", model: "Test Car" });

  const created = invoiceCreate(
    { id: "admin_1", role: "admin" },
    {
      customer_id: "cust_1",
      vehicle_id: "veh_1",
      rent_amount: 1600,
      fines_amount: 400,
      salik_amount: 80,
    },
  );

  if (typeof created.invoice_id !== "string" || created.invoice_id.length === 0) {
    throw new Error("Expected invoiceCreate to return an invoice_id.");
  }

  if (store.invoices.length !== 1) {
    throw new Error("Expected invoiceCreate to write one invoice into the store.");
  }

  if (store.invoices[0].total_amount !== 2080) {
    throw new Error("Expected invoice total_amount to equal 2080.");
  }

  if (!store.auditLogs.some((entry) => entry.event === "audit.log:invoice.create")) {
    throw new Error("Expected invoiceCreate to append an audit log entry.");
  }

  assertThrows(
    () =>
      invoiceCreate(
        { id: "customer_1", role: "customer" },
        {
          customer_id: "cust_1",
          vehicle_id: "veh_1",
          rent_amount: 1600,
          fines_amount: 400,
          salik_amount: 80,
        },
      ),
    "invoice.create guard should reject non-admin actors.",
  );

  assertThrows(
    () =>
      invoiceCreate(
        { id: "admin_1", role: "admin" },
        {
          customer_id: "cust_1",
          vehicle_id: "veh_1",
          rent_amount: -1,
          fines_amount: 0,
          salik_amount: 0,
        },
      ),
    "invoice.create guard should reject negative amounts.",
  );

  const viewedInvoice = invoiceViewOwn(
    { id: "customer_1", role: "customer", customer_id: "cust_1" },
    { invoice_id: created.invoice_id },
  );

  if (viewedInvoice.customer_id !== "cust_1") {
    throw new Error("Expected invoiceViewOwn to return the invoice for the owning customer.");
  }

  assertThrows(
    () =>
      invoiceViewOwn(
        { id: "customer_2", role: "customer", customer_id: "cust_2" },
        { invoice_id: created.invoice_id },
      ),
    "invoice.view_own guard should reject another customer.",
  );

  if (!store.auditLogs.some((entry) => entry.event === "audit.log:invoice.view_own")) {
    throw new Error("Expected invoiceViewOwn to append an audit log entry.");
  }

  const generatedSource = readFileSync(runtimeTsPath, "utf8");

  if (!generatedSource.includes("// AION operation: invoice.create")) {
    throw new Error("Expected generated runtime to include invoice.create mapping comments.");
  }

  console.log("AION executable TypeScript compiler smoke test passed.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

function assertThrows(action, message) {
  let threw = false;

  try {
    action();
  } catch (error) {
    threw = error instanceof Error;
  }

  if (!threw) {
    throw new Error(message);
  }
}
