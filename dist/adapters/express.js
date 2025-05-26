"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressPlatform = void 0;
const express_1 = __importStar(require("express"));
class ExpressResponseWrapper {
    constructor(res) {
        this.res = res;
    }
    status(code) {
        this.res.status(code);
        return this;
    }
    json(data) {
        this.res.json(data);
    }
    send(data) {
        this.res.send(data);
    }
}
class ExpressRouterWrapper {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    wrapHandler(handler) {
        return (req, res) => {
            const wrappedReq = {
                params: req.params,
                query: req.query,
                body: req.body,
                headers: req.headers
            };
            const wrappedRes = new ExpressResponseWrapper(res);
            const result = handler(wrappedReq, wrappedRes);
            // Handle direct return values
            if (result !== undefined && !res.headersSent) {
                if (typeof result === 'string') {
                    res.send(result);
                }
                else {
                    res.json(result);
                }
            }
        };
    }
    get(path, handler) {
        this.router.get(path, this.wrapHandler(handler));
    }
    post(path, handler) {
        this.router.post(path, this.wrapHandler(handler));
    }
    put(path, handler) {
        this.router.put(path, this.wrapHandler(handler));
    }
    delete(path, handler) {
        this.router.delete(path, this.wrapHandler(handler));
    }
    patch(path, handler) {
        this.router.patch(path, this.wrapHandler(handler));
    }
    use(path, router) {
        if (router instanceof ExpressRouterWrapper) {
            this.router.use(path, router.router);
        }
    }
    getRouter() {
        return this.router;
    }
}
class ExpressPlatform {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.router = new ExpressRouterWrapper();
    }
    createRouter() {
        return this.router;
    }
    createServer() {
        return this.app;
    }
    async start(port) {
        // Mount the router to the app
        this.app.use(this.router.getRouter());
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                console.log(`Express server listening on port ${port}`);
                resolve();
            });
        });
    }
}
exports.ExpressPlatform = ExpressPlatform;
