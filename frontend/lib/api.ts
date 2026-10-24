// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8004/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erreur API ${res.status}`);
  }

  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail ?? "Une erreur est survenue.");
  }

  return data;
}