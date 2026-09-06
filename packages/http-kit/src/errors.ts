/**
 * Transport-level errors shared by every service. Domain-specific errors
 * (e.g. RefreshTokenReuseDetectedError) stay in the service that owns the
 * concept and extend AppError from here.
 */
export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly code: string,
    ) {
        super(message);
        this.name = new.target.name;
    }
}

export class ValidationError extends AppError {
    constructor(public readonly details: { field: string; messages: string[] }[]) {
        super("Validation failed", 400, "VALIDATION_ERROR");
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401, "UNAUTHORIZED");
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Insufficient permissions") {
        super(message, 403, "FORBIDDEN");
    }
}
