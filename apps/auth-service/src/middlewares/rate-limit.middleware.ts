import { rateLimit } from "express-rate-limit";


export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        req.log.warn({ ip: req.ip }, "login rate limit exceeded");
        res.status(429).json({ message: "Too many login attempts from this IP, please try again after 15 minutes." });
    }
})

export const registerRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        req.log.warn({ ip: req.ip }, "register rate limit exceeded");
        res.status(429).json({
            message: "Too many registration attempts from this IP, please try again after 1 hour."
        });
    }
});