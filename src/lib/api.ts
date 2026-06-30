const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Minimal fetch client that attaches the JWT from localStorage. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}
