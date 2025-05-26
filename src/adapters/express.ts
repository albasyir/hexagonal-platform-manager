import express, { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { HttpPlatform, HttpPlatformRouter, HttpPlatformResponse, HttpPlatformRequest } from '../interfaces';

export class ExpressResponseWrapper implements HttpPlatformResponse {
  constructor(private res: ExpressResponse) {}

  json(data: any): void {
    this.res.json(data);
  }

  send(data: any): void {
    this.res.send(data);
  }
}

export class ExpressRouterWrapper implements HttpPlatformRouter {
  private router = express.Router();

  private wrapRequest(req: ExpressRequest): HttpPlatformRequest {
    return {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body,
      headers: req.headers as Record<string, string>
    };
  }

  get(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.get(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  post(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.post(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  put(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.put(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  patch(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.patch(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  delete(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.delete(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  getRouter(): any {
    return this.router;
  }
}

export class ExpressPlatform implements HttpPlatform {
  private engine: Express;
  private server: any;
  public router: ExpressRouterWrapper;

  constructor(options?: { engine?: Express }) {
    this.engine = options?.engine || express();
    this.engine.use(express.json());
    this.engine.use(express.urlencoded({ extended: true }));
    this.router = new ExpressRouterWrapper();
    this.engine.use(this.router.getRouter());

    // Add error handling middleware
    this.engine.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
      next(err);
    });

    // Add 404 handler
    this.engine.use((req: any, res: any) => {
      res.status(404).json({ error: 'Not Found' });
    });
  }

  async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.engine.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve, reject) => {
        this.server.close((err: Error) => {
          if (err) {
            reject(err);
          } else {
            this.server = null;
            resolve();
          }
        });
      });
    }
  }

  getApp(): any {
    return this.engine;
  }

  getServer(): any {
    return this.server;
  }
} 