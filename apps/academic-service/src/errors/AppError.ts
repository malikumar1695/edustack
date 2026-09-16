
export { AppError, ForbiddenError, UnauthorizedError, ValidationError } from "@ilm/http-kit";

import { AppError as BaseAppError } from "@ilm/http-kit";

export class StudentNotFoundError extends BaseAppError {
    constructor() { super("Student not found", 404, "STUDENT_NOT_FOUND"); }
}

export class AdmissionNoTakenError extends BaseAppError {
    constructor() { super("Admission number is already in use", 409, "ADMISSION_NO_TAKEN"); }
}

export class UnableToDetermineCountryError extends BaseAppError {
    constructor() { super("Unable to determine country from phone number", 422, "UNABLE_TO_DETERMINE_COUNTRY"); }
}


export class UserAlreadyLinkedError extends BaseAppError {
    constructor() { super("That user account is already linked to another student", 409, "USER_ALREADY_LINKED"); }
}
