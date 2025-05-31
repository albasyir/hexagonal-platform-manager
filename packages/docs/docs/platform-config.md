---
sidebar_position: 3
---

# Platform Configuration

UEP supports multiple platforms (HTTP, Realtime, and Messaging) and provides configuration options for each platform. This guide explains how to configure different platforms and their specific options.

## HTTP Platforms

### Express Platform

The Express platform allows you to use Express.js as your HTTP server. You can either create a new Express instance or reuse an existing one.

#### Basic Configuration

```typescript
import { UEP, ExpressPlatform } from '@uep/core';
import express from 'express';

// Create a new Express instance
const uep = new UEP({
  http: new ExpressPlatform()
});

// Or reuse an existing Express instance
const app = express();
app.use(express.json());

const uep = new UEP({
  http: new ExpressPlatform({ reuseInstance: app })
});
```

#### Express-specific Middleware

You can add Express middleware to your application:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

const uep = new UEP({
  http: new ExpressPlatform({ reuseInstance: app })
});
```

### Fastify Platform

The Fastify platform allows you to use Fastify as your HTTP server. Like Express, you can create a new instance or reuse an existing one.

#### Basic Configuration

```typescript
import { UEP, FastifyPlatform } from '@uep/core';
import fastify from 'fastify';

// Create a new Fastify instance
const uep = new UEP({
  http: new FastifyPlatform()
});

// Or reuse an existing Fastify instance
const app = fastify({
  logger: true
});

const uep = new UEP({
  http: new FastifyPlatform({ reuseInstance: app })
});
```

#### Fastify-specific Plugins

You can add Fastify plugins to your application:

```typescript
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';

const app = fastify({
  logger: true
});

// Add plugins
await app.register(fastifyCors);
await app.register(fastifyHelmet);

const uep = new UEP({
  http: new FastifyPlatform({ reuseInstance: app })
});
```

## Realtime Platform (Coming Soon)

The Socket.IO platform will be available soon, providing real-time communication capabilities.

## Messaging Platform (Coming Soon)

The RabbitMQ platform will be available soon, providing message queue capabilities.

## Platform-specific Features

### HTTP Platform Features

#### Express Features
- Full access to Express middleware ecosystem
- Support for Express-specific features like `app.use()`
- Compatibility with Express plugins and extensions

#### Fastify Features
- Built-in JSON schema validation
- High performance with low overhead
- Support for Fastify plugins and hooks
- Built-in logging capabilities

### Realtime Platform Features (Coming Soon)
- Real-time bidirectional communication
- Room-based messaging
- Event-based architecture
- Automatic reconnection handling

### Messaging Platform Features (Coming Soon)
- Message queuing and routing
- Pub/sub patterns
- Message persistence
- Dead letter queues

## Best Practices

1. **Choose the Right Platform**: Consider your specific needs when choosing between platforms
2. **Use Platform-specific Features**: Take advantage of platform-specific features when needed
3. **Keep Platform-specific Code Isolated**: Isolate platform-specific code to make it easier to switch platforms
4. **Use TypeScript**: Take advantage of TypeScript for better type safety and IDE support
5. **Leverage Protocol Handlers**: Use the protocol handler system for cross-platform functionality

## Next Steps

- Learn about [Routing](./routing) to handle different protocols and paths
- Check out [Examples](./examples) for more detailed usage scenarios
- Explore [Error Handling](./error-handling) for advanced error management 