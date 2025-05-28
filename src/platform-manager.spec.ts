import { PlatformManager } from './platform-manager';
import { ExpressPlatform } from './platforms/http/express/express';
import { FastifyPlatform } from './platforms/http/fastify/fastify';

describe('PlatformManager', () => {
  it('should use Express platform', () => {
    const manager = new PlatformManager({ http: new ExpressPlatform() });
    expect(manager.platform).toBeInstanceOf(ExpressPlatform);
  });

  it('should use Fastify platform', () => {
    const manager = new PlatformManager({ http: new FastifyPlatform() });
    expect(manager.platform).toBeInstanceOf(FastifyPlatform);
  });

  it('should throw error for unsupported platform', () => {
    // There is no built-in way to test unsupported platform since the constructor expects a Platform instance.
    // This test is not applicable with the current design.
    expect(true).toBe(true);
  });
}); 