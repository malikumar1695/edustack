

declare global {
    namespace Express {
        interface Request {
            user?: import("../config/jwt").AccessTokenPayload;
        }
    }
}

export { };