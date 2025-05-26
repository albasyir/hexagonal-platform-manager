import { Platform, PlatformManagerConfig, Router } from './types';
export declare class PlatformManager {
    private _router;
    private _platform;
    constructor(config: PlatformManagerConfig);
    get router(): Router;
    get platform(): Platform;
    start(port: number): Promise<void>;
}
