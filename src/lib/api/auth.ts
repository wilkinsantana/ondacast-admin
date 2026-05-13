import { apiFetch, ApiError } from './client';

export interface AdminUser {
  id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role: 'admin' | 'staff' | 'user';
  preferences?: Record<string, unknown>;
  created_at: string;
}

export async function getMe(): Promise<AdminUser | null> {
  try {
    const env = await apiFetch<{ user: AdminUser }>('/me');
    return env.user ?? null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function requestMagicLink(email: string, redirectTo?: string): Promise<void> {
  await apiFetch('/auth/magic-link/request', {
    method: 'POST',
    body: JSON.stringify({ email, ...(redirectTo ? { redirect_to: redirectTo } : {}) })
  });
}

export async function consumeMagicLink(token: string): Promise<AdminUser> {
  const env = await apiFetch<{ ok: true; user_id: string; redirect_to?: string }>(
    '/auth/magic-link/consume',
    { method: 'POST', body: JSON.stringify({ token, kind: 'web' }) }
  );
  const me = await getMe();
  if (!me) throw new Error('Session not established after magic link verification.');
  return me;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    /* even if it fails server-side, the local store should clear */
  }
}

export function passkeysSupported(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
}

export async function startPasskeyAuth(email?: string): Promise<AdminUser> {
  // Mock mode bypass — skip WebAuthn API
  if (import.meta.env.PUBLIC_MOCK_API === '1') {
    const me = await getMe();
    if (!me) throw new Error('Mock session not established.');
    return me;
  }

  const options = await apiFetch<unknown>('/auth/passkey/authenticate/start', {
    method: 'POST',
    body: JSON.stringify(email ? { email } : {})
  });

  const { startAuthentication } = await import('@simplewebauthn/browser');
  const assertion = await startAuthentication({ optionsJSON: options as Parameters<typeof startAuthentication>[0]['optionsJSON'] });

  await apiFetch<{ ok: true; user_id: string }>('/auth/passkey/authenticate/finish', {
    method: 'POST',
    body: JSON.stringify({ response: assertion, kind: 'web' })
  });

  const me = await getMe();
  if (!me) throw new Error('Session not established after passkey authentication.');
  return me;
}

export async function registerPasskey(): Promise<void> {
  if (import.meta.env.PUBLIC_MOCK_API === '1') return;

  const { startRegistration } = await import('@simplewebauthn/browser');
  const options = await apiFetch<unknown>('/me/passkey/register/start', { method: 'POST' });
  const attestation = await startRegistration({ optionsJSON: options as Parameters<typeof startRegistration>[0]['optionsJSON'] });
  await apiFetch('/me/passkey/register/finish', {
    method: 'POST',
    body: JSON.stringify({ response: attestation })
  });
}
