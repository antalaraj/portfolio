const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // In browser: use relative URL if not explicitly set, enabling Next.js proxy
    return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
  }
  // On server (SSR): use internal direct address
  return process.env.INTERNAL_API_URL ? `${process.env.INTERNAL_API_URL}/api/v1` : "http://127.0.0.1:8000/api/v1";
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;
  const baseUrl = getApiBaseUrl();

  let url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

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
    // If forbidden or unauthorized on an admin API call, redirect client to admin login
    if (typeof window !== "undefined" && (res.status === 401 || res.status === 403)) {
      if (endpoint.includes("/admin/") && !window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    const errorMsg = data?.error?.message || data?.detail || `HTTP Error ${res.status}`;
    const err = new Error(errorMsg);
    (err as any).status = res.status;
    (err as any).details = data?.error?.details || data;
    throw err;
  }

  return data as T;
}
