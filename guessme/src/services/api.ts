const BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL?.toString() || "http://localhost:8080";

type FetchOptions = RequestInit & { timeoutMs?: number };

export async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const { timeoutMs = 20000, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(rest.headers || {}),
      },
      signal: controller.signal,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message =
        (data && (data.message || data.error)) ||
        `Erro HTTP ${res.status}: ${res.statusText}`;
      throw new Error(message);
    }

    return data as T;
  } finally {
    clearTimeout(timer);
  }
}
