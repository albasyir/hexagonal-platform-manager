---
sidebar_position: 5
---

# Error Handling

Platform Manager provides a robust error handling system that works consistently across different HTTP platforms. This guide explains how to handle errors effectively in your application.

## Basic Error Handling

The simplest way to handle errors is to throw them in your route handlers:

```typescript
router.get('/users/:id', (req) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('User ID is required');
  }
  return { id, name: 'John Doe' };
});
```

## Custom Error Classes

You can create custom error classes to handle specific types of errors:

```typescript
// Custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Using custom errors
router.get('/users/:id', (req) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  const user = findUser(id);
  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }
  return user;
});
```

## Global Error Handler

You can set up a global error handler to handle all errors consistently:

```typescript
import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';

const app = express();
app.use(express.json());

const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

// Global error handler
app.use((err: Error, req: any, res: any, next: any) => {
  // Log the error
  console.error(err);

  // Handle different types of errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.name,
      message: err.message
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.name,
      message: err.message
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      error: err.name,
      message: err.message
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong'
  });
});
```

## Error Middleware

You can create middleware to handle specific types of errors:

```typescript
// Validation middleware
const validateUser = (req: any) => {
  const { name, email } = req.body;
  if (!name) throw new ValidationError('Name is required');
  if (!email) throw new ValidationError('Email is required');
  if (!email.includes('@')) throw new ValidationError('Invalid email format');
};

// Authentication middleware
const authenticate = (req: any) => {
  const token = req.headers.authorization;
  if (!token) throw new AuthenticationError('No token provided');
  if (!isValidToken(token)) throw new AuthenticationError('Invalid token');
};

// Using middleware
router.post('/users', (req) => {
  authenticate(req);
  validateUser(req);
  const { name, email } = req.body;
  return { message: 'User created', user: { name, email } };
});
```

## Error Response Format

It's recommended to use a consistent error response format:

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Error handler with consistent format
app.use((err: Error, req: any, res: any, next: any) => {
  const response: ErrorResponse = {
    error: err.name,
    message: err.message,
    timestamp: new Date().toISOString()
  };

  if (err instanceof ValidationError) {
    return res.status(400).json(response);
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json(response);
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json(response);
  }

  return res.status(500).json(response);
});
```

## Best Practices

1. **Use Custom Error Classes**: Create specific error classes for different types of errors
2. **Consistent Error Format**: Use a consistent format for error responses
3. **Proper Error Logging**: Log errors with appropriate context
4. **Graceful Error Recovery**: Handle errors gracefully and provide meaningful messages
5. **Type Safety**: Use TypeScript to ensure type safety in error handling

## Next Steps

- Learn about [Routing](./routing) to handle different HTTP methods and paths
- Explore [Platform Configuration](./platform-config) for advanced setup options
- Check out [Examples](./examples) for more detailed usage scenarios 