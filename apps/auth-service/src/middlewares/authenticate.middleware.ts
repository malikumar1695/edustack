import { RequestHandler, Request, Response } from "express";
import { verifyAccessToken } from "../config/jwt";
import { UnauthorizedError } from "../errors/AppError";

export const authenticate: RequestHandler = (req: Request, _res: Response, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Missing or malformed Authorization header");
    }

    try {
        req.user = verifyAccessToken(header.slice("Bearer ".length));
        next();
    } catch {
        throw new UnauthorizedError("Invalid or expired access token");
    }
};
