const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8004/api";


type PaginatedResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};


async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data: unknown = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorData = data as { detail?: string } | null;

    throw new Error(
      errorData?.detail ??
        `Erreur API ${res.status} : ${url}`
    );
  }

  return data as T;
}


export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}


export async function apiGetList<T>(path: string): Promise<T[]> {
  const data = await request<T[] | PaginatedResponse<T>>(path);

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}


export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}