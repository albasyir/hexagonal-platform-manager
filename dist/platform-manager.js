"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformManager = void 0;
class PlatformManager {
    constructor(config) {
        this._platform = config.http;
        this._router = this._platform.createRouter();
    }
    get router() {
        return this._router;
    }
    get platform() {
        return this._platform;
    }
    async start(port) {
        await this._platform.start(port);
    }
}
exports.PlatformManager = PlatformManager;
