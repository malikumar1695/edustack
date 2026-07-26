import { createHttpClient } from "./httpClient";

const SERVICE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL ?? "http://localhost:4001",
  academic: import.meta.env.VITE_ACADEMIC_SERVICE_URL ?? "http://localhost:4002",
  notifications:
    import.meta.env.VITE_NOTIFICATION_SERVICE_URL ?? "http://localhost:4003",
} as const;

export const authApi = createHttpClient(SERVICE_URLS.auth);
export const academicApi = createHttpClient(SERVICE_URLS.academic);
export const notificationsApi = createHttpClient(SERVICE_URLS.notifications);
