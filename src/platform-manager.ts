import { Platform, Router } from './interfaces';

export class PlatformManager {
  private _router: Router;
  private _platform: Platform;

  constructor(config: { http: Platform }) {
    this._platform = config.http;
    this._router = this._platform.router;
  }

  get router(): Router {
    return this._router;
  }

  get platform(): Platform {
    return this._platform;
  }

  async start(port: number): Promise<void> {
    await this._platform.start(port);
  }
} 