import { PlatformManager, ExpressPlatform, FastifyPlatform } from '../src';
import express from 'express';

const platform = new ExpressPlatform({
  reuseInstance: express()
})

// const platform = new FastifyPlatform()

const manager = new PlatformManager({
  http: platform
});

const router = manager.router;

// GET - Simple string response
router.get('/', () => 'Hello from UEP!');

// GET - JSON response
router.get('/json', () => ({
  message: 'Hello from UEP!',
  timestamp: new Date().toISOString()
}));

// GET - With URL parameters
router.get('/params/:name', (req) => {
  return `Hello, ${req.params.name}!`;
});

// GET - With query parameters
router.get('/query', (req) => {
  const { name = 'Guest' } = req.query;
  return `Hello, ${name}!`;
});

// POST - Create resource
router.post('/users', (req) => {
  const { name, email } = req.body;
  return {
    message: 'User created',
    user: { name, email, id: Date.now() }
  };
});

// PUT - Update resource
router.put('/users/:id', (req) => {
  const { id } = req.params;
  const { name, email } = req.body;
  return {
    message: 'User updated',
    user: { id, name, email, updatedAt: new Date().toISOString() }
  };
});

// PATCH - Partial update
router.patch('/users/:id', (req) => {
  const { id } = req.params;
  const updates = req.body;
  return {
    message: 'User partially updated',
    user: { id, ...updates, updatedAt: new Date().toISOString() }
  };
});

// DELETE - Remove resource
router.delete('/users/:id', (req) => {
  const { id } = req.params;
  return {
    message: 'User deleted',
    id
  };
});

// Start the servers
async function start() {
  await manager.start(3000);
  console.log('Access on: http://localhost:3000');

  console.log('\nTest the endpoints:');
  console.log('GET /');
  console.log('GET /json');
  console.log('GET /params/your-name');
  console.log('GET /query?name=your-name');
  console.log('POST /users (with body: { "name": "John", "email": "john@example.com" })');
  console.log('PUT /users/123 (with body: { "name": "John", "email": "john@example.com" })');
  console.log('PATCH /users/123 (with body: { "name": "John" })');
  console.log('DELETE /users/123');
}

start().catch(console.error); 