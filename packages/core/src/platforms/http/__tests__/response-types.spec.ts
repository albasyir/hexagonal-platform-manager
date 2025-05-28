import request from 'supertest';
import { runPlatformTest } from './helpers/platform-test.helper';
import { HttpPlatform } from '../../../types/http-platform';

describe('HTTP Platform Response Types', () => {
  runPlatformTest('should handle string responses', async (platform: HttpPlatform) => {
    platform.router.get('/test', () => 'Hello World');
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .get('/test')
      .expect(200);

    expect(response.text).toBe('Hello World');
  });

  runPlatformTest('should handle JSON responses', async (platform: HttpPlatform) => {
    platform.router.get('/json', () => ({ message: 'Hello World' }));
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .get('/json')
      .expect(200);

    expect(response.body).toEqual({ message: 'Hello World' });
  });

  runPlatformTest('should handle null responses', async (platform: HttpPlatform) => {
    platform.router.get('/null', () => null);
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .get('/null')
      .expect(200);

    expect(response.text).toEqual('');
  });

  runPlatformTest('should handle number responses', async (platform: HttpPlatform) => {
    platform.router.get('/number', () => 42);
    await platform.start(0);
    const server = platform.getServer();

    const response = await request(server)
      .get('/number')
      .expect(200);

    expect(response.text).toBe('42');
  });
}); 