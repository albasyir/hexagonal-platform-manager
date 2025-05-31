import request from 'supertest';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { runPlatformTest } from './helpers/platform-test.helper-spec.ts';
import { HttpPlatform } from '../../../types/http-platform.ts';

runPlatformTest('should handle URL parameters', async (platform: HttpPlatform) => {
  platform.router.get('/params/:name', (req) => `Hello, ${req.params.name}!`);
  await platform.start(0);
  const server = platform.getServer();

  const response = await request(server)
    .get('/params/John')
    .expect(200);

  assert.is(response.text, 'Hello, John!');
});

runPlatformTest('should handle multiple URL parameters', async (platform: HttpPlatform) => {
  platform.router.get('/users/:userId/posts/:postId', (req) => ({
    userId: req.params.userId,
    postId: req.params.postId
  }));
  await platform.start(0);
  const server = platform.getServer();

  const response = await request(server)
    .get('/users/123/posts/456')
    .expect(200);

  assert.equal(response.body, {
    userId: '123',
    postId: '456'
  });
});

runPlatformTest('should handle single query parameter', async (platform: HttpPlatform) => {
  platform.router.get('/query', (req) => {
    const { name = 'Guest' } = req.query;
    return `Hello, ${name}!`;
  });
  await platform.start(0);
  const server = platform.getServer();

  const response = await request(server)
    .get('/query?name=John')
    .expect(200);

  assert.is(response.text, 'Hello, John!');
});

runPlatformTest('should handle multiple query parameters', async (platform: HttpPlatform) => {
  platform.router.get('/multi-query', (req) => ({
    params: req.query
  }));
  await platform.start(0);
  const server = platform.getServer();

  const response = await request(server)
    .get('/multi-query?name=John&age=25&city=NY')
    .expect(200);

  assert.equal(response.body, {
    params: {
      name: 'John',
      age: '25',
      city: 'NY'
    }
  });
});

runPlatformTest('should handle array query parameters', async (platform: HttpPlatform) => {
  platform.router.get('/array-query', (req) => ({
    params: req.query
  }));
  await platform.start(0);
  const server = platform.getServer();

  // Test format: items=1&items=2&items=3
  const response1 = await request(server)
    .get('/array-query?items=1&items=2&items=3')
    .expect(200);

  assert.equal(response1.body.params.items, ['1', '2', '3']);

  // Test format: items[]=1&items[]=2&items[]=3
  const response2 = await request(server)
    .get('/array-query?items[]=3&items[]=2&items[]=1')
    .expect(200);

  assert.equal(response2.body.params.items, ['3', '2', '1']);
});

runPlatformTest('should handle mixed parameters', async (platform: HttpPlatform) => {
  platform.router.get('/users/:userId/posts', (req) => ({
    userId: req.params.userId,
    limit: req.query.limit,
    offset: req.query.offset
  }));
  await platform.start(0);
  const server = platform.getServer();

  const response = await request(server)
    .get('/users/123/posts?limit=10&offset=20')
    .expect(200);

  assert.equal(response.body, {
    userId: '123',
    limit: '10',
    offset: '20'
  });
});

runPlatformTest('should handle multi-layer optional parameters', async (platform: HttpPlatform) => {
  platform.router.get('/api/:version?/users/:userId?/posts/:postId?', (req) => ({
    version: req.params.version || 'v1',
    userId: req.params.userId || 'all',
    postId: req.params.postId || 'all',
    query: req.query
  }));

  await platform.start(0);
  const server = platform.getServer();

  // Test case 1: All parameters provided
  const response1 = await request(server)
    .get('/api/v2/users/123/posts/456?status=published')
    .expect(200);

  assert.equal(response1.body, {
    version: 'v2',
    userId: '123',
    postId: '456',
    query: { status: 'published' }
  });

  // Test case 2: Missing version parameter
  const response2a = await request(server)
    .get('/api/users/123/posts/456?status=draft')
    .expect(200);

  assert.equal(response2a.body, {
    version: 'v1',
    userId: '123',
    postId: '456',
    query: { status: 'draft' }
  });

  // Test case 3: Missing userId parameter
  const response3a = await request(server)
    .get('/api/v2/users/posts/456?status=archived')
    .expect(200);

  assert.equal(response3a.body, {
    version: 'v2',
    userId: 'all',
    postId: '456',
    query: { status: 'archived' }
  });

  // Test invalid numeric ID
  await request(server)
    .get('/users/abc')
    .expect(404);
});

runPlatformTest('should handle regex route patterns', async (platform: HttpPlatform) => {
  // Test numeric ID pattern
  platform.router.get('/users/:id(\\d+)', (req) => ({
    id: req.params.id,
    type: 'numeric'
  }));

  // Test alphanumeric pattern
  platform.router.get('/products/:slug([a-zA-Z0-9-]+)', (req) => ({
    slug: req.params.slug,
    type: 'alphanumeric'
  }));

  // Test date pattern
  platform.router.get('/posts/:date(\\d{4}-\\d{2}-\\d{2})', (req) => ({
    date: req.params.date,
    type: 'date'
  }));

  // Test multiple regex parameters
  platform.router.get('/orders/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})', (req) => ({
    year: req.params.year,
    month: req.params.month,
    day: req.params.day,
    type: 'multiple'
  }));

  // Test optional regex parameter
  platform.router.get('/search/:query([a-zA-Z]+)?', (req) => ({
    query: req.params.query || 'default',
    type: 'optional'
  }));

  await platform.start(0);
  const server = platform.getServer();

  // Test numeric ID pattern
  const response1 = await request(server)
    .get('/users/123')
    .expect(200);

  assert.equal(response1.body, {
    id: '123',
    type: 'numeric'
  });

  // Test invalid numeric ID
  await request(server)
    .get('/users/abc')
    .expect(404);

  // Test alphanumeric pattern
  const response2 = await request(server)
    .get('/products/my-product-123')
    .expect(200);

  assert.equal(response2.body, {
    slug: 'my-product-123',
    type: 'alphanumeric'
  });

  // Test invalid alphanumeric
  await request(server)
    .get('/products/my@product')
    .expect(404);

  // Test date pattern
  const response3 = await request(server)
    .get('/posts/2024-03-20')
    .expect(200);

  assert.equal(response3.body, {
    date: '2024-03-20',
    type: 'date'
  });

  // Test invalid date
  await request(server)
    .get('/posts/2024-3-20')
    .expect(404);

  // Test multiple regex parameters
  const response4 = await request(server)
    .get('/orders/2024/03/20')
    .expect(200);

  assert.equal(response4.body, {
    year: '2024',
    month: '03',
    day: '20',
    type: 'multiple'
  });

  // Test invalid multiple parameters
  await request(server)
    .get('/orders/2024/3/20')
    .expect(404);

  // Test optional regex parameter
  const response5 = await request(server)
    .get('/search/test')
    .expect(200);

  assert.equal(response5.body, {
    query: 'test',
    type: 'optional'
  });

  // Test optional regex parameter with default
  const response6 = await request(server)
    .get('/search')
    .expect(200);

  assert.equal(response6.body, {
    query: 'default',
    type: 'optional'
  });

  // Test invalid optional regex parameter
  await request(server)
    .get('/search/123')
    .expect(404);
});

test.run(); 