آره، این سند خیلی لازم می‌شود. اسم پیشنهادی فایل:

```text
docs/token-management.md
```

متن آماده برای Markdown:

````md
# AION Token Management Strategy

## Purpose

AION should reduce token usage for AI coding agents by replacing large, repeated natural-language and source-code context with compact, structured, validated system representations.

The long-term goal is not only to generate code, but to give AI agents a smaller and more reliable source of truth for understanding, modifying, and implementing software systems.

Instead of repeatedly asking an AI agent to infer system behavior from prompts, README files, source code, database schemas, and previous conversations, AION should let the agent work from structured artifacts such as:

```text
AION IR
AIONX execution plan
Compile plan
Runtime manifest
Operation-level summaries
Graph exports
````

This supports the core AION thesis:

```text
Prompt → AION IR → validation → compile plan → target code or runtime → tests
```

AION should help AI systems generate, check, transform, compile, and eventually execute software behavior through a precise intermediate representation, not only through human-written source code.

---

## Current Problem

Most AI coding workflows are token-expensive because the agent often needs to read or infer from many sources:

```text
User prompt
README
architecture docs
schema files
application code
database files
tests
previous conversation
business rules
security assumptions
```

This causes several problems:

1. High token usage
2. Repeated context loading
3. Higher chance of hallucinated assumptions
4. More inconsistent implementation decisions
5. Harder debugging
6. More accidental changes outside the requested scope

In the default workflow, the agent often works like this:

```text
Prompt → broad context reading → inference → source code changes
```

AION should move the workflow toward:

```text
Prompt → AION IR → validation → compact context → targeted code changes
```

---

## Role of AION in Token Reduction

AION acts as a compressed, structured source of truth.

Instead of giving the AI agent all project files every time, we should give it the minimum relevant AION artifact.

For example, instead of asking Codex:

```text
Read the whole project and implement invoice creation.
```

We should eventually be able to ask:

```text
Read the AIONX operation context for invoice.create.
Implement only that operation.
Respect guards, effects, invariants, and tests.
Do not infer new business rules.
```

This changes the AI agent’s role:

```text
Before:
AI Agent = architect + analyst + coder + tester + guesser

After:
AION = structured contract + validator + planner
AI Agent = targeted implementer + fixer + executor
```

---

## Token Management Principles

### 1. Structured context beats raw context

Prefer structured AION artifacts over large natural-language explanations.

Use:

```text
AION IR
AIONX
Compile plan
Runtime manifest
Operation summaries
```

Avoid repeatedly sending:

```text
Full README
Full source tree
Full previous conversation
Full business explanation
```

---

### 2. Validate before generation

AI agents should not jump directly from prompt to source code.

Recommended flow:

```text
Prompt
→ AI-generated AION JSON
→ JSON Schema validation
→ AION semantic validation
→ Compile plan
→ Target artifact generation
→ Code implementation
```

This prevents the agent from spending tokens implementing an incorrect interpretation.

---

### 3. Use operation-level context

Most coding tasks affect one operation, one entity, or one target artifact.

AION should support extracting only the needed context.

Future command idea:

```bash
aion run app.aionx.json --operation invoice.create
```

Expected compact output:

```text
Operation: invoice.create
Actor: admin
Reads: customer, vehicle
Writes: invoice
Guards:
- actor.role == admin
- rent_amount >= 0
- fines_amount >= 0
- salik_amount >= 0
Effects:
- audit.log:invoice.create
Tests:
- reject negative amounts
- calculate total amount
- write audit log
```

This is much cheaper than sending the whole system.

---

### 4. Separate human review from agent context

Humans need understandable behavior maps.

AI agents need compact implementation context.

AION should support both:

```text
Human review:
Mermaid graph
Readable summaries
Markdown reports

Agent execution:
AIONX
Compact operation context
Diff summaries
Source mappings
```

The human-facing format does not need to be the same as the agent-facing format.

---

### 5. Prefer diffs over full context

When a system changes, the AI agent should not reread everything.

Future command idea:

```bash
aion diff old.aion.json new.aion.json
```

Expected output:

```text
Changed operation: invoice.create
Added field: invoice.discount_amount
Added guard: discount_amount <= rent_amount
Added test: reject excessive discount
```

Then Codex only needs to patch the affected code.

---

### 6. Use stable source mapping

Generated files should include AION metadata markers so AI agents can locate relevant generated code without scanning the whole project.

Example:

```ts
// AION: operation=invoice.create
// AION: source_hash=abc123
```

This helps the agent map:

```text
AION operation → generated code section → related tests
```

---

### 7. Keep AIONX machine-readable

AIONX is not primarily a human documentation format.

It should remain stable, structured, and easy for tools to parse.

Current readable AIONX is useful for early development, but future versions may support compact forms.

Future command idea:

```bash
aion compile aionx app.aion.json --compact --out app.aionx.json
```

Possible compact representation:

```json
{
  "f": "aionx",
  "v": "0.1",
  "op": [
    ["invoice.create", "admin", ["customer", "vehicle"], ["invoice"]]
  ]
}
```

This should only be used when human readability is not needed.

---

## Recommended Agent Workflow

### Full system creation

```text
User prompt
→ Agent creates AION IR
→ AION validates IR
→ AION generates graph
→ Human reviews behavior
→ AION generates target artifacts
→ Agent implements missing runtime/app code
→ Tests run
→ Agent fixes only failing parts
```

### Feature change

```text
User change request
→ Agent updates AION IR
→ AION validates
→ AION diff identifies changed operations/entities
→ Agent receives only affected context
→ Agent patches implementation
→ Tests run
```

### Bug fix

```text
Bug report
→ Map bug to AION operation/entity
→ Extract operation-level context
→ Agent reads only relevant generated code/tests
→ Patch
→ Run targeted tests
```

---

## Target Commands for Token Optimization

### 1. Output file support

Purpose: avoid shell redirect issues and make generated artifacts deterministic.

```bash
aion compile aionx app.aion.json --out app.aionx.json
aion graph app.aion.json --out system.mmd
```

Priority: High

---

### 2. Operation-level inspect

Purpose: provide minimal context for a single operation.

```bash
aion run app.aionx.json --operation invoice.create
```

Priority: High

---

### 3. Agent context target

Purpose: generate a compact prompt-ready context block for AI agents.

```bash
aion compile agent-context app.aion.json --operation invoice.create
```

Possible output:

```text
Implement operation invoice.create.

Actor:
admin

Reads:
customer, vehicle

Writes:
invoice

Rules:
- actor.role == admin
- rent_amount >= 0
- fines_amount >= 0
- salik_amount >= 0

Required effects:
- audit.log:invoice.create

Required tests:
- reject negative amounts
- calculate total amount
- write audit log

Do not modify unrelated operations.
```

Priority: High

---

### 4. AION diff

Purpose: avoid sending unchanged context to agents.

```bash
aion diff old.aion.json new.aion.json
```

Priority: Medium

---

### 5. Source mapping

Purpose: connect generated code back to AION operations.

```text
AION operation → generated code → tests → runtime behavior
```

Priority: Medium

---

### 6. Compact AIONX

Purpose: reduce token usage when human readability is not needed.

```bash
aion compile aionx app.aion.json --compact --out app.aionx.json
```

Priority: Later

---

## Context Budget Strategy

AION should support different context levels.

### Level 1: Full project context

Used rarely.

```text
README
architecture docs
AION IR
source code
tests
```

Use for:

```text
major architecture changes
new compiler targets
runtime design
```

---

### Level 2: System context

Used for feature planning.

```text
AION IR
AIONX
compile plan
graph
manifest
```

Use for:

```text
adding new operations
changing data model
reviewing behavior
```

---

### Level 3: Operation context

Used for most coding tasks.

```text
operation id
actor
reads
writes
inputs
outputs
guards
effects
tests
related generated code
```

Use for:

```text
implement one operation
fix one bug
add one test
change one rule
```

---

### Level 4: Patch context

Used for targeted fixes.

```text
AION diff
affected files
failing test output
operation summary
```

Use for:

```text
debugging
small refactors
CI fixes
```

---

## Success Metrics

AION token management should be measured by:

1. Fewer files needed per AI task
2. Smaller prompts for implementation tasks
3. Fewer hallucinated business rules
4. Fewer unrelated code changes
5. Faster CI-fix loops
6. More consistent generated tests
7. Easier human review through graph and summaries
8. Better separation between behavior definition and implementation

---

## Near-Term Roadmap

### Phase 1: Basic token hygiene

* Add `--out` support
* Avoid shell redirect encoding issues
* Keep generated files clean and deterministic

### Phase 2: Operation slicing

* Add operation-level inspect
* Add operation-level graph mode
* Add operation-level AIONX output

### Phase 3: Agent context generation

* Add `agent-context` target
* Generate compact implementation instructions for Codex
* Include only affected operation/entity/test context

### Phase 4: Change-aware workflows

* Add `aion diff`
* Add source hashes
* Add generated code markers
* Support targeted regeneration

### Phase 5: Compact native formats

* Add compact AIONX
* Explore binary or graph-based encodings
* Optimize for AI-agent and runtime consumption, not human readability

---

## Guiding Principle

AION should reduce the amount of context an AI agent needs by making system behavior explicit, validated, and sliceable.

The goal is not to remove Codex or other coding agents.

The goal is to make them work with less context, fewer guesses, and more reliable contracts.

```text
AION = compressed structured truth
AI Agent = targeted executor
