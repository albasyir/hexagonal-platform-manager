import { HttpPlatformRouter } from './http-platform-router';

export interface HttpPlatform {
  router: HttpPlatformRouter;
  start(port: number): Promise<void>;
  stop(): Promise<void>;
  getApp(): any;
  getServer(): any;
} 