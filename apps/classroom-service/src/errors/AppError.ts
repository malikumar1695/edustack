
export { AppError, ForbiddenError, UnauthorizedError, ValidationError } from "@ilm/http-kit";

import { AppError as BaseAppError } from "@ilm/http-kit";

export class SessionNotFoundError extends BaseAppError {
    constructor() { super("Session not found", 404, "SESSION_NOT_FOUND"); }
}

export class SessionEndedError extends BaseAppError {
    constructor() { super("This session has already ended", 409, "SESSION_ENDED"); }
}

export class ClassNotFoundError extends BaseAppError {
    constructor() { super("Class not found", 404, "CLASS_NOT_FOUND"); }
}

/** academic-service was unreachable or answered with something unexpected. */
export class UpstreamUnavailableError extends BaseAppError {
    constructor() { super("A dependent service is unavailable. Please try again.", 502, "UPSTREAM_UNAVAILABLE"); }
}
