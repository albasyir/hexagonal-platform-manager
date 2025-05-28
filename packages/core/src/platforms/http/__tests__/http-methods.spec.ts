import request from 'supertest';
import { runPlatformTest } from './helpers/platform-test.helper';
import { HttpPlatform } from '../../../types/http-platform';

describe('HTTP Platform Methods', () => {
  runPlatformTest('should handle GET request with query parameters', async (platform: HttpPlatform) => {
    platform.router.get('/users', (req) => ({
      users: [{ id: 1, name: 'John' }],
      filters: req.query
    }));
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .get('/users?role=admin&status=active')
      .expect(200);

    expect(response.body).toEqual({
      users: [{ id: 1, name: 'John' }],
      filters: { role: 'admin', status: 'active' }
    });
  });

  runPlatformTest('should handle POST request with complex JSON body', async (platform: HttpPlatform) => {
    platform.router.post('/users', (req) => ({
      message: 'User created',
      user: {
        id: Math.floor(Math.random() * 1000),
        ...req.body,
        createdAt: new Date().toISOString()
      }
    }));
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        },
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            sms: true
          },
          language: 'en-US'
        }
      })
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'User created',
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        },
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            sms: true
          },
          language: 'en-US'
        }
      }
    });
  });

  runPlatformTest('should handle PUT request with nested updates', async (platform: HttpPlatform) => {
    platform.router.put('/users/:id', (req) => ({
      message: 'User updated',
      user: {
        id: parseInt(req.params.id),
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    }));
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .put('/users/123')
      .send({
        name: 'John Updated',
        email: 'john.updated@example.com',
        preferences: {
          theme: 'dark',
          notifications: true,
          settings: {
            fontSize: 'medium',
            colorScheme: 'auto',
            accessibility: {
              highContrast: true,
              screenReader: false
            }
          }
        }
      })
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'User updated',
      user: {
        id: 123,
        name: 'John Updated',
        email: 'john.updated@example.com',
        preferences: {
          theme: 'dark',
          notifications: true,
          settings: {
            fontSize: 'medium',
            colorScheme: 'auto',
            accessibility: {
              highContrast: true,
              screenReader: false
            }
          }
        }
      }
    });
  });

  runPlatformTest('should handle PATCH request with deep nested updates', async (platform: HttpPlatform) => {
    platform.router.patch('/users/:id', (req) => {
      const deepMerge = (target: any, source: any) => {
        for (const key in source) {
          if (source[key] instanceof Object && !Array.isArray(source[key])) {
            target[key] = deepMerge(target[key] || {}, source[key]);
          } else {
            target[key] = source[key];
          }
        }
        return target;
      };

      return {
        message: 'User patched',
        user: deepMerge({ id: req.params.id }, req.body)
      };
    });
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .patch('/users/123')
      .send({
        name: 'John',
        settings: {
          notifications: {
            email: true,
            push: false,
            channels: {
              marketing: true,
              updates: false,
              security: true
            }
          },
          theme: {
            mode: 'dark',
            colors: {
              primary: '#1a1a1a',
              secondary: '#2d2d2d',
              accent: '#3d3d3d'
            }
          }
        }
      })
      .expect(200);

    expect(response.body).toEqual({
      message: 'User patched',
      user: {
        id: '123',
        name: 'John',
        settings: {
          notifications: {
            email: true,
            push: false,
            channels: {
              marketing: true,
              updates: false,
              security: true
            }
          },
          theme: {
            mode: 'dark',
            colors: {
              primary: '#1a1a1a',
              secondary: '#2d2d2d',
              accent: '#3d3d3d'
            }
          }
        }
      }
    });
  });

  runPlatformTest('should handle DELETE request with cascade deletion', async (platform: HttpPlatform) => {
    platform.router.delete('/users/:id', (req) => {
      const { id } = req.params;
      const { cascade } = req.query;

      if (cascade === 'true') {
        return {
          message: 'User and related data deleted',
          deletedItems: {
            user: { id },
            posts: [{ id: 1 }, { id: 2 }],
            comments: [{ id: 1 }, { id: 2 }, { id: 3 }],
            metadata: {
              deletedAt: new Date().toISOString(),
              deletedBy: 'system',
              reason: 'user_request'
            }
          }
        };
      }

      return {
        message: 'User deleted',
        id
      };
    });
    await platform.start(0);
    const server = platform.getServer();

    const cascadeResponse = await request(server)
      .delete('/users/123?cascade=true')
      .expect(200);

    expect(cascadeResponse.body).toMatchObject({
      message: 'User and related data deleted',
      deletedItems: {
        user: { id: '123' },
        posts: [{ id: 1 }, { id: 2 }],
        comments: [{ id: 1 }, { id: 2 }, { id: 3 }],
        metadata: {
          deletedBy: 'system',
          reason: 'user_request'
        }
      }
    });

    const normalResponse = await request(server)
      .delete('/users/123')
      .expect(200);

    expect(normalResponse.body).toEqual({
      message: 'User deleted',
      id: '123'
    });
  });
}); 