const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

type FetchOptions = RequestInit & { timeoutMs?: number };

export async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const { timeoutMs = 20000, signal, ...rest } = options;

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener("abort", abortFromCaller, { once: true });
  if (signal?.aborted) controller.abort();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

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
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError" && timedOut) {
      throw new Error(
        "Tempo limite atingido. Verifique sua conexão e tente novamente."
      );
    }
    throw e;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
