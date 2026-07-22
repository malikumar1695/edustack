import { SERVICES } from "./services";

/**
 * Same call-site shape as apps/web's apiFetch("service/path") — so
 * components read identically either place. The difference is entirely
 * inside this file: no proxy, a real cross-origin fetch straight to
 * the service, which is why CORS is doing real work here.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const [service, ...rest] = path.split("/");
  const base = SERVICES[service];
  if (!base) throw new Error(`Unknown service "${service}"`);

  const res = await fetch(`${base}/${rest.join("/")}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });

  if (!res.ok) throw new Error(`apiFetch("${path}") failed with ${res.status}`);
  return res.json() as Promise<T>;
}
