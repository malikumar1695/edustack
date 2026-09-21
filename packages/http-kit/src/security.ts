import helmet from "helmet";
import { RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";

export const securityHeaders: RequestHandler = helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});


export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: Number(process.env.RATE_LIMIT_MAX) || 300,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers

    skip: (req) => req.path === "/health", // Skip rate limiting for the health check endpoint
    handler: (req, res) => {
        req.log?.warn({ ip: req.ip, path: req.path }, "Global rate limit exceeded");
        res.status(429).json({
            error: {
                code: "TOO_MANY_REQUESTS",
                message: "Too many requests. Please try again later.",
                requestId: req.id
            }
        })
    }
});