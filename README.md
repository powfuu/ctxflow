```
 ██████╗████████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
██╔════╝╚══██╔══╝╚██╗██╔╝██╔════╝██║     ██╔═══██╗██║    ██║
██║        ██║    ╚███╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║
██║        ██║    ██╔██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║
╚██████╗   ██║   ██╔╝ ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝
 ╚═════╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

<p align="center">
  <strong>Context scaffolding for AI agent-driven development.</strong><br/>
  <sub>Give your AI the context it needs — before it starts guessing.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/ctxflow?color=a855f7&label=npm" alt="npm version"/>
  <img src="https://img.shields.io/node/v/ctxflow?color=06b6d4&label=node" alt="node version"/>
  <img src="https://img.shields.io/npm/l/ctxflow?color=a855f7" alt="license"/>
  <img src="https://img.shields.io/npm/dm/ctxflow?color=06b6d4" alt="downloads"/>
</p>

---

## The problem

You open your AI coding assistant and ask it to implement a feature.
It starts writing code — but it doesn't know your stack, your constraints, your architecture decisions, or what's already been agreed upon.

So it guesses. And you spend the next hour correcting it.

**ctxflow fixes this.**

It scaffolds structured context files your AI can read before touching a single line of code: requirements, task plans, architectural decisions, and project-wide rules — all in plain Markdown, all version-controlled alongside your code.

---

## Install

```bash
npm install -g ctxflow
```

---

## Quick start

```bash
# 1. Initialise your project (once) — pick your AI agents
ctxflow init

# 2. Create a feature context before you start coding
ctxflow new user-authentication

# 3. Fill in requirements.md — your AI reads this first
# 4. Check progress at any time
ctxflow status user-authentication
```

Or just run `ctxflow` for the full interactive menu.

---

## What gets created

### `ctxflow init`

Asks which AI agents you use, then creates the right context file(s) for each:

| Agent | File |
|-------|------|
| Claude Code | `CLAUDE.md` |
| Codex CLI (OpenAI) | `AGENTS.md` |
| Cursor | `.cursor/rules/project.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |
| Gemini CLI | `GEMINI.md` |
| Cline | `.clinerules` |
| Aider | `CONVENTIONS.md` |
| Amazon Q | `.amazonq/rules/context.md` |
| Continue | `.continuerules` |
| Devin / Kiro / others | `AGENTS.md` |

Each file contains your stack, architecture overview, approved libraries, and non-negotiable rules — the single source of truth your AI reads every session.

You can select multiple agents. Files that share a path (e.g. Codex CLI + Devin both use `AGENTS.md`) are written once.

### `ctxflow new <feature>`

```
docs/features/<feature>/
  requirements.md       ← Why this feature exists, constraints, acceptance criteria
  plan.md               ← Tasks (checkboxes), file structure, open questions
```

---

## Interactive menu

Run `ctxflow` with no arguments for a full interactive experience:

```
  What would you like to do?

  [1]  New feature      — scaffold a new feature context
  [2]  Init project     — create AI context file(s) + /docs structure
  [3]  List features    — show all existing plans
  [4]  Status           — check tasks in a feature plan
  [5]  Help             — show usage and documentation

  Ctrl+C to exit
```

Press a number key to execute instantly — no Enter needed.

---

## CLI reference

| Command | Description |
|--------|-------------|
| `ctxflow` | Launch interactive menu |
| `ctxflow init` | Select AI agents and scaffold context file(s) |
| `ctxflow new <feature>` | Create a feature context under `docs/features/<feature>/` |
| `ctxflow list` | List all feature contexts with creation dates |
| `ctxflow status <feature>` | Show task completion progress for a feature |

---

## The workflow

```
1. ctxflow init          →  Pick your agents. Context files written automatically.
2. ctxflow new <feature> →  Before every feature: scaffold requirements + plan.
3. Fill requirements.md  →  Context, constraints, acceptance criteria. Your AI reads this.
4. Code the feature      →  AI works with full context. No guessing.
5. Check tasks off       →  Mark [ ] → [x] in plan.md as you go.
6. ctxflow status        →  See exactly where you are at any time.
```

---

## Why this works

AI coding assistants are only as useful as the context they receive. Without structured context:

| Without ctxflow | With ctxflow |
|----------------|--------------|
| Agent guesses at your stack | Agent reads your exact stack from the context file |
| Unapproved libraries sneak in | Context file lists exactly what's approved |
| Requirements drift mid-feature | `requirements.md` is the single source of truth |
| Agent asks you the same questions every session | Context is version-controlled and always available |

---

## Works with any AI assistant

ctxflow supports all major AI coding agents out of the box:

- **Claude Code** — `CLAUDE.md`
- **Codex CLI (OpenAI)** — `AGENTS.md`
- **Cursor** — `.cursor/rules/project.md`
- **GitHub Copilot** — `.github/copilot-instructions.md`
- **Windsurf** — `.windsurfrules`
- **Gemini CLI** — `GEMINI.md`
- **Cline** — `.clinerules`
- **Aider** — `CONVENTIONS.md`
- **Amazon Q** — `.amazonq/rules/context.md`
- **Continue** — `.continuerules`
- **Devin / Kiro / others** — `AGENTS.md`

Select one or more during `ctxflow init`. The project is considered initialised as long as any of these files exist.

---

## Works with any language or framework

ctxflow generates language-agnostic context files.
Whether you're building in Java, Python, Go, Rust, TypeScript, or Ruby —
fill in your stack, and your AI gets the right context.

---

## Requirements

- Node.js 18+
- Works on macOS, Linux, Windows

---

## License

MIT © ctxflow contributors
