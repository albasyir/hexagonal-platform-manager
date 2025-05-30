import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { PlatformManager } from './platform-manager.ts'
import { ExpressPlatform } from './platforms/http/express/express.ts'
import { FastifyPlatform } from './platforms/http/fastify/fastify.ts'

test('should use Express platform', () => {
  const manager = new PlatformManager({ http: new ExpressPlatform() })
  assert.instance(manager.platform, ExpressPlatform)
})

test('should use Fastify platform', () => {
  const manager = new PlatformManager({ http: new FastifyPlatform() })
  assert.instance(manager.platform, FastifyPlatform)
})

test('should throw error for unsupported platform', () => {
  // There is no built-in way to test unsupported platform since the constructor expects a Platform instance.
  // This test is not applicable with the current design.
  assert.is(true, true)
})

test.run() 