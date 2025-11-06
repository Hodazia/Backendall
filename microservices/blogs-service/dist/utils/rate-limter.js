"use strict";
// add rate limiting here
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute).
    standardHeaders: 'draft-8',
    message: {
        error: 'You have sent too many requests,please try again later!'
    }
});
exports.default = limiter;
