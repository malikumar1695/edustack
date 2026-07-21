/**
 * Single call-site for every backend service. Components never know which
 * of the three services (or which port) actually answers a given path —
 * they just call apiFetch("auth/login"), apiFetch("academic/students"), etc.
 * The proxy at app/api/[service]/[...path] routes it server-to-server.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    throw new Error(`apiFetch("${path}") failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}
