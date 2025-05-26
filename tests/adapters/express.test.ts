import express from 'express';
import { ExpressPlatform } from '../../src/adapters/express';
import { createServer } from 'net';

describe('ExpressPlatform', () => {
  let platform: ExpressPlatform;
  let port: number;

  beforeEach(async () => {
    platform = new ExpressPlatform();
    // Find an available port
    port = await findAvailablePort();
  });

  afterEach(async () => {
    await platform.stop();
  });

  // Helper function to find an available port
  async function findAvailablePort(): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = createServer();
      server.listen(0, () => {
        const address = server.address();
        if (address && typeof address === 'object') {
          const port = address.port;
          server.close(() => resolve(port));
        } else {
          reject(new Error('Could not find available port'));
        }
      });
    });
  }

  describe('constructor', () => {
    it('should create a new Express instance by default', () => {
      expect(platform.getApp()).toBeDefined();
      expect(platform.getApp().use).toBeDefined();
    });

    it('should use provided Express instance', () => {
      const existingExpress = express();
      const platformWithEngine = new ExpressPlatform({ engine: existingExpress });
      expect(platformWithEngine.getApp()).toBe(existingExpress);
    });
  });

  describe('router', () => {
    it('should handle GET requests', async () => {
      platform.router.get('/test', () => 'Hello World');
      await platform.start(port);

      const response = await fetch(`http://localhost:${port}/test`);
      const text = await response.text();
      expect(text).toBe('Hello World');
    });

    it('should handle POST requests with JSON', async () => {
      platform.router.post('/test', (req) => ({
        received: req.body
      }));
      await platform.start(port);

      const response = await fetch(`http://localhost:${port}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });
      const data = await response.json();
      expect(data).toEqual({ received: { test: 'data' } });
    });

    it('should handle URL parameters', async () => {
      platform.router.get('/user/:id', (req) => ({
        userId: req.params.id
      }));
      await platform.start(port);

      const response = await fetch(`http://localhost:${port}/user/123`);
      const data = await response.json();
      expect(data).toEqual({ userId: '123' });
    });

    it('should handle query parameters', async () => {
      platform.router.get('/search', (req) => ({
        query: req.query
      }));
      await platform.start(port);

      const response = await fetch(`http://localhost:${port}/search?q=test&page=1`);
      const data = await response.json();
      expect(data).toEqual({ query: { q: 'test', page: '1' } });
    });

    it('should handle invalid JSON in POST request', async () => {
      platform.router.post('/test', (req) => ({
        received: req.body
      }));
      await platform.start(port);

      const response = await fetch(`http://localhost:${port}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should handle non-existent routes', async () => {
      await platform.start(port);

      const response = await fetch(`http://localhost:${port}/non-existent`);
      expect(response.status).toBe(404);
    });
  });

  describe('start/stop', () => {
    it('should start and stop the server', async () => {
      await platform.start(port);
      expect(platform.getServer()).toBeDefined();

      await platform.stop();
      // Instead of checking listening property, verify server is null
      expect(platform.getServer()).toBeNull();
    });

    it('should not throw when stopping an already stopped server', async () => {
      await expect(platform.stop()).resolves.not.toThrow();
    });
  });
}); 