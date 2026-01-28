# ThreadBot

      _______
     |__   __| |      | |             | |  
        | |  | |__  _ __ ___  __ _  __| |
        | |  | '_ \| '__/ _ \/ _` |/ _` |
        | |  | | | | | |  __/ (_| | (_| |
        |_|  |_| |_|_|  \___|\__,_|\__,_|
              [ T H R E A D B O T ]

A modular, open‑source Telegram bot framework for managing **supergroups and topics**, built with **TypeScript** and **Node.js**, using an adapter‑based architecture and a lightweight **NeDB** (file‑based) database.

## Overview

**ThreadBot** is designed to manage Telegram supergroups with **multiple admins**, allowing structured topic management, automated posting, and flexible moderation workflows.

The project is **ready to use and easy to modify** — simply provide the correct values in the environment variables and deploy.

It is **supergroup‑agnostic**, meaning it can be used for **any type of Telegram supergroup** (communities, developer groups, learning hubs, DAO groups, etc.).

> **Note:** Every topic created automatically sends a `"register"` message in the topic to ensure it is properly registered in the database.


* **Platform:** Telegram
* **Language:** TypeScript / Node.js
* **Database:** NeDB (embedded, file‑based)
* **Admins:** Supports multiple topic admins
* **Goal:** Clean separation of domain logic, adapters, and bot‑specific code

## Project Structure (high level)

* `src/bots/telegram` — Telegram bot logic (handlers, scenes, middlewares)
* `src/adapters/chat` — Chat/LLM adapters and prompts
* `src/domain` — Core entities and repository interfaces
* `src/infrastructure` — DI container and configuration
* `src/database/nedb` — NeDB datastores and repository implementations

## Quick Start

```bash
pnpm install
pnpm run dev
```

### Environment configuration

For development and production, make sure the following files exist:

* `.env.development` — development environment variables
* `.env.production` — production environment variables

Provide the required bot tokens, group IDs, and service keys in these files. Once configured, ThreadBot is ready to run.

## Database

* Uses **NeDB** for persistence
* No migrations required
* Schema changes are handled in repository implementations

## Contributing

### Test access (required)

Before contributing, you must:

* Obtain your **Ollama** and **Gemini** API tokens
* Create a Telegram bot and get a **BOT TOKEN** from **BotFather**
* Join the test supergroup as an admin to validate bot behavior

### Development flow

1. Create a branch: `feat/<short-desc>`
2. Add or update domain logic in `src/domain`
3. Implement bot behavior in `src/bots/telegram`
4. Register dependencies in `src/infrastructure/container.ts`
5. Test inside a supergroup
6. Open a PR

### Guidelines

* Keep TypeScript strict and readable
* Add tests where possible
* Use clear commit messages (`feat:`, `fix:`)

— ThreadBot is designed to be flexible, clean, and production‑ready.
