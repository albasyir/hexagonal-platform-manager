---
sidebar_position: 4
---

# Examples

This section provides comprehensive examples of using Platform Manager in different scenarios. Each example demonstrates best practices and common use cases.

## Basic Server Setup

### Express Example

```typescript
import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';

// Create Express instance
const app = express();
app.use(express.json());

// Initialize Platform Manager
const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

const router = platform.router;

// Define routes
router.get('/', () => 'Hello from Express!');
router.get('/health', () => ({ status: 'ok' }));

// Start server
await platform.start(3000);
```

### Fastify Example

```typescript
import { PlatformManager, FastifyPlatform } from '@albasyir/platform-manager';
import fastify from 'fastify';

// Create Fastify instance
const app = fastify({
  logger: true
});

// Initialize Platform Manager
const platform = new PlatformManager({
  http: new FastifyPlatform({ reuseInstance: app })
});

const router = platform.router;

// Define routes
router.get('/', () => 'Hello from Fastify!');
router.get('/health', () => ({ status: 'ok' }));

// Start server
await platform.start(3000);
```

## REST API Example

Here's a complete REST API example with CRUD operations:

```typescript
import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';

const app = express();
app.use(express.json());

const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

const router = platform.router;

// In-memory database
const users = new Map();

// Create user
router.post('/users', (req) => {
  const { name, email } = req.body;
  const id = Date.now().toString();
  const user = { id, name, email, createdAt: new Date().toISOString() };
  users.set(id, user);
  return { message: 'User created', user };
});

// Get all users
router.get('/users', () => {
  return Array.from(users.values());
});

// Get user by ID
router.get('/users/:id', (req) => {
  const { id } = req.params;
  const user = users.get(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
});

// Update user
router.put('/users/:id', (req) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users.get(id);
  if (!user) {
    throw new Error('User not found');
  }
  const updatedUser = { ...user, name, email, updatedAt: new Date().toISOString() };
  users.set(id, updatedUser);
  return { message: 'User updated', user: updatedUser };
});

// Delete user
router.delete('/users/:id', (req) => {
  const { id } = req.params;
  const user = users.get(id);
  if (!user) {
    throw new Error('User not found');
  }
  users.delete(id);
  return { message: 'User deleted', id };
});

await platform.start(3000);
```

## Error Handling Example

Here's an example of implementing proper error handling:

```typescript
import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';

const app = express();
app.use(express.json());

const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

const router = platform.router;

// Custom error class
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Validation middleware
const validateUser = (req: any) => {
  const { name, email } = req.body;
  if (!name) throw new ValidationError('Name is required');
  if (!email) throw new ValidationError('Email is required');
  if (!email.includes('@')) throw new ValidationError('Invalid email format');
};

// Create user with validation
router.post('/users', (req) => {
  validateUser(req);
  const { name, email } = req.body;
  return { message: 'User created', user: { name, email } };
});

// Error handling middleware
app.use((err: Error, req: any, res: any, next: any) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.name,
      message: err.message
    });
  }
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong'
  });
});

await platform.start(3000);
```

## File Upload Example

Here's an example of handling file uploads:

```typescript
import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

const router = platform.router;

// Single file upload
router.post('/upload', (req) => {
  upload.single('file')(req, {}, (err) => {
    if (err) throw err;
  });
  return { message: 'File uploaded successfully', file: req.file };
});

// Multiple file upload
router.post('/upload-multiple', (req) => {
  upload.array('files', 5)(req, {}, (err) => {
    if (err) throw err;
  });
  return { message: 'Files uploaded successfully', files: req.files };
});

await platform.start(3000);
```

## Next Steps

- Learn about [Routing](./routing) to handle different HTTP methods and paths
- Explore [Platform Configuration](./platform-config) for advanced setup options
- Check out [Error Handling](./error-handling) for advanced error management 