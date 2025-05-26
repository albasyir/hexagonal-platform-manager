import { Router, Platform } from '../types';
export declare class FastifyPlatform implements Platform {
    private app;
    private router;
    constructor();
    createRouter(): Router;
    createServer(): any;
    start(port: number): Promise<void>;
}
