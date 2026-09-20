const API_BASE = 'http://127.0.0.1:8000';

export async function apiGet<T = any>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`GET ${path} gagal: ${response.status}`);
  }

  return response.json();
}

export async function apiPost<T = any>(
  path: string,
  body: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`POST ${path} gagal: ${response.status}`);
  }

  return response.json();
}
