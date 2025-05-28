import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { HttpPlatformRouter } from '../../../types/http-platform-router';
import { HttpPlatformRequest } from '../../../types/http-platform-request';
import { HttpPlatform } from '../../../types/http-platform';

export class FastifyHttpPlatformRouter implements HttpPlatformRouter {
  private routes: any[] = [];

  private wrapRequest(req: FastifyRequest): HttpPlatformRequest {
    return {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string | string[]>,
      body: req.body === undefined ? {} : req.body,
      headers: req.headers as Record<string, string>
    };
  }

  // Generate all route permutations for multi-layer optional parameters
  private generateRoutePermutations(path: string): string[] {
    const parts = path.split('/');
    const optionals: number[] = [];
    // Find indices of optional parameters
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].includes('?')) {
        optionals.push(i);
      }
    }
    if (optionals.length === 0) return [path];

    // Remove '?' from optional parts for permutations
    const baseParts = parts.map(p => p.replace('?', ''));
    const permutations: string[] = [];
    // For each combination of optional parameters (present or not)
    const count = Math.pow(2, optionals.length);
    for (let mask = 0; mask < count; mask++) {
      const newParts = [...baseParts];
      for (let j = 0; j < optionals.length; j++) {
        if (((mask >> j) & 1) === 0) {
          // Remove this optional part
          newParts[optionals[j]] = undefined as any;
        }
      }
      // Remove undefined parts and join
      const candidate = newParts.filter(Boolean).join('/');
      // Ensure leading slash and uniqueness
      const route = candidate ? (candidate.startsWith('/') ? candidate : '/' + candidate) : '';
      if (route && !permutations.includes(route)) {
        permutations.push(route);
      }
    }
    return permutations;
  }

  private registerRoute(method: string, path: string, handler: (req: HttpPlatformRequest) => any): void {
    // Generate all permutations for multi-layer optionals
    const paths = this.generateRoutePermutations(path);
    paths.forEach((routePath: string) => {
      this.routes.push({
        method,
        path: routePath,
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
          const result = handler(this.wrapRequest(request));
          if (result === null) {
            reply.type('text/plain').send('');
          } else if (typeof result === 'object') {
            reply.send(result);
          } else {
            reply.type('text/plain').send(String(result));
          }
        }
      });
    });
  }

  get(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.registerRoute('GET', path, handler);
  }

  post(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.registerRoute('POST', path, handler);
  }

  put(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.registerRoute('PUT', path, handler);
  }

  patch(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.registerRoute('PATCH', path, handler);
  }

  delete(path: string, handler: (req: HttpPlatformRequest) => any): void {
    this.registerRoute('DELETE', path, handler);
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
    this.instance = options?.reuseInstance || fastify({ 
      logger: false,
      ignoreTrailingSlash: true
    });

    // Add custom query string parser
    this.instance.addHook('preHandler', (request, reply, done) => {
      const url = new URL(request.url, 'http://localhost');
      const params = new URLSearchParams(url.search);
      const result: Record<string, string | string[]> = {};
      
      for (const [key, value] of params.entries()) {
        const normalizedKey = key.replace('[]', '');
        if (result[normalizedKey]) {
          const existing = result[normalizedKey];
          result[normalizedKey] = Array.isArray(existing) 
            ? [...existing, value]
            : [existing, value];
        } else {
          result[normalizedKey] = value;
        }
      }
      
      request.query = result;
      done();
    });

    this.instance.addContentTypeParser('application/x-www-form-urlencoded', function (req, payload, done) {
      let data = '';
      payload.on('data', chunk => { data += chunk; });
      payload.on('end', () => {
        try {
          const parsed = new URLSearchParams(data);
          const result: Record<string, string> = {};
          for (const [key, value] of parsed.entries()) {
            result[key] = value;
          }
          done(null, result);
        } catch (err) {
          done(err as Error, undefined);
        }
      });
    });
    this.instance.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
      try {
        const json = JSON.parse(body as string);
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    });
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