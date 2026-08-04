


export class AppError extends Error {
    constructor(message: string, public readonly statusCode: number,
        public readonly code: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class ValidationError extends AppError {
    constructor(public readonly details: { field: string, messages: string[] }[]) {
        super("Validation failed", 400, "VALIDATION_ERROR");

    }
}


export class RefreshTokenMissingError extends AppError {
    constructor() { super("Refresh token missing", 401, "REFRESH_TOKEN_MISSING"); }
}