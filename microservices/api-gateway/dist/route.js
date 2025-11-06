"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const authmiddleware_1 = require("./authmiddleware");
const router = express_1.default.Router();
exports.router = router;
// Microservice targets
const services = {
    auth: process.env.AUTH_SERVICE,
    blog: process.env.BLOG_SERVICE
};
// Public routes
router.use("/auth", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { "^/auth": "/" },
}));
// Protected routes
router.use("/blog", authmiddleware_1.AuthMiddleware, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: services.blog,
    changeOrigin: true,
    pathRewrite: { "^/blog": "/" },
}));
//# sourceMappingURL=route.js.map