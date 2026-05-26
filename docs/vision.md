# AION Vision

AION is an experiment in AI-native software construction.

The project explores a simple thesis: human intent should not always compile directly into source code. A safer path is:

```text
Prompt -> AION IR -> validation -> compile plan -> target code or runtime -> tests
```

AION is not designed to be a pleasant language for humans to write by hand. It is designed to be a precise intermediate representation that AI systems can generate, check, transform, and compile.

## Principles

1. Intent first: AION captures what the system must do before deciding how to implement it.
2. Explicit structure: actors, entities, operations, guards, effects, invariants, and tests should be visible to validators.
3. Verification before generation: an AION program should be checked before target code is emitted.
4. Explainable behavior: humans should review system behavior, not necessarily read generated implementation details.
5. Target independence: AION should be able to compile to TypeScript, Python, SQL, policy rules, tests, or direct runtime plans.

## Early scope

The v0.1 prototype focuses on a JSON-based IR with TypeScript types, parsing, validation, planning, and runtime metadata.

Future versions may explore compact graph formats, binary encodings, richer type systems, formal constraints, and agent-specific execution semantics.
