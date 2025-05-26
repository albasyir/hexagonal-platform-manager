import { HttpPlatform } from "./types/http-platform";
import { HttpPlatformRouter } from "./types/http-platform-router";

export class PlatformManager {
  private _router: HttpPlatformRouter;
  private _platform: HttpPlatform;

  constructor(config: { http: HttpPlatform }) {
    this._platform = config.http;
    this._router = this._platform.router;
  }

  get router(): HttpPlatformRouter {
    return this._router;
  }

  get platform(): HttpPlatform {
    return this._platform;
  }

  async start(port: number): Promise<void> {
    await this._platform.start(port);
  }
}