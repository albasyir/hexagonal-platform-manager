import request from 'supertest';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { ExpressPlatform } from '../express/express.ts';
import { FastifyPlatform } from '../fastify/fastify.ts';

const platforms = [
  { name: 'Express', PlatformClass: ExpressPlatform },
  { name: 'Fastify', PlatformClass: FastifyPlatform }
];

platforms.forEach(({ name, PlatformClass }) => {
  test(`${name} Platform - GET endpoints with/without trailing slash`, async () => {
    const platform = new PlatformClass();
    try {
      // Setup route without trailing slash
      platform.router.get('/test', () => ({ message: 'Hello World' }));
      await platform.start(0); // Use port 0 for random available port
      const server = platform.getServer();

      // Test without trailing slash
      const response1 = await request(server)
        .get('/test')
        .expect(200);

      assert.equal(response1.body, { message: 'Hello World' });

      // Test with trailing slash
      const response2 = await request(server)
        .get('/test/')
        .expect(200);

      assert.equal(response2.body, { message: 'Hello World' });
    } finally {
      await platform.stop();
    }
  });

  test(`${name} Platform - Dynamic routes with/without trailing slash`, async () => {
    const platform = new PlatformClass();
    try {
      // Setup route with parameter
      platform.router.get('/users/:id', (req) => ({ 
        id: req.params.id,
        message: 'User found' 
      }));
      
      await platform.start(0);
      const server = platform.getServer();

      // Test without trailing slash
      const response1 = await request(server)
        .get('/users/123')
        .expect(200);

      assert.equal(response1.body, { 
        id: '123',
        message: 'User found'
      });

      // Test with trailing slash
      const response2 = await request(server)
        .get('/users/123/')
        .expect(200);

      assert.equal(response2.body, { 
        id: '123',
        message: 'User found'
      });
    } finally {
      await platform.stop();
    }
  });

  test(`${name} Platform - Nested routes with/without trailing slash`, async () => {
    const platform = new PlatformClass();
    try {
      // Setup nested route
      platform.router.get('/api/v1/users', () => ({ 
        users: ['user1', 'user2']
      }));
      
      await platform.start(0);
      const server = platform.getServer();

      // Test without trailing slash
      const response1 = await request(server)
        .get('/api/v1/users')
        .expect(200);

      assert.equal(response1.body, { 
        users: ['user1', 'user2']
      });

      // Test with trailing slash
      const response2 = await request(server)
        .get('/api/v1/users/')
        .expect(200);

      assert.equal(response2.body, { 
        users: ['user1', 'user2']
      });
    } finally {
      await platform.stop();
    }
  });

  test(`${name} Platform - All HTTP methods with/without trailing slash`, async () => {
    const platform = new PlatformClass();
    try {
      // Setup routes for different HTTP methods
      platform.router.post('/api/items', () => ({ status: 'created' }));
      platform.router.put('/api/items/:id', (req) => ({ 
        status: 'updated',
        id: req.params.id 
      }));
      platform.router.delete('/api/items/:id', (req) => ({ 
        status: 'deleted',
        id: req.params.id 
      }));
      
      await platform.start(0);
      const server = platform.getServer();

      // Test POST
      const post1 = await request(server)
        .post('/api/items')
        .expect(200);
      const post2 = await request(server)
        .post('/api/items/')
        .expect(200);
      assert.equal(post1.body, { status: 'created' });
      assert.equal(post2.body, { status: 'created' });

      // Test PUT
      const put1 = await request(server)
        .put('/api/items/123')
        .expect(200);
      const put2 = await request(server)
        .put('/api/items/123/')
        .expect(200);
      assert.equal(put1.body, { status: 'updated', id: '123' });
      assert.equal(put2.body, { status: 'updated', id: '123' });

      // Test DELETE
      const del1 = await request(server)
        .delete('/api/items/123')
        .expect(200);
      const del2 = await request(server)
        .delete('/api/items/123/')
        .expect(200);
      assert.equal(del1.body, { status: 'deleted', id: '123' });
      assert.equal(del2.body, { status: 'deleted', id: '123' });
    } finally {
      await platform.stop();
    }
  });
});

test.run(); 