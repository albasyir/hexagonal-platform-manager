import express, { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Platform, Router, Response as PlatformResponse, Request as PlatformRequest } from '../interfaces';

export class ExpressResponseWrapper implements PlatformResponse {
  constructor(private res: ExpressResponse) {}

  json(data: any): void {
    this.res.json(data);
  }

  send(data: any): void {
    this.res.send(data);
  }
}

export class ExpressRouterWrapper implements Router {
  private router = express.Router();

  private wrapRequest(req: ExpressRequest): PlatformRequest {
    return {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body,
      headers: req.headers as Record<string, string>
    };
  }

  get(path: string, handler: (req: PlatformRequest) => any): void {
    this.router.get(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  post(path: string, handler: (req: PlatformRequest) => any): void {
    this.router.post(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  put(path: string, handler: (req: PlatformRequest) => any): void {
    this.router.put(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  patch(path: string, handler: (req: PlatformRequest) => any): void {
    this.router.patch(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      if (typeof result === 'object') {
        res.json(result);
      } else {
        res.send(result);
      }
    });
  }

  delete(path: string, handler: (req: PlatformRequest) => any): void {
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

export class ExpressPlatform implements Platform {
  private app: Express;
  private server: any;
  public router: ExpressRouterWrapper;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.router = new ExpressRouterWrapper();
    this.app.use(this.router.getRouter());
  }

  async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
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
            resolve();
          }
        });
      });
    }
  }

  getApp(): any {
    return this.app;
  }

  getServer(): any {
    return this.server;
  }
} 