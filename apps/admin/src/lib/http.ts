import axios from "axios";
import { SERVICES } from "./services";

/**
 * One configured axios instance per service instead of one function
 * parsing "service/path" strings by hand. Each instance carries its
 * own baseURL, and the request interceptor attaches auth the same
 * way for every call made through it — no per-call token wiring.
 */
function createClient(baseURL: string) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("ilm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}

export const authApi = createClient(SERVICES.auth);
export const academicApi = createClient(SERVICES.academic);
export const notificationsApi = createClient(SERVICES.notifications);
