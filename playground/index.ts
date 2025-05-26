import { PlatformManager, ExpressPlatform, FastifyPlatform } from '../src';
import express from 'express';
import fastify from 'fastify';

// Example with Express using existing instance
const existingExpress = express();
existingExpress.use(express.json());
existingExpress.use(express.urlencoded({ extended: true }));

const expressPlatform = new PlatformManager({
  http: new ExpressPlatform({ engine: existingExpress })
});

const expressRouter = expressPlatform.router;

// GET - Simple string response
expressRouter.get('/', () => 'Hello from Express!');

// GET - JSON response
expressRouter.get('/json', () => ({
  message: 'Hello from Express!',
  timestamp: new Date().toISOString()
}));

// GET - With URL parameters
expressRouter.get('/params/:name', (req) => {
  return `Hello, ${req.params.name}!`;
});

// GET - With query parameters
expressRouter.get('/query', (req) => {
  const { name = 'Guest' } = req.query;
  return `Hello, ${name}!`;
});

// POST - Create resource
expressRouter.post('/users', (req) => {
  const { name, email } = req.body;
  return {
    message: 'User created',
    user: { name, email, id: Date.now() }
  };
});

// PUT - Update resource
expressRouter.put('/users/:id', (req) => {
  const { id } = req.params;
  const { name, email } = req.body;
  return {
    message: 'User updated',
    user: { id, name, email, updatedAt: new Date().toISOString() }
  };
});

// PATCH - Partial update
expressRouter.patch('/users/:id', (req) => {
  const { id } = req.params;
  const updates = req.body;
  return {
    message: 'User partially updated',
    user: { id, ...updates, updatedAt: new Date().toISOString() }
  };
});

// DELETE - Remove resource
expressRouter.delete('/users/:id', (req) => {
  const { id } = req.params;
  return {
    message: 'User deleted',
    id
  };
});

// Example with Fastify using existing instance
const existingFastify = fastify({ logger: false });

const fastifyPlatform = new PlatformManager({
  http: new FastifyPlatform({ engine: existingFastify })
});

const fastifyRouter = fastifyPlatform.router;

// GET - Simple string response
fastifyRouter.get('/', () => 'Hello from Fastify!');

// GET - JSON response
fastifyRouter.get('/json', () => ({
  message: 'Hello from Fastify!',
  timestamp: new Date().toISOString()
}));

// GET - With URL parameters
fastifyRouter.get('/params/:name', (req) => {
  return `Hello, ${req.params.name}!`;
});

// GET - With query parameters
fastifyRouter.get('/query', (req) => {
  const { name = 'Guest' } = req.query;
  return `Hello, ${name}!`;
});

// POST - Create resource
fastifyRouter.post('/users', (req) => {
  const { name, email } = req.body;
  return {
    message: 'User created',
    user: { name, email, id: Date.now() }
  };
});

// PUT - Update resource
fastifyRouter.put('/users/:id', (req) => {
  const { id } = req.params;
  const { name, email } = req.body;
  return {
    message: 'User updated',
    user: { id, name, email, updatedAt: new Date().toISOString() }
  };
});

// PATCH - Partial update
fastifyRouter.patch('/users/:id', (req) => {
  const { id } = req.params;
  const updates = req.body;
  return {
    message: 'User partially updated',
    user: { id, ...updates, updatedAt: new Date().toISOString() }
  };
});

// DELETE - Remove resource
fastifyRouter.delete('/users/:id', (req) => {
  const { id } = req.params;
  return {
    message: 'User deleted',
    id
  };
});

// Start the servers
async function start() {
  // Start Express on port 3000
  await expressPlatform.start(3000);
  
  // Start Fastify on port 3001
  await fastifyPlatform.start(3001);
  
  console.log('Servers started!');
  console.log('Express: http://localhost:3000');
  console.log('Fastify: http://localhost:3001');
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