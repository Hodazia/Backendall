import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { AuthMiddleware } from "./authmiddleware";

const router = express.Router();

// Microservice targets
const services = {
  auth: process.env.AUTH_SERVICE,
  blog: process.env.BLOG_SERVICE
};

// Public routes
router.use(
  "/auth",
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { "^/auth": "/" },
  })
);

// Protected routes
router.use(
  "/blog",
  AuthMiddleware,
  createProxyMiddleware({
    target: services.blog,
    changeOrigin: true,
    pathRewrite: { "^/blog": "/" },
  })
);


export { router };
