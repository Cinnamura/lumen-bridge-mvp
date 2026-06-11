const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Error enriched with the HTTP status so callers can branch on 401/403/400. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Human-readable fallbacks per status code when the server gives no message. */
const STATUS_FALLBACK: Record<number, string> = {
  400: 'Проверьте правильность введённых данных',
  401: 'Сессия истекла. Войдите снова',
  403: 'Недостаточно прав для этого действия',
  404: 'Запрашиваемые данные не найдены',
  409: 'Конфликт: действие уже выполнено',
  422: 'Данные не прошли проверку',
  500: 'Ошибка сервера. Попробуйте позже',
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Destructure headers out so the ...rest spread never overwrites Content-Type
  const { headers: extraHeaders, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(extraHeaders as Record<string, string> | undefined ?? {}),
      },
    });
  } catch {
    // Network failure / server down
    throw new ApiError('Не удалось связаться с сервером. Проверьте подключение', 0);
  }

  let data: any = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    // NestJS class-validator returns message as string[] on 400
    const raw = data?.message;
    const msg = Array.isArray(raw)
      ? raw[0]
      : (raw ?? STATUS_FALLBACK[res.status] ?? 'Ошибка запроса');
    throw new ApiError(String(msg), res.status);
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
