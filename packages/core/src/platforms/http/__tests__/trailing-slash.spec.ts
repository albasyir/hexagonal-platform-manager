import request from 'supertest';
import { ExpressPlatform } from '../express/express';
import { FastifyPlatform } from '../fastify/fastify';
import { HttpPlatform } from '../../../types/http-platform';

describe('HTTP Platform Trailing Slash Behavior', () => {
  const platforms = [
    { name: 'Express', PlatformClass: ExpressPlatform },
    { name: 'Fastify', PlatformClass: FastifyPlatform }
  ];

  platforms.forEach(({ name, PlatformClass }) => {
    describe(`${name} Platform`, () => {
      let platform: HttpPlatform;
      let server: any;

      beforeEach(() => {
        platform = new PlatformClass();
      });

      afterEach(async () => {
        if (platform) {
          await platform.stop();
        }
      });

      it('should handle requests with and without trailing slash for GET endpoints', async () => {
        // Setup route without trailing slash
        platform.router.get('/test', () => ({ message: 'Hello World' }));
        await platform.start(0); // Use port 0 for random available port
        server = platform.getServer();

        // Test without trailing slash
        const response1 = await request(server)
          .get('/test')
          .expect(200);

        expect(response1.body).toEqual({ message: 'Hello World' });

        // Test with trailing slash
        const response2 = await request(server)
          .get('/test/')
          .expect(200);

        expect(response2.body).toEqual({ message: 'Hello World' });
      });

      it('should handle requests with and without trailing slash for dynamic routes', async () => {
        // Setup route with parameter
        platform.router.get('/users/:id', (req) => ({ 
          id: req.params.id,
          message: 'User found' 
        }));
        
        await platform.start(0);
        server = platform.getServer();

        // Test without trailing slash
        const response1 = await request(server)
          .get('/users/123')
          .expect(200);

        expect(response1.body).toEqual({ 
          id: '123',
          message: 'User found'
        });

        // Test with trailing slash
        const response2 = await request(server)
          .get('/users/123/')
          .expect(200);

        expect(response2.body).toEqual({ 
          id: '123',
          message: 'User found'
        });
      });

      it('should handle requests with and without trailing slash for nested routes', async () => {
        // Setup nested route
        platform.router.get('/api/v1/users', () => ({ 
          users: ['user1', 'user2']
        }));
        
        await platform.start(0);
        server = platform.getServer();

        // Test without trailing slash
        const response1 = await request(server)
          .get('/api/v1/users')
          .expect(200);

        expect(response1.body).toEqual({ 
          users: ['user1', 'user2']
        });

        // Test with trailing slash
        const response2 = await request(server)
          .get('/api/v1/users/')
          .expect(200);

        expect(response2.body).toEqual({ 
          users: ['user1', 'user2']
        });
      });

      it('should handle requests with and without trailing slash for all HTTP methods', async () => {
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
        server = platform.getServer();

        // Test POST
        const post1 = await request(server)
          .post('/api/items')
          .expect(200);
        const post2 = await request(server)
          .post('/api/items/')
          .expect(200);
        expect(post1.body).toEqual({ status: 'created' });
        expect(post2.body).toEqual({ status: 'created' });

        // Test PUT
        const put1 = await request(server)
          .put('/api/items/123')
          .expect(200);
        const put2 = await request(server)
          .put('/api/items/123/')
          .expect(200);
        expect(put1.body).toEqual({ status: 'updated', id: '123' });
        expect(put2.body).toEqual({ status: 'updated', id: '123' });

        // Test DELETE
        const del1 = await request(server)
          .delete('/api/items/123')
          .expect(200);
        const del2 = await request(server)
          .delete('/api/items/123/')
          .expect(200);
        expect(del1.body).toEqual({ status: 'deleted', id: '123' });
        expect(del2.body).toEqual({ status: 'deleted', id: '123' });
      });
    });
  });
}); 