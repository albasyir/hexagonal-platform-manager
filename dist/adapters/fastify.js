"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyPlatform = void 0;
const fastify_1 = __importDefault(require("fastify"));
class FastifyResponseWrapper {
    constructor(reply) {
        this.reply = reply;
    }
    status(code) {
        this.reply.code(code);
        return this;
    }
    json(data) {
        this.reply.send(data);
    }
    send(data) {
        this.reply.send(data);
    }
}
class FastifyRouterWrapper {
    constructor() {
        this.routes = [];
    }
    get(path, handler) {
        this.routes.push({ method: 'GET', path, handler });
    }
    post(path, handler) {
        this.routes.push({ method: 'POST', path, handler });
    }
    put(path, handler) {
        this.routes.push({ method: 'PUT', path, handler });
    }
    delete(path, handler) {
        this.routes.push({ method: 'DELETE', path, handler });
    }
    patch(path, handler) {
        this.routes.push({ method: 'PATCH', path, handler });
    }
    use(path, router) {
        if (router instanceof FastifyRouterWrapper) {
            router.routes.forEach(route => {
                this.routes.push({
                    method: route.method,
                    path: `${path}${route.path}`,
                    handler: route.handler
                });
            });
        }
    }
    getRoutes() {
        return this.routes;
    }
}
class FastifyPlatform {
    constructor() {
        this.app = (0, fastify_1.default)({
            logger: false
        });
        this.router = new FastifyRouterWrapper();
    }
    createRouter() {
        return this.router;
    }
    createServer() {
        return this.app;
    }
    async start(port) {
        const routes = this.router.getRoutes();
        routes.forEach(route => {
            this.app.route({
                method: route.method,
                url: route.path,
                handler: async (request, reply) => {
                    const wrappedReq = {
                        params: request.params,
                        query: request.query,
                        body: request.body,
                        headers: request.headers
                    };
                    const wrappedRes = new FastifyResponseWrapper(reply);
                    const result = await route.handler(wrappedReq, wrappedRes);
                    // Handle direct return values
                    if (result !== undefined && !reply.sent) {
                        if (typeof result === 'string') {
                            reply.send(result);
                        }
                        else {
                            reply.send(result);
                        }
                    }
                }
            });
        });
        await this.app.listen({ port });
        console.log(`Fastify server listening on port ${port}`);
    }
}
exports.FastifyPlatform = FastifyPlatform;
