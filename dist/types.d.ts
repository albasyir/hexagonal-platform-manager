export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export interface Request {
    params: Record<string, string>;
    query: Record<string, string>;
    body: any;
    headers: Record<string, string>;
}
export interface Response {
    status(code: number): Response;
    json(data: any): void;
    send(data: any): void;
}
export interface RouteHandler {
    (req: Request, res: Response): void | Promise<void> | any;
}
export interface Router {
    get(path: string, handler: RouteHandler): void;
    post(path: string, handler: RouteHandler): void;
    put(path: string, handler: RouteHandler): void;
    delete(path: string, handler: RouteHandler): void;
    patch(path: string, handler: RouteHandler): void;
    use(path: string, router: Router): void;
}
export interface Platform {
    createRouter(): Router;
    createServer(): any;
    start(port: number): Promise<void>;
}
export interface PlatformManagerConfig {
    http: Platform;
}
