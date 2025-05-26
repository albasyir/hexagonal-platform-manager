import { Router, Platform } from '../types';
export declare class ExpressPlatform implements Platform {
    private app;
    private router;
    constructor();
    createRouter(): Router;
    createServer(): any;
    start(port: number): Promise<void>;
}
