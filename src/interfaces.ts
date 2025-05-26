export interface Request {
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
}

export interface Response {
  json(data: any): void;
  send(data: any): void;
}

export interface Router {
  get(path: string, handler: (req: Request) => any): void;
  post(path: string, handler: (req: Request) => any): void;
  put(path: string, handler: (req: Request) => any): void;
  patch(path: string, handler: (req: Request) => any): void;
  delete(path: string, handler: (req: Request) => any): void;
}

export interface Platform {
  router: Router;
  start(port: number): Promise<void>;
  stop(): Promise<void>;
  getApp(): any;
  getServer(): any;
} 