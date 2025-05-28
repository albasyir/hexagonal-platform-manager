import express, { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { HttpPlatformRouter } from '../../../types/http-platform-router';
import { HttpPlatformRequest } from '../../../types/http-platform-request';
import { HttpPlatform } from '../../../types/http-platform';

export class ExpressHttpPlatformRouter implements HttpPlatformRouter {
  private router = express.Router();

  private wrapRequest(req: ExpressRequest): HttpPlatformRequest {
    return {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body === undefined ? {} : req.body,
      headers: req.headers as Record<string, string>
    };
  }

  private handleResponse(result: any, res: ExpressResponse): void {
    if (result === null) {
      res.type('text/plain').send('');
    } else if (typeof result === 'object') {
      res.json(result);
    } else {
      res.type('text/plain').send(String(result));
    }
  }

  get(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.get(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      this.handleResponse(result, res);
    });
  }

  post(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.post(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      this.handleResponse(result, res);
    });
  }

  put(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.put(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      this.handleResponse(result, res);
    });
  }

  patch(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.patch(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      this.handleResponse(result, res);
    });
  }

  delete(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.router.delete(path, (req: ExpressRequest, res: ExpressResponse) => {
      const result = handler(this.wrapRequest(req));
      this.handleResponse(result, res);
    });
  }

  getRouter(): any {
    return this.router;
  }
}

export class ExpressPlatform implements HttpPlatform {
  private instance: Express;
  private server: any;
  public router: ExpressHttpPlatformRouter;

  constructor(options?: { reuseInstance?: Express }) {
    this.instance = options?.reuseInstance || express();
    this.instance.use(express.json());
    this.instance.use(express.urlencoded({ extended: true }));
    this.router = new ExpressHttpPlatformRouter();
    this.instance.use(this.router.getRouter());
  }

  async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.instance.listen(port, () => {
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

  getServer(): any {
    return this.server;
  }
} 