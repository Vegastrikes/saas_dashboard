const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && typeof (data as any).error === "string"
        ? (data as any).error
        : `Request failed (${res.status})`);
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>("GET", path, undefined, token),
  post: <T>(path: string, body?: unknown, token?: string | null) => request<T>("POST", path, body, token),
  put: <T>(path: string, body?: unknown, token?: string | null) => request<T>("PUT", path, body, token),
  del: <T>(path: string, token?: string | null) => request<T>("DELETE", path, undefined, token),
};
