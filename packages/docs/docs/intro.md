---
sidebar_position: 1
---

# Introduction

UEP (Unleashed Exagonal Protocol) is a modern platform abstraction layer designed to unify HTTP, Realtime, and Messaging systems under one powerful protocol-inspired architecture. Think: Express + Fastify + Socket.IO + RabbitMQ... all in one plug-and-play interface — portable, interceptable, and 100% modular.

## ✨ Why "UEP"? What is *Exagonal*?

UEP stands for **Unleashed Exagonal Protocol**.

Unlike the traditional "Hexagonal Architecture" which focuses on Ports and Adapters, **Exagonal** is our evolved take — where protocols, interceptors, and platform behavior are first-class citizens.

> [!INFO]
> Not just Hexagonal. It's **Exagonal** — a boundary-less, scalable, plug-aware system that embraces both structure and freedom.

We intentionally dropped the "H" to show:  
- it's **not a copy**,  
- it's **not just theory**,  
- it's **a flexible protocol engine** built for real-life architecture.

## 🔧 Key Features

- 🔌 **Pluggable Platform Support**
  - HTTP: Express, Fastify (working now but experimental)
  - Realtime: Socket.IO (in plan, need to make standard first)
  - Messaging: RabbitMQ (fixed plan, soon)
  - more will coming

- 🔌 **Pluggable Runtime Support** (unit test passed for now)
  - NodeJS 
  - Bun 
  - Deno (passed with warning)

- 🧩 **Composable Middleware & Hook System** (soon)
  - Intercept Before and After
  - Validation included

- 🛡️ **Unified Schema Validation** (soon)
  - Zod-first, type-safe across body, params, query

- 🔁 **Protocol-Oriented, Not Framework-Locked**
  - Build once, run on any platform

## Installation

```bash
npm install @uep/manager
```

## Quick Start

Here's a simple example using Express:

```typescript
import { UEP, ExpressPlatform } from '@uep/manager';
import express from 'express';

// Create an Express instance
const app = express();
app.use(express.json());

// Initialize UEP with Express
const uep = new UEP({
  http: new ExpressPlatform({ reuseInstance: app })
});

// Get the router
const router = uep.router;

// Define a route
router.get('/', () => 'Hello World!');

// Start the server
await uep.start(3000);
```

## 🧭 Architecture Overview

Our architecture focuses on business logic and routing instead of overthinking about everything:

```mermaid
flowchart TD
  subgraph Platform
    A1[Express]
    A2[Fastify]
    A3[H3]
    A4[Socket.IO]
    A5[RabbitMQ]
  end

  subgraph UEP Core
    B1[Protocol Handler]
    B2[Schema Validator]
    B3[Interceptor Engine]
    B4[Router Adapter]
  end

  subgraph User Code
    C1[Define Routes]
    C2[Business Logic]
  end

  A1 --> B4
  A2 --> B4
  A3 --> B4
  A4 --> B4
  A5 --> B4

  B4 --> B1
  B1 --> B2
  B1 --> B3

  B1 --> C1
  B2 --> C2
  B3 --> C2
```

## 📦 Packages

```bash
@uep/manager
@uep/http-express-platform
@uep/http-fastify-platform
@uep/broker-rabbitmq-platform
```

## Next Steps

- Learn about [Routing](./routing) to handle different HTTP methods and paths
- Explore [Platform Configuration](./platform-config) for advanced setup options
- Check out [Examples](./examples) for more detailed usage scenarios
