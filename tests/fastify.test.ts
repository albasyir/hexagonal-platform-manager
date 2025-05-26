import request from 'supertest';
import { FastifyPlatform } from '../src/adapters/fastify';

describe('Fastify Platform', () => {
  let platform: FastifyPlatform;
  let server: any;

  beforeEach(() => {
    platform = new FastifyPlatform();
  });

  afterEach(async () => {
    if (platform) {
      await platform.stop();
    }
  });

  it('should handle GET request with string response', async () => {
    platform.router.get('/test', () => 'Hello World');
    await platform.start(3000);
    server = platform.getServer();

    const response = await request(server)
      .get('/test')
      .expect(200);

    expect(response.text).toBe('Hello World');
  });

  it('should handle GET request with JSON response', async () => {
    platform.router.get('/json', () => ({ message: 'Hello World' }));
    await platform.start(3001);
    server = platform.getServer();

    const response = await request(server)
      .get('/json')
      .expect(200);

    expect(response.body).toEqual({ message: 'Hello World' });
  });

  it('should handle URL parameters', async () => {
    platform.router.get('/params/:name', (req) => `Hello, ${req.params.name}!`);
    await platform.start(3002);
    server = platform.getServer();

    const response = await request(server)
      .get('/params/John')
      .expect(200);

    expect(response.text).toBe('Hello, John!');
  });

  it('should handle query parameters', async () => {
    platform.router.get('/query', (req) => {
      const { name = 'Guest' } = req.query;
      return `Hello, ${name}!`;
    });
    await platform.start(3003);
    server = platform.getServer();

    const response = await request(server)
      .get('/query?name=John')
      .expect(200);

    expect(response.text).toBe('Hello, John!');
  });

  it('should handle POST request with JSON body', async () => {
    platform.router.post('/users', (req) => {
      const { name, email } = req.body;
      return { message: 'User created', user: { name, email } };
    });
    await platform.start(3004);
    server = platform.getServer();

    const response = await request(server)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(200);

    expect(response.body).toEqual({
      message: 'User created',
      user: { name: 'John', email: 'john@example.com' }
    });
  });

  it('should handle PUT request', async () => {
    platform.router.put('/users/:id', (req) => {
      const { id } = req.params;
      const { name, email } = req.body;
      return { message: 'User updated', user: { id, name, email } };
    });
    await platform.start(3005);
    server = platform.getServer();

    const response = await request(server)
      .put('/users/123')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(200);

    expect(response.body).toEqual({
      message: 'User updated',
      user: { id: '123', name: 'John', email: 'john@example.com' }
    });
  });

  it('should handle PATCH request', async () => {
    platform.router.patch('/users/:id', (req) => {
      const { id } = req.params;
      const updates = req.body;
      return { message: 'User patched', user: { id, ...updates } };
    });
    await platform.start(3006);
    server = platform.getServer();

    const response = await request(server)
      .patch('/users/123')
      .send({ name: 'John' })
      .expect(200);

    expect(response.body).toEqual({
      message: 'User patched',
      user: { id: '123', name: 'John' }
    });
  });

  it('should handle DELETE request', async () => {
    platform.router.delete('/users/:id', (req) => {
      const { id } = req.params;
      return { message: 'User deleted', id };
    });
    await platform.start(3007);
    server = platform.getServer();

    const response = await request(server)
      .delete('/users/123')
      .expect(200);

    expect(response.body).toEqual({
      message: 'User deleted',
      id: '123'
    });
  });
}); 