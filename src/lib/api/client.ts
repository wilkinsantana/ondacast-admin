const API_BASE = import.meta.env.PUBLIC_API_URL || '';
const MOCK = import.meta.env.PUBLIC_MOCK_API === '1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const MOCK_USER = {
  id: 'u8a4f',
  email: 'willsann@live.com',
  display_name: 'Wilkin Santana',
  avatar_url: null,
  role: 'admin' as const,
  plan: 'team',
  status: 'active',
  created_at: '2025-01-12T00:00:00Z',
};

function mockResponse(path: string, init?: RequestInit): unknown {
  const method = init?.method || 'GET';

  if (path === '/v1/me') return { data: MOCK_USER };

  if (path === '/v1/auth/magic') return {};
  if (path === '/v1/auth/magic/verify') return { data: MOCK_USER };
  if (path === '/v1/auth/logout') return {};
  if (path === '/v1/auth/passkey/options') return { data: MOCK_USER };

  if (path === '/v1/me/passkey/register') return {};

  return {};
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (MOCK) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    const data = mockResponse(path, init);
    return data as T;
  }

  const url = `${API_BASE}${path}`;
  const r = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      accept: 'application/json',
      ...(init?.body && !(init.body instanceof FormData) ? { 'content-type': 'application/json' } : {}),
      ...init?.headers
    }
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new ApiError(r.status, `${r.status} ${path}${text ? ` — ${text.slice(0, 200)}` : ''}`);
  }
  return r.json() as Promise<T>;
}
