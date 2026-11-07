import type { User, UserFormData } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8004/api";

type PaginatedResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`)
  );

  return match ? decodeURIComponent(match[2]) : null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  const isFormData = options.body instanceof FormData;

  if (options.body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (options.method && options.method !== "GET") {
    const csrfToken = getCookie("csrftoken");

    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers,
    credentials: "include",
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorData = data as { detail?: string } | null;

    throw new Error(
      errorData?.detail ??
        `Erreur API ${response.status} : ${API_URL}${path}`
    );
  }

  if (response.status === 204 || data === null) {
    return undefined as T;
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

  return data?.results ?? [];
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiPostForm<T>(
  path: string,
  formData: FormData
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: formData,
  });
}

export async function apiPatch<T>(
  path: string,
  body: unknown
): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiPut<T>(
  path: string,
  body: unknown
): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string): Promise<void> {
  await request<void>(path, {
    method: "DELETE",
  });
}

export async function apiGetCurrentUser(): Promise<User> {
  return apiGet<User>("/auth/me/");
}

export async function apiUpdateCurrentUser(
  data: Partial<User>
): Promise<User> {
  return apiPatch<User>("/auth/me/", data);
}

export async function apiLogin(
  username: string,
  password: string
): Promise<User> {
  return apiPost<User>("/auth/login/", {
    username,
    password,
  });
}

export async function apiLogout(): Promise<void> {
  await apiPost("/auth/logout/");
}

export async function apiGetUsers(): Promise<User[]> {
  return apiGetList<User>("/users/");
}

export async function apiCreateUser(
  data: UserFormData
): Promise<User> {
  return apiPost<User>("/users/", data);
}

export async function apiUpdateUser(
  id: number,
  data: Partial<UserFormData>
): Promise<User> {
  return apiPatch<User>(`/users/${id}/`, data);
}

export async function apiDeleteUser(id: number): Promise<void> {
  await apiDelete(`/users/${id}/`);
}

export async function apiPatchForm<T>(
  path: string,
  formData: FormData
): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: formData,
  });
}