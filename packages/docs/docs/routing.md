---
sidebar_position: 2
---

# Routing

Platform Manager provides a unified routing system that works consistently across different HTTP platforms. The routing API is designed to be simple and intuitive while supporting all common HTTP methods and features.

## Basic Routing

The router supports all standard HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. Here's how to use them:

```typescript
const router = platform.router;

// GET request
router.get('/hello', () => 'Hello World!');

// POST request
router.post('/users', (req) => {
  const { name, email } = req.body;
  return { message: 'User created', user: { name, email } };
});

// PUT request
router.put('/users/:id', (req) => {
  const { id } = req.params;
  const { name, email } = req.body;
  return { message: 'User updated', user: { id, name, email } };
});

// PATCH request
router.patch('/users/:id', (req) => {
  const { id } = req.params;
  const updates = req.body;
  return { message: 'User partially updated', user: { id, ...updates } };
});

// DELETE request
router.delete('/users/:id', (req) => {
  const { id } = req.params;
  return { message: 'User deleted', id };
});
```

## Route Parameters

You can define route parameters using the `:paramName` syntax. These parameters are available in the request object:

```typescript
router.get('/users/:id', (req) => {
  const { id } = req.params;
  return `User ID: ${id}`;
});

router.get('/posts/:category/:id', (req) => {
  const { category, id } = req.params;
  return `Category: ${category}, Post ID: ${id}`;
});
```

## Query Parameters

Query parameters are automatically parsed and available in the request object:

```typescript
router.get('/search', (req) => {
  const { query, page = 1, limit = 10 } = req.query;
  return {
    query,
    page: Number(page),
    limit: Number(limit)
  };
});
```

## Request Body

For POST, PUT, and PATCH requests, the request body is automatically parsed and available in the request object:

```typescript
router.post('/users', (req) => {
  const { name, email, age } = req.body;
  return {
    message: 'User created',
    user: { name, email, age }
  };
});
```

## Response Types

The router supports various response types:

```typescript
// String response
router.get('/text', () => 'Hello World!');

// JSON response
router.get('/json', () => ({
  message: 'Hello World!',
  timestamp: new Date().toISOString()
}));

// Array response
router.get('/list', () => [1, 2, 3, 4, 5]);

// Null response
router.get('/empty', () => null);
```

## Error Handling

You can throw errors in your route handlers, and they will be properly handled:

```typescript
router.get('/users/:id', (req) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('User ID is required');
  }
  return { id, name: 'John Doe' };
});
```

## Best Practices

1. **Keep Route Handlers Simple**: Extract complex logic into separate service functions
2. **Use TypeScript**: Take advantage of TypeScript for better type safety
3. **Validate Input**: Always validate request parameters, query parameters, and body
4. **Handle Errors**: Implement proper error handling for all routes
5. **Use Consistent Response Format**: Maintain a consistent structure for all API responses

## Next Steps

- Learn about [Platform Configuration](./platform-config) for advanced setup options
- Check out [Examples](./examples) for more detailed usage scenarios
- Explore [Error Handling](./error-handling) for advanced error management 