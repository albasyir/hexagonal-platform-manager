export interface HttpPlatformRequest {
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
}

export interface HttpPlatformResponse {
  json(data: any): void;
  send(data: any): void;
}

export interface HttpPlatformRouter {
  get(path: string, handler: (req: HttpPlatformRequest) => any): void;
  post(path: string, handler: (req: HttpPlatformRequest) => any): void;
  put(path: string, handler: (req: HttpPlatformRequest) => any): void;
  patch(path: string, handler: (req: HttpPlatformRequest) => any): void;
  delete(path: string, handler: (req: HttpPlatformRequest) => any): void;
}

export interface HttpPlatform {
  router: HttpPlatformRouter;
  start(port: number): Promise<void>;
  stop(): Promise<void>;
  getApp(): any;
  getServer(): any;
} 