---
sidebar_position: 1
---

# Introduction

Platform Manager is a flexible and powerful HTTP server management library that allows you to work with multiple HTTP platforms (like Express and Fastify) using a unified API. It provides a consistent interface for handling HTTP requests regardless of the underlying platform.

## Features

- 🚀 Support for multiple HTTP platforms (Express, Fastify)
- 🔄 Unified API across different platforms
- 🛠️ Simple and intuitive routing system
- 📦 TypeScript support out of the box
- 🔌 Easy to extend for new platforms

## Installation

```bash
npm install @albasyir/platform-manager
```

## Quick Start

Here's a simple example using Express:

```typescript
import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';

// Create an Express instance
const app = express();
app.use(express.json());

// Initialize Platform Manager with Express
const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

// Get the router
const router = platform.router;

// Define a route
router.get('/', () => 'Hello World!');

// Start the server
await platform.start(3000);
```

Or using Fastify:

```typescript
import { PlatformManager, FastifyPlatform } from '@albasyir/platform-manager';
import fastify from 'fastify';

// Create a Fastify instance
const app = fastify();

// Initialize Platform Manager with Fastify
const platform = new PlatformManager({
  http: new FastifyPlatform({ reuseInstance: app })
});

// Get the router
const router = platform.router;

// Define a route
router.get('/', () => 'Hello World!');

// Start the server
await platform.start(3000);
```

## Why Platform Manager?

Platform Manager solves the problem of platform lock-in by providing a unified API that works across different HTTP platforms. This means you can:

1. Start with one platform (e.g., Express) and easily switch to another (e.g., Fastify) without changing your route handlers
2. Write platform-agnostic code that works with any supported platform
3. Maintain consistency in your codebase regardless of the underlying HTTP platform

## Next Steps

- Learn about [Routing](./routing) to handle different HTTP methods and paths
- Explore [Platform Configuration](./platform-config) for advanced setup options
- Check out [Examples](./examples) for more detailed usage scenarios
