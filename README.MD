# Devspace Bot

A modular Telegram bot framework built with TypeScript and Node.js, using adapter-based architecture and a lightweight **NeDB** (file-based) database.

## Overview

- **Platform:** Telegram
- **Language:** TypeScript / Node.js
- **Database:** NeDB (embedded, file-based)
- **Goal:** Clean separation of domain logic, adapters, and bot-specific code

## Project Structure (high level)

- `src/bots/telegram` — Telegram bot logic (handlers, scenes, middlewares)
- `src/adapters/chat` — Chat/LLM adapters and prompts
- `src/domain` — Core entities and repository interfaces
- `src/infrastructure` — DI container and configuration
- `src/database/nedb` — NeDB datastores and repository implementations

## Quick Start

```bash
pnpm install
pnpm run dev
```

Configure environment variables (bot token, paths) via `.env` or `src/config/env.config.ts`.

## Database

- Uses [**NeDB**](https://www.npmjs.com/package/@seald-io/nedb#creatingloading-a-database) for persistence
- No migrations required
- Schema changes are handled in repository implementations

## Contributing

### Test access (required)

Before contributing, you must:

- Make sure you get your [**Ollama**](https://docs.ollama.com/) and [**Gemini**](https://aistudio.google.com/api-keys) ai chat bot token
- Create your **BOT** and get your **BOT TOKEN** from [**BotFather**](https://t.me/BotFather)
- Request join to the [**Dev Space Test Group**](https://t.me/atodevspacetest) as admin for validating you bot behavior

### Development flow

1. Create a branch: `feat/<short-desc>`
2. Add or update domain logic in `src/domain`
3. Implement bot behavior in `src/bots/telegram`
4. Register dependencies in `src/infrastructure/container.ts`
5. Test using the **test bot** you created inside the [**Dev Space Test Group**](https://t.me/atodevspacetest)
6. Open a PR

### Guidelines

- Keep TypeScript strict and readable
- Add tests where possible
- Use clear commit messages (`feat:`, `fix:`)

— Keep it small, clean, and test everything in the test group.
