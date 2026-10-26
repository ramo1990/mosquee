const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8004/api";

type PaginatedResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erreur API ${res.status}`);
  }

  return res.json();
}

export async function apiGetList<T>(path: string): Promise<T[]> {
  const data = await apiGet<T[] | PaginatedResponse<T>>(path);

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
      errorData?.detail ?? "Une erreur est survenue."
    );
  }

  return data as T;
}