const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Destructure headers out so the ...rest spread never overwrites Content-Type
  const { headers: extraHeaders, ...rest } = options;
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(extraHeaders as Record<string, string> | undefined ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    // NestJS class-validator returns message as string[] on 400
    const raw = data.message;
    const msg = Array.isArray(raw) ? raw[0] : (raw ?? 'Ошибка запроса');
    throw new Error(String(msg));
  }
  return data as T;
}

export const api = {
  post: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...(headers ? { headers } : {}) }),

  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', ...(headers ? { headers } : {}) }),

  patch: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...(headers ? { headers } : {}) }),
};

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
