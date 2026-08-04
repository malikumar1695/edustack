import { rateLimit } from "express-rate-limit";


export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts from this IP, please try again after 15 minutes." }
})

export const registerRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many registration attempts from this IP, please try again after 1 hour." }
})