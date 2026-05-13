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

  if (path === '/me') return { user: MOCK_USER };

  if (path === '/auth/magic-link/request') return {};
  if (path === '/auth/magic-link/consume') return { ok: true, user_id: MOCK_USER.id };
  if (path === '/auth/logout') return {};
  if (path === '/auth/passkey/authenticate/start') return { challenge: 'mock-challenge', rpId: window?.location?.hostname || 'localhost' };
  if (path === '/auth/passkey/authenticate/finish') return { ok: true, user_id: MOCK_USER.id };

  if (path === '/me/passkey/register/start') return { challenge: 'mock-challenge', rp: { name: 'OndaCast' }, user: { id: 'mock', name: MOCK_USER.email, displayName: MOCK_USER.display_name } };
  if (path === '/me/passkey/register/finish') return { ok: true };

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
