const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  // Extract CSRF token from browser cookie if present
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) {
      defaultHeaders["X-CSRFToken"] = match[1];
    }
  }

  const res = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    credentials: "include", // Ensure session cookies are exchanged
    ...restOptions,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.error?.message || data?.detail || `HTTP Error ${res.status}`;
    const err = new Error(errorMsg);
    (err as any).status = res.status;
    (err as any).details = data?.error?.details || data;
    throw err;
  }

  return data as T;
}
