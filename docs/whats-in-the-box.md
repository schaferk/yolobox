# What's in the Box

The base image is meant to be useful immediately without turning into a giant kitchen-sink image.

## Preinstalled tools

### AI CLIs

- Claude Code
- Gemini CLI
- OpenAI Codex
- OpenCode
- GitHub Copilot

### Runtimes

- Node.js 22
- Python 3
- Go
- Bun

### Build tools

- make
- cmake
- gcc

### Utilities

- git
- GitHub CLI
- ripgrep
- fd
- fzf
- jq
- vim

Need something else? The agent has sudo inside the container. If it needs a package manager, runtime, database client, or build dependency, it can install it.

## YOLO mode

Inside yolobox, AI CLIs are wrapped to skip approval prompts where the upstream tool supports it:

| Command | Expands to |
|---------|------------|
| `claude` | `claude --dangerously-skip-permissions` |
| `codex` | `codex --dangerously-bypass-approvals-and-sandbox` |
| `gemini` | `gemini --yolo` |
| `opencode` | `opencode` |
| `copilot` | `copilot --yolo` |

No confirmations, no guardrails. That is the product.

## Why the base image stays lean

The base image includes common tools nearly everyone needs. Project-specific stacks should usually be layered on with [project-level customization](/customizing):

- `packages = [...]` for apt packages
- `dockerfile = ".yolobox.Dockerfile"` for more advanced setup

That keeps upgrades cheaper than maintaining a fully custom forked image.

::: tip Why is this safe?
The AI is running inside a container. It can `rm -rf /` and the only thing destroyed is the container itself. Your home directory, your SSH keys, your other projects, and the rest of your host stay out of reach unless you explicitly expose them.
:::
