import { ForbiddenError, UnauthorizedError } from "@ilm/http-kit";
import { Request, RequestHandler, Response } from "express";

/** Passes when the caller holds ANY of the allowed roles. */
export const requireRole = (...allowedRoles: string[]): RequestHandler => {
    return (req: Request, _res: Response, next) => {
        if (!req.user) throw new UnauthorizedError();

        const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            req.log.warn(
                { userId: req.user.sub, required: allowedRoles, actual: req.user.roles },
                "authorization denied",
            );
            throw new ForbiddenError();
        }

        next();
    };
};
