import { HttpPlatformRouter } from './http-platform-router';

export interface HttpPlatform<EngineInstance extends any = any> {
  router: HttpPlatformRouter;
  start(port: number): Promise<void>;
  stop(): Promise<void>;
  getServer(): any;
} 