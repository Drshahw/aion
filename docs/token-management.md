# AION Token Management

AION should reduce token usage for AI coding agents by replacing large, repeated source and prose context with smaller validated behavioral artifacts.

Human-readable source code is not the core optimization target.
Compact machine-native representations are a future goal.

## Why This Matters

Large AI coding workflows often require too much context:

- prompts
- README files
- architecture docs
- source trees
- tests
- previous conversations

That increases token cost and increases the chance that agents infer behavior incorrectly.

AION should reduce that burden by moving work toward:

- contracts
- execution plans
- scenario reports
- targeted repair reports

## Current Strategy

Today AION already helps by giving agents structured artifacts such as:

- AION JSON IR
- compile plan
- runtime manifest
- Mermaid graph output
- AIONX execution plan

These artifacts are smaller and more behavior-specific than broad source review.

## Future Strategy

Token reduction should increasingly come from replacing large code context with:

- validated contracts
- compact machine-native AIONX
- scenario reports
- targeted repair reports
- operation-level execution summaries

This is a workflow optimization, not just a serialization optimization.

## Design Principle

The goal is not "make generated source easier to read."
The goal is "give humans and AI enough behavioral evidence with less context."

That means:

- human-facing outputs should emphasize summaries, graphs, traces, and scenario results
- machine-facing outputs should emphasize compactness, determinism, parseability, and repairability

## Roadmap Link

The compact machine-native representation goal is tracked in [docs/roadmap.md](roadmap.md) under Sprint 006.
