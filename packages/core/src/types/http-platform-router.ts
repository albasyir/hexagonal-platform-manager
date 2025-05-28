import { HttpPlatformRequest } from './http-platform-request';

export interface HttpPlatformRouter {
  get(path: string, handler: (req: HttpPlatformRequest) => any): void;
  post(path: string, handler: (req: HttpPlatformRequest) => any): void;
  put(path: string, handler: (req: HttpPlatformRequest) => any): void;
  patch(path: string, handler: (req: HttpPlatformRequest) => any): void;
  delete(path: string, handler: (req: HttpPlatformRequest) => any): void;
} 