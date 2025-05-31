import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { ExpressPlatform } from '../../express/express.ts'
import { FastifyPlatform } from '../../fastify/fastify.ts'
import { HttpPlatform } from '../../../../types/http-platform.ts'

export type PlatformTestConfig = {
  name: string
  PlatformClass: new (...args: any[]) => HttpPlatform
}

export const platforms: PlatformTestConfig[] = [
  { name: 'Express', PlatformClass: ExpressPlatform },
  { name: 'Fastify', PlatformClass: FastifyPlatform }
]

export const runPlatformTest = (
  testName: string,
  testFn: (platform: HttpPlatform) => Promise<void>
) => {
  platforms.forEach(async ({ name, PlatformClass }) => {
    test(`[${name} Platform]: ${testName}`, async () => {
      const platform = new PlatformClass()
      try {
        await testFn(platform)
      } finally {
        await platform.stop()
      }
    })
  })
}

// Helper to match Jest's expect().toEqual() behavior
export const expectEqual = (actual: any, expected: any) => {
  assert.equal(actual, expected)
}

// Helper to match Jest's expect().toMatchObject() behavior
export const expectMatchObject = (actual: any, expected: any) => {
  for (const key in expected) {
    if (typeof expected[key] === 'object' && expected[key] !== null) {
      expectMatchObject(actual[key], expected[key])
    } else {
      assert.equal(actual[key], expected[key])
    }
  }
} 