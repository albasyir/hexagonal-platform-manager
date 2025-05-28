import { ExpressPlatform } from '../../express/express';
import { FastifyPlatform } from '../../fastify/fastify';
import { HttpPlatform } from '../../../../types/http-platform';

export type PlatformTestConfig = {
  name: string;
  PlatformClass: new (...args: any[]) => HttpPlatform;
};

export const platforms: PlatformTestConfig[] = [
  { name: 'Express', PlatformClass: ExpressPlatform },
  { name: 'Fastify', PlatformClass: FastifyPlatform }
];

export const runPlatformTest = (
  testName: string,
  testFn: (platform: HttpPlatform) => Promise<void>
) => {
  describe(testName, () => {
    platforms.forEach(({ name, PlatformClass }) => {
      describe(`${name} Platform`, () => {
        let platform: HttpPlatform;

        beforeEach(() => {
          platform = new PlatformClass();
        });

        afterEach(async () => {
          if (platform) {
            await platform.stop();
          }
        });

        it(testName, async () => {
          await testFn(platform);
        });
      });
    });
  });
}; 