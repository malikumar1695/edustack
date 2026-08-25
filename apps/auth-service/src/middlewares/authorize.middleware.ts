import { RequestHandler, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";

export const requireRole = (...allowedRoles: string[]): RequestHandler => {
    return (req: Request, _res: Response, next) => {
        if (!req.user) throw new UnauthorizedError();

        const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            req.log.warn({ userId: req.user.sub, required: allowedRoles, actual: req.user.roles }, "authorization denied");
            throw new ForbiddenError();
        }

        next();
    };
};
