import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { logger } from "../lib/logger";

/**
 * Shared key so the auth flow and every HTTP client agree on where the
 * bearer token lives. Right now login is fully mocked client-side (see
 * AuthContext) so nothing ever sets this — it's here so that when S3
 * wires a real JWT from auth-service, one write to this key is all any
 * client needs to pick it up.
 */
export const TOKEN_STORAGE_KEY = "ilm_token";
const LOGIN_PATH = "/user/login";

/**
 * One axios instance per backend service, not one shared instance with
 * one baseURL — apps/admin talks to auth-service/academic-service/
 * notification-service directly (no BFF proxy), each on its own port,
 * so a single client can only ever reach one of them.
 */
export function createHttpClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 50_0000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {

      logger.error("api request failed", {
        status: error.response?.status,
        url: error.config?.url,
        requestId: error.response?.headers?.["x-request-id "]
      });
      
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (window.location.pathname !== LOGIN_PATH) {
          window.location.href = LOGIN_PATH;
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
}
