# **Strategic and Technical Evaluation of the AION Ecosystem: History-Native Computation, Agentic Governance, and Architectural Reframing**

The paradigm of software engineering is undergoing a fundamental shift due to the rapid advancement of large language models and autonomous agentic systems.1 While classical systems engineering was built upon the assumption of a deterministic human operator modifying mutable files, the modern environment is increasingly dominated by generative agents that act as the primary authors, testers, and executioners of code.1 This transition has exposed a deep mismatch between standard runtime environments and the probabilistic nature of artificial intelligence, leading to critical failure modes such as silent behavioral drift, uncontrolled tool-calling loops, and destructive state corruption.4  
The AION open-source ecosystem, particularly the core history-native architectures pioneered under the flyingrobots and AION-NET frameworks, proposes an alternative computation model.7 It rejects mutable state, advocating instead for a ledger-based system where files are merely temporary materializations over witnessed causal histories.8 This report provides a deep technical and strategic evaluation of AION's architecture, challenges its core assumptions, evaluates its originality against emerging industry and academic standards, and outlines concrete pathways for its future development.

## **Technical Architecture of the AION Ecosystem**

AION is not a single framework but an integrated stack designed to unify state representation, repository control, runtime execution, and agentic validation into a single causal framework.8 The ecosystem is divided into three distinct layers, each addressing a specific dimension of the alignment problem between probabilistic agents and deterministic computing environments.8

┌─────────────────────────────────────────────────────────────────┐  
│                    AGENTIC GOVERNANCE LAYER                     │  
│    Graft (AST Context Governor)  •  aion-core (Runtime Security) │  
│    Wesley (Schema & Footprint Compiler)                         │  
└────────────────────────────────┬────────────────────────────────┘  
                                 │ Complies / Controls Intents  
                                 ▼  
┌─────────────────────────────────────────────────────────────────┐  
│                    EXECUTION RUNTIME LAYER                      │  
│    Echo (View Engine)  •  WARP TTD (Time-Travel Debugger)        │  
└────────────────────────────────┬────────────────────────────────┘  
                                 │ Materializes Views Over  
                                 ▼  
┌─────────────────────────────────────────────────────────────────┐  
│                   CAUSAL COORDINATION LAYER                     │  
│    git-warp (Braid Engine)  •  Continuum (History Protocol)     │  
│    git-cas (Git-Native Content-Addressable Storage)            │  
└─────────────────────────────────────────────────────────────────┘

The coordination, runtime, and governance mechanisms of AION are structured as follows:

### **The Causal Coordination Layer**

At the lowest tier, **Continuum** defines a shared protocol and contract language for witnessed causal history.8 It coordinates heterogeneous, distributed sibling runtimes without requiring them to share a common relational database.8 State is represented as an append-only ledger of events authenticated by verifiable cryptographic provenance.8  
The actual git-level branching and versioning logic is managed by **git-warp**, a custom engine that models Git history as "worldlines," treating speculative modifications as "strands" and master integrations as "canonical braids".8 For underlying storage, AION utilizes **git-cas**, an encrypted, chunked, and deduplicated content-addressable storage layer embedded directly within Git’s object database.8

### **The Execution Runtime Layer**

In the execution tier, **Echo** operates as a deterministic runtime where state is treated strictly as a materialized view over the append-only causal history.8 Engineered for real-time visualization, Echo is capable of executing over 300,000 state rewrites per second at 60 frames per second.8 This high throughput allows **WARP TTD** (Time-Travel Debugger) to step backward and forward through execution worldlines, letting developers inspect rejected counterfactual paths and evaluate exact provenance receipts.8  
At the user interface layer, **AionUi** leverages this deterministic backend—utilizing the Rust-based service **aionrs**—to orchestrate local "Cowork" agents that manipulate local files, execute terminal code, and output complex documents such as morph-animated presentations or auto-formatted spreadsheets via OfficeCLI.10 AionUi supports 24/7 unattended scheduled automation through cron services, managing complex workflows entirely within secure client runtimes.10

### **The Agentic Governance Layer**

To prevent agents from executing destructive commands, AION introduces **Graft** and **aion-core**.8 Graft acts as an AST-level context governor, parsing repositories to expose only the minimal safe view of code to the agent, which limits context dilution and prevents unauthorized access.8 At runtime, aion-core functions as a security layer that intercepts, scans, and approves tool calls before execution.9  
The system is coordinated by **Wesley**, a compiler that processes GraphQL Schema Definition Language (SDL) files to produce TypeScript types, Rust bindings, SQL schemas, and runtime execution plans.8 Wesley enforces runtime footprint validation, parsing directives such as @wes\_footprint to restrict the reads and writes of operations to verified resource paths, while validating input object structures and rejects invalid type configurations before execution.12

## **Namespace Clarification and Brand Dilution Risk**

An immediate challenge facing the AION project is the severe namespace collision in both the open-source community and commercial software. Because "AION" is an attractive name (derived from the Greek word for eternity, aligning with history-native computation), several completely unrelated initiatives share the name.9  
To guide strategic positioning, the following table maps the various active projects operating under the AION trademark, clarifying where the core repository (https://github.com/Drshahw/aion / flyingrobots/aion) stands 7:

| Project Name | Primary Domain | Underlying Technology | Relation to Core AION | Key Risk / Competitive Clash |
| :---- | :---- | :---- | :---- | :---- |
| **AION Core & git-warp** 8 | History-native developer environments & agent governance. | Rust, Git-native objects, GraphQL SDL compilation (Wesley).8 | **The Target System.** The core repository under review.7 | Severe search-engine dilution; needs clear classification as a developer system. |
| **AionData** 13 | AI-driven drug discovery data layers. | Python 3.10+, unified interfaces for biochemical databases.13 | **Unrelated.** Developed by Aion Labs for biochemistry.13 | Domain-specific naming collision on PyPI.13 |
| **Aion-2.0** 16 | Roleplaying and storytelling LLM. | Fine-tuned variant of DeepSeek V3.2 hosted via Puter.js.16 | **Unrelated.** Creative writing fine-tune model.16 | Search confusion when developers look for agent engines.16 |
| **AION Infrastructure** 17 | GPU cloud and container orchestration. | Bare-metal Kubernetes, GPU cluster monitoring, vLLM / Ray playbooks.17 | **Unrelated.** Managed enterprise AI hosting and compute provider.17 | Direct conflict on commercial trademarking in the AI space.17 |
| **Aion Hierarchical 4D Scene Graphs** 15 | Robotic spatial-semantic mapping. | Hydra integration, dynamic topology temporal flow modeling.15 | **Unrelated.** Academic framework for robotic scene prediction.15 | Research paper search dilution.15 |
| **Aion Perception Patch** 14 | Autonomous vehicle security. | Multimodal fusion, Dynamic Time Warping (DTW) anomaly scores.14 | **Unrelated.** Anomaly detection against DejaVu sensor-misalignment attacks.14 | Academic paper search dilution.14 |
| **AION Analytics News-to-Signal** 19 | Financial sentiment parsing. | Python SDK, MCP server for NSE / BSE market data.19 | **Unrelated.** Converts Indian stock news into sector trading signals.19 | Direct naming clash on PyPI and in the MCP server ecosystems.19 |
| **aion-agent** 18 | Google Calendar scheduling assistant. | ASP / Clingo constraint solver, Ollama integration.18 | **Unrelated.** Natural language terminal scheduling assistant.18 | High naming clash in the open-source CLI agent space.18 |

This namespace collision is a major risk. A developer attempting to install AION’s core runtime security library or data tools via pip or npm might accidentally install aiondata 13, aion-news-to-signal 19, or aion-agent.18  
To prevent confusion and protect its brand, the flyingrobots project must establish a unique name, such as "AionOS" or "Aion-WARP," specifically highlighting its focus on history-native computation and deterministic runtime architectures.8

## **Challenging Foundational Assumptions**

AION's vision of history-native computation is mathematically elegant, but a critical evaluation reveals several structural issues in its core assumptions.

### **The Storage and I/O Bottleneck of Git-Native CAS**

AION assumes that storing all computational history as an append-only ledger of cryptographic events within a Git-native database (git-cas) is viable for developer workflows.8 While Git is excellent for human-scale text edits, autonomous agents operate in tight, high-frequency reasoning and execution loops.1 An agent performing cross-file refactoring or running code generation benchmarks may execute hundreds of terminal commands and state mutations per minute.1  
Forcing every step, temporary file write, and diagnostic log into a content-addressable storage model within Git objects introduces severe issues:

1. **Performance Overhead:** The CPU cost of continuously chunking, compressing, and encrypting data with AES-256-GCM, combined with the disk write amplification of Git’s loose object directory structure, will cause major system latency.8  
2. **Packfile Bloat:** High-frequency, machine-generated JSON payloads will rapidly bloat Git repositories, leading to slow clone, fetch, and indexing times, rendering standard Git tooling unusable.

### **The Closed-World Determinism Assumption in Echo**

Echo promises absolute replayability and deterministic state transitions.8 While deterministic execution is possible within isolated, pure-software layers (such as a visual canvas or local file parser), it is difficult to maintain when interacting with the real world.23 AI agents regularly interact with non-deterministic external dependencies: dynamic API endpoints, real-time database queries, live system clocks, and remote web searches.10  
If an agent’s history contains an external tool call—such as sending an email or executing a transaction—that step cannot be deterministically replayed.11 Echo’s closed-world model cannot easily solve this "side-effect problem" without requiring complete operating system virtualization or manual mock implementations, which goes against its promise of "zero hand-maintained drift".8

### **Wesley’s Schema Friction vs. Developer Ergonomics**

Wesley assumes that developers will proactively design detailed GraphQL schemas and specify exact path footprints before letting an agent write code.8 While contract-driven design is a proven methodology for microservices, forcing it onto rapid, iterative agent-driven coding sessions creates friction.1  
Developers increasingly prefer "vibe coding"—using natural language prompts to quickly prototype applications.3 Forcing a developer to write formal schemas, define footprint boundaries, and specify compiler-level constraints via Wesley before an agent can begin coding runs counter to the natural, low-friction UX that is driving the adoption of AI-native development platforms.3

## **Comparative Analysis of Agent Governance Frameworks**

AION’s approach to runtime safety, managed by aion-core and Graft 8, represents a major advancement in agent security. However, it must be evaluated against competing runtime enforcement paradigms in both academia and industry.  
Two primary academic frameworks address this problem: Varun Pratap Bhardwaj’s **Agent Behavioral Contracts (ABC)** 4 and Qing Ye’s **Resource-Bounded Agent Contracts**.5

### **Agent Behavioral Contracts (ABC)**

Implemented in the AgentAssert library, the ABC framework models an agent session as a formal contract 4:  
![][image1]  
which unifies Preconditions (![][image2]), Invariants (![][image3]), Governance policies (![][image4]), and Recovery mechanisms (![][image5]) into a single, runtime-enforceable schema.4 To handle the non-determinism of large language models, ABC uses Lyapunov stability analysis over an Ornstein–Uhlenbeck drift model.4 If the runtime recovery rate ![][image6] is configured to exceed the agent's natural behavioral drift rate ![][image7], the system can guarantee that the expected behavioral drift ![][image8] is bounded over long sessions 4:  
![][image9]  
This mathematical guarantee ensures that the system returns to a safe state even if the agent attempts to violate invariants, such as leaking personal data or altering file paths.4

### **Resource-Bounded Agent Contracts**

Developed for multi-agent systems, this framework formalizes resource constraints using a seven-tuple 5:  
![][image10]  
which links inputs (![][image3]), outputs (![][image11]), permitted skill sets (![][image12]), multi-dimensional resource constraints (![][image5]), temporal boundaries (![][image13]), success criteria (![][image14]), and termination conditions (![][image15]).5 This model enforces physical conservation laws across multi-agent delegation paths.5 For instance, when a primary agent delegates subtasks to helper agents, the total resources consumed cannot exceed the parent budget 5:  
![][image16]  
If an agent falls into a recursive loop, the system detects the budget depletion and triggers a hard termination, preventing uncontrolled API costs.6  
The following table compares AION's native architecture against these formal frameworks and other commercial solutions:

| Dimension / Metric | AION Platform (Echo, Graft, aion-core) | Agent Behavioral Contracts (ABC / AgentAssert) | Resource-Bounded Agent Contracts | relari-ai/agent-contracts | Cerbos YAML / CEL |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Primary Focus** | History-native file versioning, deterministic state reconstruction, AST-level context security.8 | Safety-critical runtime monitoring of logical invariants and behavioral correctness.4 | Mitigating recursive agent loops, financial cost overruns, and resource exhaustion.5 | Off-line trace verification, benchmark simulation, and OpenTelemetry certification.28 | Application-level attribute and role authorization.29 |
| **Execution Overhead** | Low (sub-millisecond AST parser extraction and file access control).8 | Low (sub-10ms per-action validation of local state predicates).4 | Extremely low (numeric deduction and budget decrement tracking).5 | High (asynchronous trace pipeline and collector processing).28 | Very low (compiled Rust engine, fast attribute evaluation).29 |
| **Language Specification** | GraphQL SDL (Wesley compiler schemas) and system file paths.8 | ContractSpec (YAML with expression-based predicates).4 | Declarative tuples mapping budgets and execution constraints.5 | JSON specifications linked directly to OpenTelemetry span structures.28 | Declarative YAML schemas utilizing Common Expression Language (CEL).29 |
| **Violation Recovery** | Deterministic state rewind to previous verified causal braids.8 | Dynamic recovery functions (![][image5]) for inline data redaction or prompt-level corrections.4 | Graceful degradation, task termination, and budget pooling.6 | Post-hoc validation failures and OpenTelemetry exceptions.28 | Static allow/deny response blocks.29 |

## **Originality and Redundancy Assessment**

To guide AION’s strategic direction, it is vital to evaluate which parts of the platform are truly original and valuable, and which are redundant with existing open-source and commercial solutions.

### **The Strong and Highly Original Core**

AION's most valuable and original innovation is its approach to file system modifications: **Processes become strands, and files become materializations over causal history, not the raw source of truth**.8  
In traditional developer tools (such as VS Code, Cursor, or Cline), AI agents write directly to a local, mutable directory.1 If the agent generates buggy code or deletes a file, the workspace is corrupted, forcing the developer to manually reverse the damage.1  
By routing all modifications through a deterministic causal engine (git-warp and Echo), AION treats every code change as a speculative hypothesis.8 The developer can instantly inspect, step through, or discard any modification, making code generation safer and more controllable.8  
Similarly, Graft's approach of offering **parser-backed AST-level structural views** rather than raw directory dumps is highly valuable.8 By dynamically limiting the agent’s context window to the exact scope of the target interface, Graft reduces context bloat, improves code generation accuracy, and secures internal codebase modules from unauthorized access.8

### **The Redundant and High-Friction Components**

Wesley's proprietary schema compiler represents a major redundancy.8 While Wesley is technically well-designed, the industry has already standardized on **OpenAPI**, **JSON Schema**, and **Prisma** for type-safe API generation.32 Building and maintaining a custom schema and type compiler creates a steep learning curve and limits open-source adoption.  
Furthermore, if AION tries to develop its own policy language for access control, it will duplicate tools like **Cedar** or **Cerbos (using CEL)**.29 These policy engines are written in Rust, formally verified, and widely adopted, making any custom policy format redundant.29

## **Recommended Strategic Pivots**

To maximize its impact and drive adoption, AION should shift from a monolithic, proprietary runtime system to a highly compatible, developer-first tooling framework.  
The following sections detail three recommended pivots for the platform.

### **Pivot A: The Local "Developer Sandbox" Middleware Daemon**

Instead of requiring developers to build applications using a proprietary runtime stack, AION should be repackaged as a pluggable, local middleware daemon that works with existing agent platforms (such as Claude Code, Cline, Continue, and VS Code).7

┌────────────────────────────────────────────────────────┐  
│               EXISTING COOPERATIVE TOOL                │  
│       Cursor  •  Claude Code  •  Cline  •  Continue    │  
└───────────────────────────┬────────────────────────────┘  
                            │ Raw File Write Command  
                            ▼  
┌────────────────────────────────────────────────────────┐  
│               AION DEVELOPER MIDDLEWARE                │  
│   • Graft: Intercepts read, outputs parsed AST         │  
│   • git-warp: Converts file modifications to strands   │  
│   • Echo: Runs local test execution sandbox            │  
└────────────────────────────────────────────────────────┘

In this model, the developer installs a local AION background daemon. When an agent tool makes a read or write request, AION intercepts the operation:

* Graft parses the target files and provides the agent with a optimized AST-level context view, minimizing token use.8  
* git-warp maps the agent's edits onto a speculative branch, preventing immediate modification of the developer's working files.8  
* The agent's code is tested and validated within the local sandbox, and then safely merged back into the developer's master branch.8

This architecture provides the safety and versioning advantages of history-native computation without requiring developers to change their existing IDEs or workflows.8

### **Pivot B: The Deterministic Model Context Protocol (MCP) Proxy Layer**

With the industry rapidly adopting Anthropic's **Model Context Protocol (MCP)** as the standard interface for AI tool usage, AION should reframe its governance layer (Graft, aion-core) as a **Deterministic, Secure MCP Proxy**.7

┌──────────────┐          ┌──────────────────────┐          ┌──────────────────────┐  
│  AI CLIENT   │  JSON-   │  AION COMPLIANT PROXY│  JSON-   │      TARGET TOOL     │  
│ (Claude/IDE) ├─────────►│  • Cedar/CEL Rules   ├─────────►│ (Shell/Database/API) │  
└──────────────┘  RPC     │  • State Rollbacks   │  RPC     └──────────────────────┘  
                          └──────────────────────┘

Under this model:

* AION wraps existing third-party MCP servers, acting as a secure intermediary.  
* Wesley is updated to ingest standard OpenAPI specs or JSON schemas and output MCP-compliant tool definitions.8  
* Every JSON-RPC tool request generated by the LLM is inspected by AION's runtime proxy.  
* The proxy evaluates the call against behavioral security rules defined in Cedar or CEL.29 If a tool call exceeds configured boundaries or tries to write to an unauthorized directory, AION blocks the command, runs a recovery routine, and returns a safe response to the model.4

This positions AION as a secure, plug-and-play validation layer for any LLM client using the Model Context Protocol.10

### **Pivot C: BDD-Guided "Intent-Behavior Mirroring" Tooling**

A major challenge in AI code generation is the "Intent-Behavior Mirroring Effect": when coding agents rely on broad, natural language prompts, they often perform invasive, destructive code modifications.22 However, when guided by Behavior-Driven Development (BDD) and Gherkin specifications (e.g., *Given-When-Then*), agents are forced to follow a structured, two-stage cognitive process 22:

1. **Root Cause Analysis:** First analyze execution failures to isolate the logical discrepancy.  
2. **Specification Synthesis:** Formalize the intended behavior into executable test scenarios before writing code.

Integrating BDD specifications directly into AION’s Echo and Graft layers would provide a robust development flow:

                  ┌──────────────────────────────┐  
                  │ Human Intent / Gherkin Spec  │  
                  └──────────────┬───────────────┘  
                                 │  
                                 ▼  
┌────────────────────────────────────────────────────────────────┐  
│                        AION MIDDLEWARE                         │  
│                                                                │  
│   1\. Graft restricts agent context to AST paths.               │  
│                                                                │  
│   2\. Agent writes code to speculative "git-warp" strand.       │  
│                                                                │  
│   3\. Echo executes tests against the speculative strand.      │  
│      \- Negative Verification: Must fail on buggy code.         │  
│      \- Positive Verification: Must pass on repaired code.      │  
│                                                                │  
│   4\. If verified, speculative strand is braided into master.   │  
└────────────────────────────────────────────────────────────────┘

When a developer prompts an agent to resolve an issue, AION's architect agent first reverse-engineers the requirement, drafting a Gherkin specification of the intended behavior.22  
Once approved, AION forces a bidirectional validation loop 22:

1. **Negative Verification:** The Gherkin scenario is executed against the buggy code and must fail, confirming the test is valid.22  
2. **Positive Verification:** The agent implements a fix on a speculative branch.8 Echo runs the test suite; if it passes, the speculative branch is safely merged into the master history.8

This architecture provides strict boundaries on code generation, preventing agents from introducing regressions and ensuring any output complies with the system's design constraints.35

## **Strategic Recommendations**

This evaluation shows that AION has built a highly innovative, original technical foundation centered on history-native computing, deterministic runtimes, and context virtualization.8 However, forcing developers to build within a proprietary ecosystem limits its growth and adoption.8  
To realize its full potential, the AION project should adopt the following strategic plan:

1. **Reframe as Middleware:** Focus on building a local, pluggable developer middleware daemon that works with existing IDEs, rather than creating a proprietary runtime platform.8  
2. **Adopt standard schemas:** Deprecate Wesley's custom compiler in favor of standard OpenAPI, JSON Schema, and Prisma formats, reducing adoption friction.8  
3. **Integrate with MCP:** Position the platform's security layers (Graft and aion-core) as a secure, deterministic proxy for Model Context Protocol integrations, aligning with modern agent standards.9  
4. **Leverage BDD Verification:** Implement Gherkin-based specification loops to prevent behavioral drift and guarantee code generation quality.4

By shifting towards compatibility with industry standards and packaging its core innovations as modular developer tools, AION can become the foundational security and versioning layer for the next generation of AI-driven software development.1

#### **Works cited**

1. Repositories Are Human/Agent Knowledge Factories | SIGPLAN Blog, accessed May 26, 2026, [https://blog.sigplan.org/2026/04/21/repositories-are-human-agent-knowledge-factories/](https://blog.sigplan.org/2026/04/21/repositories-are-human-agent-knowledge-factories/)  
2. Rethinking Software Engineering for Agentic AI Systems \- arXiv, accessed May 26, 2026, [https://arxiv.org/html/2604.10599v1](https://arxiv.org/html/2604.10599v1)  
3. Lost in Code Generation: Reimagining the Role of Software Models in AI-driven Software Engineering \- arXiv, accessed May 26, 2026, [https://arxiv.org/html/2511.02475v1](https://arxiv.org/html/2511.02475v1)  
4. Agent Behavioral Contracts: Formal Specification and Runtime Enforcement for Reliable Autonomous AI Agents \- arXiv, accessed May 26, 2026, [https://arxiv.org/html/2602.22302v1](https://arxiv.org/html/2602.22302v1)  
5. Agent Contracts: A Formal Framework for Resource-Bounded Autonomous AI Systems (Full), accessed May 26, 2026, [https://arxiv.org/html/2601.08815v1](https://arxiv.org/html/2601.08815v1)  
6. Agent Contracts: A Formal Framework for Resource-Bounded Autonomous AI Systems \- arXiv, accessed May 26, 2026, [https://arxiv.org/pdf/2601.08815](https://arxiv.org/pdf/2601.08815)  
7. AION \- GitHub, accessed May 26, 2026, [https://github.com/aion-net](https://github.com/aion-net)  
8. James Ross flyingrobots \- GitHub, accessed May 26, 2026, [https://github.com/flyingrobots](https://github.com/flyingrobots)  
9. aion-core \- piwheels, accessed May 26, 2026, [https://www.piwheels.org/project/aion-core](https://www.piwheels.org/project/aion-core)  
10. GitHub \- iOfficeAI/AionUi: Free, local, open-source 24/7 Cowork app for OpenClaw, Hermes Agent, Claude Code, Codex, OpenCode, Gemini CLI and 20+ more CLI | Customize your assistants | Star if you like it\!, accessed May 26, 2026, [https://github.com/iOfficeAI/AionUi](https://github.com/iOfficeAI/AionUi)  
11. Designing Agent Workflows: The Mental Shift From n8n Thinking | by Micheal Lanham, accessed May 26, 2026, [https://medium.com/@Micheal-Lanham/designing-agent-workflows-the-mental-shift-from-n8n-thinking-8fb40cb0bfa8](https://medium.com/@Micheal-Lanham/designing-agent-workflows-the-mental-shift-from-n8n-thinking-8fb40cb0bfa8)  
12. Releases · flyingrobots/wesley \- GitHub, accessed May 26, 2026, [https://github.com/flyingrobots/wesley/releases](https://github.com/flyingrobots/wesley/releases)  
13. GitHub \- aion-labs/aiondata: A common data access layer for AI-driven drug discovery., accessed May 26, 2026, [https://github.com/aion-labs/aiondata](https://github.com/aion-labs/aiondata)  
14. On the Fragility of Multimodal Perception to Temporal Misalignment in Autonomous Driving, accessed May 26, 2026, [https://arxiv.org/html/2507.09095v1](https://arxiv.org/html/2507.09095v1)  
15. Aion: Towards Hierarchical 4D Scene Graphs with Temporal Flow Dynamics \- arXiv, accessed May 26, 2026, [https://arxiv.org/html/2512.11903v2](https://arxiv.org/html/2512.11903v2)  
16. Aion-2.0 \- API, Specs, Playground & Pricing \- Puter Developer, accessed May 26, 2026, [https://developer.puter.com/ai/aion-labs/aion-2.0/](https://developer.puter.com/ai/aion-labs/aion-2.0/)  
17. Welcome to AION \- aion, accessed May 26, 2026, [https://docs.aion.xyz/getting-started/introduction](https://docs.aion.xyz/getting-started/introduction)  
18. aion-agent 0.3.0 on PyPI \- Libraries.io, accessed May 26, 2026, [https://libraries.io/pypi/aion-agent](https://libraries.io/pypi/aion-agent)  
19. AION News-to-Signal MCP Server \- GitHub, accessed May 26, 2026, [https://github.com/AION-Analytics/aion-mcp-server](https://github.com/AION-Analytics/aion-mcp-server)  
20. aion-news-to-signal 1.0.1 on PyPI \- Libraries.io, accessed May 26, 2026, [https://libraries.io/pypi/aion-news-to-signal](https://libraries.io/pypi/aion-news-to-signal)  
21. AION Analytics MCP \+ local Python package for turning market headlines into sector signals : r/algotrading \- Reddit, accessed May 26, 2026, [https://www.reddit.com/r/algotrading/comments/1sw3p4i/aion\_analytics\_mcp\_local\_python\_package\_for/](https://www.reddit.com/r/algotrading/comments/1sw3p4i/aion_analytics_mcp_local_python_package_for/)  
22. Project Prometheus: Bridging the Intent Gap in Agentic Program Repair via Reverse-Engineered Executable Specifications \- arXiv, accessed May 26, 2026, [https://arxiv.org/html/2604.17464v1](https://arxiv.org/html/2604.17464v1)  
23. How to Build an AI Agent | IBM, accessed May 26, 2026, [https://www.ibm.com/think/topics/how-to-build-an-ai-agent](https://www.ibm.com/think/topics/how-to-build-an-ai-agent)  
24. \[2602.22302\] Agent Behavioral Contracts: Formal Specification and Runtime Enforcement for Reliable Autonomous AI Agents \- arXiv, accessed May 26, 2026, [https://arxiv.org/abs/2602.22302](https://arxiv.org/abs/2602.22302)  
25. \[2601.08815\] Agent Contracts: A Formal Framework for Resource-Bounded Autonomous AI Systems \- arXiv, accessed May 26, 2026, [https://arxiv.org/abs/2601.08815](https://arxiv.org/abs/2601.08815)  
26. About — agentAssert, accessed May 26, 2026, [https://agentassert.com/about/](https://agentassert.com/about/)  
27. Agent Behavioral Contracts — Formal Specification and Runtime Enforcement for Autonomous AI Agents, accessed May 26, 2026, [https://agentassert.com/](https://agentassert.com/)  
28. relari-ai/agent-contracts: A structured framework for defining, verifying and certifying AI systems. \- GitHub, accessed May 26, 2026, [https://github.com/relari-ai/agent-contracts](https://github.com/relari-ai/agent-contracts)  
29. Cedar vs Rego vs OpenFGA: Policy Language Comparison | sph.sh, accessed May 26, 2026, [https://sph.sh/en/posts/policy-language-comparison-cedar-rego-openfga/](https://sph.sh/en/posts/policy-language-comparison-cedar-rego-openfga/)  
30. Installation \- Agent Contracts \- Relari, accessed May 26, 2026, [https://agent-contracts.relari.ai/installation](https://agent-contracts.relari.ai/installation)  
31. Agent Behavioral Contracts: Formal Specification and Runtime Enforcement for Reliable Autonomous AI Agents \- arXiv, accessed May 26, 2026, [https://arxiv.org/pdf/2602.22302](https://arxiv.org/pdf/2602.22302)  
32. Type-Safe APIs with OpenAPI and TypeScript \- Steve Kinney, accessed May 26, 2026, [https://stevekinney.com/courses/full-stack-typescript/open-api-swagger-express](https://stevekinney.com/courses/full-stack-typescript/open-api-swagger-express)  
33. Best Schema Validation Tools for Developers in 2024: Ensure Data Consistency Across APIs, Databases, and Configs \- DebuggAI, accessed May 26, 2026, [https://debugg.ai/resources/best-schema-validation-tools-2024](https://debugg.ai/resources/best-schema-validation-tools-2024)  
34. Common Expressions For Portable Policy and Beyond | Google Open Source Blog, accessed May 26, 2026, [https://opensource.googleblog.com/2024/06/common-expressions-for-portable-policy.html](https://opensource.googleblog.com/2024/06/common-expressions-for-portable-policy.html)  
35. Project Prometheus: Bridging the Intent Gap in Agentic Program Repair via Reverse-Engineered Executable Specifications \- arXiv, accessed May 26, 2026, [https://arxiv.org/pdf/2604.17464](https://arxiv.org/pdf/2604.17464)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA3CAYAAACxQxY4AAAEVklEQVR4Xu3dS6hvUxwH8CWPyCuUR0LekQGR8uwmhUQSRcrEgIGBFCbSmZhIkoRQoqQUM6GkG0IZMBGJlEQpTBDKY33v/u971n+fe/Z//+89t+7h86lvnb32Pvu//mf0a71OKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7FH2rTln2Pgftl/N2cNGAIBl7VVzZs0nNV/V7DN/e0M9VbrPa6WIO77mhlm2lLXPLHJCzTVl9R3JdXNPrG/vmkdK9/0/LNN/L04t3fP5vHz+kfO3t3mv5vxhIwDAVDfWXFG6AinFxw81B809sXFOqbmkub6/5vOa02s+KF0/UnjdXvPPLGMOrXm95sKaY0pX9H1Uuu8xpeDLM1/XXNa0fV+6om1MRsyeqTmrdH18seao0vX945o/ai7Y/nRXkL5cpvUJAGCNX5ufr6z5u7neaCs1B8x+TvHyY+mKnoNr3q05Y3Yv3ipdMXRg0zZ0W80vzfX1NXc214vcVdaOfP1ec+2gbeibslp8pY+PNfeOmLVltK2Vd544aAMAGJWC49HSFUy9B2pObq430sU1Pw8bZ84tXeG4f9N2eVmueDypdKNj7TvGZNo3z7cyEras9DF97aUoe7KsnVZOvzISBwAwWQqLb8v0AmdXZZpzWCD1MjI2nP58vHTr6aa6pax9x5gUeK8NG5eUkcF8p7yr92zN0c11K9O1AACTpbBYpsBJYZd1YmMZG6F6vmbrsHEm0599MZcpxYfL/LqyKVIMLVPg3TdLK9O1maZtp2bHXFXzYFldc/dpGV+n1k4/AwAslIX1vw0bd6Oxgi3Fzqs1D5WdH/HLO24aNo64u+az5jobGFI4rjRtY/J8/obZbBDflcUFsIINAFjK1rK2wDik5p5BW+/SmqcXJM+sJwVbNhYMZURquKtyWRkZS/HVF09TZN1cvn++c7wyu57aj37dXT+ilinc/P5YHzJ6BwAwWUajUmA8MbvOVOSbNYdvf2JjZfpwR5sOsjN1ys7OTHeuDNqykSHnn71fc/Ps51trviyr07MZSctavR3t0EzRlR2e2dGZfvw1f3vbZw6L2l5G19rjP/qjO74o3Vlsb5duFK61q2vmAID/mRQYWSuWgiTJ9Gh/5MbukHVhwxGm7KR8qczvVF3PCzXPNdc57Lbve5uc53Z181yKup9KV5yNeaPmnUFbPnO9naop7u4YtOWIkPThz5p7B/cOK2sLTgCAPU52g7YjXSkah6NQY9abrl0khd6xg7aLynyhd9r87e0Wnck21UrZvQUxAMCGSMEy3Jk5VQq7/KeEnZHz5Xa0e3NL6aaG19sVms/MCOCuOq50/wEBAGBTOK8sN6q22fUHFI8deQIAsMfZ2aM7NqMUbFlvBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbH7/Ar1bn18hUWfjAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAZCAYAAAA4/K6pAAAA90lEQVR4XmNgGAXIgBOIc4H4PwEsAdOADDSB+AoQzwbiOAaIwtVALAnFVkC8CCoOUicG0QYB8kB8C4inADEjEAcxQBROQlYEBcEMEDlPZMFqID4GxDJQfjkDRFE6XAUCcDBA5HzRJZDBQiD+B8Qu6BIMEAOeALEiugQyOAzEz4FYCV0CCHSAuJIB4lWcAKT5ABDzoInzA/EeKI0XgPzYisRnBmInIL4ExPORxHECkP8LgXgFA8S/f4H4PBDbMRBwOgiA/LgciFnQJYgFOUDshy5ILAAl5R1ALI4uQSywBOKfDET4ExcAJV1QOicbgOKXFV1wFAwFAACp8i39Nz5SFgAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAZCAYAAADqrKTxAAAAv0lEQVR4Xu3SMQsBcRjH8RMWKaO8BYuZ2C0WSZQ3QHaD2Ztg8QKsdpOUzcxsVjJQ+D48zvXk/qzkV5+6+/3/96977jzvdxNFHWtcQhzRQUQeiGOIJQrIqBxGep2UjcGUsUfF9F3kTedHTrEnpbB40TtTxMmW79LD2ZauxDDB1i64ksYGU7vgyuN9BnYhLDKtmXefnEzwo5RwQEvv5eu3MUZCu1vky9fQwBwrNLXrY4eqv1tj/7EgGUb2ufWfb8oVrD0nJ4vJv1EAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAbCAYAAACnZAX6AAABKElEQVR4Xu3SvyvFURjH8UcoumIgUkpJimykELOZ5RabVRmU/4TVKItFiu2WxcZASgykDEIpg8GP9+d7fnS+JzeLjU+96t7nPPfc88vs76QBQzjFLY4wXerI0oddPGEHz/jENXqSvphx3GEZjb42gHscoNXXYvpxgXVzywuZxwtmkloRzbCHGtqSupZ6hjUrT1RkDh9YzOrN6MhqRTTDFh4xnI3VTRfOPX3Oo6M/xFRaDKdTs/J+lBbsmxtXX8wYXnGD3nSAjJq7J/1QE8Q0YdvcBV5i0NcrvvaGSV8rRZf6YK5JdC/vOMGx1TlBpROr2MSS/65/WUmbfoqWrYvtzgdCRrBh7smEDS9gInZkaTd33GE/wVXS8230ovUaquae0qy5J/SfX88XWYA3AgFe+iAAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAABN0lEQVR4Xu3SvStGYRjH8Z+ivJTykpdMxCBWxEKKMlhkIP+FxaYkgxWTlCgpu+JvMClSSgzKIKsyePlez3UfrtOjwyy/+nSe5+q6zn2f+xzpP5YKNGEQs4n9bkd16MulHut4xnuBDdSlmVLGcYsV9GBV3jgjX3EE+6lmlnxM6sNjLJA9+Q4GQs0ex3ZmwztZcRmnaEv/7bmO8YCurCllQT5s12/TjEucoSHUbeUtXKAl1HPpxRMO5ANZJnGD0VAry5R8a4vy4X5s4lo/DGbPa9tulb/j3OkWxQ7IDmpXX1u24Sv5zQozh7d0zXIvv0GslaUSh7hDR6jbCdvwCWpSrQprnx2kU76KNcdTHsaLfEfzqJV/ieehp/TiXzEWi/JVtpX/vo/QGJuG0B0LIbbdCUzrFwf3l/MBEKZBoT6txu4AAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAaCAYAAACD+r1hAAAAoklEQVR4XmNgGAWDDTACsTAQiwMxK5ocBpAA4nVA/B+KryDJaQPxRCBmgQnwA/EeIH4FxAuBeCUQf4MqANnaBcS2MMUgkAHEs4CYE0lMFYg1gVgRiOegyTE0ALE8sgAURANxOhAHoUvgAk+BuBpdEB+4AMTG6IL4ACgAeNAF8YHp6AKEQBG6AD7ADcQu6IL4gBIUEw1sgJgDXRAfwBaRwwYAALcHEivnoJ3+AAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAbCAYAAACnZAX6AAAA5ElEQVR4Xu3SLWtCYRjG8VtUTKKiOMaCeSYNIgO/ghbDiuxLCBvsGywO1sSgIAaNZjEajSIGBUGwiAbLgv4fzov3OZ4PsIEX/Mp98ZznhSNyz39NGFk8+oughPCKDQbo4s2em8TF+qAbU7xjiWc136OIFDrIqE7q+EVDD8kRH6jgSxcJTLHCky7IGn1840UXJZwwREQXYi3aibXI01Vxxqce2jGLFsj5C3Necx9zdn/MS/bk+oJunDv9iLfMY4sJ0igjpnopYI4R2pihhRoOGKMpATs6f8IDomqeFGunmwX3/O1cAIqBI7jROYSAAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAA9UlEQVR4Xu2RvwtBURTHj1BKQqT4JyTZjAb/gUFmk79Dya6kZDDgX7AZlUHJYqEsRmFR+B733t51Xp7F+D71Gd4598f73kPkI0nAHXxqj3AC+3AOD7q+h1m9x0UenuEGpkWPacMFjMmGoU7qljEMiB5ThjMYkQ3DgNQBTavGBxVgFFZgz+q5WMIbLFm1JByRisQHNKyeC5k/CFtwCkNmkRdmAid4sb7tSF/hrPZivp2nsib1eD/hrFdYtGochX/fROrAjNP+hEf4bXxMGFZl0cCbhuSdtQbjsmhIwRW5s/LBOdiFd9F7w3N9kPPaXm71Hh+f//ICU9E0h2NTXmUAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABFCAYAAAD3qbryAAAE90lEQVR4Xu3dW6hnUxwH8CUUIddcQi554ckDpnF5k3jghQc1ZN5c8jRC5gElRSTxoEiTJJFcktsLpzwQpcjlxcOQS5REKMllfdt7d/Ys5/L/nzNn/mfOfD717ey99v+cff5nT/1/s9Zee5UCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM7NfzdE1R7QHAACYrRRqN9dc2e+fUfNd337r8CIAAGbnzZrfm7anam6oObBpBwBgBn6t+bBpS8H2RdMGAMCM/FFz+2g/Q6H315w7agMAYIbmal4a7T9S82nN5TVnjtoBAPaYY2tOWCSZJZkeprWU+8KuWiDnjV9U3VhzVM05NZc0x3a3vOe8/0NHbceNtgEA9qgdNd/W/FvzZc3jNV/X/Fa63qZx0bIWTq55o3Tnf6F053+u5ofS9W4NMnPzo5pXSzcxgMnt3zYAAHufe2u2t41l14JpLeWesRRsrWdrNvfbn9TcVnN16Qo3JnN9zcVtIwCwdzm95vuak0b7B/XbF/Vfp5UiIT1ik9rZp7WldDM0BxmqPGa0v7dKj1fuh8t9ca0MQ2fIN18Pbo5NK3+rz8r89VyJXMtJ5XfOUPJChiF2AGAFLitd79bwof7w6NhKZZjzmbZxCX+Vbji0lV6/ccG2UXxc81bNttINSR/St+d+vgz5phfxg7J48TOJu0t3XYfMjQ9OIddykkLr1DJ/rvzuZ/Xt+Y/AizUv17zdvw4AmNJczT/9dgqGz+cPrUp+1oNl+V6iA0pXsF3YHihdr9ulbeMShuWk2skT46yHpaayYsIF/fZXNa/12ymehwf0poBe7e+aIvibtnEFHihLX8f0po57VLfW/F1zbemGsccTV1KM3jTaBwAmkOHQnaP99PhEZo8OPT9jmYRwV+kmByyXLOn0Y/dtizqxdOfP11YKyfwee9K4V2qhvDP/0lVJQZZi5s8y3/uV95pzpNi5pW9bjQyHDsXgQnIt22u2UJ4s3XW8rvu2/3midEPpgxRoeW95L+3qEOlx2x29uACwT8mH6vamLb1Urzdt0zqldOtwLicTDsYPqh1kLc8UC9OYpJjM8VlKMZO/eQqaSA/bXL89FK15TXq1prl/bCEpeDPhIPfMHdkcm8YrbUPj0bJrwRa5FsP7HPew5d69x0b7AMAy8qE6fKiP3VG6GZorleGzp9vGRaQHqD3/+TU/1xzetC9nkiHRSe7HWkuZCJBhymGSR7bnSlf0ZBJChojjsLJwITup/JzhPBlWvm/XwxPLtdzUNjYyxHnNaD8FYv4NZYg3vYVbR8fSPs2EFADYp7VDfePkOWdL3bO0nHtqrmgbG+k9as+b5Plrp41etxHlESW/lO7vnOIlRXMeCJyCLeuYpkcra5e2w4nT+ql0hffZ7YEp5FpOIoVhVoTII1eerzm+b8/kg/fK/PUd2gEAAAAAAAAAAFjcUk/tBwBghnLzfG74zwoLyfulm62amZbjx1MAADAjd9Y8NNrPzMcUaxtxiSwAgA0hD4TNuqib2wMAAKwPedBtniO2mufSAQCwhrIaxGpWfQAAYI1tKe5fAwBY13bUbGsbAQBYP94t3X1sAACsU5vaBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgL/Qfj/HEQlSujQ0AAAAASUVORK5CYII=>

[image10]: <data:image/png;base64,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>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAZCAYAAADXPsWXAAABIElEQVR4Xu2SvyuFYRTHv5Iit+RHWZTh/gMk5B+QhcQdTRZ/gkysVhmVycBqkQxCGUwGGQwWi8lEGfz4HOfp7XXe5+ru7qc+3Trnec/7fc99pDatsIDPuIp1vMJLPMQX/MLl4nSGDnzEMRzFe9zAztTvwzO8xcFUq2BvmMIanuKF/MEyM/iGk6H+w7g8rqVZwQ+c+3XC6Zd/0nxsdOERPsnfbHvYTvWIpcwOsYjvuB8bGWzIK07Exrp8+lpsZBjCu/RbYDs4UJOIGSzBrvy5Aot3rtaHbMk/v8KOfMhJbJSwJdvO7J5ksb/yM5mjB/fwBkdCr8AOHcvTbOJwqnfjEj7IU/SmelMG5HfFBpW9xmmFRf6FHVzEBs6qeuXb/E++AS0CNBLTIHM8AAAAAElFTkSuQmCC>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAABCklEQVR4XmNgGNmAE4jXAPEjIL4AxMVAzIeiAguwB+IbQLwSiF8C8X8oXg7ELEjqUIAvEH8E4mAonxGII4H4HxDvAWJuqDgKMAbir0B8DoiFkcQ5gFgAiY8BNIH4LQPEWX1ocngByFllDAg/uQIxM4oKPACkGeS/hwwQzSB/SaCoIABA0fGLAaL5ChCLoUpDgAwQTwXiBDRxKyB+zwDRHI0mxyAPxLeAeAUDZlCDnD2FAaKxCE2OoRwqAYo/bKAViH8CsSW6xEIGiMb5QMyKJgeKy1NAPJ0BS4qJYEAE/zogVmGAOBEUDfsZIAaiewEMQAqQ4w4ZOzFADMELQM4C+TMESkuhSo+CQQwAimEzQ7MEvrEAAAAASUVORK5CYII=>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAAvUlEQVR4XmNgGAXYgAMQhxDAaUB8G4gjIFogQAaIVwHxfyLwKyAOB2JGsE4gMIEKNgOxJBQrAfEhIP4NxL5I4sIMSBpBwAGIXzKgmQgE0QwQ29YAMQuSONFgDgPEgCJ0CWKAIBCfZoA43wZNjiigD8SfgPguEIujyREFqOb/dHQJYgDF/tcE4rdAfBWIRdDkiAIw/89nQEswxAKQxn9A7IEuQSx4AsQngJgfXYJY8BeIg9EFSQGy6AKjYLADAN8ILKMp4GouAAAAAElFTkSuQmCC>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAABCUlEQVR4Xu3RMUsCcRjH8UdKKFKCAiEU2qVByCkaWhIbnIIWwbcQBO0tvYOI8BVEja0NB02NQdCq0BboVEhR9v3f83inf0/JOX/wAe+557l7/qfIPHlUUMCG2cIeFuO25JTQxC0+0bfrUywN9U1NBgHevfrELOAIL3jCG37QwYXoERKzKrpqFzsy+uYVXIs+rGz9IzkTPd+5Xftrb9vvZ+SsFmbQ6IbrXm0w7FZuW8+B1cK4te7txonV/GH3173iC7tWi3KIb9wgLePDVdGPd4dlq0VJoYEeLrEp8fA+WqIPXtP25KzjGI+im7ijXKEo+oI/xV97pmTxgA//xrTURFf1BaLbzPMP8wufmz2a3q7/4gAAAABJRU5ErkJggg==>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAZCAYAAAA4/K6pAAAAzElEQVR4XmNgGAXYwCwg3gjEf4H4PxBfgYqVAjEHkjq8gAeIDwDxVyA2RpXCBCxA7ADEIUBsBRXDZYA8EPsDsRCSGAMjEAcA8Xsg/gkVw2aAMBBfBOJOIOaGiqGAOQwQP4MANgNANIgvAuVjgHIG4gwAyWEF6Qz4DfCEyuOMCUsGSBhwMmA3ANmFWAFI42YgtmXANECMAZIeXsMU4wNRQLyPAZGQbgBxIxBLIisiBNBdQDIQBOJjQPyNAZG4iAYgZ2PDBxjwROEoGNkAAPnTNtMDhfmRAAAAAElFTkSuQmCC>

[image16]: <data:image/png;base64,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>