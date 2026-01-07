const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiErrorShape = {
  error?: string;
};

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const { useAuthStore } = await import("../stores/auth");
  const auth = useAuthStore();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = (isJson ? await res.json().catch(() => null) : null) as ApiErrorShape | null;

  if (!res.ok) {
    if (res.status === 401) {
      auth.clearSession?.();
      auth.logout?.();
      // Avoid hard import to prevent circular deps at module load time
      const { router } = await import("../router");
      if (router.currentRoute.value.name !== "login") {
        router.replace({ name: "login", query: { redirect: router.currentRoute.value.fullPath } });
      }
    }

    const message =
      data && typeof data === "object" && typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`;

    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};
