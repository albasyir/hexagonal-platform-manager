import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Platform, Router, Response as PlatformResponse, Request as PlatformRequest } from '../interfaces';

export class FastifyResponseWrapper implements PlatformResponse {
  constructor(private reply: FastifyReply) {}

  json(data: any): void {
    this.reply.send(data);
  }

  send(data: any): void {
    this.reply.send(data);
  }
}

export class FastifyRouterWrapper implements Router {
  private routes: any[] = [];

  private wrapRequest(req: FastifyRequest): PlatformRequest {
    return {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body,
      headers: req.headers as Record<string, string>
    };
  }

  get(path: string, handler: (req: PlatformRequest) => any): void {
    this.routes.push({
      method: 'GET',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        if (typeof result === 'object') {
          reply.send(result);
        } else {
          reply.send(result);
        }
      }
    });
  }

  post(path: string, handler: (req: PlatformRequest) => any): void {
    this.routes.push({
      method: 'POST',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        if (typeof result === 'object') {
          reply.send(result);
        } else {
          reply.send(result);
        }
      }
    });
  }

  put(path: string, handler: (req: PlatformRequest) => any): void {
    this.routes.push({
      method: 'PUT',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        if (typeof result === 'object') {
          reply.send(result);
        } else {
          reply.send(result);
        }
      }
    });
  }

  patch(path: string, handler: (req: PlatformRequest) => any): void {
    this.routes.push({
      method: 'PATCH',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        if (typeof result === 'object') {
          reply.send(result);
        } else {
          reply.send(result);
        }
      }
    });
  }

  delete(path: string, handler: (req: PlatformRequest) => any): void {
    this.routes.push({
      method: 'DELETE',
      path,
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = handler(this.wrapRequest(request));
        if (typeof result === 'object') {
          reply.send(result);
        } else {
          reply.send(result);
        }
      }
    });
  }

  getRoutes(): any[] {
    return this.routes;
  }
}

export class FastifyPlatform implements Platform {
  private engine: FastifyInstance;
  private server: any;
  public router: FastifyRouterWrapper;

  constructor(options?: { engine?: FastifyInstance }) {
    this.engine = options?.engine || fastify({ logger: false });
    this.router = new FastifyRouterWrapper();
  }

  async start(port: number): Promise<void> {
    // Register routes
    this.router.getRoutes().forEach(route => {
      this.engine.route(route);
    });

    return new Promise((resolve) => {
      this.engine.listen({ port }, () => {
        this.server = this.engine.server;
        console.log(`Fastify server listening on port ${port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (this.engine) {
      await this.engine.close();
      this.server = null;
      this.engine = fastify({ logger: false });
    }
  }

  getApp(): any {
    return this.engine;
  }

  getServer(): any {
    return this.server;
  }
} 