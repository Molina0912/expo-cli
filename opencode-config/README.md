# OpenCode Configuration - mimo-v2.5-free

Configuration folder for OpenCode CLI using the free model `opencode/mimo-v2.5-free`.

## Setup

### Option 1: Global config (applies to all projects)

Copy `opencode.jsonc` to your OpenCode config directory:

**Windows:**
```cmd
copy opencode.jsonc %APPDATA%\opencode\opencode.jsonc
copy AGENTS.md %APPDATA%\opencode\AGENTS.md
```

**macOS/Linux:**
```bash
cp opencode.jsonc ~/.config/opencode/opencode.jsonc
cp AGENTS.md ~/.config/opencode/AGENTS.md
```

### Option 2: Per-project config (applies only to that project)

Copy files to your project's `.opencode/` directory:

```bash
mkdir -p .opencode
cp opencode.jsonc .opencode/opencode.jsonc
cp AGENTS.md .opencode/AGENTS.md
```

### Option 3: Use environment variable

```bash
export OPENCODE_CONFIG=/path/to/opencode-config/opencode.jsonc
```

## Model Details

| Field | Value |
|-------|-------|
| Model ID | `opencode/mimo-v2.5-free` |
| Provider | `opencode` (built-in) |
| API Key | Not required (public/free) |
| Cost | Free |

## What's configured

- **model**: `opencode/mimo-v2.5-free` (main model)
- **small_model**: `opencode/mimo-v2.5-free` (for title generation, summaries)
- **default_agent**: `build` (primary coding agent)
- **All agents** (build, plan, general, explore, scout) use mimo-v2.5-free
- **Permission mode**: `ask` for edits, bash, and MCP tools
- **Compaction**: Auto-compaction enabled when context fills up
- **All tools enabled**: bash, read, write, edit, glob, grep, fetch, patch, todoedit, todoread
- **Auto-update**: Notify mode (tells you when updates are available)

## Customization

### To enable auto-permission (no confirmations):

```jsonc
"permission": {
  "edit": "allow",
  "bash": "allow",
  "mcp": "allow"
}
```

### To add MCP servers:

```jsonc
"mcp": {
  "my-server": {
    "command": "npx",
    "args": ["-y", "my-mcp-server"]
  }
}
```

### To add custom commands:

Create `.opencode/commands/my-command.md` with:
```markdown
---
name: my-command
description: Does something useful
---

Your prompt template here. Use $ARGUMENTS for user input.
```

### To change the shell:

```jsonc
"shell": "powershell"    // Windows
"shell": "/bin/zsh"      // macOS
"shell": "/bin/bash"     // Linux
```

## File Structure

```
opencode-config/
├── opencode.jsonc      # Main configuration file
├── AGENTS.md           # Instructions for the AI agent
└── README.md           # This file
```
