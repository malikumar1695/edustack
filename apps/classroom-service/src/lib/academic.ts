import { logger } from "@ilm/http-kit";
import { ClassNotFoundError, UpstreamUnavailableError } from "../errors/AppError";

/** The subset of academic-service's GET /classes/:id this service reads. */
export type ClassRoster = {
    id: string;
    name: string;
    teacherUserId: string;
    teacherUsername: string;
    students: { id: string; userId: string | null; loginUsername: string | null }[];
};

const TIMEOUT_MS = 5_000;

/**
 * The one synchronous call this service makes to another, and only when a
 * session starts — never on the join path.
 *
 * The caller's own bearer token is forwarded, so academic-service makes the
 * authorization decision it already owns: an admin gets any class, a teacher
 * only their own, everyone else a 404. No service-to-service credential.
 */
export const getClassRoster = async (classId: string, authorization: string, requestId?: string): Promise<ClassRoster> => {
    const baseUrl = process.env.ACADEMIC_SERVICE_URL ?? "http://localhost:4002";

    let res: Response;
    try {
        res = await fetch(`${baseUrl}/classes/${encodeURIComponent(classId)}`, {
            headers: {
                authorization,
                // Same id in both services' logs for this one user action.
                ...(requestId ? { "x-request-id": requestId } : {}),
            },
            // Without a timeout a hung upstream holds this request open until
            // the platform kills it.
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch (error) {
        logger.error({ err: error, classId }, "academic-service request failed");
        throw new UpstreamUnavailableError();
    }

    if (res.status === 404) throw new ClassNotFoundError();
    if (!res.ok) {
        logger.error({ status: res.status, classId }, "academic-service returned an error");
        throw new UpstreamUnavailableError();
    }

    return await res.json() as ClassRoster;
};
