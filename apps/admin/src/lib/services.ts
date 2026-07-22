// No BFF proxy here — this is a plain SPA, so the browser calls each
// service's real address directly. That's exactly why the services'
// CORS config had to be opened up for this app's origin (:5174).
export const SERVICES: Record<string, string> = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL ?? "http://localhost:4001",
  academic: import.meta.env.VITE_ACADEMIC_SERVICE_URL ?? "http://localhost:4002",
  notifications:
    import.meta.env.VITE_NOTIFICATION_SERVICE_URL ?? "http://localhost:4003",
};
