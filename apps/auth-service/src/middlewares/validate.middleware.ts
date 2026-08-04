import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ValidationError } from "../errors/AppError";



export const validateBody = <T extends object>(dtoClass: new () => T): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const instance = plainToInstance(dtoClass, req.body);
        const errors = await validate(instance);
        if (errors.length > 0) {
            const details = errors.map(err => ({
                field: err.property,
                messages: Object.values(err.constraints || {})
            }));
            next(new ValidationError(details));
            return;
        }
        req.body = instance;
        next();
    }
}