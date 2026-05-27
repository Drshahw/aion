# AION Agent Guide

Use AION as the behavioral contract before writing or changing application code.

For the full operating guide, see [docs/skills/aion-codex-skill.md](docs/skills/aion-codex-skill.md).

## Setup

- On a fresh clone, run:

```bash
npm install
npm run build
npm run typecheck
npm run schema:check
```

- If dependencies are already installed, run:

```bash
git pull
npm run build
npm run typecheck
npm run schema:check
```

- The CLI runs from `dist/src/cli.js`.
- After any change under `src/`, run `npm run build` before testing CLI behavior.
- Do not assume `aion` is globally installed. Prefer `node dist/src/cli.js ...` or `npm run aion -- ...`.

## Required workflow

```text
User request
→ Draft or update AION IR
→ Validate
→ Generate compile plan
→ Generate graph
→ Compile AIONX
→ Run AIONX inspector
→ Compile executable-ts when applicable
→ Run smoke tests
→ Only then implement or extend application code
```

## Core rules

- Do not write app code before AION validation passes.
- Do not invent actors, entities, permissions, guards, or effects outside AION without updating the IR.
- If generated code and AION disagree, AION is the source of truth.
- Prefer `--out` or `-o` instead of shell redirect when generating artifacts.
- Use small PRs that target one capability at a time.
- Prefer smoke tests that execute generated artifacts.
- Do not add dependencies unless necessary.
- Do not modify `package-lock.json` unless dependencies changed.

## Core commands

```bash
node dist/src/cli.js validate project.aion.json
node dist/src/cli.js plan project.aion.json
node dist/src/cli.js graph project.aion.json --out system.mmd
node dist/src/cli.js compile aionx project.aion.json --out app.aionx.json
node dist/src/cli.js run app.aionx.json
node dist/src/cli.js compile executable-ts project.aion.json --out generated-runtime.ts
```

## Definition of done

- AION validates.
- The compile plan succeeds.
- Relevant artifacts are generated with `--out`.
- Generated graph or AIONX run output is checked.
- Relevant tests or smoke tests pass.
- The PR summary explains which AION operations or entities changed.
