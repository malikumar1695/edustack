import { ACCESS_KEY } from "../../../context/AuthContext";
import { authApi } from "../../../services/api";

/**
 * Ported from ant-design-pro-master/src/pages/user/register/_mock.ts
 * (`POST /api/register`). The mock always returns success regardless of
 * input, so this just mirrors that directly instead of over HTTP.
 */
export type RegisterParams = {
  username?: string;
  password?: string;
};

export async function register(payload: RegisterParams) {
  const { data } = await authApi.post<{ accessToken: string }>("/auth/register", payload);
  localStorage.setItem(ACCESS_KEY, data.accessToken);
  return { status: "ok" as const };
}
