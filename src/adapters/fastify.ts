import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { HttpPlatformRouter } from '../types/http-platform-router';
import { HttpPlatformRequest } from '../types/http-platform-request';
import { HttpPlatform } from '../types/http-platform';

export class FastifyHttpPlatformRouter implements HttpPlatformRouter {
  private routes: any[] = [];

  private wrapRequest(req: FastifyRequest): HttpPlatformRequest {
    return {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body,
      headers: req.headers as Record<string, string>
    };
  }

  get(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.routes.push({
      method: 'GET',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        reply.send(result);
      }
    });
  }

  post(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.routes.push({
      method: 'POST',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        reply.send(result);
      }
    });
  }

  put(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.routes.push({
      method: 'PUT',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        reply.send(result);
      }
    });
  }

  patch(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.routes.push({
      method: 'PATCH',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        reply.send(result);
      }
    });
  }

  delete(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.routes.push({
      method: 'DELETE',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        reply.send(result);
      }
    });
  }

  getRoutes(): any[] {
    return this.routes;
  }
}

export class FastifyPlatform implements HttpPlatform<FastifyInstance> {
  private instance: FastifyInstance;
  private server: any;
  public router: FastifyHttpPlatformRouter;

  constructor(options?: { reuseInstance?: FastifyInstance }) {
    this.instance = options?.reuseInstance || fastify({ logger: false });
    this.router = new FastifyHttpPlatformRouter();
  }

  async start(port: number): Promise<void> {
    // Register routes
    this.router.getRoutes().forEach(route => {
      this.instance.route(route);
    });

    return new Promise((resolve) => {
      this.instance.listen({ port }, () => {
        this.server = this.instance.server;
        console.log(`Fastify server listening on port ${port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.server = null;
      this.instance = fastify({ logger: false });
    }
  }

  getServer(): any {
    return this.server;
  }
} 