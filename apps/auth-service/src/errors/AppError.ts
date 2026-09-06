/**
 * Transport-level errors come from @ilm/http-kit and are re-exported so the
 * rest of this service has one import site for errors. Everything defined
 * below is auth-domain-specific and stays here.
 */
export { AppError, ForbiddenError, UnauthorizedError, ValidationError } from "@ilm/http-kit";

import { AppError as BaseAppError } from "@ilm/http-kit";

export class RefreshTokenMissingError extends BaseAppError {
    constructor() { super("Refresh token missing", 401, "REFRESH_TOKEN_MISSING"); }
}

export class RefreshTokenReuseDetectedError extends BaseAppError {
    constructor() { super("Refresh token reuse detected", 401, "REFRESH_TOKEN_REUSE_DETECTED"); }
}

export class InvalidRoleError extends BaseAppError {
    constructor() { super("One or more roles do not exist", 400, "INVALID_ROLE"); }
}

export class AccountDisabledError extends BaseAppError {
    constructor() { super("Account is disabled. Please contact an administrator.", 403, "ACCOUNT_DISABLED"); }
}
