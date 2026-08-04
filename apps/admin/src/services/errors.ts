import { AxiosError } from "axios";


type ApiErrorBody = {
    error?: { code?: string; message?: string; details?: { field: string; messages: string[] }[] };
}

export const getApiErrorMessage = (error: unknown, fallback = "An unexpected error occurred"): string => {

    if (error instanceof AxiosError) {

        if (!error.response) return "Could not reach the server. Please check your network connection.";

        if (error.response.status === 429) {
            return "Too many requests. Please try again later.";
        }

        const body = error.response.data as ApiErrorBody;
        if (body?.error?.code === "VALIDATION_ERROR" && body?.error?.details?.length) {
            return body.error.details.map(d => d.messages.join(", ")).join("; ");
        }

        if (body?.error?.message) {
            return body.error.message;
        }
    }
    return fallback;
};